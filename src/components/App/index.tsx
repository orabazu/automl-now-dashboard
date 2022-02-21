import './App.scss';

import { Button, PageHeader, Space, Timeline } from 'antd';
import Logo from 'assets/logo.png';
import { Wizard } from 'components/Wizard';
import React from 'react';

function App() {
  const steps = [
    {
      title: 'Connect Wallet',
      content: (
        <>
          <Timeline>
            <Timeline.Item>Connect your XRP wallet.</Timeline.Item>
            <Timeline.Item>Prepare and upload your data as xlsx.</Timeline.Item>
            <Timeline.Item>Choose time available, settings, and run ML.</Timeline.Item>
            <Timeline.Item>See the predictive performance.</Timeline.Item>
            <Timeline.Item>
              Decide whether the purchase the full analysis report.
            </Timeline.Item>
            <Timeline.Item>Pay in XRP and download your report.</Timeline.Item>
            <Timeline.Item>
              (a) Your reports are stored secure. Only you can download your reports. Your
              data is deleted automatically after 15 minutes.
            </Timeline.Item>
          </Timeline>
          <Space>
            <Button type="primary">Cool, let&rsquo;s connect my wallet </Button>
          </Space>
        </>
      ),
    },
    {
      title: 'Upload Data',
      content: 'Second-content',
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
