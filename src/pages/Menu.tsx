import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Hotel, Bed, Coffee, Wifi, Star, MapPin, User, Settings, LayoutDashboard, Calendar, Bell } from 'lucide-react';

const mockProperties = [
  {
    id: 1,
    title: 'Ocean View Villa',
    location: 'Phuket, Thailand',
    price: 4500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'วิลล่าทิวทัศน์ทะเล',
  },
  {
    id: 2,
    title: 'Mountain Retreat Cabin',
    location: 'Chiang Mai, Thailand',
    price: 2800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'บ้านพักตากอากาศ',
  },
  {
    id: 3,
    title: 'City Center Suite',
    location: 'Bangkok, Thailand',
    price: 3200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'ห้องสวีทส่วนตัว',
  },
  {
    id: 4,
    title: 'Sunrise Beach House',
    location: 'Koh Samui, Thailand',
    price: 5500,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'บ้านริมชายหาด',
  },
  {
    id: 5,
    title: 'Jungle Resort Room',
    location: 'Krabi, Thailand',
    price: 2100,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'ห้องพักรีสอร์ท',
  },
  {
    id: 6,
    title: 'Riverside Glamping',
    location: 'Kanchanaburi, Thailand',
    price: 1800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'แกลมปิ้งพักแรม',
  }
];

const filters = ['ทั้งหมด', 'วิลล่า', 'รีสอร์ท', 'บ้านพัก', 'แกลมปิ้ง'];

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('ทั้งหมด');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Hotel size={28} />
          <span>Vela Resort</span>
        </div>
        <div className="user-profile">
          <button className="btn-secondary" style={{ padding: '0.4rem', border: 'none' }}>
            <Bell size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="white" />
            </div>
            <div>
              <div className="user-name">คุณแอดมิน</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ผู้จัดการที่พัก</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-item active">
            <LayoutDashboard size={20} />
            <span>ภาพรวมที่พัก</span>
          </div>
          <div className="sidebar-item">
            <Calendar size={20} />
            <span>จัดการปฏิทิน</span>
          </div>
          <div className="sidebar-item">
            <User size={20} />
            <span>ข้อมูลลูกค้า</span>
          </div>
          <div className="sidebar-item">
            <Settings size={20} />
            <span>ตั้งค่าระบบ</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div className="sidebar-item" onClick={handleLogout} style={{ color: 'var(--error-color)' }} id="logout-button">
              <LogOut size={20} />
              <span>ออกจากระบบ</span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1 className="title">รายการที่พักปัจจุบัน</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>จัดการและดูสถานะที่พักของคุณทั้งหมดในที่เดียว</p>
            </div>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
              + เพิ่มที่พักใหม่
            </button>
          </div>

          <div className="filter-bar">
            {filters.map(filter => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="property-grid" id="property-list">
            {mockProperties.map((property) => (
              <div key={property.id} className="property-card" data-testid={`property-${property.id}`}>
                <div className="img-container">
                  <div className="badge">
                    <Star size={14} fill="gold" color="gold" />
                    <span>{property.rating}</span>
                  </div>
                  <img src={property.image} alt={property.title} className="property-image" />
                </div>
                
                <div className="property-content">
                  <h3 className="p-title">{property.title}</h3>
                  <div className="p-location">
                    <MapPin size={14} />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="p-features">
                    <div className="feature"><Bed size={16} /> 2 เตียง</div>
                    <div className="feature"><Wifi size={16} /> ฟรี Wifi</div>
                    <div className="feature"><Coffee size={16} /> อาหารเช้า</div>
                  </div>
                  
                  <div className="p-footer">
                    <div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block' }}>ราคาต่อคืน</span>
                      <div className="p-price">฿{property.price.toLocaleString()}</div>
                    </div>
                    <button className="btn-secondary">จัดการ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Menu;
