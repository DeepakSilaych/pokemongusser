"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Search,
  Timer,
  Heart,
  Target,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Pokemon {
  name: string;
  types: string[];
  region: string;
  abilities: string[];
  sprite?: string;
  id?: number;
  height: number;
  weight: number;
  baseStats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  moves: string[];
  habitat?: string;
  color?: string;
}

interface GuessResult {
  nameMatch: boolean;
  regionMatch: boolean;
  type1Match: boolean;
  type2Match: boolean;
  abilityMatches: string[];
  statMatches: {
    hp: boolean;
    attack: boolean;
    defense: boolean;
    specialAttack: boolean;
    specialDefense: boolean;
    speed: boolean;
  };
}

const getRegionFromId = (id: number): string => {
  if (id <= 151) return "Kanto";
  if (id <= 251) return "Johto";
  if (id <= 386) return "Hoenn";
  if (id <= 493) return "Sinnoh";
  if (id <= 649) return "Unova";
  if (id <= 721) return "Kalos";
  if (id <= 809) return "Alola";
  if (id <= 898) return "Galar";
  return "Paldea";
};

// Target Pokémon (Greninja)
const targetPokemon: Pokemon = {
  name: "Greninja",
  types: ["Water", "Dark"],
  region: "Kalos",
  abilities: ["Torrent", "Protean", "Battle Bond"],
  height: 1.5,
  weight: 40.0,
  baseStats: {
    hp: 72,
    attack: 95,
    defense: 67,
    specialAttack: 103,
    specialDefense: 71,
    speed: 122
  },
  moves: ["Water Shuriken", "Dark Pulse", "Ice Beam", "Night Slash"]
};

function checkGuess(guess: Pokemon): GuessResult {
  return {
    nameMatch: guess.name.toLowerCase() === targetPokemon.name.toLowerCase(),
    regionMatch: guess.region === targetPokemon.region,
    type1Match: guess.types[0] === targetPokemon.types[0],
    type2Match: guess.types[1] === targetPokemon.types[1],
    abilityMatches: guess.abilities.filter(ability => 
      targetPokemon.abilities.includes(ability)
    ),
    statMatches: {
      hp: Math.abs(guess.baseStats.hp - targetPokemon.baseStats.hp) <= 10,
      attack: Math.abs(guess.baseStats.attack - targetPokemon.baseStats.attack) <= 10,
      defense: Math.abs(guess.baseStats.defense - targetPokemon.baseStats.defense) <= 10,
      specialAttack: Math.abs(guess.baseStats.specialAttack - targetPokemon.baseStats.specialAttack) <= 10,
      specialDefense: Math.abs(guess.baseStats.specialDefense - targetPokemon.baseStats.specialDefense) <= 10,
      speed: Math.abs(guess.baseStats.speed - targetPokemon.baseStats.speed) <= 10
    }
  };
}

export default function GamePlay() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const difficulty = searchParams.get("difficulty");
  const generation = searchParams.get("generation");

  const [attempts, setAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [lives, setLives] = useState(mode === "competitive" ? 3 : Infinity);
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<Pokemon[]>([]);
  const [guessedPokemon, setGuessedPokemon] = useState<Pokemon[]>([]);
  const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "competitive" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, timeLeft]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!guess.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${guess.toLowerCase()}`);
        if (response.ok) {
          const data = await response.json();
          const speciesResponse = await fetch(data.species.url);
          const speciesData = await speciesResponse.json();

          const pokemon: Pokemon = {
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            types: data.types.map((t: any) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
            region: getRegionFromId(data.id),
            abilities: data.abilities.map((a: any) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)),
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
            id: data.id,
            height: data.height / 10,
            weight: data.weight / 10,
            baseStats: {
              hp: data.stats[0].base_stat,
              attack: data.stats[1].base_stat,
              defense: data.stats[2].base_stat,
              specialAttack: data.stats[3].base_stat,
              specialDefense: data.stats[4].base_stat,
              speed: data.stats[5].base_stat
            },
            moves: data.moves.slice(0, 4).map((m: any) => 
              m.move.name.split('-').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')
            ),
            habitat: speciesData.habitat?.name,
            color: speciesData.color?.name
          };
          setSuggestions([pokemon]);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [guess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGuess = async (pokemonName: string = guess) => {
    if (!pokemonName.trim()) return;

    setAttempts((prev) => prev + 1);
    if (mode === "competitive") {
      setLives((prev) => prev - 1);
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();

        const guessedPokemonData: Pokemon = {
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          types: data.types.map((t: any) => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)),
          region: getRegionFromId(data.id),
          abilities: data.abilities.map((a: any) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)),
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
          id: data.id,
          height: data.height / 10,
          weight: data.weight / 10,
          baseStats: {
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            specialAttack: data.stats[3].base_stat,
            specialDefense: data.stats[4].base_stat,
            speed: data.stats[5].base_stat
          },
          moves: data.moves.slice(0, 4).map((m: any) => 
            m.move.name.split('-').map((word: string) => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
          ),
          habitat: speciesData.habitat?.name,
          color: speciesData.color?.name
        };

        const result = checkGuess(guessedPokemonData);

        setGuessedPokemon((prev) => [guessedPokemonData, ...prev]);
        setGuessResults((prev) => [result, ...prev]);

        // Download the guessed Pokémon's image
        fetch(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`)
          .then(res => res.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.src = url;
          });
      }
    } catch (error) {
      console.error("Error processing guess:", error);
    }

    setGuess("");
    setShowSuggestions(false);
  };

  const renderGuessCard = (guess: Pokemon, result: GuessResult) => (
    <Card className="w-full bg-black/40 backdrop-blur-sm border-white/10 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Pokemon Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
              {guess.sprite && (
                <Image
                  src={guess.sprite}
                  alt={guess.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-200"
                />
              )}
            </div>
          </div>

          {/* Pokemon Info */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className={`rounded-lg p-3 ${result.nameMatch ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <h3 className="text-sm font-semibold opacity-75">Name</h3>
                  <p className={`font-bold ${result.nameMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {guess.name}
                  </p>
                </div>

                <div className={`rounded-lg p-3 ${result.regionMatch ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <h3 className="text-sm font-semibold opacity-75">Region</h3>
                  <p className={`font-bold ${result.regionMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {guess.region}
                  </p>
                </div>
              </div>

              {/* Types and Abilities */}
              <div className="space-y-4">
                <div className="rounded-lg p-3 bg-violet-500/20">
                  <h3 className="text-sm font-semibold opacity-75">Types</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-sm ${result.type1Match ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {guess.types[0]}
                    </span>
                    {guess.types[1] && (
                      <span className={`px-2 py-1 rounded text-sm ${result.type2Match ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {guess.types[1]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-lg p-3 bg-violet-500/20">
                  <h3 className="text-sm font-semibold opacity-75">Abilities</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {guess.abilities.map(ability => (
                      <span 
                        key={ability}
                        className={`px-2 py-1 rounded text-sm ${
                          result.abilityMatches.includes(ability) 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="rounded-lg p-3 bg-violet-500/20">
                <h3 className="text-sm font-semibold opacity-75">Base Stats</h3>
                <div className="space-y-2 mt-1">
                  {Object.entries(guess.baseStats).map(([stat, value]) => (
                    <div key={stat} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{stat.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className={`font-bold ${
                        result.statMatches[stat as keyof typeof result.statMatches]
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg p-3 bg-violet-500/20">
                <h3 className="text-sm font-semibold opacity-75">Physical</h3>
                <div className="mt-1 space-y-1">
                  <p className="text-sm">Height: {guess.height}m</p>
                  <p className="text-sm">Weight: {guess.weight}kg</p>
                </div>
              </div>

              <div className="rounded-lg p-3 bg-violet-500/20">
                <h3 className="text-sm font-semibold opacity-75">Moves</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {guess.moves.map(move => (
                    <span key={move} className="px-2 py-1 rounded text-sm bg-white/10">
                      {move}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-gray-900 pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-violet-400" />
                <div>
                  <p className="text-sm text-gray-400">Attempts</p>
                  <p className="text-xl font-bold text-white">{attempts}</p>
                </div>
              </div>
            </Card>

            {mode === "competitive" && (
              <>
                <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-4">
                  <div className="flex items-center space-x-3">
                    <Timer className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-sm text-gray-400">Time Left</p>
                      <p className="text-xl font-bold text-white">
                        {formatTime(timeLeft)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm text-gray-400">Lives</p>
                      <p className="text-xl font-bold text-white">{lives}</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Hints Used</p>
                  <p className="text-xl font-bold text-white">0/3</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Game Area */}
          <div className="space-y-8">
            {/* Pokemon Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6 aspect-[2/1] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 30% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 30% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <div className="text-center relative z-10">
                  <motion.div 
                    className="w-48 h-48 bg-violet-500/10 rounded-full mx-auto mb-4 flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                        "0 0 40px rgba(139, 92, 246, 0.2)",
                        "0 0 20px rgba(139, 92, 246, 0.3)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Image
                        src="/images/pokemon/pokeball.png"
                        alt="Mystery Pokémon"
                        width={96}
                        height={96}
                        className="w-24 h-24 object-contain opacity-50"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.p 
                    className="text-gray-400 text-lg"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    Who's that Pokémon?
                  </motion.p>
                </div>
              </Card>
            </motion.div>

            {/* Guess Input and Suggestions */}
            <div className="relative">
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  type="text"
                  placeholder="Enter Pokémon name..."
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="bg-black/40 border-white/10 text-white"
                />
                <Button
                  onClick={() => handleGuess()}
                  className="bg-violet-600 hover:bg-violet-700 relative overflow-hidden"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden z-50"
                  >
                    {suggestions.map((pokemon) => (
                      <motion.button
                        key={pokemon.name}
                        className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 flex items-center space-x-2"
                        onClick={() => handleGuess(pokemon.name)}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Image
                          src="/images/pokemon/pokeball.png"
                          alt=""
                          width={16}
                          height={16}
                          className="w-4 h-4 opacity-50"
                        />
                        <span>{pokemon.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Guessed Pokemon Cards */}
            <div className="space-y-4">
              <motion.h3 
                className="text-lg font-semibold text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Previous Guesses
              </motion.h3>
              <div className="grid gap-4">
                <AnimatePresence>
                  {guessedPokemon.map((pokemon, index) => (
                    <motion.div
                      key={`${pokemon.name}-${index}`}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {renderGuessCard(pokemon, guessResults[index])}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Hint Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                className="w-full border-violet-500/50 text-violet-400 hover:bg-violet-500/10 relative overflow-hidden"
              >
                <span className="relative z-10">Get a Hint (3 remaining)</span>
                <motion.div
                  className="absolute inset-0 bg-violet-500/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
