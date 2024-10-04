import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';

const AddTask = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    axios.post('http://localhost:3000/tasks', values)
      .then(response => {
        alert('Task added successfully!');
        form.resetFields();
      })
      .catch(error => {
        console.error('There was an error adding the task!', error);
      });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item name="title" label="Имя задачи" rules={[{ required: true, message: 'Please enter the task title!' }]}>
        <Input placeholder="Введите имя задачи" />
      </Form.Item>
      <Form.Item name="description" label="Подробности задачи" rules={[{ required: true, message: 'Please enter the task description!' }]}>
        <Input.TextArea rows={4} placeholder="Введите подробности задачи" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Создать задачу</Button>
      </Form.Item>
    </Form>
  );
};

export default AddTask;
