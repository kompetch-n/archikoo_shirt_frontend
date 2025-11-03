import { useState, useEffect } from "react";

export default function SizeSummary() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://archikoo-shirt-backend.vercel.app/summary-sizes");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const totalQuantity = Object.values(summary).reduce((acc, qty) => acc + qty, 0);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        สรุปจำนวนเสื้อแต่ละ Size
      </h1>

      <table className="w-full table-auto border-collapse text-center">
        <thead>
          <tr className="bg-pink-100 text-gray-700">
            <th className="border px-4 py-2">Size</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([size, qty]) => (
            <tr key={size} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{size}</td>
              <td className="border px-4 py-2">{qty}</td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td className="border px-4 py-2">รวมทั้งหมด</td>
            <td className="border px-4 py-2">{totalQuantity}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
