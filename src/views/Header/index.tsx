import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import { connectWallet, useAccountContext } from 'contexts/accountContext';
import React, { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AccountActionTypes } from 'reducers/accountReducer';
import { formatAccount } from 'utils/common';

// import xrpLogo from '../../assets/xrp.png';

export type RowType = { [k: string]: any }[];
export type HeadersType =
  | {
      title: string;
      dataIndex: string;
      key: string;
    }[]
  | undefined;

import './Header.scss';

const Header = () => {
  const [accountState, accountDispatch] = useAccountContext();

  useEffect(() => {
    if (accountState.account?.address) {
      accountDispatch({
        type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
        payload: false,
      });
    } else {
      accountDispatch({
        type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
        payload: true,
      });
    }
  }, [accountState.account?.address]);

  useEffect(() => {
    accountDispatch({
      type: AccountActionTypes.SET_NEXT_BUTTON_TOOLTIP_TEXT,
      payload: 'Please connect wallet first',
    });
  }, []);

  return (
    <div className="Main">
      <PageHeader
        className="PageHeader"
        ghost={false}
        avatar={{
          src: Logo,
        }}
        title={<Link to="/">AutoML.NFT </Link>}
        subTitle="Automate your ML, get your results as NFT"
        extra={
          <>
            {accountState.account?.balance && (
              <Button>{accountState.account?.balance} XRP</Button>
            )}

            <Button
              loading={accountState.isLoading}
              type="primary"
              onClick={() =>
                accountState.account?.address ? undefined : connectWallet(accountDispatch)
              }>
              {accountState.account?.address
                ? formatAccount(accountState.account?.address)
                : 'Connect Wallet'}
            </Button>
            {/* <Avatar src={xrpLogo} className={'xrpLogo'} /> */}
          </>
        }></PageHeader>
      <Outlet />
    </div>
  );
};

export default Header;
