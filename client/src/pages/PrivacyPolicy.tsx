import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/login")}>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Button>
        </div>
        <span className="font-bold text-lg">Privacy Policy</span>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-6 text-zinc-300 leading-relaxed">
        <h1 className="text-3xl font-bold text-white tracking-tight">Privacy Policy - CourtKarao</h1>
        <p className="text-xs text-zinc-400">Last updated: August 6, 2026</p>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
          <p>
            CourtKarao collects personal identification information such as your name, email address, WhatsApp phone number, and sports preferences when you register or book sports courts across Karachi.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
          <p>
            We use your data to process turf bookings, generate QR venue check-in passes, calculate split payments with co-players, and send timely slot reminders via WhatsApp and email.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">3. Data Security & Supabase Storage</h2>
          <p>
            All user avatars, venue cover images, and transaction logs are securely stored using encrypted Supabase infrastructure with strict Row Level Security (RLS) policies.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">4. Contact Us</h2>
          <p>
            For any privacy-related inquiries regarding our Karachi operations, please contact support@courtkarao.pk.
          </p>
        </section>
      </main>
    </div>
  );
}
