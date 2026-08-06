import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, QrCode, ArrowLeft, Wallet, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { QRCodeSVG } from "qrcode.react";

export default function PlayerWallet() {
  const [, setLocation] = useLocation();
  const isGuest = localStorage.getItem("guest_mode") === "true";
  const { data: bookings } = trpc.bookings.myBookings.useQuery(undefined, { enabled: !isGuest });

  const mockBookings = [
    {
      id: 101,
      venueName: "The Padel Arena DHA",
      date: "2026-08-08",
      timeSlot: "18:00 - 19:00",
      totalAmount: "4500",
      status: "confirmed",
      qrCodeToken: "CK-PASS-MOCK-99821",
      splitAmount: "1125",
      whatsappMessage: "Hey! Split payment for Padel."
    },
    {
      id: 102,
      venueName: "Moonlight Futsal Gulshan",
      date: "2026-08-10",
      timeSlot: "20:00 - 21:00",
      totalAmount: "3800",
      status: "pending",
      qrCodeToken: "CK-PASS-MOCK-44312",
      splitAmount: "950",
      whatsappMessage: "Hey! Split payment for Futsal."
    }
  ];

  const bookingList = isGuest ? mockBookings : (bookings || []);
  const [activeQr, setActiveQr] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/player/dashboard")}>
          <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
          <span className="font-bold text-xl tracking-tight">Court<span className="text-[#CCFF00]">Karao</span> Wallet</span>
        </div>
        <Button variant="outline" onClick={() => setLocation("/player/dashboard")} className="border-white/[0.1] text-zinc-300">
          Back to Dashboard
        </Button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Bookings & QR Passes</h1>
            <p className="text-xs text-zinc-400 mt-1">Access your active court bookings and check-in QR codes</p>
          </div>
          <div className="bg-[#111314] px-4 py-2.5 rounded-xl border border-white/[0.06] flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-sm font-semibold">Active Bookings: {bookingList.length}</span>
          </div>
        </div>

        <div className="space-y-4">
          {bookingList.map((b: any) => (
            <Card key={b.id} className="bg-[#111314] border-white/[0.06] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{b.venueName || "Sports Arena Karachi"}</h3>
                  <Badge className={b.status === "confirmed" ? "bg-[#CCFF00] text-black font-semibold" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}>
                    {b.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#CCFF00]" /> {b.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#CCFF00]" /> {b.timeSlot}</span>
                  <span className="font-semibold text-white">Total: Rs. {Number(b.totalAmount).toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={() => setActiveQr(b.qrCodeToken)}
                className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]"
              >
                <QrCode className="w-4 h-4 mr-2" /> View QR Pass
              </Button>
            </Card>
          ))}
        </div>
      </main>

      {activeQr && (
        <Dialog open={!!activeQr} onOpenChange={() => setActiveQr(null)}>
          <DialogContent className="bg-[#111314] border-white/[0.1] text-white max-w-sm text-center">
            <DialogHeader>
              <DialogTitle>Venue Check-in QR Pass</DialogTitle>
              <DialogDescription className="text-zinc-400">Show this QR code at the venue entrance for instant verification.</DialogDescription>
            </DialogHeader>
            <div className="bg-white p-4 rounded-xl inline-block mx-auto my-4">
              <QRCodeSVG value={activeQr} size={180} bgColor="#ffffff" fgColor="#08090a" />
            </div>
            <p className="text-xs text-zinc-400 font-mono">{activeQr}</p>
            <Button onClick={() => setActiveQr(null)} className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white mt-4">
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
