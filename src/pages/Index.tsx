import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, Smartphone, Monitor, ArrowRight, Zap, Sofa, Home } from 'lucide-react';

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
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center box-glow-strong">
              <Home className="w-14 h-14 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-card border border-primary/50 flex items-center justify-center box-glow">
              <Zap className="w-5 h-5 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-orbitron font-black tracking-tight">
              <span className="gradient-text">RoomRunner</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-lg">
              Jump across your real furniture in this AR-style platformer game
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {[
            {
              icon: Monitor,
              title: '1. Project to Wall',
              description: 'Display the game on a screen or project it onto your wall',
            },
            {
              icon: Smartphone,
              title: '2. Scan & Connect',
              description: 'Scan the QR code with your phone to become the controller',
            },
            {
              icon: Sofa,
              title: '3. Jump on Furniture',
              description: 'Control your character to jump across real room objects!',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 p-6 bg-card/50 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:box-glow group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-orbitron font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
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
            <Gamepad2 className="w-5 h-5" />
            Controller
          </Button>
        </div>

        {/* Feature list */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {['Phone Controls', 'Real-time Sync', 'Custom Platforms', 'Projector Ready'].map((feature) => (
            <div key={feature} className="flex items-center gap-1.5 px-3 py-1 bg-card/50 rounded-full border border-border/50">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              {feature}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center max-w-md">
          Best experienced when projected onto a wall with real furniture.
          <br />
          Works on any modern browser with same-device tab sync.
        </p>
      </div>
    </div>
  );
};

export default Index;
