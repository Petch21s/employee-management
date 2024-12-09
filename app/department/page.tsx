'use client';

import { useEffect, useState } from 'react';

interface Department {
  id: number;
  name: string;
  description: string;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // กำหนดจำนวนแถวในแต่ละหน้า

  // ดึงข้อมูลแผนกทั้งหมด
  useEffect(() => {
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDepartments(data);
        } else {
          console.error('Data is not an array:', data); // เพิ่มการตรวจสอบ
        }
      })
      .catch((error) => {
        console.error('Error fetching departments:', error); // การจัดการข้อผิดพลาด
      });
  }, []);

  // ฟังก์ชันเพิ่มแผนกใหม่
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/departments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      const newDepartment = await response.json();
      setDepartments((prev) => [...prev, newDepartment]);
      setName('');
      setDescription('');
      alert('Department added successfully!'); // แจ้งเตือนเมื่อเพิ่มแผนกสำเร็จ
    } else {
      console.error('Failed to add department');
    }
  };

  // ฟังก์ชันแก้ไขแผนก
  const handleEditDepartment = async (id: number) => {
    const department = departments.find((dept) => dept.id === id);
    if (department) {
      setName(department.name);
      setDescription(department.description);
      setEditingId(id);
    }
  };

  // ฟังก์ชันบันทึกการแก้ไข
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/departments', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: editingId, name, description }),
    });

    if (response.ok) {
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingId ? { ...dept, name, description } : dept
        )
      );
      setName('');
      setDescription('');
      setEditingId(null);
      alert('Department updated successfully!'); // แจ้งเตือนเมื่ออัพเดตแผนกสำเร็จ
    } else {
      console.error('Failed to update department');
    }
  };

  // ฟังก์ชันลบแผนก
  const handleDeleteDepartment = async (id: number) => {
    const response = await fetch('/api/departments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setDepartments(departments.filter((department) => department.id !== id));
      alert('Department deleted successfully!'); // แจ้งเตือนเมื่อลบแผนกสำเร็จ
    } else {
      console.error('Failed to delete department');
    }
  };

  // คำนวณข้อมูลที่จะใช้ในแต่ละหน้า
  const indexOfLastDepartment = currentPage * itemsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstDepartment, indexOfLastDepartment);

  // เปลี่ยนหน้าของ Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Department Management</h1>

      {/* Form สำหรับเพิ่มแผนกใหม่ */}
      <form onSubmit={editingId ? handleSaveEdit : handleAddDepartment} className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department Name"
          className="p-2 border mb-2 w-full text-black rounded-t-md"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Department Description"
          className="p-2 border mb-2 w-full text-black rounded-b-md"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md mt-[20px]">
          {editingId ? 'Save Changes' : 'Add Department'}
        </button>
      </form>

      {/* แสดงข้อมูลแผนก */}
      <table className="w-full border">
        <thead className="sticky top-0 bg-blue-500">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(currentDepartments) &&
            currentDepartments.map((department) => (
              <tr key={department.id}>
                <td className="border p-2">{department.id}</td>
                <td className="border p-2">{department.name}</td>
                <td className="border p-2">{department.description}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditDepartment(department.id)}
                    className="bg-yellow-500 w-[70px] rounded-md text-white p-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteDepartment(department.id)}
                    className="bg-red-500 text-center w-[70px] rounded-md text-white p-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2 text-black">
        {Array.from({ length: Math.ceil(departments.length / itemsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
