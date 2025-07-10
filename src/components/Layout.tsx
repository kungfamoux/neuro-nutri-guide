import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      {children || <Outlet />}
    </main>
    <footer className="bg-background border-t py-4">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} NeuroNutri Guide. All rights reserved.</p>
      </div>
    </footer>
  </div>
);

export default Layout;
