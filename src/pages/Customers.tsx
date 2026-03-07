import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Hotel, LogOut, LayoutDashboard, Calendar, User, Settings, Bell,
  Search, Plus, Pencil, Trash2, X, Check, Phone, Mail, MapPin,
  ChevronUp, ChevronDown, Users
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

const initialCustomers: Customer[] = [
  { id: 1, name: 'สมชาย ใจดี', email: 'somchai@email.com', phone: '081-234-5678', address: 'กรุงเทพมหานคร', totalBookings: 8, totalSpent: 52000, status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'วิไล มีสุข', email: 'wilai@email.com', phone: '089-876-5432', address: 'เชียงใหม่', totalBookings: 3, totalSpent: 18500, status: 'active', joinDate: '2024-03-22' },
  { id: 3, name: 'ประทีป แก้วใส', email: 'prateep@email.com', phone: '062-111-2233', address: 'ภูเก็ต', totalBookings: 12, totalSpent: 98000, status: 'active', joinDate: '2023-11-05' },
  { id: 4, name: 'นภา ฟ้าใส', email: 'napa@email.com', phone: '095-555-7788', address: 'ขอนแก่น', totalBookings: 1, totalSpent: 4500, status: 'inactive', joinDate: '2024-06-01' },
  { id: 5, name: 'ธนา รุ่งเรือง', email: 'thana@email.com', phone: '080-909-1122', address: 'หาดใหญ่', totalBookings: 5, totalSpent: 31000, status: 'active', joinDate: '2024-02-10' },
  { id: 6, name: 'ลดา งามเนตร', email: 'lada@email.com', phone: '076-333-4455', address: 'พัทยา', totalBookings: 7, totalSpent: 47500, status: 'active', joinDate: '2023-09-17' },
  { id: 7, name: 'อรรถ สว่างใจ', email: 'arth@email.com', phone: '093-012-3344', address: 'กาญจนบุรี', totalBookings: 2, totalSpent: 9200, status: 'inactive', joinDate: '2024-07-30' },
];

const emptyForm: Omit<Customer, 'id' | 'totalBookings' | 'totalSpent' | 'joinDate'> = {
  name: '', email: '', phone: '', address: '', status: 'active',
};

type SortKey = 'name' | 'totalBookings' | 'totalSpent' | 'joinDate';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('joinDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = customers
    .filter(c => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    })
    .filter(c => statusFilter === 'all' || c.status === statusFilter)
    .sort((a, b) => {
      let va: string | number = a[sortKey];
      let vb: string | number = b[sortKey];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (c: Customer) => {
    setEditingId(c.id);
    setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, status: c.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      showToast('กรุณากรอกชื่อและอีเมล', 'error');
      return;
    }
    if (editingId !== null) {
      setCustomers(prev => prev.map(c => c.id === editingId ? { ...c, ...form } : c));
      showToast('แก้ไขข้อมูลลูกค้าสำเร็จ');
    } else {
      const newCustomer: Customer = {
        id: Date.now(),
        ...form,
        totalBookings: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setCustomers(prev => [newCustomer, ...prev]);
      showToast('เพิ่มลูกค้าใหม่สำเร็จ');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    setDeleteConfirmId(null);
    showToast('ลบข้อมูลลูกค้าแล้ว');
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? (sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)
      : <ChevronDown size={14} style={{ opacity: 0.3 }} />;

  const totalActive = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
  const totalBookings = customers.reduce((s, c) => s + c.totalBookings, 0);

  return (
    <div className="app-container">
      {/* Toast */}
      {toast && (
        <div className={`cust-toast ${toast.type}`}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Navbar */}
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
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-item" onClick={() => navigate('/menu')}>
            <LayoutDashboard size={20} /><span>ภาพรวมที่พัก</span>
          </div>
          <div className="sidebar-item">
            <Calendar size={20} /><span>จัดการปฏิทิน</span>
          </div>
          <div className="sidebar-item active">
            <User size={20} /><span>ข้อมูลลูกค้า</span>
          </div>
          <div className="sidebar-item">
            <Settings size={20} /><span>ตั้งค่าระบบ</span>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <div className="sidebar-item" onClick={() => navigate('/login')} style={{ color: 'var(--error-color)' }} id="logout-button">
              <LogOut size={20} /><span>ออกจากระบบ</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main-content">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="title">ข้อมูลลูกค้า</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>จัดการข้อมูลลูกค้าทั้งหมดในระบบ</p>
            </div>
            <button className="btn-primary" id="add-customer-btn" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={openAdd}>
              <Plus size={18} /> เพิ่มลูกค้าใหม่
            </button>
          </div>

          {/* Stat Cards */}
          <div className="cust-stats">
            <div className="cust-stat-card">
              <div className="cust-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-color)' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="cust-stat-val">{customers.length}</div>
                <div className="cust-stat-label">ลูกค้าทั้งหมด</div>
              </div>
            </div>
            <div className="cust-stat-card">
              <div className="cust-stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                <Check size={22} />
              </div>
              <div>
                <div className="cust-stat-val">{totalActive}</div>
                <div className="cust-stat-label">ลูกค้าใช้งานอยู่</div>
              </div>
            </div>
            <div className="cust-stat-card">
              <div className="cust-stat-icon" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div className="cust-stat-val">{totalBookings}</div>
                <div className="cust-stat-label">การจองทั้งหมด</div>
              </div>
            </div>
            <div className="cust-stat-card">
              <div className="cust-stat-icon" style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>
                <Hotel size={22} />
              </div>
              <div>
                <div className="cust-stat-val">฿{totalRevenue.toLocaleString()}</div>
                <div className="cust-stat-label">รายได้รวม</div>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="cust-toolbar">
            <div className="cust-search-box">
              <Search size={16} className="cust-search-icon" />
              <input
                id="customer-search"
                className="cust-search-input"
                placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="cust-clear-btn" onClick={() => setSearch('')}>
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="cust-filter-tabs">
              {(['all', 'active', 'inactive'] as const).map(s => (
                <button
                  key={s}
                  className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'all' ? 'ทั้งหมด' : s === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="cust-table-wrapper">
            <table className="cust-table" id="customer-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable">
                    ลูกค้า <SortIcon col="name" />
                  </th>
                  <th>ติดต่อ</th>
                  <th onClick={() => handleSort('totalBookings')} className="sortable">
                    การจอง <SortIcon col="totalBookings" />
                  </th>
                  <th onClick={() => handleSort('totalSpent')} className="sortable">
                    ยอดรวม <SortIcon col="totalSpent" />
                  </th>
                  <th onClick={() => handleSort('joinDate')} className="sortable">
                    วันที่สมัคร <SortIcon col="joinDate" />
                  </th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="cust-empty">
                      <Users size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                      <div>ไม่พบข้อมูลลูกค้า</div>
                    </td>
                  </tr>
                ) : filtered.map(c => (
                  <tr key={c.id} className="cust-row" data-testid={`customer-row-${c.id}`}>
                    <td>
                      <div className="cust-name-cell">
                        <div className="cust-avatar">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="cust-name">{c.name}</div>
                          <div className="cust-address"><MapPin size={11} /> {c.address}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cust-contact">
                        <div><Mail size={13} /> {c.email}</div>
                        <div><Phone size={13} /> {c.phone}</div>
                      </div>
                    </td>
                    <td className="cust-center">{c.totalBookings} ครั้ง</td>
                    <td className="cust-price">฿{c.totalSpent.toLocaleString()}</td>
                    <td className="cust-center" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.joinDate}</td>
                    <td className="cust-center">
                      <span className={`cust-badge ${c.status}`}>
                        {c.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </span>
                    </td>
                    <td>
                      <div className="cust-actions">
                        <button
                          className="cust-action-btn edit"
                          onClick={() => openEdit(c)}
                          title="แก้ไข"
                          data-testid={`edit-btn-${c.id}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="cust-action-btn delete"
                          onClick={() => setDeleteConfirmId(c.id)}
                          title="ลบ"
                          data-testid={`delete-btn-${c.id}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            แสดง {filtered.length} จาก {customers.length} รายการ
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="cust-overlay" onClick={() => setShowModal(false)}>
          <div className="cust-modal" onClick={e => e.stopPropagation()} id="customer-modal">
            <div className="cust-modal-header">
              <h2>{editingId ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}</h2>
              <button className="cust-close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="cust-modal-body">
              <div className="cust-form-grid">
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล *</label>
                  <input
                    id="field-name"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="กรอกชื่อ-นามสกุล"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">อีเมล *</label>
                  <input
                    id="field-email"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="กรอกอีเมล"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">เบอร์โทร</label>
                  <input
                    id="field-phone"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="กรอกเบอร์โทร"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ที่อยู่</label>
                  <input
                    id="field-address"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="กรอกที่อยู่"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">สถานะ</label>
                <div className="cust-status-toggle">
                  <button
                    id="status-active"
                    className={`cust-toggle-btn ${form.status === 'active' ? 'on' : ''}`}
                    onClick={() => setForm({ ...form, status: 'active' })}
                  >
                    <Check size={14} /> ใช้งาน
                  </button>
                  <button
                    id="status-inactive"
                    className={`cust-toggle-btn ${form.status === 'inactive' ? 'on' : ''}`}
                    onClick={() => setForm({ ...form, status: 'inactive' })}
                  >
                    <X size={14} /> ไม่ใช้งาน
                  </button>
                </div>
              </div>
            </div>
            <div className="cust-modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>ยกเลิก</button>
              <button className="btn-primary" id="save-customer-btn" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={handleSave}>
                <Check size={16} /> {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มลูกค้า'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId !== null && (
        <div className="cust-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="cust-confirm-box" onClick={e => e.stopPropagation()} id="delete-confirm-modal">
            <div className="cust-confirm-icon">
              <Trash2 size={32} color="#ef4444" />
            </div>
            <h3>ยืนยันการลบ</h3>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลลูกค้ารายนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            <div className="cust-modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteConfirmId(null)}>ยกเลิก</button>
              <button
                className="btn-primary"
                id="confirm-delete-btn"
                style={{ width: 'auto', padding: '0.75rem 2rem', background: 'var(--error-color)' }}
                onClick={() => handleDelete(deleteConfirmId!)}
              >
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
