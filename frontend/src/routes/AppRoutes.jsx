import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Navigate } from "react-router-dom"

import React from 'react'
import HomePage from "../pages/HomePage"
import Login from "../pages/Login"
import SignUp from "../pages/SignUp"
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react"
import { checkAuth } from "../slice/auth.slice"
import AdminPanel from "../components/CreateAdmin"
import CodeEditor from "../pages/CodeEditer"
import Admin from "../pages/AdminPage"
import CreateAdmin from "../components/CreateAdmin"
import UpdateAdmin from "../components/UpdateAdmin"
import DeleteAdmin from "../components/DeleteAdmin"
import VideoAdmin from "../components/VideoAdmin"
import VideoUploadAdmin from "../components/VideoUploadAdmin"

function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return (
    <Router>
      <Routes>

        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/signup" />} > </Route>

        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} ></Route>

        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} ></Route>
        <Route path="/adminPanel" element=
          {
            isAuthenticated && user.role === "admin" ?
              <AdminPanel /> :
              <Navigate to='/' />
          }  ></Route>

        <Route path="/problem/:problemId" element={isAuthenticated ? <CodeEditor /> : <Navigate to="/" />}></Route>
        <Route path="/admin" element={isAuthenticated && user.role === "admin" ? <Admin /> : <Navigate to="/" />}></Route>
        <Route path="/admin/create" element={isAuthenticated && user.role === "admin" ? <CreateAdmin /> : <Navigate to="/" />}></Route>
        <Route path="/admin/update" element={isAuthenticated && user.role === "admin" ? <UpdateAdmin /> : <Navigate to="/" />}></Route>
        <Route path="/admin/delete" element={isAuthenticated && user.role === "admin" ? <DeleteAdmin /> : <Navigate to="/" />}></Route>
        <Route path="/admin/update/:id" element={isAuthenticated && user.role === "admin" ? <CreateAdmin /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user.role === "admin" ? <VideoAdmin /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user.role === "admin" ? <VideoUploadAdmin /> : <Navigate to="/" />} />

      </Routes>
    </Router>
  )
}

export default AppRoutes