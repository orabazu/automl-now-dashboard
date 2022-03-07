/* eslint-disable no-undef */
import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import { Wizard } from 'components/Wizard';
import React, { useState } from 'react';
import { formatAccount } from 'utils/common';
import { postData } from 'utils/http';
import { DataOverview } from 'views/Steps/DataOverview';
import { Download } from 'views/Steps/Download';
import { TargetSelection } from 'views/Steps/TargetSelection';
import UploadData from 'views/Steps/UploadData';
import WelcomeStep from 'views/Steps/WelcomeStep';

function App() {
  const [account, setAccount] = useState();
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

  const connectWallet = async () => {
    let data = await postData('https://faucet-nft.ripple.com/accounts', 'NFT-Devnet');

    // not expose secret on UI
    // these are credentials
    const { address, secret } = data.account;
    console.log(data, secret);
    // let networkUrl = 'wss://s.altnet.rippletest.net:51233';

    let nftNetworkUrl = 'wss://xls20-sandbox.rippletest.net:51233';
    // eslint-disable-next-line no-undef
    console.log(xrpl);
    const client = new xrpl.Client(nftNetworkUrl);
    await client.connect();
    let response;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        response = await client.request({
          command: 'account_info',
          account: address,
          ledger_index: 'validated',
        });
        console.log(
          "\n\n----------------Get XRPL NFT Seller's Wallet Account Info----------------",
        );
        console.log(JSON.stringify(response, null, 2));

        setAccount(response.result.account_data.Account);
        break;
      } catch (e) {
        console.error(e);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    client.disconnect();
  };

  return (
    <div className="App">
      <PageHeader
        ghost={false}
        avatar={{
          src: Logo,
        }}
        title="AutoMLNow"
        subTitle="Automate your ML, get your results as NFT"
        extra={[
          <Button key="1" type="primary" onClick={account ? undefined : connectWallet}>
            {formatAccount(account) || 'Connect Wallet'}
          </Button>,
        ]}></PageHeader>
      <div className="body">
        {/* TODO: add is next disabled connection */}
        <Wizard steps={steps} isNextDisabled={false} />
      </div>
    </div>
  );
}

export default App;
