/* eslint-disable no-undef */
import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import { Wizard } from 'components/Wizard';
import React, { useState } from 'react';
import { Download } from 'views/Steps/Download';
import { Results } from 'views/Steps/Results';
import { TargetSelection } from 'views/Steps/TargetSelection';
import { TimeSpan } from 'views/Steps/TimeSpan';
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
      content: <Download />,
    },
  ];

  // Example POST method implementation:
  async function postData(url = '', altName: string, data = {}) {
    console.log('altName', altName);
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const connectWallet = async () => {
    let data = await postData('https://faucet-nft.ripple.com/accounts', 'NFT-Devnet');

    // not expose secret on UI
    const { address, secret } = data.account;
    console.log(data, secret);
    // let networkUrl = 'wss://s.altnet.rippletest.net:51233';

    let nftNetworkUrl = 'wss://xls20-sandbox.rippletest.net:51233';
    // eslint-disable-next-line no-undef
    console.log(xrpl);
    const client = new xrpl.Client(nftNetworkUrl);
    await client.connect();
    let response;
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
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    client.disconnect();
  };

  const formatAccount = (str?: string) =>
    str && str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);

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
        <Wizard steps={steps} />
      </div>
    </div>
  );
}

export default App;
