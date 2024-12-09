// app/api/event-logs/route.ts

import { NextResponse } from 'next/server';
import db from '../../../lib/db'; // เชื่อมต่อกับฐานข้อมูล

interface EventLog {
  eventType: string;
  description: string;
}


export async function GET() {
    try {
      const eventLogs = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM event_logs ORDER BY created_at DESC', (err, rows) => {
          if (err) {
            reject('Failed to fetch event logs');
          } else {
            resolve(rows);
          }
        });
      });
  
      return NextResponse.json(eventLogs); // คืนค่าเป็น JSON response
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  


export async function POST(request: Request) {
  try {
    const body: EventLog = await request.json(); // รับข้อมูลจาก body
    const { eventType, description } = body;

    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!eventType || !description) {
      return NextResponse.json({ error: 'Missing eventType or description' }, { status: 400 });
    }

    // บันทึกข้อมูลลงในฐานข้อมูล
    db.run(
      'INSERT INTO event_logs (event_type, description) VALUES (?, ?)',
      [eventType, description],
      function (err) {
        if (err) {
          return NextResponse.json({ error: 'Failed to insert event log' }, { status: 500 });
        }

        // ส่งข้อมูลที่บันทึกไปกลับเป็นผลลัพธ์
        return NextResponse.json({
          id: this.lastID,
          eventType,
          description,
          createdAt: new Date().toISOString(),
        });
      }
    );

    // หากไม่เข้าเงื่อนไขใด ๆ ก็จะส่งคำตอบที่บอกว่าไม่มีการดำเนินการอะไร
    return NextResponse.json({ message: 'Event log handled successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
