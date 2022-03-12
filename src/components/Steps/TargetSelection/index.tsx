/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import './TargetSelection.scss';

import { SmileOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Select, Space, Table } from 'antd';
import Text from 'antd/lib/typography/Text';
import Advertisement from 'assets/advertisement.gif';
import {
  DataColumnType,
  DataType,
  EditableCell,
  RoleType,
} from 'components/EditableCell';
import { useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useMemo, useState } from 'react';
import { AccountActionTypes } from 'reducers/accountReducer';
import { HeadersType, RowType } from 'views/ReportGenerator';

type TargetSelectionProps = {
  data: RowType;
};

export type TargetSelectionData = {
  field: string;
  type: DataType;
  role: RoleType;
};

export const TargetSelection: React.FC<TargetSelectionProps> = ({ data }) => {
  const [rows, setRows] = useState<TargetSelectionData[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCalculated, setisCalculated] = useState(false);
  const [accountState, accountDispatch] = useAccountContext();

  const staticColumns = [
    {
      title: 'field',
      dataIndex: 'field',
      key: 'field',
      editable: false,
    },
    {
      title: 'type',
      dataIndex: DataColumnType.Type,
      key: 'type',
      editable: true,
    },
    {
      title: 'role',
      dataIndex: DataColumnType.Role,
      key: 'role',
      editable: true,
    },
  ];

  const columns = staticColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TargetSelectionData) => ({
        record,
        editable: col.editable,
        title: col.title,
        handleChange: handleChange,
        columnType: col.dataIndex,
        field: record.field,
        isTargetSelected,
      }),
    };
  });

  const handleChange = (
    value: DataType | RoleType,
    dataColumnType: keyof TargetSelectionData,
    field: string,
  ) => {
    const newRows = [...rows];
    const index = newRows.findIndex((item) => field === item.field);
    const newData = newRows[index];
    //@ts-ignore
    newData[dataColumnType] = value;
    newRows.splice(index, 1, newData);
    setRows(newRows);
  };

  useEffect(() => {
    const rows = [];
    const sampleData = data[0];
    for (const [key, value] of Object.entries(sampleData)) {
      if (typeof value === 'number') {
        rows.push({
          field: key,
          type: DataType.Numeric,
          role: RoleType.Attribute,
        });
      } else if (typeof value === 'string' && value.length < 6) {
        rows.push({
          field: key,
          type: DataType.Categorical,
          role: RoleType.Attribute,
        });
      } else {
        rows.push({
          field: key,
          type: DataType.Text,
          role: RoleType.Attribute,
        });
      }
    }
    setRows(rows);
  }, []);

  const [isTargetSelected, categoricalTarget] = useMemo(() => {
    let isTargetSelected = false;
    let categoricalTarget;
    rows.forEach((r) => {
      if (r.role === RoleType.Target) {
        isTargetSelected = true;
        if (r.type === DataType.Categorical) {
          categoricalTarget = r.field;
        }
      }
    });
    return [isTargetSelected, categoricalTarget];
  }, [rows]);

  const getRowClassName = (record: TargetSelectionData) => {
    switch (record.role) {
      case RoleType.Id:
        return 'IdBased';
      case RoleType.Target:
        return 'TargetBased';
      default:
        return '';
    }
  };

  const startCalculation = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
      setisCalculated(true);
      accountDispatch({
        type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
        payload: false,
      });
      notification.open({
        message: 'Calculations are done.',
        placement: 'bottomRight',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    }, 3000);
  };

  useEffect(() => {
    accountDispatch({
      type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
      payload: true,
    });
  }, []);

  return (
    <>
      <Table
        className="TargetSelection"
        size="small"
        dataSource={rows}
        columns={columns}
        rowKey={(record) => record.field}
        rowClassName={getRowClassName}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
      {categoricalTarget && (
        <Space direction="vertical">
          <Text>
            Select the target value of interest for <Text code>{categoricalTarget}</Text>:
          </Text>
          <Select style={{ width: 120 }}>
            <Select.Option value={1}>Iris-setosa</Select.Option>
            <Select.Option value={2}>Iris-versicolor</Select.Option>
            <Select.Option value={2}>Iris-virginica</Select.Option>
          </Select>
        </Space>
      )}

      <div className="flex">
        <Button onClick={startCalculation} className="btn-fancy">
          Start Calculation
        </Button>
      </div>

      <Modal
        centered
        visible={isModalVisible}
        footer={null}
        closable={false}
        // onOk={() => setIsModalVisible(false)}
        // onCancel={}
        width={780}>
        <p>Running machine learning calculations ...</p>
        <p>Sponsored by</p>
        <img src={Advertisement} />
      </Modal>
    </>
  );
};
