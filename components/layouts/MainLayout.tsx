import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-neutral-300">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 mt-16 children scrollbar-hide ">
          {children}
          <div />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
