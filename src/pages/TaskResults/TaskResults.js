import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Alert } from 'antd';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get taskId from the URL

const TaskResults = () => {
  const { taskId } = useParams(); // Get taskId from URL parameters
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tasks/${taskId}/results`);
        setResults(response.data);
      } catch (err) {
        setError('There was an error fetching the results!');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [taskId]);

  const columns = [
    { title: 'Телеграм адресс юзера', dataIndex: 'userId', key: 'userId' },
    { title: 'Ответ текстом', dataIndex: 'responseText', key: 'responseText' },
    {
      title: 'Фото',
      dataIndex: 'photo',
      key: 'photo',
      render: (text) => text ? <img src={text} alt="User provided" style={{ width: 100 }} /> : 'No photo',
    },
    // { title: 'Создано', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  if (loading) {
    return <Spin tip="Loading results..." />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  return (
    <div>
      <Typography.Title level={3}>Результаты задания</Typography.Title>
      <Table
        dataSource={results}
        columns={columns}
        rowKey="_id"
      />
    </div>
  );
};

export default TaskResults;
