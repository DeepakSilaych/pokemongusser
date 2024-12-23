"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function GameSelection() {
  const session = await getServerSession(authOptions);

  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);

  const modes = [
    {
      id: "casual",
      name: "Casual",
      description: "A peaceful journey with the mystical Mew as your guide",
      icon: "/images/pokemon/mew.png",
      features: ["Unlimited attempts"],
      color: "from-pink-400 to-purple-400",
      bgGlow: "pink"
    },
    {
      id: "competitive",
      name: "Competitive",
      description: "Face the challenge of the powerful Mewtwo",
      icon: "/images/pokemon/mewtwo.png",
      features: ["10 lives only"],
      color: "from-purple-600 to-indigo-600",
      bgGlow: "purple"
    },
  ];

  const difficulties = [
    {
      id: "easy",
      name: "Charmander",
      icon: "/images/pokemon/charmander.png",
      color: "from-orange-400 to-red-400",
      bgGlow: "orange"
    },
    {
      id: "medium",
      name: "Charmeleon",
      icon: "/images/pokemon/charmeleon.png",
      color: "from-red-500 to-orange-500",
      bgGlow: "red"
    },
    {
      id: "hard",
      name: "Charizard",
      icon: "/images/pokemon/charizard.png",
      color: "from-red-600 to-orange-600",
      bgGlow: "red"
    },
  ];

  const generations = [
    { id: "gen1", name: "Gen 1 (Kanto)", pokemon: "Charizard" },
    { id: "gen2", name: "Gen 2 (Johto)", pokemon: "Typhlosion" },
    { id: "gen3", name: "Gen 3 (Hoenn)", pokemon: "Blaziken" },
    { id: "gen4", name: "Gen 4 (Sinnoh)", pokemon: "Infernape" },
    { id: "gen5", name: "Gen 5 (Unova)", pokemon: "Samurott" },
    { id: "gen6", name: "Gen 6 (Kalos)", pokemon: "Greninja" },
    { id: "gen7", name: "Gen 7 (Alola)", pokemon: "Decidueye" },
    { id: "gen8", name: "Gen 8 (Galar)", pokemon: "Cinderace" },
    { id: "gen9", name: "Gen 9 (Paldea)", pokemon: "Meowscarada" },
  ];

  const toggleGeneration = (genId: string) => {
    setSelectedGenerations(prev => {
      if (prev.includes(genId)) {
        return prev.filter(id => id !== genId);
      } else {
        return [...prev, genId];
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Image
                src="/images/pokemon/pokeball.png"
                alt="Pokeball"
                width={32}
                height={32}
                className="w-8 h-8 mr-3 text-yellow-400"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                Choose Your Path
              </span>
            </h1>
            <p className="text-gray-400">Your journey to becoming a Pokémon Master starts here!</p>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div 
          className=""
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Game Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {modes.map((mode) => (
              <motion.div
                key={mode.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {mode.id === "competitive" && !session ? (
                  <Card
                    className="p-6 cursor-not-allowed relative overflow-hidden bg-black/20"
                  >
                    <div className="flex items-start space-x-6 relative z-10">
                      <div className="flex-shrink-0">
                        <div className={`w-24 h-24 rounded-full overflow-hidden`}>
                          <Image
                            src={mode.icon}
                            alt={mode.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">{mode.name}</h3>
                        <p className="text-sm text-gray-300 mb-4">{mode.description}</p>
                        <ul className="space-y-2">
                          {mode.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/50 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        Sign in to play
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card
                    className={`p-6 cursor-pointer relative overflow-hidden ${
                      selectedMode === mode.id
                        ? `bg-gradient-to-br ${mode.color} bg-opacity-20 border-2 border-white/20`
                        : "bg-black/20 hover:bg-black/30"
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    {selectedMode === mode.id && (
                      <div 
                        className={`absolute inset-0 blur-3xl opacity-20 bg-${mode.bgGlow}-500`}
                        style={{ transform: 'scale(0.9)' }}
                      />
                    )}
                    <div className="flex items-start space-x-6 relative z-10">
                      <div className="flex-shrink-0">
                        <div className={`w-24 h-24 rounded-full overflow-hidden ${
                          selectedMode === mode.id ? 'ring-4 ring-white/30' : ''
                        }`}>
                          <Image
                            src={mode.icon}
                            alt={mode.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-white">{mode.name}</h3>
                        <p className="text-sm text-gray-300 mb-4">{mode.description}</p>
                        <ul className="space-y-2">
                          {mode.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-white/50 mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedMode === "casual" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8"
              >
                {/* Difficulty Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center">
                    <span className="text-orange-400">Choose Difficulty</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {difficulties.map((diff) => (
                      <motion.div
                        key={diff.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`p-6 cursor-pointer relative overflow-hidden ${
                            selectedDifficulty === diff.id
                              ? `bg-gradient-to-br ${diff.color} bg-opacity-20 border-2 border-white/20`
                              : "bg-black/20 hover:bg-black/30"
                          }`}
                          onClick={() => setSelectedDifficulty(diff.id)}
                        >
                          {selectedDifficulty === diff.id && (
                            <div 
                              className={`absolute inset-0 blur-3xl opacity-20 bg-${diff.bgGlow}-500`}
                              style={{ transform: 'scale(0.9)' }}
                            />
                          )}
                          <div className="flex flex-col items-center space-y-4 relative z-10">
                            <div className={`w-32 h-32 rounded-xl overflow-hidden ${
                              selectedDifficulty === diff.id ? 'ring-4 ring-white/30' : ''
                            }`}>
                              <Image
                                src={diff.icon}
                                alt={diff.name}
                                width={128}
                                height={128}
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <span className={`text-lg font-semibold ${
                              selectedDifficulty === diff.id ? 'text-white' : 'text-gray-400'
                            }`}>
                              {diff.name}
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Generation Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="text-blue-400">Select Your Regions</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {generations.map((gen) => (
                      <motion.div
                        key={gen.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`p-4 cursor-pointer relative overflow-hidden ${
                            selectedGenerations.includes(gen.id)
                              ? "bg-gradient-to-br from-blue-500 to-cyan-500 bg-opacity-20 border-2 border-white/20"
                              : "bg-black/20 hover:bg-black/30"
                          }`}
                          onClick={() => toggleGeneration(gen.id)}
                        >
                          {selectedGenerations.includes(gen.id) && (
                            <div 
                              className="absolute inset-0 blur-3xl opacity-20 bg-blue-500"
                              style={{ transform: 'scale(0.9)' }}
                            />
                          )}
                          <div className="flex items-center justify-between relative z-10">
                            <span className={selectedGenerations.includes(gen.id) ? "text-white" : "text-gray-400"}>
                              {gen.name}
                            </span>
                            {selectedGenerations.includes(gen.id) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6"
                              >
                                <Image
                                  src="/images/pokemon/pokeball.png"
                                  alt="Selected"
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-contain"
                                />
                              </motion.div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start Game Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex justify-center"
          >
            <Link href="/game/play">
              <Button
                className={`px-8 py-6 text-lg font-semibold relative overflow-hidden ${
                  (selectedMode === "competitive" || 
                  (selectedMode === "casual" && selectedDifficulty && selectedGenerations.length > 0))
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                  : "bg-gray-700 cursor-not-allowed"
                }`}
                disabled={!(selectedMode === "competitive" || 
                  (selectedMode === "casual" && selectedDifficulty && selectedGenerations.length > 0))}
              >
                <span className="relative z-10 flex items-center">
                  Start Your Journey
                  <Image
                    src="/images/pokemon/pokeball.png"
                    alt="Pokeball"
                    width={24}
                    height={24}
                    className="ml-2 w-6 h-6"
                  />
                </span>
                {(selectedMode === "competitive" || 
                  (selectedMode === "casual" && selectedDifficulty && selectedGenerations.length > 0)) && (
                  <div className="absolute inset-0 blur-lg opacity-30 bg-yellow-300" />
                )}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
