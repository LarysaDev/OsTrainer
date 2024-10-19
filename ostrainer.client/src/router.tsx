import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import Landing from "../src/Pages/Landing/Landing.tsx";
import { FcfsTrainer } from "./Pages/AlgorithmTrainerPage/FcfsTrainer.tsx";
import { SchedulingAlgorithmCards } from "./Pages/Student/DashboardLearn/SchedulingAlgorithmCards.tsx";
import { NewCourse } from "./Pages/Teacher/NewCource/NewCource.tsx";
import { RrTrainer } from "./Pages/AlgorithmTrainerPage/RrTrainer.tsx";
import { NonpreemptiveSjfTrainer } from "./Pages/AlgorithmTrainerPage/NonpreemptiveSjf.tsx";
import { PreemptiveSjfTrainer } from "./Pages/AlgorithmTrainerPage/PreemptiveSjf.tsx";
import { PreemptivePriorityTrainer } from "./Pages/AlgorithmTrainerPage/PreemptivePriorityTrainer.tsx";
import { NonpreemptivePriorityTrainer } from "./Pages/AlgorithmTrainerPage/NonpreemptivePriorityTrainer.tsx";

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
    path: "/practice/rr",
    element: <RrTrainer />,
  },
  {
    path: "/practice/preemptive_sjf",
    element: <PreemptiveSjfTrainer />,
  },
  {
    path: "/practice/nonpreemptive_sjf",
    element: <NonpreemptiveSjfTrainer />,
  },
  {
    path: "/practice/preemptive_priority",
    element: <PreemptivePriorityTrainer />,
  },
  {
    path: "/practice/nonpreemptive_priority",
    element: <NonpreemptivePriorityTrainer />,
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
