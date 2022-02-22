import { Radio, RadioChangeEvent, Space } from 'antd';
import React, { useState } from 'react';

export const TimeSpan = () => {
  const [timeSpan, setTimeSpan] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    setTimeSpan(Number(e.target.value));
  };
  return (
    <Radio.Group onChange={onChange} value={timeSpan}>
      <Space direction="vertical">
        <Radio value={1}>~ 1 min</Radio>
        <Radio value={2}>~ 5 min</Radio>
        <Radio value={3}>~ 20 min</Radio>
        <Radio value={4}>~ 2 hours</Radio>
        <Radio value={5}>~ 6 hours</Radio>
        <Radio value={6}>~ 12 hours</Radio>
        <Radio value={7}>~ 24 hours</Radio>
        <Radio value={8}>Take all the time you want</Radio>
      </Space>
    </Radio.Group>
  );
};
