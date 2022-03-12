import './style.scss';

import { DownloadOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { getAccountInfo, useAccountContext } from 'contexts/accountContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SellOfferType } from 'views/Dashboard';

export const MarketPlace = () => {
  const [accountState, accountDispatch] = useAccountContext();
  const [form] = Form.useForm();
  const [sellOffers, setSellOffers] = useState<SellOfferType[]>();
  const [isLoading, setIsLoading] = useState(false);

  const transactionCost = 0.000012;

  let navigate = useNavigate();

  const onFinish = async (values: any) => {
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();

    const transactionBlob = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.classicAddress,
      Owner: values.Owner,
      TokenID: values.TokenID,
      Amount: values.Amount,
      Flags: 0,
    };

    console.log(transactionBlob);
    await client.submitAndWait(transactionBlob, { wallet });

    console.log('***Sell Offers***');
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: values.TokenID,
      });
      setSellOffers(nftSellOffers.result.offers);
    } catch (err) {
      console.log('No sell offers.');
    }
    console.log(JSON.stringify(nftSellOffers, null, 2));
    console.log('***Buy Offers***');
    let nftBuyOffers;
    try {
      nftBuyOffers = await client.request({
        method: 'nft_buy_offers',
        tokenid: values.TokenID,
      });
    } catch (err) {
      console.log('No buy offers.');
    }
    console.log(JSON.stringify(nftBuyOffers, null, 2));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const getSellOffers = async () => {
    setIsLoading(true);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    const tokenId = form.getFieldValue('TokenID');
    console.log(tokenId);
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: tokenId,
      });
      setSellOffers(nftSellOffers?.result?.offers || []);
    } catch (err) {
      console.log('No sell offers.');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptSellOffer = async () => {
    setIsLoading(true);
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();

    const transactionBlob = {
      TransactionType: 'NFTokenAcceptOffer',
      Account: wallet.classicAddress,
      SellOffer: sellOffers && sellOffers[sellOffers?.length - 1].index,
    };

    await client.submitAndWait(transactionBlob, { wallet });

    notification.open({
      message: 'Your successfully bought the report NFT',
      placement: 'bottomRight',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
    setIsLoading(false);
    getAccountInfo(accountDispatch, accountState);

    client.disconnect();

    navigate(`/`);
  };

  return (
    <div className="MarketPlace">
      <div className="MarketPlaceWrapper">
        <Title level={1} style={{ textAlign: 'left', marginBottom: '30px' }}>
          Buy single report item on XRP Ledger
        </Title>

        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}>
          <Title level={3} style={{ textAlign: 'left' }}>
            Get from marketplace
          </Title>
          <div className="flex card TokenForm">
            <Form.Item
              style={{ width: '500px', margin: 0 }}
              label="TokenID"
              name="TokenID"
              rules={[{ required: true, message: 'Please input TokenID!' }]}>
              <Input />
            </Form.Item>
            <Button
              onClick={() => getSellOffers()}
              icon={<DownloadOutlined />}
              loading={isLoading}>
              Get sell offers
            </Button>
          </div>

          {form.getFieldValue('TokenID') && (
            <Row>
              <Col span={12}>
                <Title level={3} style={{ textAlign: 'left' }}>
                  Current Offers
                </Title>
                {sellOffers?.length
                  ? sellOffers?.map((offer) => (
                      <div className="offer card" key={offer.index}>
                        <div className="flex flex-space-between">
                          <div className="price">
                            <span className="price">Current price: </span>
                            <span> {Number(offer.amount) / 1000000} XRP</span>
                          </div>

                          <Button
                            type="primary"
                            onClick={acceptSellOffer}
                            disabled={!accountState.account?.address}
                            loading={isLoading}>
                            Buy Now
                          </Button>
                        </div>

                        <p>Transaction Cost: {transactionCost} XRP</p>
                        <p>
                          Total: {transactionCost + Number(offer.amount) / 1000000} XRP
                        </p>
                      </div>
                    ))
                  : isLoading
                  ? 'Loading'
                  : 'No offers'}
              </Col>
              {/* <Col span={12} className="">
                <Title level={3} style={{ textAlign: 'left' }}>
                  Make Offer
                </Title>
                <div className="card makeOffer">
                  <Form.Item
                    label="Owner"
                    name="Owner"
                    rules={[
                      { required: true, message: 'Please input owner of the token!' },
                    ]}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Amount"
                    name="Amount"
                    rules={[{ required: true, message: 'Please input Price' }]}>
                    <Input type="number" />
                  </Form.Item>
                  <Form.Item
                    label="Flags"
                    name="Flags"
                    rules={[{ required: true, message: 'Please input Flags' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" disabled={!accountState.account?.address}>
                      Make Offer
                    </Button>
                  </Form.Item>
                </div>
              </Col> */}
            </Row>
          )}
        </Form>
      </div>
    </div>
  );
};
