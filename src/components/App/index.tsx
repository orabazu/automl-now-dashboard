import './App.scss';

import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import UploadData from 'components/Steps/UploadData';
import WelcomeStep from 'components/Steps/WelcomeStep';
import { Wizard } from 'components/Wizard';
import React from 'react';

function App() {
  const steps = [
    {
      title: 'Connect Wallet',
      content: <WelcomeStep />,
    },
    {
      title: 'Upload Data',
      content: <UploadData />,
    },
    {
      title: 'Time Span',
      content: 'Last-content',
    },
    {
      title: 'See Results',
      content: 'Second-content',
    },
    {
      title: 'Full Report',
      content: 'Last-content',
    },
    {
      title: 'Download',
      content: 'Last-content',
    },
  ];

  return (
    <div className="App">
      <PageHeader
        ghost={false}
        avatar={{
          src: Logo,
        }}
        title="AutoML"
        subTitle="Automate your ML, get your results as NFT"
        extra={[
          <Button key="1" type="primary">
            Connect Wallet
          </Button>,
        ]}></PageHeader>
      <div className="body">
        <Wizard steps={steps} />
      </div>
    </div>
  );
}

export default App;
