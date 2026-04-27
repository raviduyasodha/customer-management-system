import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, message, Space, Divider, List, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, PhoneOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { getCustomer } from '../api/customerApi';
import { useNavigate, useParams } from 'react-router-dom';

const CustomerViewPage = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getCustomer(id)
      .then(res => setCustomer(res.data))
      .catch(() => message.error('Failed to load customer details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!customer) return <div style={{ padding: '40px', textAlign: 'center' }}>Customer not found</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')} 
        style={{ marginBottom: '24px' }}
        ghost
      >
        Back to List
      </Button>

      <Card 
        className="neon-card"
        title={
          <Space>
            <UserOutlined />
            <span>Customer Profile Detail</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/edit/${customer.id}`)}>
            Edit Profile
          </Button>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Full Name" span={2}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1677ff' }}>{customer.name}</span>
          </Descriptions.Item>
          <Descriptions.Item label="NIC Number">{customer.nicNumber}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">{customer.dob}</Descriptions.Item>
        </Descriptions>

        <Divider orientation="left"><PhoneOutlined /> Contact Numbers</Divider>
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={customer.mobiles}
          renderItem={item => (
            <List.Item>
              <Card size="small" className="address-box">
                <Tag color="blue">{item}</Tag>
              </Card>
            </List.Item>
          )}
        />

        <Divider orientation="left"><HomeOutlined /> Registered Addresses</Divider>
        <List
          dataSource={customer.addresses}
          renderItem={item => (
            <List.Item>
              <Card size="small" className="address-box" style={{ width: '100%' }}>
                <div>{item.addressLine1}</div>
                <div>{item.addressLine2}</div>
                <div style={{ marginTop: '8px' }}>
                  <Tag color="cyan">City: {item.cityName || 'Unknown'}</Tag>
                  <Tag color="geekblue">Country: {item.countryName || 'Not Linked'}</Tag>
                </div>
              </Card>
            </List.Item>
          )}
        />

        <Divider orientation="left"><TeamOutlined /> Family Members</Divider>
        {customer.familyMemberIds?.length > 0 ? (
          <Space wrap>
            {customer.familyMemberIds.map(fid => (
              <Button key={fid} type="dashed" onClick={() => navigate(`/view/${fid}`)}>
                View Relative (ID: {fid})
              </Button>
            ))}
          </Space>
        ) : (
          <div style={{ color: 'rgba(255,255,255,0.45)' }}>No family members linked</div>
        )}
      </Card>
    </div>
  );
};

export default CustomerViewPage;
