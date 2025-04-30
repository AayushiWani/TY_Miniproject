import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import ProtectedUserRoute from './components/shared/ProtectedUserRoute'
import Guidelines from './components/Guidelines'
import Tools from './components/Tools'
import GroupDirectory from './components/group/GroupDirectory';
import GroupChat from './components/group/GroupChat';
import Notifications from './components/Notifications'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/guidelines',
    element: <Guidelines />
  },
  {
    path: '/tools',
    element: <ProtectedUserRoute><Tools /></ProtectedUserRoute>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <ProtectedUserRoute><Jobs /></ProtectedUserRoute>
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/browse",
    element: <ProtectedUserRoute><Browse /></ProtectedUserRoute>
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: '/groups',
    element: <ProtectedUserRoute><GroupDirectory /></ProtectedUserRoute>
  },
  {
    path: '/groups/:id',
    element: <ProtectedUserRoute><GroupChat /></ProtectedUserRoute>
  },
  {
    path: '/notifications',
    element: <Notifications />
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute>
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute>
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute>
  },

])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
