/* eslint-disable no-undef */
import React, { createContext, useContext, useReducer } from 'react';
import { postData } from 'utils/http';

import {
  AccountAction,
  AccountActionTypes,
  AccountState,
  initialState,
  reducer,
} from '../reducers/accountReducer';
type AccountContextType = [AccountState, React.Dispatch<AccountAction>];

export type Props = {
  children: React.ReactNode;
};

//@ts-ignore
const AccountContext = createContext<AccountContextType>(null);
const AccountContextProvider = (props: Props): JSX.Element => {
  const [accountState, accountDispatch] = useReducer(reducer, initialState);

  return (
    <AccountContext.Provider value={[accountState, accountDispatch]}>
      {props.children}
    </AccountContext.Provider>
  );
};

async function connectWallet(dispatch: React.Dispatch<AccountAction>) {
  dispatch({ type: AccountActionTypes.SET_IS_ACCOUNT_LOADING, payload: true });
  try {
    let wallet = await postData('https://faucet-nft.ripple.com/accounts', 'NFT-Devnet');

    // possibly const test_wallet = xrpl.Wallet.generate()
    // not expose secret on UI
    // these are credentials

    // TODO ask if secret exist or not
    // const wallet = xrpl.Wallet.fromSeed('shyTfxCW4gHNUbvYbv77LZdtQErRk');

    const { address, seed, classicAddress, secret } = wallet.account;
    console.log(wallet, seed, secret);

    let nftNetworkUrl = 'wss://xls20-sandbox.rippletest.net:51233';
    const client = new xrpl.Client(nftNetworkUrl);
    await client.connect();
    let response;
    // eslint-disable-next-line no-constant-condition
    while (true) {
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

        const payload = {
          address: response.result.account_data.Account,
          balance: response.result.account_data.Balance,
          classicAddress: classicAddress,
          secret: seed || secret,
        };

        dispatch({ type: AccountActionTypes.SET_ACCOUNT, payload });
        dispatch({ type: AccountActionTypes.SET_IS_ACCOUNT_LOADING, payload: false });

        break;
      } catch (e) {
        console.error(e);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    client.disconnect();
  } catch (error) {
    console.log(error);
    dispatch({ type: AccountActionTypes.SET_ACCOUNT_FAILURE });
  }
}

async function getAccountInfo(
  dispatch: React.Dispatch<AccountAction>,
  state: AccountState,
) {
  const wallet = xrpl.Wallet.fromSeed(state.account?.secret);
  const client = new xrpl.Client('wss://xls20-sandbox.rippletest.net:51233');
  await client.connect();
  console.log('\n\n----------------Get Account Info----------------');
  // const nfts = await client.request({
  const response = await client.request({
    command: 'account_info',
    account: wallet.address,
    ledger_index: 'validated',
  });

  const payload = {
    address: response.result.account_data.Account,
    balance: response.result.account_data.Balance,
    classicAddress: wallet.classicAddress,
    secret: wallet.seed,
  };

  dispatch({ type: AccountActionTypes.SET_ACCOUNT, payload });
  dispatch({ type: AccountActionTypes.SET_IS_ACCOUNT_LOADING, payload: false });
  client.disconnect();
} //End of getAccountInfo

const useAccountContext = () => useContext(AccountContext);

export { AccountContextProvider, connectWallet, getAccountInfo, useAccountContext };
