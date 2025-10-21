import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="wrap">
      <Header />
      <section>
        <Outlet />
      </section>
      <Footer />
    </div>
  );
}

export default Layout;
