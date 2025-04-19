import React from "react";
import Header from "./header";
import Link from "next/link";
import Footer from "./footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={'flex-col w-full'}>
        <Header/>
        <div className=" grow w-full h-full mx-auto items-center justify-center flex  max-w-4xl z-10">
          {children}
        </div>
        <Footer/>
      </div>
    </>
  );
}
export default Layout;
