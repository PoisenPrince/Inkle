import Layout from './components/Layout';
import RequestsTable from './features/customers/RequestsTable';

function App() {
  return (
    <Layout
      title="Customers"
      subtitle="Match the Figma design by wiring @tanstack/react-table with UI polish."
    >
      <RequestsTable />
    </Layout>
  );
}

export default App;
