import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme, Button, FloatButton } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import CustomerViewPage from './pages/CustomerViewPage';
import BulkUploadPage from './pages/BulkUploadPage';

import 'antd/dist/reset.css';
import './index.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff', // Professional Blue
          borderRadius: 8,
          fontFamily: 'Outfit, sans-serif',
        },
        components: {
          Card: {
            colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
          },
          Table: {
            colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
          }
        }
      }}
    >
      <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`} style={{ minHeight: '100vh', transition: 'all 0.3s' }}>
        <Router>
          <Routes>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/create" element={<CustomerFormPage />} />
            <Route path="/edit/:id" element={<CustomerFormPage />} />
            <Route path="/view/:id" element={<CustomerViewPage />} />
            <Route path="/bulk" element={<BulkUploadPage />} />
          </Routes>
        </Router>
        
        <FloatButton
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          type="primary"
          onClick={toggleTheme}
          style={{ right: 24, bottom: 24 }}
          tooltip={<div>Switch to {isDarkMode ? 'Light' : 'Dark'} Mode</div>}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
