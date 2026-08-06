import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Calendar, TrendingUp, CheckCircle, Plus, Store, Settings, LogOut, ShieldCheck, QrCode } from "lucide-react";
import { useLocation } from "wouter";

const MOCK_OWNER_BOOKINGS = [
  {
    id: 201,
    venueName: "The Padel Arena DHA",
    date: "2026-08-07",
    timeSlot: "18:00 - 19:00",
    totalAmount: "4500",
    platformFee: "375",
    ownerPayout: "4125",
    status: "confirmed",
    paymentMethod: "online"
  },
  {
    id: 202,
    venueName: "The Padel Arena DHA",
    date: "2026-08-07",
    timeSlot: "19:00 - 20:00",
    totalAmount: "4500",
    platformFee: "0",
    ownerPayout: "4500",
    status: "pending",
    paymentMethod: "cash"
  }
];

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const isGuest = localStorage.getItem("guest_mode") === "true";

  const { data: dbBookings } = trpc.bookings.myBookings.useQuery(undefined, { enabled: !isGuest });
  const { data: summary } = trpc.monetization.summary.useQuery(undefined, { enabled: !isGuest });

  const [bookingsList, setBookingsList] = useState<any[]>(isGuest ? MOCK_OWNER_BOOKINGS : (dbBookings || []));
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [walkInForm, setWalkInForm] = useState({ court: "The Padel Arena DHA", date: "2026-08-07", time: "17:00 - 18:00", method: "cash", amount: "4500" });

  const updateStatusMutation = trpc.bookings.updateStatus.useMutation();

  const handleVerify = async (bookingId: number) => {
    if (isGuest) {
      setBookingsList(bookingsList.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
      return;
    }
    await updateStatusMutation.mutateAsync({ bookingId, status: 'confirmed' });
    window.location.reload();
  };

  const handleAddWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(walkInForm.amount);
    const fee = walkInForm.method === 'online' ? (amount * 0.05) + 150 : 0;
    const payout = amount - fee;

    const newBooking = {
      id: Date.now(),
      venueName: walkInForm.court,
      date: walkInForm.date,
      timeSlot: walkInForm.time,
      totalAmount: amount.toString(),
      platformFee: fee.toString(),
      ownerPayout: payout.toString(),
      status: 'confirmed',
      paymentMethod: walkInForm.method
    };

    setBookingsList([newBooking, ...bookingsList]);
    setIsWalkInOpen(false);
    alert("Walk-in added to schedule successfully!");
  };

  const totalRev = bookingsList.reduce((acc, b) => acc + (b.status === 'confirmed' || b.status === 'completed' ? Number(b.ownerPayout || b.totalAmount) : 0), 0);
  const pendingCount = bookingsList.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}>
          <div className="w-9 h-9 bg-[#CCFF00] rounded-xl flex items-center justify-center text-black font-bold text-xl">CK</div>
          <span className="font-bold text-xl tracking-tight">Court<span className="text-[#CCFF00]">Karao</span> Owner</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setLocation("/owner/settings")} className="border-white/[0.1] text-zinc-300">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
          <Button variant="outline" onClick={() => { localStorage.clear(); setLocation("/login"); }} className="border-white/[0.1] text-zinc-300">
            <LogOut className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[#111314] border-white/[0.06] p-5">
            <span className="text-xs text-zinc-400 block">Total Owner Payout</span>
            <span className="text-2xl font-bold text-[#CCFF00] mt-1 block">Rs. {totalRev.toLocaleString()}</span>
          </Card>
          <Card className="bg-[#111314] border-white/[0.06] p-5">
            <span className="text-xs text-zinc-400 block">Court Occupancy Rate</span>
            <span className="text-2xl font-bold mt-1 block">78.4%</span>
          </Card>
          <Card className="bg-[#111314] border-white/[0.06] p-5">
            <span className="text-xs text-zinc-400 block">Total Bookings</span>
            <span className="text-2xl font-bold mt-1 block">{bookingsList.length}</span>
          </Card>
          <Card className="bg-[#111314] border-white/[0.06] p-5">
            <span className="text-xs text-zinc-400 block">Pending Verification</span>
            <span className="text-2xl font-bold text-yellow-400 mt-1 block">{pendingCount}</span>
          </Card>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Verification Queue & Bookings</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Verify player QR check-ins and track daily venue schedule</p>
          </div>
          <Button onClick={() => setIsWalkInOpen(true)} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
            <Plus className="w-4 h-4 mr-1" /> Add Manual Walk-in
          </Button>
        </div>

        {/* Bookings Table */}
        <Card className="bg-[#111314] border-white/[0.06] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-xs text-zinc-400 bg-white/[0.02]">
                    <th className="p-4">Venue / Court</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Payment & Method</th>
                    <th className="p-4">Platform Fee / Payout</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-sm">
                  {bookingsList.map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/[0.02]">
                      <td className="p-4 font-semibold">{b.venueName || "Sports Court"}</td>
                      <td className="p-4 text-zinc-300">
                        <div>{b.date}</div>
                        <div className="text-xs text-zinc-500">{b.timeSlot}</div>
                      </td>
                      <td className="p-4">
                        <div>Rs. {Number(b.totalAmount).toLocaleString()}</div>
                        <span className="text-[10px] bg-white/[0.05] px-2 py-0.5 rounded uppercase tracking-wider text-zinc-400">{b.paymentMethod}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-zinc-400">Fee: Rs. {Number(b.platformFee || 0)}</div>
                        <div className="text-xs font-semibold text-[#CCFF00]">Payout: Rs. {Number(b.ownerPayout || b.totalAmount)}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={b.status === "confirmed" ? "bg-[#CCFF00] text-black font-semibold" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}>
                          {b.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        {b.status === 'pending' ? (
                          <Button size="sm" onClick={() => handleVerify(b.id)} className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
                            Verify & Confirm
                          </Button>
                        ) : (
                          <span className="text-xs text-zinc-500 flex items-center justify-end gap-1"><CheckCircle className="w-3.5 h-3.5 text-[#CCFF00]" /> Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Walk-in Modal */}
      {isWalkInOpen && (
        <Dialog open={isWalkInOpen} onOpenChange={() => setIsWalkInOpen(false)}>
          <DialogContent className="bg-[#111314] border-white/[0.1] text-white">
            <DialogHeader>
              <DialogTitle>Add Manual Walk-in Booking</DialogTitle>
              <DialogDescription className="text-zinc-400">Record cash or walk-in slot directly into venue schedule.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddWalkIn} className="space-y-4 py-2">
              <div>
                <label className="text-xs font-medium text-zinc-400 mb-1 block">Court Name</label>
                <Input
                  value={walkInForm.court}
                  onChange={(e) => setWalkInForm({ ...walkInForm, court: e.target.value })}
                  className="bg-[#08090a] border-white/[0.08]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={walkInForm.date}
                    onChange={(e) => setWalkInForm({ ...walkInForm, date: e.target.value })}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1 block">Time Slot</label>
                  <Input
                    value={walkInForm.time}
                    onChange={(e) => setWalkInForm({ ...walkInForm, time: e.target.value })}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1 block">Total Amount (Rs.)</label>
                  <Input
                    value={walkInForm.amount}
                    onChange={(e) => setWalkInForm({ ...walkInForm, amount: e.target.value })}
                    className="bg-[#08090a] border-white/[0.08]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-1 block">Payment Method</label>
                  <select
                    value={walkInForm.method}
                    onChange={(e) => setWalkInForm({ ...walkInForm, method: e.target.value })}
                    className="w-full bg-[#08090a] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white outline-none"
                  >
                    <option value="cash">Cash (0 fee)</option>
                    <option value="online">Online (5% + Rs.150 fee)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsWalkInOpen(false)} className="border-white/[0.1]">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#CCFF00] text-black font-semibold hover:bg-[#b3e600]">
                  Add Walk-in
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
