"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Pokemon {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  image: string;
}

export const AnimatedBackground = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const pokemonList = [
      "charizard",
      "pikachu",
      "mewtwo",
      "gengar",
      "dragonite",
      "gyarados",
    ];

    const initialPokemons = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: 0.5 + Math.random() * 0.5,
      size: 40 + Math.random() * 40,
      image: `/images/pokemon/${pokemonList[i]}.png`,
    }));

    setPokemons(initialPokemons);

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setPokemons((prevPokemons) =>
        prevPokemons.map((pokemon) => {
          const dx = mousePosition.x - pokemon.x;
          const dy = mousePosition.y - pokemon.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          let newX = pokemon.x;
          let newY = pokemon.y;

          if (distance > 5) {
            const angle = Math.atan2(dy, dx);
            newX += Math.cos(angle) * pokemon.speed;
            newY += Math.sin(angle) * pokemon.speed;
          }

          return {
            ...pokemon,
            x: newX,
            y: newY,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {pokemons.map((pokemon) => (
        <div
          key={pokemon.id}
          className="absolute transition-transform duration-300 ease-out"
          style={{
            left: `${pokemon.x}%`,
            top: `${pokemon.y}%`,
            transform: `translate(-50%, -50%) scale(${
              1 - Math.min(0.3, Math.sqrt((mousePosition.x - pokemon.x) ** 2 + (mousePosition.y - pokemon.y) ** 2) / 100)
            })`,
          }}
        >
          <Image
            src={pokemon.image}
            alt="Pokemon"
            width={pokemon.size}
            height={pokemon.size}
            className="opacity-10"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  );
};
