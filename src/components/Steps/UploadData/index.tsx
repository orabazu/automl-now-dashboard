import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import React from 'react';
const UploadData = () => {
  const { Dragger } = Upload;

  const onChange = (info: UploadChangeParam) => {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const onDrop = (e: any) => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  return (
    <Dragger
      name="file"
      multiple={true}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={onChange}
      onDrop={onDrop}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data
        or other band files
      </p>
    </Dragger>
  );
};

export default UploadData;
