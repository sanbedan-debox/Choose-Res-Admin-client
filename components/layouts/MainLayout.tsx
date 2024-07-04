import { useEffect } from "react";
import Navbar from "../navbar/navbar";
import Sidebar from "../navigation/sidebar";
import oneStore from "@/store/test";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUserId } = oneStore();
  useEffect(() => {
    console.log("Hello");
    setUserId("Jehe");
  }, [setUserId]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 h-auto overflow-y-auto p-6 mt-16 children scrollbar-hide ">
          {children}
          <div />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
