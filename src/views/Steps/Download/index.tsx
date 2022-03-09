/* eslint-disable no-undef */
/* eslint-disable react/display-name */
import './Download.scss';

import { Button } from 'antd';
import { useAccountContext } from 'contexts/accountContext';
import React, { useState } from 'react';
import { postData } from 'utils/http';

export const Download = () => {
  const [accountState, accountDispatch] = useAccountContext();

  const [token, setToken] = useState();

  // const download = () => {
  //   const link = document.createElement('a');
  //   link.href = `http://www.africau.edu/images/default/sample.pdf`;
  //   link.target = '_blank';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const mintToken = async () => {
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();

    console.log('\n\n----------------Mint Token----------------');

    // Note that you must convert the token URL to a hexadecimal
    // value for this transaction.
    // ----------------------------------------------------------

    const tokenUrl = 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi';

    const transactionBlob = {
      TransactionType: 'NFTokenMint',
      Account: wallet.classicAddress,
      URI: xrpl.convertStringToHex(tokenUrl),
      Flags: 1, // TODO put that into input
      TokenTaxon: 0, //Required, but if you have no use for it, set to zero.
    };
    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet });

    const nfts = await client.request({
      method: 'account_nfts',
      account: wallet.classicAddress,
    });
    // console.log(nfts)

    // setToken('0001000016C035066EC9447EB2C49081C91BEF8786F2CD480000099B00000000');
    console.log(JSON.stringify(nfts, null, 2));
    // Check transaction results -------------------------------------------------
    console.log('Transaction result:', tx.result.meta.TransactionResult);
    console.log(
      'Balance changes:',
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
    );

    // Get Account Info to update Balance after Minting Token
    // getAccountInfo();
    client.disconnect();
  }; //End of mintToken

  const getOffers = async () => {
    // const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    let token = '0001000016C035066EC9447EB2C49081C91BEF8786F2CD480000099B00000000';

    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('\n\n----------------Get Offers----------------');

    console.log('***Sell Offers***');
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: token,
      });
    } catch (err) {
      console.log('No sell offers.');
    }
    if (typeof nftSellOffers !== 'undefined') {
      console.log(JSON.stringify(nftSellOffers, null, 2));
    }
    console.log('***Buy Offers***');
    let nftBuyOffers;
    try {
      nftBuyOffers = await client.request({
        method: 'nft_buy_offers',
        tokenid: token,
      });
    } catch (err) {
      console.log('No buy offers.');
    }
    if (typeof nftBuyOffers !== 'undefined') {
      console.log(JSON.stringify(nftBuyOffers, null, 2));
    }
    // console.log(JSON.stringify(nftBuyOffers,null,2))
    client.disconnect();
    // End of getOffers()
  };

  async function createSellOffer() {
    let token = '0001000016C035066EC9447EB2C49081C91BEF8786F2CD480000099B00000000';
    const wallet = xrpl.Wallet.fromSeed(accountState.account?.secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('\n\n----------------Create Sell Offer----------------');

    // Prepare transaction -------------------------------------------------------
    const transactionBlob = {
      TransactionType: 'NFTokenCreateOffer',
      Account: wallet.classicAddress,
      TokenID: token,
      Amount: '100', // TODO bind input
      Flags: 1,
    };

    // Submit signed blob --------------------------------------------------------

    const tx = await client.submitAndWait(transactionBlob, { wallet }); //AndWait

    console.log('***Sell Offers***');
    let nftSellOffers;
    try {
      nftSellOffers = await client.request({
        method: 'nft_sell_offers',
        tokenid: token,
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
        tokenid: token,
      });
    } catch (err) {
      console.log('No buy offers.');
    }
    console.log(JSON.stringify(nftBuyOffers, null, 2));

    // Check transaction results -------------------------------------------------
    console.log(
      'Transaction result:',
      JSON.stringify(tx.result.meta.TransactionResult, null, 2),
    );
    console.log(
      'Balance changes:',
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
    );
    client.disconnect();
    // End of createSellOffer()
  }

  async function acceptSellOffer() {
    let data = await postData('https://faucet-nft.ripple.com/accounts', 'NFT-Devnet');

    // possibly const test_wallet = xrpl.Wallet.generate()
    // not expose secret on UI
    // these are credentials
    const { secret } = data.account;
    console.log(data, secret);
    // let networkUrl = 'wss://s.altnet.rippletest.net:51233';
    const wallet = xrpl.Wallet.fromSeed(secret);
    const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
    await client.connect();
    console.log('\n\n----------------Accept Sell Offer----------------');

    // Prepare transaction -------------------------------------------------------
    const transactionBlob = {
      TransactionType: 'NFTokenAcceptOffer',
      Account: wallet.classicAddress,
      SellOffer: 'E68BC2C8EC88F77AF83AAD2D15D926871374A2EBFE2646DFB6CAB2982662BD31',

      // TransactionType: 'NFTokenAcceptOffer',
      // Account: wallet.classicAddress,
      // SellOffer: 100, // TODO bind input
      // Index: 'E68BC2C8EC88F77AF83AAD2D15D926871374A2EBFE2646DFB6CAB2982662BD31',
      // Owner: 'rsnJ3rLLrkoZLHqXTzM16cPFy3oWavVvES',
      // TokenId: '0001000016C035066EC9447EB2C49081C91BEF8786F2CD480000099B00000000',
      // Flags: 0,
    };
    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob, { wallet });
    const nfts = await client.request({
      method: 'account_nfts',
      account: wallet.classicAddress,
    });
    console.log(JSON.stringify(nfts, null, 2));

    // Check transaction results -------------------------------------------------
    console.log(
      'Transaction result:',
      JSON.stringify(tx.result.meta.TransactionResult, null, 2),
    );
    console.log(
      'Balance changes:',
      JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2),
    );
    client.disconnect();
    // End of acceptSellOffer()
  }

  return (
    <>
      <div className="download-footer">
        <pre>{JSON.stringify(accountState)}</pre>
        <Button type="primary" onClick={mintToken}>
          Mint
        </Button>
        <Button type="primary" onClick={getOffers}>
          Get sell offers
        </Button>
        <Button type="primary" onClick={createSellOffer}>
          Create sell offer
        </Button>
        <Button>I need better results. Please delete my data.</Button>

        <div>----------</div>

        <Button type="primary" onClick={acceptSellOffer}>
          Accept Sell offer
        </Button>
      </div>
    </>
  );
};
