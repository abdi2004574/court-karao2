import React from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CalendarCheck, LogOut, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery();
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!user && user.role === 'admin'
  });
  const { data: pendingVenues, isLoading: venuesLoading } = trpc.admin.getPendingVenues.useQuery(undefined, {
    enabled: !!user && user.role === 'admin'
  });

  React.useEffect(() => {
    if (!userLoading && (!user || user.role !== 'admin')) {
      setLocation("/login");
    }
  }, [user, userLoading, setLocation]);

  if (userLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading admin panel...</div>
      </div>
    );
  }

  const approveMutation = trpc.admin.approveVenue.useMutation({
    onSuccess: () => {
      utils.admin.getPendingVenues.invalidate();
    },
  });

  const rejectMutation = trpc.admin.rejectVenue.useMutation({
    onSuccess: () => {
      utils.admin.getPendingVenues.invalidate();
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setLocation("/login");
    },
  });

  const handleApprove = (venueId: number) => {
    if (confirm("Are you sure you want to approve this venue?")) {
      approveMutation.mutate({ venueId });
    }
  };

  const handleReject = (venueId: number) => {
    if (confirm("Are you sure you want to reject and delete this venue?")) {
      rejectMutation.mutate({ venueId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              CK
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              CourtKarao <span className="text-gray-500 font-medium">Admin</span>
            </span>
          </div>
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-10">
        {/* Section 1: Stats */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <Users className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsLoading ? "..." : stats?.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Venues</CardTitle>
                <Building2 className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsLoading ? "..." : stats?.totalVenues}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                <CalendarCheck className="w-5 h-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{statsLoading ? "..." : stats?.totalBookings}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Pending Approvals */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Venue Approval Queue
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Venue Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Area</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sport</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {venuesLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Loading pending venues...
                      </td>
                    </tr>
                  ) : !pendingVenues || pendingVenues.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No pending venues.
                      </td>
                    </tr>
                  ) : (
                    pendingVenues.map((venue) => (
                      <tr key={venue.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{venue.name}</td>
                        <td className="px-6 py-4 text-gray-600">{venue.area}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {venue.sportType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{venue.ownerName || "Unknown"}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(venue.id)}
                            disabled={approveMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white border-none h-8 px-3"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(venue.id)}
                            disabled={rejectMutation.isPending}
                            className="bg-red-500 hover:bg-red-600 text-white border-none h-8 px-3"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Reject
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
