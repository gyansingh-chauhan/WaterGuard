/* import React, { useEffect, useState } from "react";

type SensorReading = {
  temperature: number;
  time: string;
};

const SensorDataList: React.FC = () => {
  const [data, setData] = useState<SensorReading[]>([]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData(); // first fetch
    const interval = setInterval(fetchData, 3000); // auto-refresh every 3 sec
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sensor Readings</h1>

      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          data.map((reading, index) => (
            <div
              key={index}
              className="grid grid-cols-2 gap-4 p-4 border rounded-xl shadow-md w-fit"
            >
              <div className="font-semibold text-gray-700">Temperature</div>
              <div className="text-gray-900">{reading.temperature} °C</div>

              <div className="font-semibold text-gray-700">Time</div>
              <div className="text-gray-900">{reading.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SensorDataList;
 */

import React, { useEffect, useState } from "react";

interface SensorData {
  tds: number;
  temperature: number;
  timestamp: string;
}

const SensorDataList: React.FC = () => {
  const [data, setData] = useState<SensorData[]>([]);

  const fetchSensorData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/sensor");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error("Error fetching sensor data:", err);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 font-sans">
  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Sensor Data</h2>
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
      <thead className="bg-green-500 text-white">
        <tr>
          <th className="py-3 px-6 text-center">TDS</th>
          <th className="py-3 px-6 text-center">Temperature (°C)</th>
          <th className="py-3 px-6 text-center">Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            className={`text-center ${
              index % 2 === 0 ? "bg-gray-100" : "bg-white"
            } hover:bg-gray-200 transition-colors`}
          >
            <td className="py-3 px-6">{item.tds}</td>
            <td className="py-3 px-6">{item.temperature}</td>
            <td className="py-3 px-6">{new Date(item.timestamp).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default SensorDataList;


