import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Store, ArrowRight, Sparkles } from "lucide-react";
import { useLocation, Link } from "wouter";
import { startLogin } from "@/const";

export default function Login() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<"player" | "owner">("player");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleGuestExplore = (role: "player" | "owner") => {
    localStorage.setItem("guest_mode", "true");
    localStorage.setItem("guest_role", role);
    if (role === "player") {
      setLocation("/player/dashboard");
    } else {
      setLocation("/owner/dashboard");
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    localStorage.removeItem("guest_mode");
    startLogin();
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col justify-center items-center p-4">
      <div className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer" onClick={() => setLocation("/")}>
        <div className="w-9 h-9 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black font-bold text-xl">CK</div>
        <span className="font-bold text-xl tracking-tight">Court<span className="text-[#CCFF00]">Karao</span></span>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-semibold mb-3 border border-[#CCFF00]/20">
            <Sparkles className="w-3.5 h-3.5" /> Karachi's Premier Sports Booking SaaS
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to CourtKarao</h1>
          <p className="text-sm text-zinc-400 mt-2">Select your role and sign in to manage or book courts</p>
        </div>

        <Card className="bg-[#111314] border-white/[0.06] shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Role</CardTitle>
            <CardDescription className="text-zinc-400">Are you booking a court or managing one?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("player")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedRole === "player"
                    ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]"
                    : "bg-[#08090a] border-white/[0.06] text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-semibold text-sm">Player</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedRole === "owner"
                    ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]"
                    : "bg-[#08090a] border-white/[0.06] text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Store className="w-6 h-6" />
                <span className="font-semibold text-sm">Court Owner</span>
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#08090a] border-white/[0.08] text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#08090a] border-white/[0.08] text-white"
                />
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded border-zinc-700 bg-[#08090a] text-[#CCFF00] focus:ring-[#CCFF00]"
                />
                <label htmlFor="agree" className="text-xs text-zinc-400 leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link href="/privacy-policy" className="text-[#CCFF00] hover:underline">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link href="/terms-of-use" className="text-[#CCFF00] hover:underline">Terms of Use</Link>.
                </label>
              </div>

              <Button
                type="submit"
                disabled={!agreed}
                className={`w-full font-semibold h-11 ${
                  agreed
                    ? "bg-[#CCFF00] text-black hover:bg-[#b3e600]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                Sign In / Sign Up <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="flex-shrink mx-4 text-xs text-zinc-500">OR DEMO</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
            </div>

            <Button
              variant="outline"
              onClick={() => handleGuestExplore(selectedRole)}
              className="w-full bg-transparent border-white/[0.1] text-white hover:bg-white/[0.05] h-11"
            >
              Explore Demo as Guest ({selectedRole === "player" ? "Player" : "Owner"})
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
