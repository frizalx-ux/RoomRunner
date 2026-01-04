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

const GRAVITY = 0.3;
const JUMP_FORCE = -7; // slightly shorter jump
const MOVE_SPEED = 1.6; // slower base speed
const FRICTION = 0.88;
const CHARACTER_WIDTH = 5;
const CHARACTER_HEIGHT = 8;

const AIR_CONTROL = 0.65;

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

  // Physics loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setCharacter(prev => {
        let { x, y, velocityX, velocityY, isGrounded, facingRight, isJumping } = prev;

        // Apply horizontal movement (reduced control while airborne)
        const speedFactor = isGrounded ? 1 : AIR_CONTROL;
        if (keysHeldRef.current.has('left')) {
          velocityX = -MOVE_SPEED * speedFactor;
          facingRight = false;
        } else if (keysHeldRef.current.has('right')) {
          velocityX = MOVE_SPEED * speedFactor;
          facingRight = true;
        } else {
          velocityX *= FRICTION;
          if (Math.abs(velocityX) < 0.1) velocityX = 0;
        }

        // Apply jump
        if (keysHeldRef.current.has('jump') && isGrounded) {
          velocityY = JUMP_FORCE;
          isGrounded = false;
          isJumping = true;
          // reduce carry distance on takeoff
          velocityX *= 0.85;
          keysHeldRef.current.delete('jump');
        }

        // Apply gravity
        velocityY += GRAVITY;

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
              charBottom <= objTop + 10 &&
              prev.y + CHARACTER_HEIGHT <= objTop + 5) {
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
    }, 1000 / 60);

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
