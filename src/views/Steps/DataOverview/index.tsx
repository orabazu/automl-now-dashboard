import { Table, TablePaginationConfig } from 'antd';
import Title from 'antd/lib/typography/Title';
// import mockData from 'assets/mockData.json';
import React, { useState } from 'react';
import { HeadersType, RowType } from 'views/Main';

type DataOverviewProps = {
  data: RowType;
  headers: HeadersType;
};

export const DataOverview: React.FC<DataOverviewProps> = ({ data, headers }) => {
  const defaultPagination: TablePaginationConfig = {
    current: 1,
    pageSize: 5,
    total: data?.length,
  };
  const [pagination, setPagination] = useState(defaultPagination);

  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <>
      {!loading && <Title level={3}>Successfully read. Here is your data</Title>}
      <Table
        dataSource={data}
        columns={headers}
        pagination={pagination}
        rowKey={(record) => record.restaurantId}
        onChange={(e: TablePaginationConfig) => setPagination(e)}
        loading={loading}
      />
    </>
  );
};
