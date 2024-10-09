import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Descriptions, Image, Popconfirm, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://91.243.71.220:3000/tasks');
        console.log('Tasks Response:', response.data);
        setTasks(response.data);
      } catch (error) {
        console.error('There was an error fetching the tasks!', error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://91.243.71.220:3000/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId)); 
      message.success('Задача успешно удалена!'); 
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Ошибка при удалении задачи!'); 
    }
  };

  const columns = [
    { title: 'Имя', dataIndex: 'title', key: 'title' },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
    {
      title: 'Действия',
      key: 'action',
      render: (text, record) => (
        <Button
        type="link"
        danger
        onClick={(e) => {
          e.stopPropagation(); 
          deleteTask(record._id); 
        }}
      >
        Удалить
      </Button>
      ),
    },
  ];

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

  const baseUrl = 'http://91.243.71.220:3000/'; // Adjust this base URL according to your server setup

  return (
    <>
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="_id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record), // Open modal with task details on row click
        })}
      />

      {selectedTask && (
        <Modal
          title={`Имя задачи: ${selectedTask.title}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Закрыть
            </Button>
          ]}
          width="100%"
          style={{ top: 0, margin: 0 }}
          bodyStyle={{ height: 'calc(100vh - 55px)', overflowY: 'auto' }} // Make the body of the modal scrollable if needed
          modalRender={modal => (
            <div style={{ height: '100vh', width: '100vw' }}>
              {modal}
            </div>
          )}
        >
          <Button style={{ marginBottom: '20px' }} key="viewResults">
            <Link to={`/tasks/${selectedTask._id}/results`}>Посмотреть результаты</Link>
          </Button>

          <Descriptions bordered layout="vertical">
            <Descriptions.Item label="Имя">{selectedTask.title}</Descriptions.Item>
            <Descriptions.Item label="Описание">{selectedTask.description}</Descriptions.Item>
            <Descriptions.Item label="Статус">{selectedTask.isAvailable ? "Available" : "Not Available"}</Descriptions.Item>
            <Descriptions.Item label="Время окончания задачи">
              {new Date(selectedTask.expirationDate).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Слоты">
              <ul>
                {selectedTask.slots.map((slot, index) => (
                  <li key={index}>
                    {`Время: ${new Date(slot.time).toLocaleString()}, Статус: ${slot.status || 'Не установлено'}, Забронировано: ${slot.bookedBy || 'Нет'}`}
                  </li>
                ))}
              </ul>
            </Descriptions.Item>
            <Descriptions.Item label="Фото">
              {selectedTask.photos && selectedTask.photos.length > 0 ? (
                <Image.PreviewGroup>
                  {selectedTask.photos.map((photo, index) => (
                    <img 
                      key={index} 
                      width={200} 
                      src={`${baseUrl}${photo}`} 
                      alt={`Фото задачи ${index + 1}`} 
                      onLoad={() => console.log(`Loaded: ${photo}`)}
                      onError={() => console.error(`Failed to load: ${photo}`)}
                    />
                  ))}
                </Image.PreviewGroup>
              ) : (
                'Нет фото'
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Видео">
              {selectedTask.videos && selectedTask.videos.length > 0 ? (
                selectedTask.videos.map((video, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <video 
                      width="200" 
                      controls 
                      onError={() => console.error(`Failed to load video: ${video}`)}
                    >
                      <source src={`${baseUrl}${video}`} type="video/mp4" />
                      Ваш браузер не поддерживает тег видео.
                    </video>
                  </div>
                ))
              ) : (
                'Нет видео'
              )}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </>
  );
};

export default TaskList;




