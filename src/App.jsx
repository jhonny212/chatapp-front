import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from 'flowbite-react'
import { NavBarLayout } from './components/common/Navbar'
import { Layout } from './layout/Layout'
import { Login } from './views/Login'
import { Register } from './views/Register'
import { Home } from './views/Home'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './provider/AuthProvider'
import PrivateRoute from './router/PrivateRoute'
import { AddFriends } from './views/AddFriends'
import { FriendRequest } from './views/FriendRequest'
import { Post } from './views/Post'
import { ChatApp } from './views/ChatApp'
import { EditProfile } from './views/EditProfile'
import { Friends } from './views/Friends'


function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/home" element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />

            <Route
              path="/amigos/buscar" element={
                <PrivateRoute>
                  <AddFriends />
                </PrivateRoute>
              }
            />

            <Route
              path="/amigos/solicitudes" element={
                <PrivateRoute>
                  <FriendRequest />
                </PrivateRoute>
              }
            />

            <Route
              path="/post/:id" element={
                <PrivateRoute>
                  <Post />
                </PrivateRoute>
              }
            />

            <Route
              path="/chat" element={
                <PrivateRoute>
                  <ChatApp />
                </PrivateRoute>
              }
            />

            <Route
              path="/perfil" element={
                <PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/amigos" element={
                <PrivateRoute>
                  <Friends />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
