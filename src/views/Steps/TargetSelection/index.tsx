/* eslint-disable no-unused-vars */
import { Table } from 'antd';
import mockData from 'assets/mockData.json';
import {
  DataColumnType,
  DataType,
  EditableCell,
  RoleType,
} from 'components/EditableCell';
import React, { useEffect, useMemo, useState } from 'react';

export type TargetSelectionData = {
  field: string;
  type: DataType;
  role: RoleType;
};

export const TargetSelection = () => {
  const [rows, setRows] = useState<TargetSelectionData[]>([]);

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
    const sampleData = mockData[0];
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

  console.log(rows);
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
