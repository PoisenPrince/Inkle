import { ReactNode } from 'react';
import Button from './ui/Button';

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const Layout = ({ title, subtitle, children }: LayoutProps) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        <Button variant="primary">New customer</Button>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
