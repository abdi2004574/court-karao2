import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsOfUse() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/login")}>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
          </Button>
        </div>
        <span className="font-bold text-lg">Terms of Use</span>
        <div className="w-20"></div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 space-y-6 text-zinc-300 leading-relaxed">
        <h1 className="text-3xl font-bold text-white tracking-tight">Terms of Use - CourtKarao</h1>
        <p className="text-xs text-zinc-400">Last updated: August 6, 2026</p>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or booking sports courts through CourtKarao in Karachi, you agree to abide by these Terms of Use and all applicable local sports turf regulations.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">2. Court Booking & Cancellation Policy</h2>
          <p>
            Bookings are confirmed upon slot selection and payment method agreement. Cancellations made at least 6 hours prior to the booked slot are eligible for a full refund or rescheduling.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">3. Split Payments & Co-Players</h2>
          <p>
            Organizers inviting co-players via WhatsApp split links are responsible for collecting respective shares. CourtKarao facilitates cost breakdown calculations but is not liable for individual co-player defaults.
          </p>
        </section>

        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-semibold text-white">4. Venue Rules & Conduct</h2>
          <p>
            Players must present their unique QR pass at the venue entrance. Turf owners reserve the right to refuse entry in cases of unruly conduct or failure to adhere to safety guidelines.
          </p>
        </section>
      </main>
    </div>
  );
}
