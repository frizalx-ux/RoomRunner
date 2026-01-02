import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, Smartphone, Monitor, ArrowRight, Zap } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6 py-12 max-w-4xl mx-auto">
        {/* Logo and title */}
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center box-glow-strong">
              <Gamepad2 className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-card border border-primary/50 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-orbitron font-black tracking-tight">
              <span className="gradient-text">GyroGame</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Control game objects in real-time using your phone's motion sensors
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            {
              icon: Monitor,
              title: '1. Open on Desktop',
              description: 'Start the game on your computer to see the playing field',
            },
            {
              icon: Smartphone,
              title: '2. Connect Phone',
              description: 'Scan the QR code with your phone to connect as controller',
            },
            {
              icon: Gamepad2,
              title: '3. Tilt to Play',
              description: 'Tilt your phone to control objects in the game',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 p-6 bg-card/50 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-orbitron font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button
            onClick={() => navigate('/game')}
            className="flex-1 h-14 text-lg font-orbitron gap-2 group"
          >
            <Monitor className="w-5 h-5" />
            Start Game
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button
            onClick={() => navigate('/controller')}
            variant="outline"
            className="flex-1 h-14 text-lg font-orbitron gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Controller Only
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Works best when desktop and phone are on the same network.
          <br />
          Motion controls require device orientation permission on iOS.
        </p>
      </div>
    </div>
  );
};

export default Index;
