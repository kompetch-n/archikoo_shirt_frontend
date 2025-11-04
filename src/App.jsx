import { Routes, Route, Link } from 'react-router-dom'
import RegisterForm from './RegisterForm'
import OrderList from './OrderList'
import TrackingSearch from './TrackingSearch'
import SizeSummary from './SizeSummary'

function AdminNav() {
  return (
    <nav className="bg-pink-600 text-white p-4 flex space-x-4">
      <Link to="/admin/register" className="hover:underline">ลงทะเบียนสั่งซื้อ</Link>
      <Link to="/admin/orders" className="hover:underline">รายการคำสั่งซื้อ</Link>
      <Link to="/admin/sizesummary" className="hover:underline">สรุปการสั่งซื้อ</Link>
    </nav>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <Routes>
          {/* 🏠 ลูกค้าค้นหา Tracking */}
          <Route path="/" element={<TrackingSearch />} />

          {/* 🔐 ส่วนของแอดมิน */}
          <Route
            path="/admin/*"
            element={
              <div>
                <AdminNav />
                <div className="mt-6">
                  <Routes>
                    <Route path="register" element={<RegisterForm />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="sizesummary" element={<SizeSummary />} />
                    {/* <Route path="*" element={<p>ไม่พบหน้าในส่วน admin</p>} /> */}
                    <Route path="*" element={<OrderList />} />
                  </Routes>
                </div>
              </div>
            }
          />

          {/* ❌ หน้าที่ไม่พบ */}
          <Route path="*" element={<p className="text-center mt-10">หน้าไม่พบ</p>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
