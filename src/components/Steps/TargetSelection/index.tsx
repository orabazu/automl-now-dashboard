import { Table } from 'antd';
import { EditableCell } from 'components/EditableCell';
import React from 'react';

export type TargetSelectionData = {
  field: string;
  type: string;
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
      type: 'text',
      role: 'id',
    },
    {
      field: 'satisfactionfield',
      type: 'text',
      role: 'id',
    },
    {
      field: 'receptionfield',
      type: 'text',
      role: 'id',
    },
    {
      field: 'servicefield ',
      type: 'text',
      role: 'id',
    },
    {
      field: 'waitingTimefield ',
      type: 'text',
      role: 'id',
    },
    {
      field: 'foodQualityfield ',
      type: 'text',
      role: 'id',
    },
  ];

  return (
    <Table
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
