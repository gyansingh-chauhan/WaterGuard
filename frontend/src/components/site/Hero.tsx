import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-waterborn.jpg";

const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="spotlight bg-hero-gradient"
    >
      <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Waterborne Disease Prediction with IoT
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Real-time water quality monitoring powered by IoT sensors and
            intelligent risk modeling to protect communities before outbreaks
            happen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" className="animate-float">
              <Link to="/predict">Predict Risk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">View Live Dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroImg}
            alt="IoT-enabled water quality network visual with sensors for pH, turbidity, TDS, conductivity"
            loading="eager"
            className="w-full rounded-lg border shadow-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
