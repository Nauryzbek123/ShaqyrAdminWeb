import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddTask = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState({ photos: [], videos: [] });

  // Обработчик для загрузки файлов
  const handleUploadChange = (type, { fileList: newFileList }) => {
    setFileList({ ...fileList, [type]: newFileList });
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    
    // Добавляем текстовые поля в FormData
    formData.append('title', values.title);
    formData.append('description', values.description);

    // Добавляем файлы в FormData
    fileList.photos.forEach(file => {
      formData.append('photos', file.originFileObj);
    });
    fileList.videos.forEach(file => {
      formData.append('videos', file.originFileObj);
    });

    try {
      const response = await axios.post('http://localhost:3000/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Task added successfully!');
      form.resetFields();
      setFileList({ photos: [], videos: [] });
    } catch (error) {
      console.error('There was an error adding the task!', error);
      message.error('Failed to add task!');
    }
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
      
      {/* Поля для загрузки фото */}
      <Form.Item label="Фото">
        <Upload
          multiple
          listType="picture"
          fileList={fileList.photos}
          onChange={(info) => handleUploadChange('photos', info)}
          beforeUpload={() => false} // Отключить авто-загрузку
        >
          <Button icon={<UploadOutlined />}>Загрузить фото</Button>
        </Upload>
      </Form.Item>

      {/* Поля для загрузки видео */}
      <Form.Item label="Видео">
        <Upload
          multiple
          fileList={fileList.videos}
          onChange={(info) => handleUploadChange('videos', info)}
          beforeUpload={() => false} // Отключить авто-загрузку
        >
          <Button icon={<UploadOutlined />}>Загрузить видео</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">Создать задачу</Button>
      </Form.Item>
    </Form>
  );
};

export default AddTask;

