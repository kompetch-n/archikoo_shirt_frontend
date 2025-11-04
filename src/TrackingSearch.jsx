import { useState } from "react";

export default function TrackingSearch() {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setResults([]);
    setMessage("");
    setLoading(true);

    if (!name.trim()) {
      setMessage("กรุณากรอกชื่อ");
      setLoading(false);
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
      if (data.length === 0) setMessage("ไม่พบข้อมูลที่ตรงกับชื่อที่กรอก");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6 text-center">
        ค้นหาเลข Tracking Number
      </h1>

      {/* 🔍 ช่องค้นหา */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          placeholder="กรอกชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
        >
          {loading ? "กำลังค้นหา..." : "ค้นหา"}
        </button>
      </form>

      {/* 🧠 ข้อความแจ้งเตือน */}
      {message && (
        <p className="text-center text-red-600 mb-4 font-medium">{message}</p>
      )}

      {/* 🧾 แสดงผลลัพธ์แบบการ์ด */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl shadow-sm p-5 bg-gradient-to-br from-pink-50 to-white hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                👤 {order.fullName}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-700">Order ID:</span>{" "}
                {order.orderId || "-"}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-medium text-gray-700">สถานะ:</span>{" "}
                {order.status || "-"}
              </p>
              <div className="bg-pink-100 text-pink-700 font-semibold rounded-md px-3 py-2 text-center">
                📦 Tracking: {order.tracking_number || "ยังไม่มีเลขพัสดุ"}
              </div>

              {order.items && order.items.length > 0 && (
                <div className="mt-3 text-sm text-gray-700">
                  <p className="font-medium mb-1">รายการเสื้อ:</p>
                  <ul className="list-disc list-inside">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.size} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
