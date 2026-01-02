import { useState, useEffect, useCallback, useRef } from 'react';
import type { RoomObject, ControlData } from './useGameRoom';

interface CharacterState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  isGrounded: boolean;
  facingRight: boolean;
  isJumping: boolean;
}

// ========== PHYSICS CONFIGURATION ==========
// Adjust these values to tune movement feel

// Gravity & Jump
const GRAVITY = 0.4;           // How fast character falls (higher = faster fall)
const JUMP_FORCE = -10;        // Jump power (more negative = higher jump)
const MAX_FALL_SPEED = 12;     // Terminal velocity when falling

// Movement
const MAX_SPEED = 4;           // Maximum horizontal speed
const ACCELERATION = 0.5;      // How fast character speeds up
const DECELERATION = 0.3;      // How fast character slows down when stopping
const AIR_CONTROL = 0.7;       // Movement control while in air (0-1, lower = less control)

// Character size (percentage of screen)
const CHARACTER_WIDTH = 5;
const CHARACTER_HEIGHT = 8;

// ============================================

export const useGamePhysics = (
  roomObjects: RoomObject[],
  controlData: ControlData
) => {
  const [character, setCharacter] = useState<CharacterState>({
    x: 15,
    y: 60,
    velocityX: 0,
    velocityY: 0,
    isGrounded: false,
    facingRight: true,
    isJumping: false,
  });

  const lastControlRef = useRef<ControlData['action']>('none');
  const keysHeldRef = useRef<Set<string>>(new Set());

  // Handle control input
  useEffect(() => {
    const action = controlData.action;
    
    if (action === 'left') {
      keysHeldRef.current.add('left');
      keysHeldRef.current.delete('right');
    } else if (action === 'right') {
      keysHeldRef.current.add('right');
      keysHeldRef.current.delete('left');
    } else if (action === 'stop') {
      keysHeldRef.current.delete('left');
      keysHeldRef.current.delete('right');
    } else if (action === 'jump') {
      keysHeldRef.current.add('jump');
    }

    lastControlRef.current = action;
  }, [controlData]);

  // Physics loop - runs at 60fps
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setCharacter(prev => {
        let { x, y, velocityX, velocityY, isGrounded, facingRight, isJumping } = prev;

        // Calculate acceleration based on grounded state
        const currentAccel = isGrounded ? ACCELERATION : ACCELERATION * AIR_CONTROL;
        const currentDecel = isGrounded ? DECELERATION : DECELERATION * AIR_CONTROL;

        // Apply horizontal movement with smooth acceleration
        if (keysHeldRef.current.has('left')) {
          velocityX = Math.max(-MAX_SPEED, velocityX - currentAccel);
          facingRight = false;
        } else if (keysHeldRef.current.has('right')) {
          velocityX = Math.min(MAX_SPEED, velocityX + currentAccel);
          facingRight = true;
        } else {
          // Smooth deceleration when no input
          if (velocityX > 0) {
            velocityX = Math.max(0, velocityX - currentDecel);
          } else if (velocityX < 0) {
            velocityX = Math.min(0, velocityX + currentDecel);
          }
        }

        // Apply jump
        if (keysHeldRef.current.has('jump') && isGrounded) {
          velocityY = JUMP_FORCE;
          isGrounded = false;
          isJumping = true;
          keysHeldRef.current.delete('jump');
        }

        // Apply gravity with terminal velocity
        velocityY = Math.min(MAX_FALL_SPEED, velocityY + GRAVITY);

        // Update position
        x += velocityX;
        y += velocityY;

        // Collision detection with platforms
        isGrounded = false;
        
        for (const obj of roomObjects) {
          const charLeft = x;
          const charRight = x + CHARACTER_WIDTH;
          const charTop = y;
          const charBottom = y + CHARACTER_HEIGHT;
          
          const objLeft = obj.x;
          const objRight = obj.x + obj.width;
          const objTop = obj.y;
          const objBottom = obj.y + obj.height;

          // Check horizontal overlap
          const horizontalOverlap = charRight > objLeft && charLeft < objRight;
          
          // Landing on top of platform
          if (horizontalOverlap && 
              velocityY >= 0 &&
              charBottom >= objTop && 
              charBottom <= objTop + 12 &&
              prev.y + CHARACTER_HEIGHT <= objTop + 8) {
            y = objTop - CHARACTER_HEIGHT;
            velocityY = 0;
            isGrounded = true;
            isJumping = false;
          }
        }

        // Keep character in bounds
        x = Math.max(0, Math.min(95 - CHARACTER_WIDTH, x));
        
        // Fall off screen - respawn
        if (y > 100) {
          x = 15;
          y = 50;
          velocityX = 0;
          velocityY = 0;
        }

        return { x, y, velocityX, velocityY, isGrounded, facingRight, isJumping };
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [roomObjects]);

  const resetCharacter = useCallback(() => {
    setCharacter({
      x: 15,
      y: 60,
      velocityX: 0,
      velocityY: 0,
      isGrounded: false,
      facingRight: true,
      isJumping: false,
    });
  }, []);

  return { character, resetCharacter, CHARACTER_WIDTH, CHARACTER_HEIGHT };
};
