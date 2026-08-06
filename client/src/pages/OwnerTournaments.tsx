import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Trophy, Users, Plus, Award, ArrowLeft, LogOut, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function OwnerTournaments() {
  const [, setLocation] = useLocation();

  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: "Karachi Padel Open 2026",
      sport: "Padel",
      teamsCount: 8,
      entryFee: 12000,
      status: "upcoming"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [sport, setSport] = useState("Padel");
  const [teamsCount, setTeamsCount] = useState(8);
  const [entryFee, setEntryFee] = useState(10000);

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newT = {
      id: tournaments.length + 1,
      name,
      sport,
      teamsCount,
      entryFee,
      status: "upcoming"
    };

    setTournaments([newT, ...tournaments]);
    setName("");
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/owner/dashboard")} className="text-zinc-400 hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
        </div>
        <span className="font-bold text-lg">Tournament Management & Brackets</span>
        <Button variant="outline" onClick={() => { localStorage.clear(); setLocation("/login"); }} className="border-white/[0.1] text-zinc-300 hover:text-white">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Active Tournaments</h1>
            <p className="text-xs text-zinc-400 mt-1">Host competitive cups, manage registration fees, and view automated brackets.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
            <Plus className="w-4 h-4 mr-1.5" /> Create Tournament
          </Button>
        </div>

        {/* Tournaments List & Brackets */}
        <div className="space-y-8">
          {tournaments.map((t) => (
            <Card key={t.id} className="bg-[#111314] border-white/[0.06] overflow-hidden">
              <CardHeader className="border-b border-white/[0.06] flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#CCFF00]" />
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                  </div>
                  <CardDescription className="text-zinc-400 mt-1">
                    Sport: {t.sport} • Teams: {t.teamsCount} Bracket • Entry Fee: Rs. {t.entryFee.toLocaleString()}
                  </CardDescription>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20 capitalize">
                  {t.status}
                </span>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">Tournament Bracket Grid (Quarterfinals / Semis / Finals)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Quarterfinals */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-medium text-zinc-500">Quarterfinals</span>
                      <div className="bg-[#08090a] p-3 rounded-xl border border-white/[0.06] text-xs space-y-2">
                        <div className="flex justify-between font-medium"><span>Karachi Smashers</span><span>2</span></div>
                        <div className="flex justify-between text-zinc-400"><span>Clifton Strikers</span><span>1</span></div>
                      </div>
                      <div className="bg-[#08090a] p-3 rounded-xl border border-white/[0.06] text-xs space-y-2">
                        <div className="flex justify-between font-medium"><span>DHA Titans</span><span>3</span></div>
                        <div className="flex justify-between text-zinc-400"><span>Gulshan United</span><span>0</span></div>
                      </div>
                    </div>

                    {/* Semifinals */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-medium text-zinc-500">Semifinals</span>
                      <div className="bg-[#08090a] p-3 rounded-xl border border-white/[0.06] text-xs space-y-2 mt-6">
                        <div className="flex justify-between font-medium"><span>Karachi Smashers</span><span>4</span></div>
                        <div className="flex justify-between text-zinc-400"><span>DHA Titans</span><span>2</span></div>
                      </div>
                    </div>

                    {/* Finals */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-medium text-zinc-500">Grand Final</span>
                      <div className="bg-[#CCFF00]/10 p-3 rounded-xl border border-[#CCFF00]/30 text-xs space-y-2 mt-12">
                        <div className="flex justify-between font-bold text-[#CCFF00]"><span>Karachi Smashers (Winner)</span><span>🏆</span></div>
                        <div className="flex justify-between text-zinc-400"><span>Pending Challenger</span><span>-</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Create Tournament Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#111314] border-white/[0.1] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
            <DialogDescription className="text-zinc-400">Set up a competitive cup for your venue.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTournament} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Tournament Name</label>
              <Input
                placeholder="e.g. Summer Cup 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#08090a] border-white/[0.08]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Sport</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
                >
                  <option value="Padel">Padel</option>
                  <option value="Football">Football</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Teams Count</label>
                <select
                  value={teamsCount}
                  onChange={(e) => setTeamsCount(Number(e.target.value))}
                  className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#CCFF00]"
                >
                  <option value={4}>4 Teams</option>
                  <option value={8}>8 Teams</option>
                  <option value={16}>16 Teams</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Entry Fee per Team (PKR)</label>
              <Input
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(Number(e.target.value))}
                className="bg-[#08090a] border-white/[0.08]"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/[0.1]">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
                Publish Tournament
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
