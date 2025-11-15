import { useEffect, useState } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingInput, setTrackingInput] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ ควบคุม dropdown

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://archikoo-shirt-backend.vercel.app/all");
      const data = await res.json();
      setOrders(data);

      const allSizes = data.flatMap((order) =>
        order.items.map((i) => i.size)
      );
      const uniqueSizes = [...new Set(allSizes)];
      setAvailableSizes(uniqueSizes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openConfirmPopup = (order) => {
    if (!trackingInput[order.orderId]) return alert("กรุณากรอกเลขพัสดุ");
    setSelectedOrder(order);
    setShowConfirm(true);
  };

  const confirmUpdate = async () => {
    if (!selectedOrder) return;
    const orderId = selectedOrder.orderId;

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
      setShowConfirm(false);
      alert("✅ อัปเดตเลขพัสดุสำเร็จแล้ว!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSizes([]);
  };

  const filteredOrders = orders.filter((order) =>
    [
      order.fullName,
      order.phone,
      order.orderId,
      order.tracking_number || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center mt-10">กำลังโหลด...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        รายการคำสั่งซื้อทั้งหมด
      </h1>

      {/* 🔍 ช่องค้นหา + ตัวกรองไซส์ */}
      <div className="flex justify-between mb-4 items-start gap-3">
        <input
          type="text"
          placeholder="ค้นหาชื่อ, เบอร์โทร, Order ID หรือ Tracking"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-80 focus:ring-2 focus:ring-pink-400 outline-none"
        />

        <div className="relative">
          {/* ปุ่ม dropdown */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="border border-gray-300 rounded-lg p-2 w-48 bg-white flex justify-between items-center focus:ring-2 focus:ring-pink-400"
          >
            <span>
              {selectedSizes.length > 0
                ? `เลือกแล้ว (${selectedSizes.length})`
                : "เลือกไซส์เสื้อ"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transform transition-transform ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* รายการ dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="max-h-56 overflow-y-auto p-2">
                {availableSizes.map((size) => (
                  <label
                    key={size}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                      className="accent-pink-500"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ✅ ปุ่มล้างตัวกรอง */}
        <button
          onClick={handleClearFilters}
          className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
        >
          ล้างตัวกรอง
        </button>
      </div>

      {/* 📋 ตารางข้อมูล */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-pink-100 text-gray-700">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">ที่อยู่</th>
            <th className="border px-4 py-2">เบอร์โทร</th>
            <th className="border px-4 py-2">สถานะ</th>
            <th className="border px-4 py-2">Tracking Number</th>
            <th className="border px-4 py-2">รายการเสื้อ</th>
            <th className="border px-4 py-2">อัปเดตเลขพัสดุ</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders
            .filter((order) =>
              selectedSizes.length > 0
                ? order.items.some((i) => selectedSizes.includes(i.size))
                : true
            )
            .map((order) => (
              <tr key={order.id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{order.orderId}</td>
                <td className="border px-4 py-2">{order.fullName}</td>
                <td className="border px-4 py-2">{order.address}</td>
                <td className="border px-4 py-2">{order.phone}</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">
                  {order.tracking_number || "-"}
                </td>
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
                    onClick={() => openConfirmPopup(order)}
                    className="bg-pink-600 text-white px-2 py-1 rounded-md hover:bg-pink-700"
                  >
                    อัปเดต
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* 🟢 Popup ยืนยัน */}
      {showConfirm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
              ยืนยันการอัปเดตเลขพัสดุ
            </h2>
            <div className="text-gray-700 mb-4 space-y-1">
              <p><b>ชื่อ:</b> {selectedOrder.fullName}</p>
              <p><b>เบอร์โทร:</b> {selectedOrder.phone}</p>
              <p><b>Order ID:</b> {selectedOrder.orderId}</p>
              <p><b>รายการเสื้อ:</b></p>
              <ul className="list-disc list-inside text-sm">
                {selectedOrder.items.map((i, idx) => (
                  <li key={idx}>
                    {i.size} × {i.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-pink-600">
                <b>เลขพัสดุใหม่:</b> {trackingInput[selectedOrder.orderId]}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmUpdate}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                ยืนยันอัปเดต
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
