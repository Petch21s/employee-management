// lib/db.ts

import sqlite3 from 'sqlite3';

// สร้างการเชื่อมต่อฐานข้อมูลใหม่
const db = new sqlite3.Database('./employee.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database opened');
  }
});

// ตรวจสอบว่า `departmentId` คอลัมน์มีอยู่ในตาราง `employees` หรือยัง
db.get("PRAGMA table_info(employees);", (err, result) => {
  if (err) {
    console.error('Error checking table structure:', err);
    return;
  }

  // ตรวจสอบว่า result ไม่เป็น undefined และเป็น array
  if (!result || !Array.isArray(result)) {
    console.error('Invalid result from PRAGMA table_info');
    return;
  }

  // กำหนด type ให้กับ result เพื่อให้ TypeScript รู้ว่ามันเป็น array ของ object
  const columns = result as { name: string }[];

  // ตรวจสอบว่า column departmentId มีอยู่หรือไม่
  const hasDepartmentId = columns.some((column) => column.name === 'departmentId');

  if (!hasDepartmentId) {
    // ถ้าไม่มี `departmentId` ในตาราง employees ให้เพิ่มคอลัมน์นี้
    db.run('ALTER TABLE employees ADD COLUMN departmentId INTEGER', (err) => {
      if (err) {
        console.error('Error adding departmentId column:', err);
      } else {
        console.log('departmentId column added');
      }
    });
  } else {
    console.log('departmentId column already exists, no need to add.');
  }
});

// สร้างตาราง departments ถ้ายังไม่มี
db.run(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating departments table:', err);
  } else {
    console.log('Departments table ensured');
  }
});

// สร้างตาราง employees ถ้ายังไม่มี
db.run(`
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    position TEXT,
    salary INTEGER,
    email TEXT,
    phone TEXT,
    dateHired TEXT,
    status TEXT,
    departmentId INTEGER,
    FOREIGN KEY(departmentId) REFERENCES departments(id)
  )
`, (err) => {
  if (err) {
    console.error('Error creating employees table:', err);
  } else {
    console.log('Employees table ensured');
  }
});

// สร้างตาราง event_logs ถ้ายังไม่มี
db.run(`
  CREATE TABLE IF NOT EXISTS event_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,   -- เช่น 'ADD_EMPLOYEE', 'UPDATE_EMPLOYEE', 'DELETE_EMPLOYEE'
    description TEXT NOT NULL,  -- คำอธิบายเหตุการณ์
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP  -- เวลาในการบันทึกเหตุการณ์
  )
`, (err) => {
  if (err) {
    console.error('Error creating event_logs table:', err);
  } else {
    console.log('Event Logs table ensured');
  }
});

export default db;
