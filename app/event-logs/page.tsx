'use client';

import { useState, useEffect } from 'react';

interface EventLog {
  id: number;
  event_type: string;
  description: string;
  created_at: string;
}

export default function EventLogsPage() {
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);

  useEffect(() => {
    const fetchEventLogs = async () => {
      const res = await fetch('/api/event-logs');
      if (res.ok) {
        const data = await res.json();
        setEventLogs(data);
      }
    };

    fetchEventLogs();
  }, []);

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-4xl font-bold mt-10">Event Logs</h1>

      <div className="overflow-y-auto max-h-[600px] mt-10">
        <table className="w-full border ">
        <thead className="sticky top-0.5 bg-blue-500 ">
            
            <tr>
                <th>Event Type</th>
                <th>Description</th>
                <th>Timestamp</th>
            </tr>
            </thead>

          <tbody>
            {eventLogs.map((log) => (
              <tr key={log.id}>
                <td className="border p-2">{log.event_type}</td>
                <td className="border p-2">{log.description}</td>
                <td className="border p-2">{log.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
