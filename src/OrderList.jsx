import { useEffect, useState } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://archikoo-shirt-backend.vercel.app/all");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateTracking = async (orderId) => {
    if (!trackingInput[orderId]) return alert("กรุณากรอกเลขพัสดุ");

    try {
      const res = await fetch(
        `https://archikoo-shirt-backend.vercel.app/order/${orderId}/track`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tracking_number: trackingInput[orderId] }),
        }
      );
      if (!res.ok) throw new Error("อัปเดตไม่สำเร็จ");
      await fetchOrders();
      setTrackingInput({ ...trackingInput, [orderId]: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">กำลังโหลด...</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        รายการคำสั่งซื้อทั้งหมด
      </h1>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-pink-100 text-gray-700">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">เบอร์โทร</th>
            <th className="border px-4 py-2">สถานะ</th>
            <th className="border px-4 py-2">Tracking Number</th>
            <th className="border px-4 py-2">รายการเสื้อ</th>
            <th className="border px-4 py-2">อัปเดตเลขพัสดุ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center hover:bg-gray-50">
              <td className="border px-4 py-2">{order.orderId}</td>
              <td className="border px-4 py-2">{order.fullName}</td>
              <td className="border px-4 py-2">{order.phone}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{order.tracking_number || "-"}</td>
              <td className="border px-4 py-2">
                {order.items.map((i, idx) => (
                  <div key={idx}>
                    {i.size} × {i.quantity}
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  placeholder="กรอกเลขพัสดุ"
                  value={trackingInput[order.orderId] || ""}
                  onChange={(e) =>
                    setTrackingInput({
                      ...trackingInput,
                      [order.orderId]: e.target.value,
                    })
                  }
                  className="p-1 border rounded-md w-36 mr-2"
                />
                <button
                  onClick={() => updateTracking(order.orderId)}
                  className="bg-pink-600 text-white px-2 py-1 rounded-md hover:bg-pink-700"
                >
                  อัปเดต
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
