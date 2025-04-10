
import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-calm-lavender/30 via-white to-calm-blue/30">
      <NavBar />
      <main className="flex-grow pt-24 pb-16 container mx-auto px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
