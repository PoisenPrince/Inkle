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
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="app-header-actions">{actions}</div>}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default Layout;
