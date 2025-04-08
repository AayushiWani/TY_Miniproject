import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import ToolsPage from "./ToolsPage";
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <div>
      <Navbar />
      <div className="">
        <ToolsPage />
      </div>
      <Footer />
    </div>
  );
};

export default Tools;
