import { GoogleGenerativeAI } from "@google/generative-ai";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
// import { predictDiseases } from "@/li/gemini"; // adjust path if needed
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // put key in .env
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function predictDiseases(values: { ph: number; turbidity: number; tds: number; temp: number; cond: number; }) {
  const prompt = `
  Based on these water sensor readings:
  - pH: ${values.ph}
  - Turbidity: ${values.turbidity} NTU
  - TDS: ${values.tds} ppm
  - Temperature: ${values.temp} °C
  - Conductivity: ${values.cond} µS/cm

  Give the result in EXACTLY this format:
  Sensor Data: [write values in one line]

  Possible Diseases:
  - [Disease 1]: [one line effect]
  - [Disease 2]: [one line effect]
  - [Disease 3]: [one line effect]

  Keep it short and do not add extra notes or disclaimers.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}


const Predict = () => {
  const [ph, setPh] = useState(7.0);
  const [turbidity, setTurbidity] = useState(2.5);
  const [tds, setTds] = useState(300);
  const [temp, setTemp] = useState(26);
  const [cond, setCond] = useState(500);
  const [diseases, setDiseases] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Analyzing with AI...", description: "Fetching disease predictions..." });

    try {
      const result = await predictDiseases({ ph, turbidity, tds, temp, cond });
      setDiseases(result);
      toast({ title: "Prediction complete", description: "Diseases predicted successfully" });
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch prediction" });
    }
  };

  const title = "Predict Waterborne Disease Risk | WaterGuard";
  const description = "Enter IoT water sensor values to estimate possible diseases using Gemini AI.";
  const canonical = typeof window !== "undefined" ? window.location.origin + "/predict" : "";

  return (
    <main className="container py-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <section className="grid gap-8 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Sensor Readings</CardTitle>
            <CardDescription>Use latest IoT values from your device</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="ph">pH</Label>
                <Input id="ph" type="number" step="0.01" value={ph} onChange={(e) => setPh(parseFloat(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="turbidity">Turbidity (NTU)</Label>
                <Input id="turbidity" type="number" step="0.1" value={turbidity} onChange={(e) => setTurbidity(parseFloat(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tds">TDS (ppm)</Label>
                <Input id="tds" type="number" step="1" value={tds} onChange={(e) => setTds(parseFloat(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="temp">Temperature (°C)</Label>
                <Input id="temp" type="number" step="0.1" value={temp} onChange={(e) => setTemp(parseFloat(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cond">Conductivity (µS/cm)</Label>
                <Input id="cond" type="number" step="1" value={cond} onChange={(e) => setCond(parseFloat(e.target.value))} />
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="hero">Predict</Button>
                <Button type="button" variant="outline" onClick={() => { setPh(7); setTurbidity(2.5); setTds(300); setTemp(26); setCond(500); setDiseases(""); }}>Reset</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>AI Disease Prediction</CardTitle>
            <CardDescription>Using Gemini Model</CardDescription>
          </CardHeader>
          <CardContent>
            {diseases ? (
              <div className="whitespace-pre-line text-muted-foreground">{diseases}</div>
            ) : (
              <p className="text-muted-foreground">No prediction yet. Enter sensor readings and click Predict.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Predict;
