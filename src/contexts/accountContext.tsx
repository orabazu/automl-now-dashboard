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
    let data = await postData('https://faucet-nft.ripple.com/accounts', 'NFT-Devnet');

    // possibly const test_wallet = xrpl.Wallet.generate()
    // not expose secret on UI
    // these are credentials
    const { balance, account } = data;
    const { address, secret, classicAddress } = account;
    console.log(data, secret);
    // let networkUrl = 'wss://s.altnet.rippletest.net:51233';
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
          balance: balance,
          classicAddress: classicAddress,
          secret,
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

const useAccountContext = () => useContext(AccountContext);

export { AccountContextProvider, connectWallet, useAccountContext };
