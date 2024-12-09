import { NextResponse } from 'next/server';
import db from '../../../lib/db';

interface Department {
  id: number;
  name: string;
  description: string;
}

// ดึงข้อมูลแผนกทั้งหมด
export async function GET() {
  return new Promise<NextResponse>((resolve) => {
    db.all('SELECT * FROM departments', (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        resolve(NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows)); // ค่าตอบกลับต้องเป็นอาร์เรย์
      }
    });
  });
}


// เพิ่มข้อมูลแผนกใหม่
export async function POST(request: Request) {
  const { name, description } = await request.json();

  return new Promise<NextResponse>((resolve) => {
    db.run(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description],
      function (err) {
        if (err) {
          resolve(NextResponse.json({ error: 'Failed to add department' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ id: this.lastID, name, description }, { status: 201 }));
        }
      }
    );
  });
}

// ลบแผนก
export async function DELETE(request: Request) {
  const { id } = await request.json();

  return new Promise<NextResponse>((resolve) => {
    db.run('DELETE FROM departments WHERE id = ?', [id], function (err) {
      if (err) {
        resolve(NextResponse.json({ error: 'Failed to delete department' }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ message: 'Department deleted successfully' }));
      }
    });
  });
}

// แก้ไขข้อมูลแผนก
export async function PUT(request: Request) {
  const { id, name, description } = await request.json();

  return new Promise<NextResponse>((resolve) => {
    db.run(
      'UPDATE departments SET name = ?, description = ? WHERE id = ?',
      [name, description, id],
      function (err) {
        if (err) {
          resolve(NextResponse.json({ error: 'Failed to update department' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ message: 'Department updated successfully' }));
        }
      }
    );
  });
}
