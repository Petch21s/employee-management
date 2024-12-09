"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button 
          className={`bg-transparent transition duration-300 ease-in-out rounded-lg 
            'bg-white/20' : ''}`}
        >
          <Link 
            href='/' 
            className="text-white text-2xl font-bold px-4 py-2 block"
          >
            Employee Management
          </Link>
        </button>

        <div className="flex space-x-4">
          <button 
            className={`bg-transparent hover:bg-white/20 transition duration-300 ease-in-out rounded-lg 
              ${isActive('/department') ? 'bg-white/20' : ''}`}
          >
            <Link 
              href='/department' 
              className="text-white px-4 py-2 block"
            >
              Department
            </Link>
          </button>
          <button 
            className={`bg-transparent hover:bg-white/20 transition duration-300 ease-in-out rounded-lg 
              ${isActive('/add_employees') ? 'bg-white/20' : ''}`}
          >
            <Link 
              href='/add_employees' 
              className="text-white px-4 py-2 block"
            >
              Employees
            </Link>
          </button>
          <button 
            className={`bg-transparent hover:bg-white/20 transition duration-300 ease-in-out rounded-lg 
              ${isActive('/search') ? 'bg-white/20' : ''}`}
          >
            <Link 
              href='/search' 
              className="text-white px-4 py-2 block"
            >
              Search
            </Link>
          </button>
          <button 
            className={`bg-transparent hover:bg-white/20 transition duration-300 ease-in-out rounded-lg 
              ${isActive('/event-logs') ? 'bg-white/20' : ''}`}
          >
            <Link 
              href='/event-logs' 
              className="text-white px-4 py-2 block"
            >
              Events
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
}