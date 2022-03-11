import { Button, PageHeader } from 'antd';
import Logo from 'assets/logo.png';
import { DataOverview } from 'components/Steps/DataOverview';
import { Download } from 'components/Steps/Download';
import { TargetSelection } from 'components/Steps/TargetSelection';
import UploadData from 'components/Steps/UploadData';
import WelcomeStep from 'components/Steps/WelcomeStep';
import { Wizard } from 'components/Wizard';
import { connectWallet, useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useState } from 'react';
import { AccountActionTypes } from 'reducers/accountReducer';
import { formatAccount } from 'utils/common';

export type RowType = { [k: string]: any }[];
export type HeadersType =
  | {
      title: string;
      dataIndex: string;
      key: string;
    }[]
  | undefined;

const Main = () => {
  const [accountState, accountDispatch] = useAccountContext();
  const [data, setData] = useState<RowType>([]);
  const [headers, setHeaders] = useState<HeadersType>([]);

  const handleUpload = (parsedData: [][]) => {
    const keys = parsedData[0];
    const mappedData = parsedData.map((data) => {
      let objectMap = {};
      keys.forEach((element: string, i) => {
        objectMap = {
          ...objectMap,
          [element]: data[i],
        };
      });
      return objectMap;
    });

    const headers = mappedData.shift();
    const headersFormatted =
      headers &&
      Object.keys(headers).map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
      }));
    setData(mappedData);
    setHeaders(headersFormatted);
  };

  const steps = [
    {
      title: 'Connect Wallet',
      content: <WelcomeStep />,
    },
    {
      title: 'Upload Data',
      content: <UploadData onUpload={handleUpload} />,
    },
    {
      title: 'See Data',
      content: <DataOverview data={data} headers={headers} />,
    },
    {
      title: 'Select Data Type',
      content: <TargetSelection data={data} />,
    },
    {
      title: 'Results',
      content: <Download />,
    },
    {
      title: 'Download',
      content: <Download />,
    },
  ];

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
    <>
      <PageHeader
        ghost={false}
        avatar={{
          src: Logo,
        }}
        title="AutoMLNow"
        subTitle="Automate your ML, get your results as NFT"
        extra={
          <Button
            loading={accountState.isLoading}
            type="primary"
            onClick={() =>
              accountState.account?.address ? undefined : connectWallet(accountDispatch)
            }>
            {formatAccount(accountState.account?.address) || 'Connect Wallet'}
          </Button>
        }></PageHeader>
      <div className="body">
        <Wizard
          steps={steps}
          isNextDisabled={accountState.isNextButtonDisabled}
          tooltipText={accountState.nextButtonTooltipText}
        />
      </div>
    </>
  );
};

export default Main;
