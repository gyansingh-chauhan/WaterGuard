import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini setup
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to compute water risk
function computeRisk(values: {
  ph: number;
  turbidity: number;
  tds: number;
  temp: number;
  cond: number;
}) {
  let score = 0;
  if (values.turbidity > 5) score += 2;
  if (values.turbidity > 8) score += 2;
  if (values.tds > 500) score += 1;
  if (values.tds > 1000) score += 1;
  if (values.ph < 6.5 || values.ph > 8.5) score += 2;
  if (values.temp > 30) score += 1;
  if (values.cond > 800) score += 1;

  const level =
    score >= 6 ? "Critical" : score >= 4 ? "High" : score >= 2 ? "Moderate" : "Low";
  return { score, level };
}

interface SensorData {
  ph: number;
  turbidity: number;
  tds: number;
  temp: number;
  cond: number;
}

const Predict = () => {
  const defaultData: SensorData = {
    ph: 7.0,
    turbidity: 2.5,
    tds: 300,
    temp: 26,
    cond: 500,
  };

  const [currentData, setCurrentData] = useState<SensorData>(defaultData);
  const [diseases, setDiseases] = useState<string>("");

  const result = useMemo(
    () => computeRisk(currentData),
    [currentData]
  );

  // Call Gemini with live sensor data
  const predictDiseases = async (values: SensorData) => {
    const prompt = `
    Based on these water sensor readings:
    pH ${values.ph}, Turbidity ${values.turbidity} NTU, 
    TDS ${values.tds} ppm, Temp ${values.temp} °C, 
    Conductivity ${values.cond} µS/cm.

    Return exactly in this format:
    Sensor Data: [all values in one line]
    Possible Diseases:
    - Disease 1: one line effect
    - Disease 2: one line effect
    - Disease 3: one line effect
    `;
    const res = await model.generateContent(prompt);
    return res.response.text();
  };

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/sensor"); // replace with your API
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const latest = data[data.length - 1];
          const newData: SensorData = {
            ph: latest.ph ?? currentData.ph,
            turbidity: latest.turbidity ?? currentData.turbidity,
            tds: latest.tds ?? currentData.tds,
            temp: latest.temperature ?? currentData.temp,
            cond: latest.cond ?? currentData.cond,
          };

          setCurrentData(newData);

          // Trigger AI disease prediction
          const aiResult = await predictDiseases(newData);
          setDiseases(aiResult);

          toast({
            title: "New Sensor Data",
            description: `Temp: ${newData.temp} °C, TDS: ${newData.tds}, Risk: ${computeRisk(newData).level}`,
          });
        }
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);

    return () => clearInterval(interval);
  }, []);

  const title = "Live Water Sensor Data | WaterGuard";
  const description = "Live IoT water sensor readings with AI-predicted diseases.";
  const canonical =
    typeof window !== "undefined" ? window.location.origin + "/predict" : "";

  return (
    <main className="container py-10">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <section className="grid gap-8 md:grid-cols-2">
        {/* Sensor Data Card */}
        <Card>
          <CardHeader>
            <CardTitle>Live Sensor Data</CardTitle>
            <CardDescription>Updated automatically from IoT device</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2"><Label>pH</Label><div className="rounded-md border bg-gray-100 px-3 py-2">{currentData.ph}</div></div>
            <div className="grid gap-2"><Label>Turbidity (NTU)</Label><div className="rounded-md border bg-gray-100 px-3 py-2">{currentData.turbidity}</div></div>
            <div className="grid gap-2"><Label>TDS (ppm)</Label><div className="rounded-md border bg-gray-200 px-3 py-2 font-semibold">{currentData.tds}</div></div>
            <div className="grid gap-2"><Label>Temperature (°C)</Label><div className="rounded-md border bg-gray-200 px-3 py-2 font-semibold">{currentData.temp}</div></div>
            <div className="grid gap-2"><Label>Conductivity (µS/cm)</Label><div className="rounded-md border bg-gray-100 px-3 py-2">{currentData.cond}</div></div>
          </CardContent>
        </Card>

        {/* Risk + AI Prediction */}
        <Card>
          <CardHeader>
            <CardTitle>Risk & AI Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold">{result.level}</div>
              <p className="text-muted-foreground">
                Score: {result.score} (higher = greater risk)
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>pH outside 6.5–8.5 increases risk</li>
                <li>Turbidity above 5 NTU indicates contamination</li>
                <li>TDS above 500 ppm and high conductivity correlate with impurities</li>
                <li>Higher temperatures accelerate microbial growth</li>
              </ul>
              {diseases && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border text-sm whitespace-pre-line">
                  {diseases}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default Predict;
