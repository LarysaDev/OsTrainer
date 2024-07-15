import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import Landing from "../src/Pages/Landing/Landing.tsx";

import {StudentDashboard} from '../src/Pages/Student/Dashboard/Dashboard.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <StudentDashboard />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/landing",
    element: <Landing />,
  },
]);

export default router;
