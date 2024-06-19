import Navbar from "./NavBar";
import Sidebar from "./navigation/sidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-black ">
        <Navbar />
        <div className="flex p-6 bg-black">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
