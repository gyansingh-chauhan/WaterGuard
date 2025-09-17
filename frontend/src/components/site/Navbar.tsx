import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const links = [
    { to: "/", label: "Home" },
    { to: "/data", label: "Reading-data" },
    { to: "/live-data", label: "Live-Prediction  " },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="WaterGuard Home">
          <span className="inline-block h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-base font-semibold">WaterGuard</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              aria-current={location.pathname === l.to ? "page" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/dashboard">Live Dashboard</Link>
          </Button>
          <Button asChild variant="hero">
            <Link to="/predict">Try Predictor</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
