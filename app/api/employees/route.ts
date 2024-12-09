// app/api/employees/route.ts

import { NextResponse } from 'next/server';
import db from '../../../lib/db';

// สำหรับดึงข้อมูลพนักงาน
export async function GET() {
  return new Promise<NextResponse>((resolve) => {
    db.all('SELECT * FROM employees', (err, rows) => {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows));
      }
    });
  });
}

// เพิ่มข้อมูลพนักงานใหม่
export async function POST(request: Request) {
  const { name, position, salary, email, phone, dateHired, status, departmentId } = await request.json();

  return new Promise<NextResponse>((resolve) => {
    db.run(
      'INSERT INTO employees (name, position, salary, email, phone, dateHired, status, departmentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, position, salary, email, phone, dateHired, status, departmentId],
      function (err) {
        if (err) {
          console.error('Failed to add employee:', err);
          resolve(NextResponse.json({ error: 'Failed to add employee', details: err.message }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ id: this.lastID, name, position, salary, email, phone, dateHired, status, departmentId }, { status: 201 }));
        }
      }
    );
  });
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;  // ดึง `id` จาก params ที่ได้จาก Next.js

  console.log('Deleting employee with id:', id);  // เพิ่ม log เพื่อดีบัก

  if (!id) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
  }

  return new Promise<NextResponse>((resolve) => {
    db.get('SELECT id FROM employees WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error checking employee:', err);  // เพิ่ม log สำหรับกรณี error
        resolve(NextResponse.json({ error: 'Failed to check if employee exists', details: err.message }, { status: 500 }));
      } else if (!row) {
        console.log('Employee not found with id:', id);  // เพิ่ม log ถ้าไม่พบพนักงาน
        resolve(NextResponse.json({ error: 'Employee not found' }, { status: 404 }));
      } else {
        db.run('DELETE FROM employees WHERE id = ?', [id], function (err) {
          if (err) {
            console.error('Failed to delete employee:', err);  // เพิ่ม log สำหรับ error ขณะลบ
            resolve(NextResponse.json({ error: 'Failed to delete employee', details: err.message }, { status: 500 }));
          } else {
            console.log('Employee with id', id, 'deleted successfully');  // เพิ่ม log เมื่อลบสำเร็จ
            resolve(NextResponse.json({ message: 'Employee deleted successfully' }));
          }
        });
      }
    });
  });
}