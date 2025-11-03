import { useState } from "react";

export default function TrackingSearch() {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setResults([]);
    setMessage("");

    if (!name) {
      setMessage("กรุณากรอกชื่อ");
      return;
    }

    try {
      const res = await fetch(
        `https://archikoo-shirt-backend.vercel.app/search-by-name?name=${encodeURIComponent(
          name
        )}`
      );
      if (!res.ok) throw new Error("ไม่พบชื่อที่ค้นหา");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        ค้นหาเลข Tracking Number
      </h1>

      <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="กรอกชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:outline-pink-500"
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-4 rounded-md hover:bg-pink-700"
        >
          ค้นหา
        </button>
      </form>

      {message && (
        <p className="text-center text-red-600 mb-4">{message}</p>
      )}

      {results.length > 0 && (
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr className="bg-pink-100 text-gray-700">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">ชื่อ</th>
              <th className="border px-4 py-2">Tracking Number</th>
              <th className="border px-4 py-2">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {results.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{order.orderId}</td>
                <td className="border px-4 py-2">{order.fullName}</td>
                <td className="border px-4 py-2">{order.tracking_number || "-"}</td>
                <td className="border px-4 py-2">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
