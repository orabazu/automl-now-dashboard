import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import { Wizard } from 'components/Wizard';
import React from 'react';
import { Results } from 'views/Steps/Results';
import { TargetSelection } from 'views/Steps/TargetSelection';
import { TimeSpan } from 'views/Steps/TimeSpan';
import UploadData from 'views/Steps/UploadData';
import WelcomeStep from 'views/Steps/WelcomeStep';

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
      content: <TimeSpan />,
    },
    {
      title: 'See Results',
      content: <Results />,
    },
    {
      title: 'Full Report',
      content: <TargetSelection />,
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
