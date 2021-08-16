import Header from "@/components/layout/Header";
import React from "react";

const Main: React.FC = ({ children }) => {
  return (
    <div>
      <Header />
      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Main;
