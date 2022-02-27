/* eslint-disable no-unused-vars */
import { InputNumber, Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import React from 'react';
import { TargetSelectionData } from 'views/Steps/TargetSelection';
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  handleChange: (value: string) => void;
  record: TargetSelectionData;
  selectorType: string;
  editable: boolean;
  children: React.ReactNode;
}

export enum DataType {
  Numeric = '100',
  Text = '200',
  Categorical = '300',
}

export const EditableCell: React.FC<EditableCellProps> = ({
  handleChange,
  record,
  selectorType,
  editable,
  children,
  ...restProps
}) => {
  let content;
  if (editable) {
    content =
      selectorType === 'role' ? (
        <Select
          defaultValue={record?.role}
          style={{ width: 120 }}
          onChange={handleChange}>
          <Option value="id">Id</Option>
          <Option value="target">Target</Option>
          <Option value="factor">Factor</Option>
        </Select>
      ) : (
        <Select
          defaultValue={record?.type.toString()}
          style={{ width: 120 }}
          onChange={handleChange}>
          <Option value={DataType.Text}>Text</Option>
          <Option value={DataType.Numeric}>Numeric</Option>
          <Option value={DataType.Categorical}>Categorical</Option>
        </Select>
      );
  } else {
    content = children;
  }
  return <td {...restProps}>{content}</td>;
};
