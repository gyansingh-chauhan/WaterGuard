import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container py-8 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div>© {new Date().getFullYear()} WaterGuard. All rights reserved.</div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <Link to="/predict" className="hover:text-foreground transition-colors">Predict</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
