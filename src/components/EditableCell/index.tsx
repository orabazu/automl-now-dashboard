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
          defaultValue={record?.type}
          style={{ width: 120 }}
          onChange={handleChange}>
          <Option value="id">Id</Option>
          <Option value="target">Target</Option>
          <Option value="factor">Factor</Option>
        </Select>
      ) : (
        <Select
          defaultValue={record?.role}
          style={{ width: 120 }}
          onChange={handleChange}>
          <Option value="text">Text</Option>
          <Option value="numeric">Numeric</Option>
        </Select>
      );
  } else {
    content = children;
  }
  return <td {...restProps}>{content}</td>;
};
