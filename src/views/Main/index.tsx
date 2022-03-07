import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import { Wizard } from 'components/Wizard';
import { connectWallet, useAccountContext } from 'contexts/accountContext';
import React from 'react';
import { formatAccount } from 'utils/common';
import { DataOverview } from 'views/Steps/DataOverview';
import { Download } from 'views/Steps/Download';
import { TargetSelection } from 'views/Steps/TargetSelection';
import UploadData from 'views/Steps/UploadData';
import WelcomeStep from 'views/Steps/WelcomeStep';

const Main = () => {
  const [accountState, accountDispatch] = useAccountContext();
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
      title: 'See Data',
      content: <DataOverview />,
    },
    {
      title: 'Select Data Type',
      content: <TargetSelection />,
    },
    {
      title: 'Results',
      content: <Download />,
    },
    {
      title: 'Download',
      content: <Download />,
    },
  ];
  return (
    <>
      <PageHeader
        ghost={false}
        avatar={{
          src: Logo,
        }}
        title="AutoMLNow"
        subTitle="Automate your ML, get your results as NFT"
        extra={
          <Button
            loading={accountState.isLoading}
            type="primary"
            onClick={() =>
              accountState.account?.address ? undefined : connectWallet(accountDispatch)
            }>
            {formatAccount(accountState.account?.address) || 'Connect Wallet'}
          </Button>
        }></PageHeader>
      <div className="body">
        {/* TODO: add is next disabled connection */}
        <Wizard steps={steps} isNextDisabled={false} />
      </div>
    </>
  );
};

export default Main;
