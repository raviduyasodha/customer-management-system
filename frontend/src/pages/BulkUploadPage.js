import React, { useState } from 'react';
import { Upload, Button, Card, message, Result, Space, Alert } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { bulkUpload } from '../api/customerApi';
import { useNavigate } from 'react-router-dom';

const BulkUploadPage = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (fileList.length === 0) return;
    
    setUploading(true);
    try {
      const response = await bulkUpload(fileList[0]);
      setResult(response.data);
      message.success('Upload completed');
    } catch (error) {
      message.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  if (result) {
    return (
      <div style={{ padding: '24px' }}>
        <Result
          status="success"
          title="Bulk Upload Processed"
          subTitle={`Records Created: ${result.success}, Failed: ${result.failed}`}
          extra={[
            <Button type="primary" key="home" onClick={() => navigate('/')}>
              Back to List
            </Button>,
            <Button key="again" onClick={() => setResult(null)}>
              Upload Another
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')} 
        style={{ marginBottom: '24px' }}
        ghost
      >
        Back to List
      </Button>
      
      <Card className="neon-card" title={<span style={{ fontSize: '24px' }}>Bulk Import Customers</span>}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Excel File Requirements"
            description={
              <div>
                <p>Please ensure your Excel file (.xlsx) follows this exact structure:</p>
                <ul style={{ paddingLeft: '20px' }}>
                  <li><b>Column 1:</b> Full Name</li>
                  <li><b>Column 2:</b> Date of Birth (Format: YYYY-MM-DD)</li>
                  <li><b>Column 3:</b> NIC Number (Must be unique)</li>
                </ul>
                <p><b>Example Row:</b></p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', border: '1px solid #d9d9d9', marginBottom: '16px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa' }}>
                      <th style={{ border: '1px solid #d9d9d9', padding: '4px' }}>Name</th>
                      <th style={{ border: '1px solid #d9d9d9', padding: '4px' }}>DOB</th>
                      <th style={{ border: '1px solid #d9d9d9', padding: '4px' }}>NIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #d9d9d9', padding: '4px' }}>John Doe</td>
                      <td style={{ border: '1px solid #d9d9d9', padding: '4px' }}>1990-01-15</td>
                      <td style={{ border: '1px solid #d9d9d9', padding: '4px' }}>901234567V</td>
                    </tr>
                  </tbody>
                </table>
                <Button type="link" href="/customer_template.xlsx" download icon={<UploadOutlined rotate={180} />}>
                  Download Sample Template
                </Button>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Upload {...props} accept=".xlsx">
            <Button icon={<UploadOutlined />}>Select Excel File</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
            block
          >
            {uploading ? 'Processing...' : 'Start Upload'}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default BulkUploadPage;
