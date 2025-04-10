import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import SearchPage from './components/SearchPage/SearchPage.js';
import ImportPage from './components/ImportPage/ImportPage.js';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/import" element={<ImportPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App; 