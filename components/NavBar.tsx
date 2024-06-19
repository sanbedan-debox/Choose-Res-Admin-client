import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          <Link href="/dashboard">
            <div className="hover:bg-gray-700 px-3 py-2 rounded">Dashboard</div>
          </Link>
          <Link href="/restaurant">
            <div className="hover:bg-gray-700 px-3 py-2 rounded">
              Restaurants
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
