import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, MapPin, Star, ArrowRight, Sparkles, Zap, Trophy, Users } from "lucide-react";
import { useLocation } from "wouter";

const CATEGORIES = [
  { name: "Cricket", courts: 14, icon: "🏏", image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop" },
  { name: "Football", courts: 22, icon: "⚽", image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=800&auto=format&fit=crop" },
  { name: "Badminton", courts: 18, icon: "🏸", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop" },
  { name: "Padel & Tennis", courts: 12, icon: "🎾", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop" },
];

const FEATURED_COURTS = [
  {
    name: "The Padel Arena DHA",
    area: "DHA Phase 6, Karachi",
    sport: "Padel",
    price: "Rs. 4,500 / hr",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Moonlight Futsal Gulshan",
    area: "Gulshan-e-Iqbal, Karachi",
    sport: "Football",
    price: "Rs. 3,800 / hr",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1200&auto=format&fit=crop"
  },
  {
    name: "Clifton Smash Badminton",
    area: "Clifton Block 5, Karachi",
    sport: "Badminton",
    price: "Rs. 2,500 / hr",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
          <div className="w-10 h-10 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black font-bold text-2xl">CK</div>
          <span className="font-bold text-xl tracking-tight">Court<span className="text-[#CCFF00]">Karao</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/login")} className="text-zinc-300 hover:text-white">
            Sign In
          </Button>
          <Button onClick={() => setLocation("/login")} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
            Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-semibold border border-[#CCFF00]/20">
              <Sparkles className="w-3.5 h-3.5" /> Karachi's Elite Sports Court Booking Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Book Premium Sports Courts in <span className="text-[#CCFF00]">Karachi</span>
            </h1>
            <p className="text-lg text-zinc-400">
              Instant slot booking, automated WhatsApp split payments, QR venue check-ins, and professional turf management across DHA, Clifton, Gulshan, and PECHS.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={() => setLocation("/login")} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600] h-12 px-8 text-base">
                Explore Courts as Player <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => setLocation("/login")} className="border-white/[0.1] text-white hover:bg-white/[0.05] h-12 px-8 text-base">
                List Your Court (Owner)
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#CCFF00]/30 to-emerald-500/20 rounded-3xl blur-2xl opacity-50"></div>
            <div className="relative bg-[#111314] p-4 rounded-2xl border border-white/[0.08] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop"
                alt="Padel Court Karachi"
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">The Padel Arena DHA</h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" /> DHA Phase 6, Karachi
                  </p>
                </div>
                <span className="text-[#CCFF00] font-bold text-lg">Rs. 4,500/hr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sport Categories */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Browse by Sport Category</h2>
          <p className="text-sm text-zinc-400 mt-2">Find professional turfs and indoor courts across Karachi</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <div
              key={i}
              onClick={() => setLocation("/login")}
              className="group relative h-64 rounded-2xl overflow-hidden border border-white/[0.06] cursor-pointer"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090a] via-[#08090a]/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl mb-1 block">{cat.icon}</span>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-zinc-400">{cat.courts} Active Venues</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white/[0.1] backdrop-blur flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courts */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold">Featured Karachi Venues</h2>
            <p className="text-sm text-zinc-400 mt-1">Top-rated spots for your next match</p>
          </div>
          <Button onClick={() => setLocation("/login")} variant="outline" className="border-white/[0.1] text-zinc-300">
            View All Venues
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_COURTS.map((court, i) => (
            <Card key={i} className="bg-[#111314] border-white/[0.06] overflow-hidden group hover:border-[#CCFF00]/50 transition-all cursor-pointer" onClick={() => setLocation("/login")}>
              <div className="relative h-48 overflow-hidden">
                <img src={court.image} alt={court.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{court.rating}</span>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold text-lg">{court.name}</h3>
                <p className="text-xs text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" /> {court.area}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <span className="text-sm font-semibold text-[#CCFF00]">{court.price}</span>
                  <span className="text-xs text-zinc-400 font-medium">Book Slot →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6 mt-auto bg-[#08090a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-400 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#CCFF00] rounded-lg flex items-center justify-center text-black font-bold text-sm">CK</div>
            <span className="font-bold text-white text-sm">CourtKarao Karachi</span>
          </div>
          <p>© 2026 CourtKarao Inc. All rights reserved. Built for Karachi athletes & venue owners.</p>
        </div>
      </footer>
    </div>
  );
}
