import { useRef } from 'react';
import { HiOutlinePlus, HiOutlineRefresh } from 'react-icons/hi';
import Layout from './components/Layout';
import Button from './components/ui/Button';
import RequestsTable, { RequestsTableHandle } from './features/customers/RequestsTable';

function App() {
  const tableRef = useRef<RequestsTableHandle>(null);

import Layout from './components/Layout';
import RequestsTable from './features/customers/RequestsTable';

function App() {
  return (
    <Layout
      title="Customers"
      subtitle="Match the Figma design by wiring @tanstack/react-table with UI polish."
      actions={
        <div className="header-actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => tableRef.current?.refresh()}
          >
            <HiOutlineRefresh size={18} />
            <span className="btn-text">Refresh</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => tableRef.current?.openNewCustomer()}
          >
            <HiOutlinePlus size={18} />
            <span className="btn-text">New customer</span>
          </Button>
        </div>
      }
    >
      <RequestsTable ref={tableRef} />
    >
      <RequestsTable />
    </Layout>
  );
}

export default App;
