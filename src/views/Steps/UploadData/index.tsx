import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import React from 'react';
import * as XLSX from 'xlsx';
const { Dragger } = Upload;

type UploadDataProps = {
  // eslint-disable-next-line no-unused-vars
  onUpload: (e: [][]) => void;
};

const UploadData: React.FC<UploadDataProps> = ({ onUpload }) => {
  const parseData = (file: Blob) => {
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target?.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      /* Convert array to json*/
      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as [][];
      console.log(parsedData);
      onUpload(parsedData);
    };
    reader.readAsBinaryString(file as Blob);
  };

  const onChange = (info: UploadChangeParam) => {
    console.log(info);
    // parseData(info.file.originFileObj as Blob);
    // const { status } = info.file;
    // if (status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    //   const wb = XLSX.read(info.file.originFileObj, { type: 'binary' });
    //   const wsname = wb.SheetNames[0];
    //   const ws = wb.Sheets[wsname];
    //   const data = XLSX.utils.sheet_to_json(ws);
    //   console.log(data);
    // }
    // if (status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  };
  const onDrop = (e: any) => {
    console.log('Dropped files', e.dataTransfer.files);
  };

  const handleBeforeUpload = (file: RcFile) => {
    parseData(file);
  };

  return (
    <Dragger
      name="file"
      multiple={false}
      beforeUpload={handleBeforeUpload}
      // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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
