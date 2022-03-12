/* eslint-disable react/display-name */
import './Results.scss';

import { SmileOutlined } from '@ant-design/icons';
import { Button, Descriptions, Input, notification, Space } from 'antd';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import { getAccountInfo, useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useState } from 'react';
import { AccountActionTypes } from 'reducers/accountReducer';

export const Results = () => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountState, accountDispatch] = useAccountContext();
  const [transactionCost, setTransactionCost] = useState(0.000012);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const results = {
    MSE: 0.86,
    RMSE: 0.93,
    MAE: 0.66,
    MAEPerc: 12.87,
    R2: 17.72,
    R2adjusted: 0.6,
  };

  const openPurchaseForm = () => setIsPurchasing(true);

  const buyReport = async () => {
    setIsLoading(true);

    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('\n\n----------------Create Purchase Offer----------------');

    const prepared = await client.autofill({
      TransactionType: 'Payment',
      Account: wallet.address,
      Amount: xrpl.xrpToDrops('10'),
      Destination: 'rDY8SojU48RrUpP4R2xs8TTuLwaH4SXZZE',
    });
    const max_ledger = prepared.LastLedgerSequence;
    console.log('Prepared transaction instructions:', prepared);
    console.log('Transaction cost:', xrpl.dropsToXrp(prepared.Fee), 'XRP');

    setTransactionCost(Number(xrpl.dropsToXrp(prepared.Fee)));

    console.log('Transaction expires after ledger:', max_ledger);

    const signed = wallet.sign(prepared);
    console.log('Identifying hash:', signed.hash);
    console.log('Signed blob:', signed.tx_blob);

    notification.open({
      message: 'Transaction submitted.',
      placement: 'bottomRight',
      type: 'info',
    });

    const tx = await client.submitAndWait(signed.tx_blob);

    console.log(
      'Transaction result:',
      JSON.stringify(tx.result.meta.TransactionResult, null, 2),
    );

    if (tx.result.meta.TransactionResult === 'tesSUCCESS') {
      setIsTransactionComplete(true);
    }
    console.log(
      'Balance changes:',
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
    );

    notification.open({
      message: 'You succesfully purchased the report',
      placement: 'bottomRight',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });

    getAccountInfo(accountDispatch, accountState);

    mintToken(wallet, client);

    // navigate(`/`);
  };

  const mintToken = async (wallet: any, client: any) => {
    notification.open({
      message: 'NFT minting started',
      placement: 'bottomRight',
      type: 'info',
    });
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
    console.log(accountNfts);

    accountDispatch({
      type: AccountActionTypes.SET_LAST_MINTED_NFT,
      payload: accountNfts[accountNfts.length - 1].TokenID,
    });

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

    accountDispatch({
      type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
      payload: false,
    });

    setIsLoading(false);

    client.disconnect();
  };

  useEffect(() => {
    accountDispatch({
      type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
      payload: true,
    });
  }, []);

  return (
    <>
      <div className="Regression">
        <Title level={3}>Regression Performance</Title>
        <Descriptions bordered>
          <Descriptions.Item label="MSE">{results.MSE} </Descriptions.Item>
          <Descriptions.Item label="RMSE">{results.RMSE}</Descriptions.Item>
          <Descriptions.Item label="MAE"> {results.MAE} </Descriptions.Item>
          <Descriptions.Item label="MAE %"> {results.MAEPerc} </Descriptions.Item>
          <Descriptions.Item label="R^2"> {results.R2} </Descriptions.Item>
          <Descriptions.Item label="R^2 adjusted">{results.R2adjusted}</Descriptions.Item>
        </Descriptions>

        <div className="flex results-action">
          <Button className="btn-fancy" onClick={openPurchaseForm} loading={isLoading}>
            I want to purchase full report
          </Button>
          <Button style={{ color: `red` }} loading={isLoading}>
            I need better results, delete my data
          </Button>
        </div>

        {isPurchasing && !isTransactionComplete && (
          <Space direction="vertical">
            <Text type="secondary" className="subtitle">
              NFT of this report would be minted to your wallet as well.
            </Text>

            <div
              className="label flex flex-space-between"
              style={{ alignItems: 'center' }}>
              <Text style={{ marginRight: 10, fontSize: 16 }}>Price: </Text>
              <Input
                placeholder="Enter price for the report in XRP"
                value={10}
                disabled
              />
            </div>
            <div className="transaction-costs">
              <p>Transaction Cost: {transactionCost} XRP</p>
              <p>Minting Cost: {transactionCost} XRP</p>
              <p>Report&apos;s price: 10 XRP</p>
              <p>Total: {transactionCost + 10} XRP</p>
              <p>
                Your balance after transaction:{' '}
                {accountState.account!.balance - (transactionCost + transactionCost + 10)}{' '}
                XRP
              </p>
            </div>

            <div className="flex sell-btn">
              <Button
                className="btn-fancy"
                onClick={buyReport}
                key="buy"
                loading={isLoading}
                disabled={isTransactionComplete}>
                Buy Report
              </Button>
            </div>
          </Space>
        )}
      </div>

      {/* <Space>
        <Title level={3}>Classification Performance</Title>
      </Space> */}

      {/* <div className="ant-table-wrapper Classification">
        <table
          className="ant-table ant-table-small"
          style={{
            width: '100%',
          }}>
          <thead className="ant-table-thead">
            <tr className="ant-table-row ant-table-row-level-0">
              <th className="ant-table-cell"></th>
              <th className="ant-table-cell">Negative (-)</th>
              <th className="ant-table-cell">Positive (+)</th>
              <th className="ant-table-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ant-table-cell head-cell">Negative (-)</td>
              <td className="ant-table-cell positive">True (+) ___</td>
              <td className="ant-table-cell negative">False (-) ___</td>
              <td className="ant-table-cell">Specifity ___</td>
            </tr>
            <tr>
              <td className="ant-table-cell head-cell">Positive(+)</td>
              <td className="ant-table-cell negative">False (+) ___</td>
              <td className="ant-table-cell positive">True (+) ___</td>
              <td className="ant-table-cell">Recall ___</td>
            </tr>
            <tr>
              <td className="ant-table-cell last-head-cell"></td>
              <td className="ant-table-cell">F1 ___</td>
              <td className="ant-table-cell">MCC ___</td>
              <td className="ant-table-cell">Balanced ACC ___</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </>
  );
};
