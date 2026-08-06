import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store, Upload, CheckCircle2, ArrowLeft, LogOut, ShieldCheck, DollarSign } from "lucide-react";
import { useLocation } from "wouter";
import { uploadImageToSupabase } from "@/lib/supabase/storage";

export default function OwnerSettings() {
  const [, setLocation] = useLocation();

  // Venue details
  const [venueName, setVenueName] = useState("The Padel Arena DHA");
  const [area, setArea] = useState("DHA Phase 6, Karachi");
  const [sportType, setSportType] = useState("padel");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop");
  const [uploading, setUploading] = useState(false);

  // Owner payout details
  const [ownerName, setOwnerName] = useState("Farhan Malik");
  const [cnic, setCnic] = useState("42101-9876543-1");
  const [payoutMethod, setPayoutMethod] = useState("Easypaisa");
  const [payoutNumber, setPayoutNumber] = useState("+92 321 9876543");

  const [saved, setSaved] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setCoverImage(preview);

    try {
      const url = await uploadImageToSupabase(file, "venue-images", "owner-1");
      setCoverImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/owner/dashboard")} className="text-zinc-400 hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
        </div>
        <span className="font-bold text-lg">Owner Venue & Payout Settings</span>
        <Button variant="outline" onClick={() => { localStorage.clear(); setLocation("/login"); }} className="border-white/[0.1] text-zinc-300 hover:text-white">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Venue Details Card */}
          <Card className="bg-[#111314] border-white/[0.06]">
            <CardHeader>
              <CardTitle>Venue Configuration</CardTitle>
              <CardDescription className="text-zinc-400">Manage your court listing details and turf photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Venue Cover Photo</label>
                <div className="relative h-48 rounded-xl overflow-hidden border border-white/[0.08] group">
                  <img src={coverImage} alt="Venue Cover" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="w-8 h-8 text-[#CCFF00]" />
                    <span className="text-xs text-white mt-1 font-semibold">Upload New Cover Photo</span>
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <span className="text-xs text-[#CCFF00] mt-1 block">Uploading to Supabase venue-images...</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Venue Name</label>
                  <Input
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Sport Type</label>
                  <select
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
                  >
                    <option value="padel">Padel</option>
                    <option value="football">Football</option>
                    <option value="cricket">Cricket</option>
                    <option value="badminton">Badminton</option>
                    <option value="tennis">Tennis</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Karachi Area</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
                  >
                    <option value="DHA Phase 6, Karachi">DHA Phase 6, Karachi</option>
                    <option value="Clifton, Karachi">Clifton, Karachi</option>
                    <option value="Gulshan-e-Iqbal, Karachi">Gulshan-e-Iqbal, Karachi</option>
                    <option value="PECHS, Karachi">PECHS, Karachi</option>
                    <option value="North Nazimabad, Karachi">North Nazimabad, Karachi</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout Details Card */}
          <Card className="bg-[#111314] border-white/[0.06]">
            <CardHeader>
              <CardTitle>Owner Payout Information</CardTitle>
              <CardDescription className="text-zinc-400">Where we send your daily turf earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Owner Full Name</label>
                  <Input
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">CNIC Number</label>
                  <Input
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Payout Method</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
                  >
                    <option value="Easypaisa">Easypaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Bank Transfer">Bank Transfer (Meezan/HBL)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Account / Mobile Number</label>
                  <Input
                    value={payoutNumber}
                    onChange={(e) => setPayoutNumber(e.target.value)}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {saved ? (
                  <span className="text-xs text-[#CCFF00] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
                  </span>
                ) : <span></span>}
                <Button type="submit" className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
                  Save Venue & Payout Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
