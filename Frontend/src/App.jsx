import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Register from './pages/Register';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateBill from './pages/CreateBill';
import BillSplit from './pages/BillSplit';

// Helper component to protect routes
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Helper component to redirect root path
function RootRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateBill />
              </ProtectedRoute>
            } 
          />
          <Route path="/bill/:uuid" element={<BillSplit />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;