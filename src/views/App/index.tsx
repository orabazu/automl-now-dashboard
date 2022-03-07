import React from 'react';
import Main from 'views/Main';

import { AccountContextProvider } from '../../contexts/accountContext';

function App() {
  return (
    <div className="App">
      <AccountContextProvider>
        <Main />
      </AccountContextProvider>
    </div>
  );
}

export default App;
