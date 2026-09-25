import React from 'react'
import LandingPage from './Pages/Landing'
import { Routes, Route } from 'react-router-dom'
import Login from './Pages/Login'
import { Toaster } from 'react-hot-toast'
import Dashboard from './Pages/Dashboard'
import ProtectedRoutes from './Components/ProtectedRoute'


const App = () => {
  return (
    <div>

      <Toaster />

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>


      </Routes>
      
    </div>
  )
}

export default App