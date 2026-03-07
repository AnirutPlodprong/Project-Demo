import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Hotel } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('กรุณากรอกข้อม');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Hardcoded check for demo
      if (email === 'admin@resort.com' && password === '123456') {
        navigate('/menu');
      } else {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    }, 1000);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <Hotel size={32} />
          <span>Vela Resort</span>
        </div>
        <h1 className="auth-title">ยินดีต้อนรับกลับ</h1>
        <p className="auth-subtitle">เข้าสู่ระบบเพื่อจัดการการจองที่พักของคุณ</p>

        <form onSubmit={handleLogin} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">อีเมล</label>
            <input
              id="email-input"
              type="text"
              className="form-input"
              placeholder="admin@resort.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail className="form-icon" size={20} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">รหัสผ่าน</label>
            <input
              id="password-input"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Lock className="form-icon" size={20} />
          </div>

          {error && <div className="error-message" id="error-message">{error}</div>}

          <button id="login-button" type="submit" className="btn-primary" style={{ marginTop: '2rem' }} disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : (
              <>
                เข้าสู่ระบบ <LogIn size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
