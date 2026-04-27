import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Space, Divider, message, Select, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { getCustomers, createCustomer, getCustomer, updateCustomer } from '../api/customerApi';

const CustomerFormPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);

  useEffect(() => {
    getCustomers()
      .then(res => setAllCustomers(res.data))
      .catch(() => message.error('Failed to load customers list'));
  }, []);
  useEffect(() => {
    if (id) {
      setLoading(true);
      getCustomer(id)
        .then(response => {
          const data = response.data;
          form.setFieldsValue({
            ...data,
            dob: dayjs(data.dob),
            mobiles: data.mobiles.map(m => ({ mobile: m })),
            addresses: data.addresses,
          });
        })
        .catch(() => message.error('Failed to load customer'))
        .finally(() => setLoading(false));
    }
  }, [id, form]);

  const onFinish = async (values) => {
    const payload = {
      ...values,
      dob: values.dob.format('YYYY-MM-DD'),
      mobiles: values.mobiles?.map(m => m.mobile) || [],
      addresses: values.addresses || [],
      familyMemberIds: values.familyMemberIds || [],
    };

    try {
      if (id) {
        await updateCustomer(id, payload);
        message.success('Customer updated successfully');
      } else {
        await createCustomer(payload);
        message.success('Customer created successfully');
      }
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/')} 
        style={{ marginBottom: '24px' }}
        ghost
      >
        Back to List
      </Button>
      
      <Card className="neon-card" title={<span style={{ fontSize: '24px' }}>{id ? 'Update Customer Profile' : 'Register New Customer'}</span>}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ mobiles: [{}], addresses: [{}] }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} size="large" />
            </Form.Item>
          </div>
          
          <Form.Item name="nicNumber" label="NIC Number" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>


        <Divider orientation="left">Mobile Numbers</Divider>
        <Form.List name="mobiles">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'mobile']}
                    rules={[
                      { required: true, message: 'Missing mobile number' },
                      { pattern: /^\d+$/, message: 'Please input only numbers' }
                    ]}
                  >
                    <Input placeholder="Mobile Number" maxLength={15} />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Mobile
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Addresses</Divider>
        <Form.List name="addresses">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} className="address-box">
                  <Form.Item {...restField} name={[name, 'addressLine1']} label="Address Line 1" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item {...restField} name={[name, 'addressLine2']} label="Address Line 2">
                    <Input />
                  </Form.Item>
                  <Space>
                    <Form.Item {...restField} name={[name, 'cityId']} label="City ID" rules={[{ required: true }]}>
                      <Input type="number" placeholder="1 for Colombo" />
                    </Form.Item>
                  </Space>
                  <Button type="link" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                    Remove Address
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Address
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Divider orientation="left">Family Members</Divider>
        <Form.Item name="familyMemberIds" label="Select Family Members">
          <Select
            mode="multiple"
            placeholder="Select other customers"
            style={{ width: '100%' }}
            optionFilterProp="children"
          >
            {allCustomers
              .filter(c => c.id !== Number(id))
              .map(c => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name} ({c.nicNumber})
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </div>
);
};

export default CustomerFormPage;
