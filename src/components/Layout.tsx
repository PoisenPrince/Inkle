import { ReactNode } from 'react';

interface LayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const Layout = ({ title, subtitle, actions, children }: LayoutProps) => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-titles">
          <p className="eyebrow">Dashboard</p>

          {/* Bigger, bolder main title */}
          <h1 className="page-title">{title}</h1>

          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="app-header-actions">{actions}</div>}
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
  
};

export default Layout;
