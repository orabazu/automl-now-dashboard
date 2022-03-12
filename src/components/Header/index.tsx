import './Header.scss';

import { Button, Divider, message, Modal, PageHeader } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Logo from 'assets/logo.png';
import { connectWallet, useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useState } from 'react';
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

const Header = () => {
  const [accountState, accountDispatch] = useAccountContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [seed, setSeed] = useState<string>();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const generateWallet = () => connectWallet(accountDispatch).then(() => handleOk());

  const importWallet = () => connectWallet(accountDispatch, seed).then(() => handleOk());

  const showAccount = () => {
    message.open({
      type: 'info',
      content: accountState.account?.address,
    });
  };

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
    <div className="Header">
      <PageHeader
        className="PageHeader"
        ghost={false}
        avatar={{
          src: Logo,
        }}
        title={
          <Link to="/" className="heading">
            AutoML.NFT
          </Link>
        }
        subTitle="Automate your ML, get your results as NFT"
        extra={
          <>
            {accountState.account?.balance && (
              <Button>{accountState.account?.balance} XRP</Button>
            )}

            <Button
              loading={accountState.isLoading}
              type="primary"
              onClick={accountState.account?.address ? showAccount : showModal}>
              {accountState.account?.address
                ? formatAccount(accountState.account?.address)
                : 'Connect Wallet'}
            </Button>
            {/* <Avatar src={xrpLogo} className={'xrpLogo'} /> */}
            <Modal
              title="Generate a new wallet or recover from seed"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}>
              <TextArea
                rows={4}
                placeholder="Wallet seed/secret"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
              <div className="flex modal-action" style={{ paddingTop: '20px' }}>
                <Button
                  loading={accountState.isLoading}
                  type="primary"
                  onClick={importWallet}>
                  Import Wallet
                </Button>
              </div>
              <Divider plain>or</Divider>
              <div className="flex modal-action">
                <Button
                  loading={accountState.isLoading}
                  type="primary"
                  onClick={generateWallet}>
                  Generate New Wallet
                </Button>
              </div>
            </Modal>
          </>
        }></PageHeader>
      <Outlet />
    </div>
  );
};

export default Header;
