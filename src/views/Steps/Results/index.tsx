/* eslint-disable react/display-name */
import './Results.scss';

import { Descriptions, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';

export const Results = () => {
  return (
    <>
      <div className="Regression">
        <Title level={3}>Regression Performance</Title>
        <Descriptions bordered>
          <Descriptions.Item label="MSE">...</Descriptions.Item>
          <Descriptions.Item label="RMSE">...</Descriptions.Item>
          <Descriptions.Item label="RMSE">...</Descriptions.Item>
          <Descriptions.Item label="MAE">...</Descriptions.Item>
          <Descriptions.Item label="MAE %">...</Descriptions.Item>
          <Descriptions.Item label="R^2">...</Descriptions.Item>
          <Descriptions.Item label="R^2 adjusted">...</Descriptions.Item>
        </Descriptions>
      </div>

      <Space>
        <Title level={3}>Classification Performance</Title>
      </Space>

      <div className="ant-table-wrapper Download">
        <table
          className="ant-table ant-table-small"
          style={{
            width: '100%',
          }}>
          <thead className="ant-table-thead">
            <tr className="ant-table-row ant-table-row-level-0">
              <th className="ant-table-cell"></th>
              <th className="ant-table-cell">Negative (-)</th>
              <th className="ant-table-cell">Positive (+)</th>
              <th className="ant-table-cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="ant-table-cell head-cell">Negative (-)</td>
              <td className="ant-table-cell positive">True (+) ___</td>
              <td className="ant-table-cell negative">False (-) ___</td>
              <td className="ant-table-cell">Specifity ___</td>
            </tr>
            <tr>
              <td className="ant-table-cell head-cell">Positive(+)</td>
              <td className="ant-table-cell negative">False (+) ___</td>
              <td className="ant-table-cell positive">True (+) ___</td>
              <td className="ant-table-cell">Recall ___</td>
            </tr>
            <tr>
              <td className="ant-table-cell last-head-cell"></td>
              <td className="ant-table-cell">F1 ___</td>
              <td className="ant-table-cell">MCC ___</td>
              <td className="ant-table-cell">Balanced ACC ___</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
