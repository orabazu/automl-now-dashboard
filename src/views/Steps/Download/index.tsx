import { Button, Descriptions, Space } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';

export const Download = () => {
  return (
    <>
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
      <Space
        style={{
          padding: '30px 0px 30px',
        }}>
        <Button type="primary">Great, I want to purchase full report.</Button>
        <Button>I need better results. Please delete my data.</Button>
      </Space>
    </>
  );
};
