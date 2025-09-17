import { Helmet } from "react-helmet-async";
import Hero from "@/components/site/Hero";
import { Droplets, Thermometer, Activity, ShieldCheck } from "lucide-react";

const Index = () => {
  const title = "Waterborne Disease Prediction with IoT | WaterGuard";
  const description = "Monitor water quality in real-time and predict waterborne disease risk using IoT sensors and analytics.";
  const canonical = typeof window !== "undefined" ? window.location.origin + "/" : "";

  const faqsLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "WaterGuard",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    description,
  };

  const features = [
    { icon: Droplets, title: "Multi-sensor IoT", desc: "pH, turbidity, TDS, temperature, conductivity" },
    { icon: Thermometer, title: "Real-time Streaming", desc: "Live plots and trend insights" },
    { icon: Activity, title: "Risk Scoring", desc: "Heuristic predictions out-of-the-box" },
    { icon: ShieldCheck, title: "Alerts & Actions", desc: "Proactive decisions to prevent outbreaks" },
  ];

  return (
    <main>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(faqsLd)}</script>
      </Helmet>

      <Hero />

      <section id="features" className="container py-16 md:py-20">
        <h2 className="mb-10 text-center text-3xl font-bold">Why WaterGuard</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-transform hover:-translate-y-0.5">
              <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden />
              <h3 className="mb-1 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
