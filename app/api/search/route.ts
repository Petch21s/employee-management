import { NextResponse } from 'next/server';
import db from '../../../lib/db'; // เชื่อมต่อฐานข้อมูลของคุณ

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('q') || ''; // ดึงค่า q จาก query string

  // กรณีไม่พบ query
  if (!searchQuery) {
    return NextResponse.json({ message: 'Please provide a search query.' }, { status: 400 });
  }

  const searchTerm =  searchQuery.trim();
  let queryParams = [
    searchTerm, 
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`
  ]

  






  const sqlQuery = `
    SELECT employees.id, employees.name, employees.position, employees.salary, employees.email, employees.phone, employees.dateHired, employees.status, employees.departmentId, departments.name AS departmentName
    FROM employees
    LEFT JOIN departments ON employees.departmentId = departments.id
    WHERE (employees.id = ?  OR ? = '')  -- ค้นหาตรงๆ สำหรับ ID
        OR employees.name LIKE ? 
        OR employees.position LIKE ? 
        OR employees.email LIKE ? 
        OR departments.name LIKE ? 
        OR employees.status LIKE ?
    `;

  try {
    const rows = await new Promise<any[]>((resolve, reject) => {
      db.all(sqlQuery, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
        if (err) {
          console.error('Error searching employees:', err);
          return reject(err);
        }
        resolve(rows);
      });
    });

    // ถ้าไม่พบข้อมูล
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No employees found' }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ message: 'Failed to search employees' }, { status: 500 });
  }
}
