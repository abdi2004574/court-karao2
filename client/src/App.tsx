import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PlayerDashboard from "./pages/PlayerDashboard";
import PlayerWallet from "./pages/PlayerWallet";
import PlayerSettings from "./pages/PlayerSettings";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerSettings from "./pages/OwnerSettings";
import OwnerTournaments from "./pages/OwnerTournaments";
import OwnerWallet from "./pages/OwnerWallet";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import AdminDashboard from "./pages/admin/AdminDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/player/dashboard" component={PlayerDashboard} />
      <Route path="/player/wallet" component={PlayerWallet} />
      <Route path="/player/settings" component={PlayerSettings} />
      <Route path="/owner/dashboard" component={OwnerDashboard} />
      <Route path="/owner/settings" component={OwnerSettings} />
      <Route path="/owner/tournaments" component={OwnerTournaments} />
      <Route path="/owner/wallet" component={OwnerWallet} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-use" component={TermsOfUse} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
