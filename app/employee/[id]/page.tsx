'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // ใช้ useParams จาก next/navigation

interface Department {
  id: number;
  name: string;
}

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
}

export default function EmployeeDetail() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const params = useParams();
  const id = params?.id as string | null; // ใช้การแปลงค่าเป็น string หากมี id

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return; // ตรวจสอบว่า id มีค่า
      const res = await fetch(`/api/employees/${id}`);
      const data = await res.json();
      setEmployee(data);
      if (data.departmentId) {
        const departmentRes = await fetch(`/api/departments/${data.departmentId}`);
        const departmentData = await departmentRes.json();
        setDepartment(departmentData);
      }
    };

    fetchEmployee();
  }, [id]); // useEffect จะทำงานเมื่อ id เปลี่ยนแปลง

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Position:</strong> {employee.position}</p>
      <p><strong>Salary:</strong> {employee.salary}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Phone:</strong> {employee.phone}</p>
      <p><strong>Date Hired:</strong> {employee.dateHired}</p>
      <p><strong>Status:</strong> {employee.status}</p>
      <p><strong>Department:</strong> {department ? department.name : 'N/A'}</p>
    </div>
  );
}
