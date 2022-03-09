/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './style.scss';

import { FilePdfOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Descriptions,
  Divider,
  List,
  Result,
  Skeleton,
  Space,
} from 'antd';
import Title from 'antd/lib/typography/Title';
import { getAccountInfo, useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type SellOfferType = {
  amount: string;
  flags: number;
  index: string;
  owner: string;
};

type NFT = {
  Flags: number;
  Issuer: string;
  TokenID: string;
  TokenTaxon: number;
  URI: string;
  nft_serial: number;
  nftSellOffers: SellOfferType[];
  nftBuyOffers: SellOfferType[];
};

const Dashboard = () => {
  const [accountState, accountDispatch] = useAccountContext();
  const [accountNFTs, setAccountNFTs] = useState<NFT[]>([]);
  const [nftsLoading, setNftsLoading] = useState(false);

  async function getNFTs() {
    setNftsLoading(true);
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('Connected to devnet');

    const nfts = await client.request({
      method: 'account_nfts',
      account: wallet.classicAddress,
    });

    console.log(nfts);

    setAccountNFTs(nfts.result.account_nfts);
    setNftsLoading(false);
    client.disconnect();
  } //End of getTokens

  useEffect(() => {
    if (accountState.account?.address) {
      getNFTs();
    }
  }, [accountState.account?.address]);

  //***************************
  //** Get Offers *************
  //***************************

  async function getOffers(tokenId: string) {
    // const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('***Sell Offers***');
    let nftSellOffers: any;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: tokenId,
      });
    } catch (err) {
      console.log('No sell offers.');
    }

    let nftBuyOffers: any;
    try {
      nftBuyOffers = await client.request({
        method: 'nft_buy_offers',
        tokenid: tokenId,
      });
    } catch (err) {
      console.log('No buy offers.');
    }

    let tempNfts = [...accountNFTs];
    tempNfts = tempNfts.map((nft) => {
      if (nft.TokenID === tokenId) {
        return {
          ...nft,
          nftSellOffers: nftSellOffers?.result?.offers || [],
          nftBuyOffers: nftBuyOffers?.result?.offers || [],
        };
      }
      return nft;
    });
    console.log(JSON.stringify(tempNfts, null, 2));

    setAccountNFTs(tempNfts);
    client.disconnect();
  }

  async function burnToken(tokenId: string) {
    setNftsLoading(true);
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();

    const transactionBlob = {
      TransactionType: 'NFTokenBurn',
      Account: wallet.classicAddress,
      TokenID: tokenId,
    };

    const tx = await client.submitAndWait(transactionBlob, { wallet });
    console.log('Burned', tx);
    // Get Account Info to update Balance after Minting Token
    getAccountInfo(accountDispatch, accountState);

    getNFTs();
    setNftsLoading(false);
  }

  return (
    <>
      <Result
        className="Hero"
        icon={<FilePdfOutlined />}
        title="Machine Learning reporst with just a few clicks, seamless integration with NFTs on XRP Ledger "
        // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Link to="generate-report" key="generate-report">
            <Button type="primary">Generate Report</Button>
          </Link>,
          <Button key="buy">MarketPlace</Button>,
        ]}
      />
      <Space
        direction="vertical"
        style={{
          padding: '20px 50px',
          background: 'linear-gradient(179deg, #f0f0f1, #e6f7ff)',
          width: '100%',
        }}>
        <Title level={2}>Your NFTs</Title>
        <List
          className="demo-loadmore-list"
          // loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 10,
          }}
          dataSource={accountNFTs}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="list-loadmore-edit">Sell</a>,
                <a key="list-loadmore-more" onClick={() => burnToken(item.TokenID)}>
                  Burn
                </a>,
              ]}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Skeleton avatar title={true} loading={nftsLoading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3cXtv77N7Lp7xFOiRum0a13pcg-u7UpGnlQ&usqp=CAU" />
                    }
                    title={item.TokenID}
                    description={xrpl.convertHexToString(item.URI)}
                  />
                </Skeleton>

                <div className="actions">
                  <Button onClick={() => getOffers(item.TokenID)}>Get Offers</Button>
                </div>

                <Divider />
                {item.nftSellOffers?.length && (
                  <Descriptions title="Sell Offers">
                    {item.nftSellOffers?.map((offer) => (
                      <>
                        <Descriptions.Item label="Offered By" key={offer.index}>
                          {offer.owner === accountState.account?.address
                            ? 'Me'
                            : offer.owner}
                        </Descriptions.Item>
                        <Descriptions.Item label="Price" key={offer.index}>
                          {offer.amount} XRP
                        </Descriptions.Item>
                      </>
                    ))}
                  </Descriptions>
                )}
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </>
  );
};

export default Dashboard;
