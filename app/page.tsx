import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-6 mt-[300px]">
      <h1 className="text-4xl font-bold text-center mb-6">Homepage</h1>

      <div className="space-x-4">
        <button className="bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-200">
        <Link 
              href='department' 
              className="text-white"
            >
              Department
            </Link>
        </button>
        <button className="bg-green-500 text-white p-3 rounded-md shadow-lg hover:bg-green-600 transition duration-200">
        <Link 
              href='add_employees' 
              className="text-white"
            >
              Employees
            </Link>
        </button>
      </div>
    </div>
  );
}
