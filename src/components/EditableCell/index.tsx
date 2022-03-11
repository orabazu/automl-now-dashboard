/* eslint-disable no-unused-vars */
import { InputNumber, Select } from 'antd';
import { TargetSelectionData } from 'components/Steps/TargetSelection';
import React from 'react';
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  handleChange: (
    value: DataType | RoleType,
    columnType: DataColumnType,
    field: string,
  ) => void;
  record: TargetSelectionData;
  columnType: DataColumnType;
  editable: boolean;
  field: string;
  children: React.ReactNode;
  isTargetSelected: boolean;
}

export enum DataType {
  Numeric = '100',
  Text = '200',
  Categorical = '300',
}

export enum RoleType {
  Id = '1',
  Target = '2',
  Attribute = '3',
}

export enum DataColumnType {
  Role = 'role',
  Type = 'type',
}

export const EditableCell: React.FC<EditableCellProps> = ({
  handleChange,
  record,
  columnType,
  editable,
  field,
  children,
  isTargetSelected,
  ...restProps
}) => {
  let content;
  if (editable) {
    content =
      columnType === 'role' ? (
        <Select
          defaultValue={record?.role}
          style={{ width: 120 }}
          onChange={(value) => handleChange(value, columnType, field)}>
          <Select.Option value={RoleType.Id}>Id</Select.Option>
          <Select.Option value={RoleType.Target} disabled={isTargetSelected}>
            Target
          </Select.Option>
          <Select.Option value={RoleType.Attribute}>Attribute</Select.Option>
        </Select>
      ) : (
        <Select
          defaultValue={record?.type}
          style={{ width: 120 }}
          onChange={(value) => handleChange(value, columnType, field)}>
          <Select.Option value={DataType.Numeric}>Numeric</Select.Option>
          <Select.Option value={DataType.Text}>Text</Select.Option>
          <Select.Option value={DataType.Categorical}>Categorical</Select.Option>
        </Select>
      );
  } else {
    content = children;
  }
  return <td {...restProps}>{content}</td>;
};
