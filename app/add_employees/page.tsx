"use client"
import { useEffect, useState } from 'react';

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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState<number>(0);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateHired, setDateHired] = useState('');
  const [status, setStatus] = useState('Active');
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  // Fetch departments
  useEffect(() => {
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => setDepartments(data))
      .catch((error) => console.error("Failed to fetch departments:", error));
  }, []);

  // Fetch employees
  useEffect(() => {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Failed to fetch employees:", error));
  }, []);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!name) errors.push('Name is required');
    if (!position) errors.push('Position is required');
    if (salary <= 0) errors.push('Salary must be greater than 0');
    if (!email) errors.push('Email is required');
    if (!phone) errors.push('Phone is required');
    if (!dateHired) errors.push('Date Hired is required');
    if (!status) errors.push('Status is required');
    if (!departmentId) errors.push('Department is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Invalid email format');
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      errors.push('Phone number must be 10 digits');
    }

    setErrorMessages(errors);
    return errors.length === 0;
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        position,
        salary,
        email,
        phone,
        dateHired,
        status,
        departmentId: departmentId || null,
      }),
    });

    if (response.ok) {
      const newEmployee = await response.json();
      setEmployees((prev) => [...prev, newEmployee]);

      alert("Employee added successfully!");  
      await fetch('/api/event-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'ADD_EMPLOYEE',
          description: `Added new employee: ${newEmployee.name}, Position: ${newEmployee.position}`,
        }),
      });
      resetForm();
    } else {
      const errorData = await response.json();
      console.error('Failed to add employee:', errorData.error);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    if (!editingEmployee) return;
  
    const response = await fetch(`/api/employees/${editingEmployee.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: editingEmployee.id,
        name,
        position,
        salary,
        email,
        phone,
        dateHired,
        status,
        departmentId: departmentId || null,
      }),
    });
  
    if (response.ok) {
      const updatedEmployee = await response.json();
  
      // Fetch the updated list of employees after the update
      const employeesResponse = await fetch('/api/employees');
      const updatedEmployees = await employeesResponse.json();
  
      // Update the state with the new list of employees
      setEmployees(updatedEmployees);
  
      await fetch('/api/event-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'UPDATE_EMPLOYEE',
          description: `Updated employee: ${updatedEmployee.name}, Position: ${updatedEmployee.position}`,
        }),
      });
  
      resetForm();
      alert("Employee updated successfully!");
    } else {
      const errorData = await response.json();
      console.error('Failed to update employee:', errorData.error);
      alert("Failed to update employee.");
    }
  };


  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setPosition(employee.position);
    setSalary(employee.salary);
    setEmail(employee.email);
    setPhone(employee.phone);
    setDateHired(employee.dateHired);
    setStatus(employee.status);
    setDepartmentId(employee.departmentId);
  };

  const handleDeleteEmployee = async (id: number) => {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setEmployees((prev) => prev.filter((employee) => employee.id !== id));
      await fetch('/api/event-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'DELETE_EMPLOYEE',
          description: `Deleted employee with ID: ${id}`,
        }),
      });
      alert("Employee deleted successfully!");  
    } else {
      console.error('Failed to delete employee');
    }
  };

  const resetForm = () => {
    setName('');
    setPosition('');
    setSalary(0);
    setEmail('');
    setPhone('');
    setDateHired('');
    setStatus('Active');
    setDepartmentId(null);
    setEditingEmployee(null);
    setErrorMessages([]);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee} className="grid grid-cols-2 gap-3 w-[500px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-2 border mb-2 w-full text-black rounded-md"
        />
        <input
          type="text"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          placeholder="Position"
          className="p-2 border mb-2 w-full text-black rounded-md"
        />
        <input
          type="number"
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          placeholder="Salary"
          className="p-2 border mb-2 w-full text-black rounded-md"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border mb-2 w-full text-black rounded-md"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          className="p-2 border mb-2 w-full text-black rounded-md"
        />
        <input
          type="date"
          value={dateHired}
          onChange={(e) => setDateHired(e.target.value)}
          placeholder="Date Hired"
          className="p-2 border mb-2 w-full text-black rounded-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border mb-2 w-full text-black rounded-md"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>
        <select
          value={departmentId || ''}
          onChange={(e) => setDepartmentId(Number(e.target.value))}
          className="p-2 border mb-2 w-full text-black rounded-md"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md w-[500px]">
          {editingEmployee ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>

      {/* แสดงข้อความข้อผิดพลาด */}
      {errorMessages.length > 0 && (
        <div className="text-red-500 mt-4">
          <ul>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* แสดงตารางพนักงาน */}
      <h2 className="text-xl mt-6">Employee List</h2>
      <div className="overflow-y-auto max-h-[277px] mt-5">
        <table className="w-full border table-auto">
          <thead className="sticky top-0 bg-blue-500">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Salary</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Date Hired</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.id}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.position}</td>
                <td className="border p-2">{employee.salary}</td>
                <td className="border p-2">{employee.email}</td>
                <td className="border p-2">{employee.phone}</td>
                <td className="border p-2">{employee.dateHired}</td>
                <td
                  className={`border-2 p-2 text-center ${
                    employee.status === 'Active'
                      ? 'border-green-500 text-green-500 rounded-full w-[100px] mx-auto'
                      : employee.status === 'Inactive'
                      ? 'border-orange-500 text-orange-500 rounded-full w-[100px] mx-auto'
                      : employee.status === 'On Leave'
                      ? 'border-red-500 text-red-500 rounded-full w-[100px] mx-auto'
                      : ''
                  }`}
>
                    {employee.status}
                  </td>
                <td className="border p-2">
                  {departments.find((dept) => dept.id === employee.departmentId)?.name || 'N/A'}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditEmployee(employee)}
                    className="bg-yellow-500 text-center w-[70px] rounded-md text-white p-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="bg-red-500 text-center w-[70px] rounded-md text-white p-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
