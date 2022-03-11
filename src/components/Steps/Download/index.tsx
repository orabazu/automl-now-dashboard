/* eslint-disable no-undef */
/* eslint-disable react/display-name */
import './Download.scss';

import { SmileOutlined } from '@ant-design/icons';
import { Button, Card, Input, notification, Space } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Title from 'antd/lib/typography/Title';
import { getAccountInfo, useAccountContext } from 'contexts/accountContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { postData } from 'utils/http';

export const Download = () => {
  const [accountState, accountDispatch] = useAccountContext();

  const [tokenId, setTokenId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>();
  let navigate = useNavigate();

  const mintToken = async () => {
    setIsLoading(true);
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();

    console.log('\n\n----------------Mint Token----------------');
    const ipfsUrl =
      'ipfs://QmNqAJtadcGSq2vTxcsJEYPU3BYUznxQCb1d59aC6tC115?filename=iris_Data_Analysis.pdf';

    const transactionBlob = {
      TransactionType: 'NFTokenMint',
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(ipfsUrl),
      Flags: 1, // TODO put that into input
      TokenTaxon: 0, //Required, but if you have no use for it, set to zero.
    };
    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet });

    const nfts = await client.request({
      method: 'account_nfts',
      account: wallet.classicAddress,
    });
    console.log(JSON.stringify(nfts, null, 2));
    // Check transaction results -------------------------------------------------
    console.log('Transaction result:', tx.result.meta.TransactionResult);
    console.log(
      'Balance changes:',
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
    );

    console.log('-----', nfts);
    const accountNfts = nfts.result.account_nfts;
    setTokenId(accountNfts[accountNfts.length - 1].TokenID);

    notification.open({
      message: 'Minted NFT succesfully',
      placement: 'bottomRight',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });

    // Get Account Info to update Balance after Minting Token
    getAccountInfo(accountDispatch, accountState);
    setIsLoading(false);
    client.disconnect();
  }; //End of mintToken

  // const getOffers = async () => {
  //   // const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
  //   let token = '0001000016C035066EC9447EB2C49081C91BEF8786F2CD480000099B00000000';

  //   const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
  //   await client.connect();
  //   console.log('\n\n----------------Get Offers----------------');

  //   console.log('***Sell Offers***');
  //   let nftSellOffers;
  //   try {
  //     nftSellOffers = await client.request({
  //       method: 'nft_sell_offers',
  //       tokenid: token,
  //     });
  //   } catch (err) {
  //     console.log('No sell offers.');
  //   }
  //   if (typeof nftSellOffers !== 'undefined') {
  //     console.log(JSON.stringify(nftSellOffers, null, 2));
  //   }
  //   console.log('***Buy Offers***');
  //   let nftBuyOffers;
  //   try {
  //     nftBuyOffers = await client.request({
  //       method: 'nft_buy_offers',
  //       tokenid: token,
  //     });
  //   } catch (err) {
  //     console.log('No buy offers.');
  //   }
  //   if (typeof nftBuyOffers !== 'undefined') {
  //     console.log(JSON.stringify(nftBuyOffers, null, 2));
  //   }
  //   // console.log(JSON.stringify(nftBuyOffers,null,2))
  //   client.disconnect();
  //   // End of getOffers()
  // };

  const createSellOffer = async () => {
    setIsLoading(true);

    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('\n\n----------------Create Sell Offer----------------');

    const transactionBlob = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.classicAddress,
      TokenID: tokenId,
      Amount: offerAmount, // TODO bind input
      Flags: 1,
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet });

    console.log('***Sell Offers***');
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: tokenId,
      });
    } catch (err) {
      console.log('No sell offers.');
    }
    console.log(JSON.stringify(nftSellOffers, null, 2));
    console.log('***Buy Offers***');
    let nftBuyOffers;
    try {
      nftBuyOffers = await client.request({
        method: 'nft_buy_offers',
        tokenid: tokenId,
      });
    } catch (err) {
      console.log('No buy offers.');
    }
    console.log(JSON.stringify(nftBuyOffers, null, 2));

    console.log(
      'Transaction result:',
      JSON.stringify(tx.result.meta.TransactionResult, null, 2),
    );
    console.log(
      'Balance changes:',
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
    );

    setIsLoading(false);

    notification.open({
      message: 'Your sell offer created successfully',
      placement: 'bottomRight',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });

    client.disconnect();
    navigate(`/`);
  };

  // async function acceptSellOffer() {
  //   let data = await postData('https://faucet-nft.ripple.com/accounts', 'NFT-Devnet');

  //   // possibly const test_wallet = xrpl.Wallet.generate()
  //   // not expose secret on UI
  //   // these are credentials
  //   const { secret } = data.account;
  //   console.log(data, secret);
  //   // let networkUrl = 'wss://s.altnet.rippletest.net:51233';
  //   const wallet = xrpl.Wallet.fromSeed(secret);
  //   const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
  //   await client.connect();
  //   console.log('\n\n----------------Accept Sell Offer----------------');

  //   // Prepare transaction -------------------------------------------------------
  //   const transactionBlob = {
  //     TransactionType: 'NFTokenAcceptOffer',
  //     Account: wallet.classicAddress,
  //     SellOffer: 'E68BC2C8EC88F77AF83AAD2D15D926871374A2EBFE2646DFB6CAB2982662BD31',

  //     // TransactionType: 'NFTokenAcceptOffer',
  //     // Account: wallet.classicAddress,
  //     // SellOffer: 100, // TODO bind input
  //     // Index: 'E68BC2C8EC88F77AF83AAD2D15D926871374A2EBFE2646DFB6CAB2982662BD31',
  //     // Owner: 'rsnJ3rLLrkoZLHqXTzM16cPFy3oWavVvES',
  //     // TokenId: '0001000016C035066EC9447EB2C49081C91BEF8786F2CD480000099B00000000',
  //     // Flags: 0,
  //   };
  //   // Submit signed blob --------------------------------------------------------
  //   const tx = await client.submitAndWait(transactionBlob, { wallet });
  //   const nfts = await client.request({
  //     method: 'account_nfts',
  //     account: wallet.classicAddress,
  //   });
  //   console.log(JSON.stringify(nfts, null, 2));

  //   // Check transaction results -------------------------------------------------
  //   console.log(
  //     'Transaction result:',
  //     JSON.stringify(tx.result.meta.TransactionResult, null, 2),
  //   );
  //   console.log(
  //     'Balance changes:',
  //     JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
  //   );
  //   client.disconnect();
  //   // End of acceptSellOffer()
  // }

  return (
    <>
      <div className="download-footer">
        {/* <pre>{JSON.stringify(accountState)}</pre> */}
        <Title level={2}>Your Report</Title>
        <Card
          style={{ width: 350 }}
          cover={
            <img
              alt="example"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3cXtv77N7Lp7xFOiRum0a13pcg-u7UpGnlQ&usqp=CAU"
            />
          }
          actions={[
            <Button
              type="primary"
              onClick={mintToken}
              key="mint"
              loading={isLoading}
              disabled={tokenId}>
              Mint NFT
            </Button>,
            <Button
              type="primary"
              onClick={createSellOffer}
              key="mint"
              loading={isLoading}
              disabled={!tokenId}>
              Create Sell Offer
            </Button>,
          ]}>
          <Space direction="vertical" style={{ width: 300 }}>
            <Meta
              title="IrisClassificationResults"
              description="You can generate an NFT of that report by clicking Mint PDF Report"
            />
            <Meta description={tokenId || ''} />
            {tokenId && (
              <Input
                placeholder="Amount in XRP"
                value={offerAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOfferAmount(e.target.value)
                }
              />
            )}
          </Space>
        </Card>

        {/* <Button type="primary" onClick={getOffers}>
          Get sell offers
        </Button>
        <Button type="primary" onClick={createSellOffer}>
          Create sell offer
        </Button>

        <div>----------</div>

        <Button type="primary" onClick={acceptSellOffer}>
          Accept Sell offer
        </Button> */}
      </div>
    </>
  );
};
