import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import BusinessProfile from './pages/BusinessProfile';
import TemplateUploader from './pages/TemplateUploader';
import CatalogueGenerator from './pages/CatalogueGenerator';
import Preview from './pages/Preview';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<TemplateUploader />} />
            <Route path="generator" element={<CatalogueGenerator />} />
            <Route path="preview" element={<Preview />} />
            <Route path="profile" element={<BusinessProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App;
