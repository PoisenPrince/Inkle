import { useRef } from 'react';
import { HiOutlinePlus, HiOutlineRefresh } from 'react-icons/hi';
import Layout from './components/Layout';
import Button from './components/ui/Button';
import RequestsTable, { RequestsTableHandle } from './features/customers/RequestsTable';

function App() {
  const tableRef = useRef<RequestsTableHandle>(null);

  return (
    <Layout
      title="Customers"
      actions={
        <div className="header-actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => tableRef.current?.refresh()}
          >
            <HiOutlineRefresh size={12} />
            <span className="btn-text">Refresh</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => tableRef.current?.openNewCustomer()}
          >
            <HiOutlinePlus size={15} />
            <span className="btn-text">New customer</span>
          </Button>
        </div>
      }
    >
      <RequestsTable ref={tableRef} />
    </Layout>
  );
}

export default App;
