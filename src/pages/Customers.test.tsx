import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Customers from './Customers';

describe('Customers Component Unit Tests', () => {
  const renderCustomers = () => render(
    <BrowserRouter>
      <Customers />
    </BrowserRouter>
  );

  test('should render header and total stats correctly', () => {
    renderCustomers();
    
    // ตรวจสอบว่ามีหัวข้อข้อมูลลูกค้า
    expect(screen.getByText('ข้อมูลลูกค้า', { selector: 'h1' })).toBeInTheDocument();
    
    // ตรวจสอบว่ามีการแสดงยอด "ลูกค้าทั้งหมด" ถูกต้องเริ่มต้น
    expect(screen.getByText('ลูกค้าทั้งหมด')).toBeInTheDocument();
    
    // ตรวจสอบตารางเริ่มต้นว่ามีข้อมูลลูกค้าขึ้นมาครบไหม (จำลอง 7 คนบน Initial State)
    const rows = screen.getAllByTestId(/customer-row-/);
    expect(rows.length).toBe(7);
  });

  test('should filter customers by search input', () => {
    renderCustomers();
    
    // พิมพ์ชื่อค้นหาคำว่า "สมชาย"
    const searchInput = screen.getByPlaceholderText('ค้นหาชื่อ, อีเมล, เบอร์โทร...');
    fireEvent.change(searchInput, { target: { value: 'สมชาย' } });

    // จำนวนแถวในตารางต้องเหลือแค่ของ สมชาย (1 คน)
    const rows = screen.getAllByTestId(/customer-row-/);
    expect(rows.length).toBe(1);
    
    // ตรวจสอบว่าชื่อสมชายขึ้นมาในตาราง
    expect(screen.getByText('สมชาย ใจดี')).toBeInTheDocument();
  });

  test('should open add customer modal when clicking add button', () => {
    renderCustomers();
    
    // คลิกปุ่ม "เพิ่มลูกค้าใหม่"
    const addButton = screen.getByText(/เพิ่มลูกค้าใหม่/i);
    fireEvent.click(addButton);

    // เช็คว่า Modal แจ้งเตือนขึ้นหรือไม่
    expect(screen.getByText('เพิ่มลูกค้าใหม่', { selector: 'h2' })).toBeInTheDocument();
    
    // เช็คว่ามีช่องกรอกชื่อ
    const nameInput = screen.getByPlaceholderText('กรอกชื่อ-นามสกุล');
    expect(nameInput).toBeInTheDocument();
  });

  test('should filter by active status correctly', () => {
    renderCustomers();
    
    // คลิกปุ่มกรอง "ใช้งาน"
    const activeFilterBtn = screen.getByText('ใช้งาน', { selector: 'button.filter-btn' });
    fireEvent.click(activeFilterBtn);

    // ใน Initial State มีลูกค้า Active 5 คน
    const rows = screen.getAllByTestId(/customer-row-/);
    expect(rows.length).toBe(5);
  });
});
