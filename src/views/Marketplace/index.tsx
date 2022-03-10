import './style.scss';

import { DownloadOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useAccountContext } from 'contexts/accountContext';
import React, { useState } from 'react';
import { SellOfferType } from 'views/Dashboard';

export const MarketPlace = () => {
  const [accountState] = useAccountContext();
  const [form] = Form.useForm();
  const [sellOffers, setSellOffers] = useState<SellOfferType[]>();

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
    }
  };

  const acceptSellOffer = async () => {
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
  };

  return (
    <div className="MarketPlace">
      <div>
        <Title level={2} style={{ textAlign: 'center' }}>
          Buy Report
        </Title>
      </div>

      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        form={form}>
        <Row>
          <Col span={16}>
            <Form.Item
              label="TokenID"
              name="TokenID"
              rules={[{ required: true, message: 'Please input TokenID!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => getSellOffers()} icon={<DownloadOutlined />}>
              Get sell offers
            </Button>
          </Col>
        </Row>

        {form.getFieldValue('TokenID') && (
          <Row>
            <Col span={24}>
              <Title level={3} style={{ textAlign: 'center' }}>
                Current Offers
              </Title>
              {sellOffers?.length
                ? sellOffers?.map((offer) => (
                    <div className="offer" key={offer.index}>
                      <div className="price">
                        <span className="price">Current price</span>
                        <span> {offer.amount} XRP</span>
                      </div>
                      <Button type="primary" onClick={acceptSellOffer}>
                        Buy Now
                      </Button>
                    </div>
                  ))
                : 'No offers'}
            </Col>
            <Col span={24} className="makeOffer">
              <Title level={3} style={{ textAlign: 'center' }}>
                Make Offer
              </Title>
              <Form.Item
                label="Owner"
                name="Owner"
                rules={[{ required: true, message: 'Please input owner of the token!' }]}>
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
              <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
                <Button htmlType="submit">Make Offer</Button>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};
