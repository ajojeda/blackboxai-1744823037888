import { Routes, Route, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSignOutAlt, faTachometerAlt, faTicketAlt, faUsersCog, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">GoodieRun 2.0</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-gray-600">{user.firstName} {user.lastName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-500"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                <span className="ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen">
          <nav className="mt-5 px-2">
            <a href="/dashboard" className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-3 h-5 w-5" />
              Dashboard
            </a>
            <a href="/tickets" className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <FontAwesomeIcon icon={faTicketAlt} className="mr-3 h-5 w-5" />
              Tickets
            </a>
            <a href="/attendance" className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 h-5 w-5" />
              Attendance
            </a>
            {user.isTopLevelAdmin && (
              <a href="/admin" className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <FontAwesomeIcon icon={faUsersCog} className="mr-3 h-5 w-5" />
                Admin
              </a>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
=======
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
            <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h2>
                <div className="bg-white shadow rounded-lg p-6">
                  <p className="text-gray-600">Welcome to your dashboard, {user.firstName}!</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
