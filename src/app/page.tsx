"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Play, Trophy, Users, Sparkles, Target, ChevronRight } from "lucide-react";
import { AuthTest } from "@/components/auth/AuthTest";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950">
      <HeroSection />
    </main>
  );
}

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const { left, top, width, height } = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateTransform = (depth: number) => {
    const moveX = (mousePosition.x - 0.5) * depth;
    const moveY = (mousePosition.y - 0.5) * depth;
    return `translate(${moveX}px, ${moveY}px)`;
  };

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-gray-900 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20 gap-12">
          <div className="flex-1 text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="text-white">Master the Art of</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
                  Pokémon Guessing
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Challenge yourself with our engaging Pokémon guessing game. Test your knowledge, compete with trainers worldwide, and become a Pokémon Master.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/game">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 group"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Playing
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-violet-500/50 text-violet-400 hover:bg-violet-500/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm transition-all duration-300 group"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12">
              {[
                { label: "Generations", value: "9", icon: Sparkles, color: "purple", description: "From Kanto to Paldea" },
                { label: "Regions", value: "10+", icon: Target, color: "green", description: "Explore diverse lands" },
                { label: "Pokémon", value: "1000+", icon: Users, color: "red", description: "Discover new species" }
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/[0.05] hover:border-violet-500/50 transition-colors duration-300"
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl" />
              
              <div className="relative grid grid-cols-2 gap-8 p-8">
                {[
                  { name: "Charizard", size: 250 },
                  { name: "Mewtwo", size: 200 },
                  { name: "Gengar", size: 180 },
                  { name: "Pikachu", size: 150 }
                ].map((pokemon) => (
                  <div
                    key={pokemon.name}
                    className="group relative flex items-center justify-center"
                    style={{ transform: calculateTransform(-30) }}
                  >
                    <Image
                      src={`/images/pokemon/${pokemon.name.toLowerCase()}.png`}
                      width={pokemon.size}
                      height={pokemon.size}
                      alt={pokemon.name}
                      className="transition-all duration-500"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-violet-500/20 rounded-full blur-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
