// import React from "react";

// import StaticLayout from "@/components/layouts/StaticPageLayout";
// import Image from "next/image";

// type NextPageWithLayout = React.FC & {
//   getLayout?: (page: React.ReactNode) => React.ReactNode;
// };

// const Error: NextPageWithLayout = () => {
//   return (
//     <div className=" items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
//       <div className=" w-full xl:w-1/2 relative pb-12 lg:pb-0">
//         <div className="relative">
//           <div className="absolute">
//             <div className="">
//               <h1 className="my-2 text-gray-800 font-bold text-2xl">
//                 {`Looks like you've found the doorway to the great nothing`}
//               </h1>
//               <p className="my-2 text-gray-800">
//                 Sorry about that! Please visit our Dashboard to get where you
//                 need to go.
//               </p>
//               <button className="btn btn-primary mt-2">Visit Dashboard</button>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <Image alt="" src="https://i.ibb.co/ck1SGFJ/Group.png" />
//       </div>
//     </div>
//   );
// };

// Error.getLayout = function getLayout(page: React.ReactNode) {
//   return <StaticLayout>{page}</StaticLayout>;
// };

// export default Error;

import React from "react";

import StaticLayout from "@/components/layouts/StaticPageLayout";

type NextPageWithLayout = React.FC & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

const Error: NextPageWithLayout = () => {
  return (
    <div className="w-full  flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <p className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider text-primary mt-8">
          404
        </p>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-600 mt-2">
          Lost Your Way
        </p>
        <p className="md:text-lg xl:text-xl text-gray-500 mt-4">
          {`Looks like you've found the doorway to the great nothing`}
        </p>
      </div>
    </div>
  );
};

Error.getLayout = function getLayout(page: React.ReactNode) {
  return <StaticLayout>{page}</StaticLayout>;
};

export default Error;
