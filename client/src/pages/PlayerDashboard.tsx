import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Star, Calendar, Clock, DollarSign, Users, QrCode, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, LogOut, Wallet } from "lucide-react";
import { useLocation } from "wouter";
import { QRCodeSVG } from "qrcode.react";

const MOCK_VENUES = [
  {
    id: 1,
    name: "The Padel Arena DHA",
    sportType: "padel",
    area: "DHA Phase 6, Karachi",
    address: "Street 26, Tauheed Commercial, DHA Phase 6",
    pricePerHour: 4500,
    coverImage: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Floodlights", "Cafeteria", "Pro Shop", "Changing Rooms"],
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: 2,
    name: "Moonlight Futsal Gulshan",
    sportType: "football",
    area: "Gulshan-e-Iqbal, Karachi",
    address: "Block 4, Near University Road, Gulshan",
    pricePerHour: 3800,
    coverImage: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1200&auto=format&fit=crop",
    amenities: ["FIFA Turf", "Floodlights", "Parking", "Dugouts"],
    rating: 4.7,
    reviewsCount: 94
  },
  {
    id: 3,
    name: "Clifton Smash Badminton",
    sportType: "badminton",
    area: "Clifton, Karachi",
    address: "Block 5, Kehkashan, Clifton",
    pricePerHour: 2500,
    coverImage: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Wooden Flooring", "AC Indoor", "Racket Rental", "Locker Room"],
    rating: 4.8,
    reviewsCount: 112
  },
  {
    id: 4,
    name: "Karachi Titans Cricket Ground",
    sportType: "cricket",
    area: "PECHS, Karachi",
    address: "Block 2, Tariq Road adjacent area, PECHS",
    pricePerHour: 6000,
    coverImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop",
    amenities: ["Hardened Tapeball Pitch", "Floodlights", "Seating Pavilion", "Scoreboard"],
    rating: 4.9,
    reviewsCount: 215
  }
];

const TIME_SLOTS = [
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00", // disabled 7pm as requested in prompt
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00"
];

export default function PlayerDashboard() {
  const [, setLocation] = useLocation();
  const isGuest = localStorage.getItem("guest_mode") === "true";
  
  const [sportType, setSportFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: dbVenues, isLoading } = trpc.venues.list.useQuery(
    { sportType, area: areaFilter },
    { enabled: !isGuest }
  );

  const venuesList = isGuest 
    ? MOCK_VENUES.filter(v => {
        if (sportType !== "all" && v.sportType !== sportType) return false;
        if (areaFilter !== "all" && !v.area.toLowerCase().includes(areaFilter.toLowerCase())) return false;
        if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
    : (dbVenues || []).filter(v => {
        if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });

  // Booking Modal State
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("2026-08-07");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [coPlayers, setCoPlayers] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  
  const createBookingMutation = trpc.bookings.create.useMutation();
  const [successData, setSuccessData] = useState<any>(null);

  const handleBookNow = (venue: any) => {
    setSelectedVenue(venue);
    setBookingStep(1);
    setSelectedSlot("");
    setSuccessData(null);
  };

  const handleConfirmBooking = async () => {
    const totalAmount = Number(selectedVenue.pricePerHour);
    if (isGuest) {
      // Mock success for guest
      const split = Math.round(totalAmount / (coPlayers + 1));
      const qr = `CK-PASS-GUEST-${Math.floor(Math.random() * 100000)}`;
      const wa = encodeURIComponent(`Hey! I booked ${selectedVenue.name} on CourtKarao for ${selectedDate} at ${selectedSlot}. Your share is Rs. ${split}. Pay via Easypaisa to confirm!`);
      setSuccessData({ qrCodeToken: qr, splitAmount: split, whatsappMessage: wa });
      setBookingStep(3);
      return;
    }

    try {
      const res = await createBookingMutation.mutateAsync({
        venueId: selectedVenue.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        totalAmount,
        paymentMethod,
        coPlayersCount: coPlayers,
      });
      setSuccessData(res);
      setBookingStep(3);
    } catch (err) {
      alert("Failed to create booking");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
          <div className="w-9 h-9 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black font-bold text-xl">CK</div>
          <span className="font-bold text-xl tracking-tight">Court<span className="text-[#CCFF00]">Karao</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/player/wallet")} className="text-zinc-300 hover:text-white">
            <Wallet className="w-4 h-4 mr-2" /> My Bookings & Passes
          </Button>
          <Button variant="outline" onClick={() => { localStorage.clear(); setLocation("/login"); }} className="border-white/[0.1] text-zinc-300 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Hero search bar */}
        <div className="bg-gradient-to-r from-[#111314] to-[#1a1d1e] p-8 rounded-2xl border border-white/[0.06] flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Find & Book Karachi's Best Sports Courts</h1>
            <p className="text-sm text-zinc-400 mt-1">Cricket, Football, Badminton, Padel, and Tennis courts across DHA, Clifton, and Gulshan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search venue name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#08090a] border-white/[0.08]"
              />
            </div>
            
            <select
              value={sportType}
              onChange={(e) => setSportFilter(e.target.value)}
              className="bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
            >
              <option value="all">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="badminton">Badminton</option>
              <option value="tennis">Tennis</option>
              <option value="padel">Padel</option>
            </select>

            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
            >
              <option value="all">All Karachi Areas</option>
              <option value="dha">DHA</option>
              <option value="clifton">Clifton</option>
              <option value="gulshan">Gulshan-e-Iqbal</option>
              <option value="pechs">PECHS</option>
            </select>

            <Button className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600] h-11">
              Search Courts
            </Button>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Available Venues ({venuesList.length})</h2>
            <span className="text-xs text-zinc-400">Karachi Region</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venuesList.map((venue: any) => (
              <Card key={venue.id} className="bg-[#111314] border-white/[0.06] overflow-hidden group hover:border-[#CCFF00]/50 transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={venue.coverImage} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{venue.rating}</span>
                  </div>
                  <Badge className="absolute bottom-3 left-3 bg-[#CCFF00] text-black font-semibold capitalize">
                    {venue.sportType}
                  </Badge>
                </div>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{venue.name}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" /> {venue.area}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(venue.amenities) && venue.amenities.map((amenity: string, i: number) => (
                      <span key={i} className="text-[10px] bg-white/[0.05] border border-white/[0.05] px-2 py-0.5 rounded-md text-zinc-300">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <div>
                      <span className="text-xs text-zinc-400 block">Rate per hour</span>
                      <span className="text-lg font-bold text-[#CCFF00]">Rs. {Number(venue.pricePerHour).toLocaleString()}</span>
                    </div>
                    <Button onClick={() => handleBookNow(venue)} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
                      Book Now <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Dialog Modal */}
      {selectedVenue && (
        <Dialog open={!!selectedVenue} onOpenChange={() => setSelectedVenue(null)}>
          <DialogContent className="bg-[#111314] border-white/[0.1] text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Book {selectedVenue.name}</DialogTitle>
              <DialogDescription className="text-zinc-400">
                {bookingStep === 1 && "Step 1: Select date and time slot"}
                {bookingStep === 2 && "Step 2: Split cost with co-players & payment"}
                {bookingStep === 3 && "Step 3: Booking Confirmed & QR Pass"}
              </DialogDescription>
            </DialogHeader>

            {bookingStep === 1 && (
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Select Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Select Time Slot (7 PM is disabled)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot, i) => {
                      const isDisabled = slot.includes("18:00"); // 7 PM slot in 16:00-19:00 system or 18:00-19:00
                      return (
                        <button
                          key={i}
                          disabled={isDisabled}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            isDisabled
                              ? "opacity-40 bg-zinc-900 border-transparent cursor-not-allowed line-through"
                              : selectedSlot === slot
                              ? "bg-[#CCFF00] text-black border-[#CCFF00]"
                              : "bg-[#08090a] border-white/[0.08] text-zinc-300 hover:border-zinc-700"
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    disabled={!selectedSlot}
                    onClick={() => setBookingStep(2)}
                    className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]"
                  >
                    Next: Split & Payment <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="space-y-4 py-2">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Number of Co-Players to Split Cost With</label>
                  <select
                    value={coPlayers}
                    onChange={(e) => setCoPlayers(Number(e.target.value))}
                    className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
                  >
                    <option value={1}>1 Co-Player (Split 50/50)</option>
                    <option value={3}>3 Co-Players (Split 4 ways)</option>
                    <option value={5}>5 Co-Players (Split 6 ways)</option>
                  </select>
                </div>

                <div className="bg-[#08090a] p-4 rounded-xl border border-white/[0.06] space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Total Court Rent</span>
                    <span className="font-bold">Rs. {Number(selectedVenue.pricePerHour).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#CCFF00]">
                    <span>Split Cost Per Player ({coPlayers + 1} people)</span>
                    <span className="font-bold">Rs. {Math.round(Number(selectedVenue.pricePerHour) / (coPlayers + 1)).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`p-3 rounded-xl border text-xs font-semibold ${paymentMethod === "online" ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]" : "bg-[#08090a] border-white/[0.08] text-zinc-400"}`}
                    >
                      Online (Card / Easypaisa)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`p-3 rounded-xl border text-xs font-semibold ${paymentMethod === "cash" ? "bg-[#CCFF00]/10 border-[#CCFF00] text-[#CCFF00]" : "bg-[#08090a] border-white/[0.08] text-zinc-400"}`}
                    >
                      Pay Cash at Venue
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setBookingStep(1)} className="border-white/[0.1]">
                    Back
                  </Button>
                  <Button onClick={handleConfirmBooking} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
                    Confirm Booking & Get QR Pass
                  </Button>
                </div>
              </div>
            )}

            {bookingStep === 3 && successData && (
              <div className="space-y-6 py-4 text-center">
                <div className="w-16 h-16 bg-[#CCFF00]/10 text-[#CCFF00] rounded-full flex items-center justify-center mx-auto border border-[#CCFF00]/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Booking Confirmed!</h3>
                  <p className="text-xs text-zinc-400 mt-1">Your slot is locked. Show the QR pass at the venue entrance.</p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-xl inline-block mx-auto">
                  <QRCodeSVG value={successData.qrCodeToken} size={160} bgColor="#ffffff" fgColor="#08090a" />
                </div>

                {/* WhatsApp Split Share */}
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/?text=${successData.whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] text-black font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#20ba59] transition-all"
                  >
                    <MessageSquare className="w-4 h-4" /> Share Split Payment on WhatsApp
                  </a>
                  <p className="text-[11px] text-zinc-400">Pre-filled message includes your co-player share amount of Rs. {successData.splitAmount}.</p>
                </div>

                <Button onClick={() => setSelectedVenue(null)} className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white">
                  Done
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
