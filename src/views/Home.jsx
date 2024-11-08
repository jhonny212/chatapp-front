import React from 'react'
import { Layout } from '../layout/Layout'
import { NavBarLayout } from '../components/common/Navbar'
import { AuthProvider } from '../provider/AuthProvider'
import { Router, Routes } from 'react-router-dom'
import { CreatePost } from './CreatePost'

export const Home = () => {
  return <>
    <CreatePost />
  </>
}
