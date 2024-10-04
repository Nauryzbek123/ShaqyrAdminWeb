import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import TaskList from './pages/TaskList/TaskList';
import AddTask from './pages/AddTask/AddTask';
import TaskResults from './pages/TaskResults/TaskResults'; // Adjust the path as necessary


const App = () => (
  <Router>
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/tasks/:taskId/results" element={<TaskResults />} />
        </Routes>
    </DashboardLayout>
  </Router>
);

export default App;

