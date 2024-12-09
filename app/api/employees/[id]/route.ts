import { NextResponse } from 'next/server';
import db from '../../../../lib/db';  // อย่าลืมปรับ path ให้ถูกต้อง

// สำหรับดึงข้อมูลพนักงาน
export async function GET({ params }: { params: { id: string } }) {
  const { id } = await params;  // ต้อง await params ก่อนใช้งาน

  return new Promise<NextResponse>((resolve) => {
    db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Failed to fetch employee:', err);
        resolve(NextResponse.json({ error: 'Failed to fetch employee', details: err.message }, { status: 500 }));
      } else if (!row) {
        resolve(NextResponse.json({ error: 'Employee not found' }, { status: 404 }));
      } else {
        resolve(NextResponse.json(row));
      }
    });
  });
}

// สำหรับอัปเดตข้อมูลพนักงาน
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;  // ต้อง await params ก่อนใช้งาน
  const { name, position, salary, email, phone, dateHired, status, departmentId } = await request.json();

  return new Promise<NextResponse>((resolve) => {
    db.run(
      'UPDATE employees SET name = ?, position = ?, salary = ?, email = ?, phone = ?, dateHired = ?, status = ?, departmentId = ? WHERE id = ?',
      [name, position, salary, email, phone, dateHired, status, departmentId, id],
      function (err) {
        if (err) {
          console.error('Failed to update employee:', err);
          resolve(NextResponse.json({ error: 'Failed to update employee', details: err.message }, { status: 500 }));
        } else if (this.changes === 0) {
          resolve(NextResponse.json({ error: 'Employee not found' }, { status: 404 }));
        } else {
          resolve(NextResponse.json({ message: 'Employee updated successfully' }));
        }
      }
    );
  });
}

// สำหรับลบพนักงาน
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;  // ต้อง await params ก่อนใช้งาน

  return new Promise<NextResponse>((resolve) => {
    db.run('DELETE FROM employees WHERE id = ?', [id], function (err) {
      if (err) {
        console.error('Failed to delete employee:', err);
        resolve(NextResponse.json({ error: 'Failed to delete employee', details: err.message }, { status: 500 }));
      } else if (this.changes === 0) {
        resolve(NextResponse.json({ error: 'Employee not found' }, { status: 404 }));
      } else {
        resolve(NextResponse.json({ message: 'Employee deleted successfully' }));
      }
    });
  });
}
