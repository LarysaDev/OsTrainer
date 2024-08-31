import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import Landing from "../src/Pages/Landing/Landing.tsx";
import { FcfsTrainer } from "./Pages/AlgorithmTrainerPage/FcfsTrainer.tsx";
import { SchedulingAlgorithmCards } from "./Pages/Student/DashboardLearn/SchedulingAlgorithmCards.tsx";
import { NewCourse } from "./Pages/Teacher/NewCource/NewCource.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
  {
    path: "/practice/fcfs",
    element: <FcfsTrainer />,
  },
  {
    path: "/scheduling",
    element: <SchedulingAlgorithmCards />,
  },
  {
    path: "/newCourse",
    element: <NewCourse />,
  }
]);

export default router;
