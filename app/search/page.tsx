'use client';

import { useState, useEffect } from 'react';

interface Employee {
  id: number;
  name: string;
  position: string;
  salary: number;
  email: string;
  phone: string;
  dateHired: string;
  status: string;
  departmentId: number | null;
  departmentName: string;  // ชื่อแผนกที่ดึงมาจากการ JOIN
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await fetch(`/api/search?q=${searchQuery}`);
    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || 'Something went wrong');
      setEmployees([]);
    } else {
      const data = await res.json();
      setEmployees(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Employees</h1>

      {/* Form for search */}
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, Name, Position, Email, Department, or Status"
          className="p-2 border mb-2 w-full rounded-md text-black"
        />
        <button type="submit" className="bg-blue-500 w-[70px] rounded-md text-white p-2 mt-[]">Search</button>

        
      </form>

      {/* Display error or loading */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Employee List */}
      <h2 className="text-xl mb-2">Search Results</h2>
      <table className="w-full border">
        <thead className="sticky top-0 bg-blue-500">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.id}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.position}</td>
                <td className="border p-2">{employee.email}</td>
                <td className="border p-2">{employee.departmentName}</td>
                <td className="border p-2">{employee.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border p-2">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
