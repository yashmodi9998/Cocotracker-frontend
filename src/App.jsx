
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import User from './pages/User';
import ManageStock from './pages/ManageStock';
import Stocks from './pages/Stocks';
import ProtectedRoute from './components/ProtectedRoute';
import ManageReturnRequest from './pages/ManageReturnRequest';

function App() {
  return (
    <div className="page">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<ProtectedRoute element={<User />} requiredRole="admin" />} />
          <Route path="/manage-stock" element={<ProtectedRoute element={<ManageStock />} requiredRole="admin" />} />
          <Route path="/manage-return-requests" element={ <ProtectedRoute element={<ManageReturnRequest />} requiredRole="admin"  />}/>
       
          <Route path="/allocated-stock" element={<ProtectedRoute element={<Stocks />} requiredRole="kiosk owner" />} />
      
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
