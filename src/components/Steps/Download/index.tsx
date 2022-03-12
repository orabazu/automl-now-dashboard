/* eslint-disable no-undef */
/* eslint-disable react/display-name */
import './Download.scss';

import { SmileOutlined } from '@ant-design/icons';
import { Button, Card, Input, notification, Space, Switch } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { useAccountContext } from 'contexts/accountContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import { postData } from 'utils/http';

export const Download = () => {
  const [accountState] = useAccountContext();

  // const [tokenId, setTokenId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [offerAmount, setOfferAmount] = useState<string>();
  const [onSale, setOnSale] = useState(false);

  let navigate = useNavigate();

  const download = () => {
    const link = document.createElement('a');
    link.href = `http://www.africau.edu/images/default/sample.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const mintToken = async () => {
  //   setIsLoading(true);
  //   const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
  //   const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
  //   await client.connect();

  //   console.log('\n\n----------------Mint Token----------------');
  //   const ipfsUrl =
  //     'ipfs://QmNqAJtadcGSq2vTxcsJEYPU3BYUznxQCb1d59aC6tC115?filename=iris_Data_Analysis.pdf';

  //   const transactionBlob = {
  //     TransactionType: 'NFTokenMint',
  //     Account: wallet.classicAddress,
  //     URI: xrpl.convertStringToHex(ipfsUrl),
  //     Flags: 1, // TODO put that into input
  //     TokenTaxon: 0, //Required, but if you have no use for it, set to zero.
  //   };
  //   // Submit signed blob --------------------------------------------------------
  //   const tx = await client.submitAndWait(transactionBlob, { wallet });

  //   const nfts = await client.request({
  //     method: 'account_nfts',
  //     account: wallet.classicAddress,
  //   });
  //   console.log(JSON.stringify(nfts, null, 2));
  //   // Check transaction results -------------------------------------------------
  //   console.log('Transaction result:', tx.result.meta.TransactionResult);
  //   console.log(
  //     'Balance changes:',
  //     JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
  //   );

  //   console.log('-----', nfts);
  //   const accountNfts = nfts.result.account_nfts;
  //   setTokenId(accountNfts[accountNfts.length - 1].TokenID);

  //   notification.open({
  //     message: 'Minted NFT succesfully',
  //     placement: 'bottomRight',
  //     icon: <SmileOutlined style={{ color: '#86dc3d' }} />,
  //     onClick: () => {
  //       console.log('Notification Clicked!');
  //     },
  //   });

  //   // Get Account Info to update Balance after Minting Token
  //   getAccountInfo(accountDispatch, accountState);
  //   setIsLoading(false);
  //   client.disconnect();
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
      TokenID: accountState.lastMintedNft,
      Amount: xrpl.xrpToDrops(offerAmount),
      Flags: 1,
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet });

    console.log('***Sell Offers***');
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: accountState.lastMintedNft,
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
        tokenid: accountState.lastMintedNft,
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
      icon: <SmileOutlined style={{ color: '#86dc3d' }} />,
    });

    client.disconnect();
    navigate(`/`);
  };

  const onChangeSwitch = () => setOnSale(!onSale);

  return (
    <div className="Download">
      <Title level={2}>Your Report</Title>
      <Card
        className="NTFResultCard card"
        style={{ width: 400 }}
        cover={
          <img
            style={{ borderRadius: '24px 24px 0 0' }}
            alt="example"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3cXtv77N7Lp7xFOiRum0a13pcg-u7UpGnlQ&usqp=CAU"
          />
        }
        actions={[
          <Button type="primary" onClick={download} key="mint" loading={isLoading}>
            Download
          </Button>,
        ]}>
        <Space direction="vertical" style={{ width: 340 }}>
          <Meta
            title="IrisClassificationResults"
            description={
              accountState.lastMintedNft
                ? ''
                : `You can generate an NFT of that report by clicking Mint PDF Report`
            }
          />
          {accountState.lastMintedNft && (
            <div>
              <Meta title="Token ID" className="fancy-description" />
              <Text className="fancy-description">#{accountState.lastMintedNft} </Text>
              <div className="flex flex-space-between marketplace-title">
                <Title level={4}>Put on marketplace</Title>
                <Switch onChange={onChangeSwitch} />
              </div>
              {onSale && (
                <Space direction="vertical">
                  <Text type="secondary" className="subtitle">
                    Enter price to allow users instantly purchase your NFT
                  </Text>

                  <div
                    className="label flex flex-space-between"
                    style={{ alignItems: 'center' }}>
                    <Text style={{ marginRight: 10, fontSize: 16 }}>Price: </Text>
                    <Input
                      placeholder="Enter price for the report in XRP"
                      value={offerAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setOfferAmount(e.target.value)
                      }
                    />
                  </div>

                  <div className="flex sell-btn">
                    <Button
                      className="btn-fancy"
                      onClick={createSellOffer}
                      key="mint"
                      loading={isLoading}
                      disabled={!accountState.lastMintedNft}>
                      Create Sell Offer
                    </Button>
                  </div>
                </Space>
              )}
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};
