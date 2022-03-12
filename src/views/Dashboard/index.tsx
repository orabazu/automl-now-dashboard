/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './style.scss';

import { Button, List, Result, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import Logo from 'assets/logo.png';
import { getAccountInfo, useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export type SellOfferType = {
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

    setAccountNFTs(nfts.result.account_nfts);
    setNftsLoading(false);
    client.disconnect();
  }

  useEffect(() => {
    if (accountState.account?.address) {
      getNFTs();
    }
  }, [accountState.account?.address]);

  async function getOffers(tokenId: string) {
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

    getAccountInfo(accountDispatch, accountState);
    getNFTs();
    setNftsLoading(false);
  }

  return (
    <>
      <Result
        className="Hero"
        icon={false}
        title={
          <>
            <img src={Logo} style={{ maxWidth: '150px' }}></img>
            <h3 style={{ margin: 0 }}>Machine Learning reports with just a few clicks</h3>
            <h3>Seamless integration with NFTs for auditing on XRP Ledger</h3>
          </>
        }
        extra={[
          <Link to="generate-report" key="generate-report">
            <Button type="primary">Generate Report</Button>
          </Link>,
          <Link to="marketplace" key="marketplace">
            <Button key="buy">Buy Report</Button>
          </Link>,
        ]}
      />
      <div className="NFTList">
        <Title level={2}>Your NFTs</Title>
        <List
          className="demo-loadmore-list"
          loading={nftsLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          // pagination={{
          //   onChange: (page) => {
          //     console.log(page);
          //   },
          //   pageSize: 10,
          // }}
          dataSource={accountNFTs}
          renderItem={(item) => (
            <List.Item className="card NFTCard">
              <Space direction="vertical" style={{ width: '100%' }}>
                <List.Item.Meta
                  title={`#${item.TokenID}`}
                  description={xrpl.convertHexToString(item.URI)}
                />

                <p className="actions owned">Owned by: {accountState.account?.address}</p>

                <div className="actions">
                  <Button onClick={() => getOffers(item.TokenID)} className={'btn-fancy'}>
                    Sync Sales
                  </Button>

                  <div className="actions-right">
                    <Button className={'btn-fancy'} style={{ marginRight: '5px' }}>
                      Put on sale
                    </Button>
                    <Button onClick={() => burnToken(item.TokenID)}>Burn</Button>
                  </div>
                </div>

                {Boolean(item.nftSellOffers?.length) && (
                  <>
                    <Text>On sale for</Text>
                    {item.nftSellOffers?.map((offer) => (
                      <span key={offer.index}>{Number(offer.amount) / 1000000} XRP</span>
                    ))}
                  </>
                )}

                {Boolean(item.nftBuyOffers?.length) && (
                  <>
                    <Text>Current Bids</Text> (
                    {item.nftSellOffers?.map((offer) => (
                      <span key={offer.index}>{offer.amount} XRP</span>
                    ))}
                    ) : (<Text>No bids</Text>)
                  </>
                )}
              </Space>
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default Dashboard;
