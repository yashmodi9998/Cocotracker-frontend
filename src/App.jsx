
import Header from './components/Header'
import Footer from './components/Footer'
import Register from './pages/Register'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import User from './pages/User'

function App() {

  return (
    <>
      <div className="page">
        
      <BrowserRouter>
        <Header/>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/user" element={<User/>}/>
        </Routes>
        <Footer/>
        </BrowserRouter>
        
      </div>
    </>
  )
}

export default App
