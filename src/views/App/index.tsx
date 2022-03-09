import { Result } from 'antd';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from 'views/Dashboard';
import Header from 'views/Header';
import { MarketPlace } from 'views/Marketplace';
import ReportGenerator from 'views/ReportGenerator';

import { AccountContextProvider } from '../../contexts/accountContext';

function App() {
  return (
    <div className="App">
      <AccountContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Dashboard />} />
              <Route path="generate-report" element={<ReportGenerator />} />
              <Route path="marketplace" element={<MarketPlace />} />
            </Route>
            <Route
              path="*"
              element={
                <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </AccountContextProvider>
    </div>
  );
}

export default App;
