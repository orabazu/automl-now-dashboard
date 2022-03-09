import './style.scss';

import { Button, Form, Input } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useAccountContext } from 'contexts/accountContext';
import React from 'react';

export const MarketPlace = () => {
  const [accountState] = useAccountContext();

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

  return (
    <div className="MarketPlace">
      <Title level={2} style={{ textAlign: 'center' }}>
        Create Buy Offer
      </Title>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="Owner"
          name="Owner"
          rules={[{ required: true, message: 'Please input owner of the token!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="TokenID"
          name="TokenID"
          rules={[{ required: true, message: 'Please input TokenID!' }]}>
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
          <Button type="primary" htmlType="submit">
            Create Buy Offer
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
