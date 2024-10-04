import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Descriptions } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks from the API
  useEffect(() => {
    axios.get('http://localhost:3000/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the tasks!', error);
      });
  }, []);

  const columns = [
    { title: 'Имя', dataIndex: 'title', key: 'title' },
    { title: 'Описание', dataIndex: 'description', key: 'description' },
  ];

  const handleRowClick = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTask(null);
  };

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
          title={
            `Имя задачи: ${selectedTask.title}`
            }
           
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              Close
            </Button>
            
          ]}
          width="100%" // Set width to 100%
          style={{ top: 0, margin: 0 }} // Position modal to top-left
          bodyStyle={{ height: 'calc(100vh - 55px)', overflowY: 'auto' }} // Make the body of the modal scrollable if needed
          modalRender={modal => (
            <div style={{ height: '100vh', width: '100vw' }}>
              {modal}
            </div>
          )}
        >
        <Button style={{marginBottom: '20px'}} key="viewResults">
  <Link to={`/tasks/${selectedTask._id}/results`}>Посмотреть результаты</Link>
</Button>

          <Descriptions bordered layout="vertical">
          
            <Descriptions.Item label="Имя">{selectedTask.title}</Descriptions.Item>
            <Descriptions.Item label="Описание">{selectedTask.description}</Descriptions.Item>
            <Descriptions.Item label="Статус">{selectedTask.isAvailable ? "Available" : "Not Available"}</Descriptions.Item>
            <Descriptions.Item label="Время окончание задачи">
              {new Date(selectedTask.expirationDate).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Слоты">
              <ul>
                {selectedTask.slots.map((slot, index) => (
                  <li key={index}>
                    {`Time: ${new Date(slot.time).toLocaleString()}, Status: ${slot.status || 'Not Set'}, Booked By: ${slot.bookedBy || 'None'}`}
                  </li>
                ))}
              </ul>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </>
  );
};

export default TaskList;

