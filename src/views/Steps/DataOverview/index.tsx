import { Table, TablePaginationConfig } from 'antd';
import Title from 'antd/lib/typography/Title';
import mockData from 'assets/mockData.json';
import React, { useState } from 'react';

export const DataOverview = () => {
  const defaultPagination: TablePaginationConfig = {
    current: 1,
    pageSize: 5,
    total: mockData.length,
  };
  const [pagination, setPagination] = useState(defaultPagination);

  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  const columns = [
    {
      title: 'restaurantId',
      dataIndex: 'restaurantId',
      key: 'restaurantId',
    },
    {
      title: 'satisfaction',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
    },
    {
      title: 'reception',
      dataIndex: 'reception',
      key: 'reception',
    },
    {
      title: 'service',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'waitingTime',
      dataIndex: 'waitingTime',
      key: 'waitingTime',
    },
    {
      title: 'foodQuality',
      dataIndex: 'foodQuality',
      key: 'foodQuality',
    },
  ];

  return (
    <>
      {!loading && <Title level={3}>Successfully read. Here is your data</Title>}
      <Table
        dataSource={mockData}
        columns={columns}
        pagination={pagination}
        rowKey={(record) => record.restaurantId}
        onChange={(e: TablePaginationConfig) => setPagination(e)}
        loading={loading}
      />
    </>
  );
};
