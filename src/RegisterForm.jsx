import { useState } from "react";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([{ size: "", quantity: 1 }]);
  const [message, setMessage] = useState("");

  const addItem = () => {
    setItems([...items, { size: "", quantity: 1 }]);
  };

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!fullName || !phone || !address) {
      setMessage("❌ กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (items.some((item) => !item.size || item.quantity <= 0)) {
      setMessage("❌ กรุณากรอกขนาดและจำนวนเสื้อให้ถูกต้อง");
      return;
    }

    const payload = {
      fullName,
      phone,
      address,
      items,
    };

    try {
      const res = await fetch("https://archikoo-shirt-backend.vercel.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("ส่งข้อมูลไม่สำเร็จ");
      const data = await res.json();
      setMessage(`✅ บันทึกสำเร็จ! Order ID: ${data.orderId}`);

      // ล้างฟอร์มหลังบันทึก
      setFullName("");
      setPhone("");
      setAddress("");
      setItems([{ size: "", quantity: 1 }]);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        ลงทะเบียนสั่งซื้อเสื้อ
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ข้อมูลลูกค้า */}
        <div>
          <label className="block text-gray-700 mb-2">ชื่อ-นามสกุล</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-pink-500"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="เช่น นายสมชาย ใจดี"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            className="w-full p-2 border rounded-md focus:outline-pink-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="เช่น 0812345678"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">ที่อยู่จัดส่ง</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-pink-500"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
            required
          ></textarea>
        </div>

        {/* รายการเสื้อ */}
        <div>
          <label className="block text-gray-700 mb-2">รายการเสื้อ</label>
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 mb-2 bg-gray-50 p-3 rounded-md border border-gray-100"
            >
              <input
                type="text"
                placeholder="เช่น M, L, XL, หรือ Custom เช่น 42"
                value={item.size}
                onChange={(e) => updateItem(index, "size", e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-pink-500"
                required
              />

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", parseInt(e.target.value))
                }
                className="w-24 p-2 border rounded-md text-center focus:outline-pink-500"
                required
              />

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
          >
            + เพิ่มรายการ
          </button>
        </div>

        {/* ปุ่มบันทึก */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
        >
          บันทึกคำสั่งซื้อ
        </button>
      </form>

      {/* แสดงผลลัพธ์ */}
      {message && (
        <p
          className={`mt-4 text-center text-lg font-medium ${
            message.startsWith("✅")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
