"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/game");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
      <Card className="w-[350px] p-6 bg-black/40 backdrop-blur-sm border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Button
            variant="link"
            className="text-violet-400 hover:text-violet-300 p-0"
            onClick={handleRegister}
          >
            Register here
          </Button>
        </p>
      </Card>
    </div>
  );
}
