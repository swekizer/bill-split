import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateBill from './pages/CreateBill';
import BillSplit from './pages/BillSplit';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element= {<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element= {<CreateBill />} />
        <Route path="/bill/:uuid" element= {<BillSplit />}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App;