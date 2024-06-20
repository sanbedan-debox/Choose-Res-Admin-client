// import Navbar from "./NavBar";
// import Sidebar from "./navigation/sidebar";

// const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   return (
//     <div className="flex h-screen overflow-hidden">
//       <Sidebar />
//       <div className="flex-1 flex flex-col bg-black navbar">
//         <Navbar />
//         <div className="flex-1 overflow-y-auto p-6 mt-16 children scrollbar-hide">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import Navbar from "./NavBar";
import Sidebar from "./navigation/sidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-black">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 mt-16 children scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
