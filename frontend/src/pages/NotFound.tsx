import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const title = "Page Not Found | WaterGuard";
  const description = "The page you are looking for does not exist.";
  const canonical = typeof window !== "undefined" ? window.location.origin + location.pathname : "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="underline text-primary hover:opacity-90">
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
