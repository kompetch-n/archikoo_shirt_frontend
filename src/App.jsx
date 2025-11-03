import { Routes, Route, Link } from 'react-router-dom'
import RegisterForm from './RegisterForm'
import OrderList from './OrderList'
import TrackingSearch from './TrackingSearch'
import SizeSummary from './SizeSummary'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-pink-600 text-white p-4 flex space-x-4">
        <Link to="/register" className="hover:underline">ลงทะเบียนสั่งซื้อ</Link>
        <Link to="/orders" className="hover:underline">รายการคำสั่งซื้อ</Link>
        <Link to="/tracking" className="hover:underline">ตรวจสอบ Tracking</Link>
        <Link to="/sizesummary" className="hover:underline">สรุปการสั่งซื้อ</Link>
      </nav>

      <div className="p-8">
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/tracking" element={<TrackingSearch />} />
          <Route path="/sizesummary" element={<SizeSummary />} />
          <Route path="*" element={<p>หน้าไม่พบ</p>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
