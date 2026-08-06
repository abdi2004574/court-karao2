
import React from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, ArrowLeft, LogOut, TrendingUp, CreditCard, Receipt, Wallet } from "lucide-react";
import { useLocation } from "wouter";

export default function OwnerWallet() {
  const [, setLocation] = useLocation();
  const summaryQuery = trpc.monetization.summary.useQuery();
  const bookingsQuery = trpc.bookings.myBookings.useQuery();

  const summary = summaryQuery.data || {
    totalRevenue: 0,
    platformCommission: 0,
    ownerEarnings: 0,
    totalBookings: 0,
  };

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col">
      <header className="border-b border-white/[0.06] bg-[#111314]/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/owner/dashboard")} className="text-zinc-400 hover:text-white -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Button>
        </div>
        <span className="font-bold text-lg">Financial Ledger & Wallet</span>
        <Button variant="outline" onClick={() => { localStorage.clear(); setLocation("/login"); }} className="border-white/[0.1] text-zinc-300 hover:text-white">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Earnings Overview</h1>
          <p className="text-xs text-zinc-400 mt-1">Transparent breakdown of your venue revenue and platform fees.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111314] border-white/[0.06] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp className="w-12 h-12 text-[#CCFF00]" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Gross Revenue</CardDescription>
              <CardTitle className="text-3xl font-bold tracking-tighter">Rs. {summary.totalRevenue.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                <span className="text-[#CCFF00]">+{summary.totalBookings}</span> bookings this period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111314] border-white/[0.06] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-12 h-12 text-amber-500" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Platform Fees (5% + 150)</CardDescription>
              <CardTitle className="text-3xl font-bold tracking-tighter text-amber-500">- Rs. {summary.platformCommission.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[10px] text-zinc-500">Automatically deducted from online bookings</div>
            </CardContent>
          </Card>

          <Card className="bg-[#111314] border-[#CCFF00]/20 relative overflow-hidden group shadow-[0_0_20px_rgba(204,255,0,0.05)]">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wallet className="w-12 h-12 text-[#CCFF00]" />
            </div>
            <CardHeader className="pb-2">
              <CardDescription className="text-[#CCFF00] text-xs font-medium uppercase tracking-wider">Net Payout (Ready)</CardDescription>
              <CardTitle className="text-3xl font-bold tracking-tighter text-[#CCFF00]">Rs. {summary.ownerEarnings.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[10px] text-[#CCFF00]/60">Settled to your Easypaisa/JazzCash account</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="bg-[#111314] border-white/[0.06]">
          <CardHeader className="border-b border-white/[0.06]">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#CCFF00]" /> Transaction Ledger
            </CardTitle>
            <CardDescription className="text-zinc-400">Detailed list of recent bookings and their financial breakdown</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Date & Slot</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Gross</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Net Payout</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {bookingsQuery.data?.map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{b.date}</div>
                        <div className="text-[10px] text-zinc-500">{b.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.paymentMethod === 'online' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-500/10 text-zinc-400'
                        }`}>
                          {b.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">Rs. {Number(b.totalAmount).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-amber-500">- Rs. {Number(b.platformFee).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#CCFF00] text-right">Rs. {Number(b.ownerPayout).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(!bookingsQuery.data || bookingsQuery.data.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-sm italic">
                        No transactions found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
