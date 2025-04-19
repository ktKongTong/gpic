import React from "react";
import Header from "@/app/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={'flex-col w-full'}>
        <Header/>
        <div className=" grow w-full h-full mx-auto  max-w-4xl z-10">
          {children}
        </div>
      </div>
    </>
  );
}
export default Layout;
