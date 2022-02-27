/* eslint-disable no-unused-vars */
import { Table } from 'antd';
import { DataType, EditableCell } from 'components/EditableCell';
import React from 'react';

export type TargetSelectionData = {
  field: string;
  type: DataType;
  role: string;
};

export const TargetSelection = () => {
  const staticColumns = [
    {
      title: 'field',
      dataIndex: 'field',
      key: 'field',
      editable: false,
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      editable: true,
    },
    {
      title: 'role',
      dataIndex: 'role',
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
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
        selectorType: col.dataIndex,
      }),
    };
  });

  const handleSave = (e: any) => {
    console.log(e);
  };

  const rows = [
    {
      field: 'restaurantId',
      type: DataType.Text,
      role: 'id',
    },
    {
      field: 'satisfactionfield',
      type: DataType.Text,
      role: 'id',
    },
    {
      field: 'receptionfield',
      type: DataType.Text,
      role: 'id',
    },
    {
      field: 'servicefield ',
      type: DataType.Numeric,
      role: 'id',
    },
    {
      field: 'waitingTimefield ',
      type: DataType.Text,
      role: 'id',
    },
    {
      field: 'foodQualityfield ',
      type: DataType.Categorical,
      role: 'id',
    },
  ];

  return (
    <Table
      size="small"
      dataSource={rows}
      columns={columns}
      rowKey={(record) => record.field}
      components={{
        body: {
          cell: EditableCell,
        },
      }}
    />
  );
};
