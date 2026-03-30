import { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    try {
      const res = await api.post('/tasks', newTask);
      setTasks([res.data, ...tasks]);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="dashboard-header">
        <h2>Hello, <span style={{ color: 'var(--primary)' }}>{user?.name || 'User'}</span></h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          You have {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="add-task-panel glass-panel">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Create New Task</h3>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Task title..." 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              style={{ width: '100%', marginBottom: '0.5rem' }}
              required
            />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Description (optional)" 
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>Add</button>
        </form>
      </div>

      <div className="task-grid">
        {tasks.map(task => (
          <div key={task._id} className="task-card glass-panel">
            <div className="task-header">
              <div className="task-title">{task.title}</div>
              <span className={`task-status status-${task.status}`}>{task.status.replace('-', ' ')}</span>
            </div>
            <div className="task-desc">{task.description || 'No description provided.'}</div>
            <div className="task-actions">
              <select 
                className="form-control" 
                style={{ padding: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)' }}
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button 
                onClick={() => handleDeleteTask(task._id)} 
                className="btn btn-danger" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
