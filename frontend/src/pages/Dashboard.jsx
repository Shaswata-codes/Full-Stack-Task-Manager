import { useState, useEffect } from 'react'
import { FiPlus, FiTrash2, FiCheckCircle, FiClock, FiList } from 'react-icons/fi'

const Dashboard = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Define project requirements', completed: true, priority: 'High' },
    { id: 2, title: 'Design database schema', completed: false, priority: 'Medium' },
    { id: 3, title: 'Set up Vite + React frontend', completed: true, priority: 'Low' },
    { id: 4, title: 'Create authentication endpoints', completed: false, priority: 'High' },
  ])
  const [newTitle, setNewTitle] = useState('')
  const [priority, setPriority] = useState('Medium')

  // Smooth scroll to tasks section if URL contains the hash
  useEffect(() => {
    const scrollToSection = () => {
      if (window.location.hash === '#tasks-section') {
        const element = document.getElementById('tasks-section')
        if (element) {
          // Small timeout to ensure elements are fully layout-rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' })
          }, 50)
        }
      }
    }

    scrollToSection()

    window.addEventListener('hashchange', scrollToSection)
    return () => {
      window.removeEventListener('hashchange', scrollToSection)
    }
  }, [])

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      completed: false,
      priority,
    }
    setTasks([...tasks, newTask])
    setNewTitle('')
  }

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-500 mt-1">Here is a quick summary of your tasks for today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Tasks Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalTasks}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FiList className="w-6 h-6" />
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{completedTasks}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{pendingTasks}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FiClock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checklist */}
        <div id="tasks-section" className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Task Checklist</h2>
          
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No tasks available. Add some tasks to get started!</p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium ${
                        task.completed ? 'line-through text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-600'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-green-50 text-green-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete task"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter task name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
