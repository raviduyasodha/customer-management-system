import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCustomers, deleteCustomer } from '../api/customerApi';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (error) {
      message.error('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      message.error('Failed to delete customer');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'DOB', dataIndex: 'dob', key: 'dob' },
    { title: 'NIC', dataIndex: 'nicNumber', key: 'nicNumber' },
    { title: 'Mobiles', dataIndex: 'mobiles', key: 'mobiles', render: (mobiles) => mobiles.length },
    { title: 'Addresses', dataIndex: 'addresses', key: 'addresses', render: (addresses) => addresses.length },
    { title: 'Family', dataIndex: 'familyMemberIds', key: 'familyMemberIds', render: (ids) => ids?.length || 0 },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/view/${record.id}`)}>View</Button>
          <Button icon={<EditOutlined />} onClick={() => navigate(`/edit/${record.id}`)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
        <Title level={1} style={{ margin: 0 }}>Customer Management</Title>
        <Space>
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/create')}>Create New</Button>
          <Button size="large" icon={<UploadOutlined />} onClick={() => navigate('/bulk')}>Bulk Upload</Button>
        </Space>
      </div>
      <Table 
        className="neon-card"
        columns={columns} 
        dataSource={customers} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default CustomerListPage;
