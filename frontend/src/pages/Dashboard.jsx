import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiList,
  FiSearch,
  FiCalendar,
  FiAlertCircle,
  FiEdit2,
  FiX
} from 'react-icons/fi'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [dueDate, setDueDate] = useState('')

  
  const [toasts, setToasts] = useState([])

  
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)
  const [isUpdatingTask, setIsUpdatingTask] = useState(false)

  
  const [filter, setFilter] = useState('All') 
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Newest') 

  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editTaskId, setEditTaskId] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPriority, setEditPriority] = useState('Medium')
  const [editDueDate, setEditDueDate] = useState('')
  const [editCompleted, setEditCompleted] = useState(false)

  const navigate = useNavigate()

  
  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    const fetchTasks = async () => {
      try {
        setIsLoadingTasks(true)
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.dispatchEvent(new Event('auth-change'))
          navigate('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await response.json()
        setTasks(data)
      } catch (err) {
        addToast(err.message, 'error')
      } finally {
        setIsLoadingTasks(false)
      }
    }

    fetchTasks()
  }, [navigate])

  
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      addToast('Task Title is required.', 'error')
      return
    }

    const token = localStorage.getItem('token')
    try {
      setIsSubmittingTask(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
          priority,
          dueDate: dueDate || null,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create task.')
      }

      setTasks([data, ...tasks])
      setNewTitle('')
      setNewDescription('')
      setPriority('Medium')
      setDueDate('')
      addToast('Task created successfully!', 'success')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsSubmittingTask(false)
    }
  }

  
  const handleToggleCompleted = async (task) => {
    const token = localStorage.getItem('token')
    try {
      const updatedStatus = !task.completed
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: updatedStatus }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task status.')
      }

      setTasks(tasks.map((t) => (t._id === task._id ? data : t)))
      addToast(`Task marked as ${updatedStatus ? 'completed' : 'pending'}.`, 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete task.')
      }

      setTasks(tasks.filter((t) => t._id !== id))
      addToast('Task deleted successfully.', 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  
  const handleDeleteAllCompleted = async () => {
    if (!window.confirm('Are you sure you want to delete all completed tasks?')) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks/completed`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete completed tasks.')
      }

      setTasks(tasks.filter((t) => !t.completed))
      addToast(`Cleared ${data.count || 0} completed tasks.`, 'success')
    } catch (err) {
      addToast(err.message, 'error')
    }
  }

  
  const openEditModal = (task) => {
    setEditTaskId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditPriority(task.priority)
    setEditDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
    setEditCompleted(task.completed)
    setIsEditModalOpen(true)
  }

  
  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!editTitle.trim()) {
      addToast('Task Title is required.', 'error')
      return
    }

    const token = localStorage.getItem('token')
    try {
      setIsUpdatingTask(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tasks/${editTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          priority: editPriority,
          dueDate: editDueDate || null,
          completed: editCompleted,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update task.')
      }

      setTasks(tasks.map((t) => (t._id === editTaskId ? data : t)))
      setIsEditModalOpen(false)
      addToast('Task updated successfully.', 'success')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setIsUpdatingTask(false)
    }
  }

  
  const isOverdue = (task) => {
    if (task.completed || !task.dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(task.dueDate)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate < today
  }

  
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasksCount = tasks.filter(isOverdue).length

  
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'Pending' && task.completed) return false
    if (filter === 'Completed' && !task.completed) return false

    const matchesTitle = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDesc = (task.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTitle || matchesDesc
  })

  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (sortBy === 'Oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
    if (sortBy === 'Priority') {
      const priorityWeight = { High: 3, Medium: 2, Low: 1 }
      return priorityWeight[b.priority] - priorityWeight[a.priority]
    }
    if (sortBy === 'DueDate') {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return 0
  })

  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-sm flex items-center justify-between gap-3 transition-all duration-300 transform translate-y-0 scale-100 bg-white ${
              toast.type === 'error'
                ? 'border-rose-100 text-rose-700 bg-rose-50/95 backdrop-blur-xs shadow-rose-100'
                : 'border-emerald-100 text-emerald-700 bg-emerald-50/95 backdrop-blur-xs shadow-emerald-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'error' ? (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              ) : (
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
              )}
              <span className="font-semibold">{toast.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
        <p className="text-gray-500 mt-1">Here is a real-time summary of your tasks.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalTasks}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FiList className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{completedTasks}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{pendingTasks}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FiClock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Overdue Tasks</p>
            <p className="text-3xl font-bold text-rose-600 mt-1">{overdueTasksCount}</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <FiAlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div id="tasks-section" className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Task Checklist</h2>
            {completedTasks > 0 && (
              <button
                onClick={handleDeleteAllCompleted}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Clear Completed ({completedTasks})
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex border border-gray-300 rounded-lg p-0.5 bg-gray-50/50 self-start sm:self-auto">
              {['All', 'Pending', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    filter === status
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-dropdown" className="text-xs font-medium text-gray-500 whitespace-nowrap">Sort:</label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Priority">Priority</option>
                <option value="DueDate">Due Date</option>
              </select>
            </div>
          </div>
          {isLoadingTasks ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                    <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">
                {tasks.length === 0
                  ? 'No tasks found. Create a new task to get started!'
                  : 'No tasks match your search or filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl transition-all duration-200 ${
                    task.completed
                      ? 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                      : isOverdue(task)
                      ? 'bg-rose-50/10 border-rose-100 hover:border-rose-200 hover:bg-rose-50/20'
                      : 'bg-white border-gray-100 hover:bg-gray-50/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleCompleted(task)}
                      className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-semibold truncate ${
                            task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            task.priority === 'High'
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-green-50 text-green-600 border border-green-100'
                          }`}
                        >
                          {task.priority}
                        </span>
                        {isOverdue(task) && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white flex items-center gap-0.5 animate-pulse">
                            <FiAlertCircle className="w-2.5 h-2.5" />
                            Overdue
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            task.completed ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-500">
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span className={isOverdue(task) ? 'text-rose-600 font-semibold' : ''}>
                            Due: {formatDate(task.dueDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0 self-end sm:self-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 pl-3 sm:pl-0">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit task"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter task name..."
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="task-description"
                rows="3"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description of the task..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div>
                <label htmlFor="task-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingTask}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isSubmittingTask ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Task Details</h2>
            
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Task title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows="3"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Task description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    id="edit-priority"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-due-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    id="edit-due-date"
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 py-2">
                <input
                  id="edit-completed"
                  type="checkbox"
                  checked={editCompleted}
                  onChange={(e) => setEditCompleted(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="edit-completed" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Mark as completed
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingTask}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdatingTask && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
