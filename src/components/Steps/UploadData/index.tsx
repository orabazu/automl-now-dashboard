import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { useAccountContext } from 'contexts/accountContext';
import React, { useEffect, useState } from 'react';
import { AccountActionTypes } from 'reducers/accountReducer';
import * as XLSX from 'xlsx';
const { Dragger } = Upload;

type UploadDataProps = {
  // eslint-disable-next-line no-unused-vars
  onUpload: (e: [][]) => void;
};

const UploadData: React.FC<UploadDataProps> = ({ onUpload }) => {
  const [, accountDispatch] = useAccountContext();
  const [parsedData, setParsedData] = useState(false);

  useEffect(() => {
    if (parsedData) {
      accountDispatch({
        type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
        payload: false,
      });
    } else {
      accountDispatch({
        type: AccountActionTypes.SET_IS_NEXT_BUTTON_DISABLED,
        payload: true,
      });
    }
  }, [parsedData]);

  useEffect(() => {
    accountDispatch({
      type: AccountActionTypes.SET_NEXT_BUTTON_TOOLTIP_TEXT,
      payload: 'Please upload data first',
    });
  }, []);

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
      setParsedData(true);
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
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isExcel) {
      message.error(`${file.name} is not an excel file. Please upload an excel file`);
      return isExcel || Upload.LIST_IGNORE;
    } else {
      parseData(file);
    }
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
      <p className="ant-upload-text">
        Click or drag file to this area to upload (xlsx file)
      </p>
      <p className="ant-upload-hint">
        Upload a single xlsx file. Do not upload confidential data.
      </p>
    </Dragger>
  );
};

export default UploadData;
