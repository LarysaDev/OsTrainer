import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login.tsx";
import Register from "./Pages/Register/Register.tsx";
import Landing from "../src/Pages/Landing/Landing.tsx";
import { FcfsTrainer } from "./Pages/AlgorithmTrainerPage/Scheduling/FcfsTrainer.tsx";
import { SchedulingAlgorithmCards } from "./Pages/Student/DashboardLearn/SchedulingAlgorithmCards.tsx";
import { PageReplacementAlgorithmCards } from "./Pages/Student/DashboardLearn/PageReplacementCards.tsx";
import { NewCourse } from "./Pages/Teacher/NewCource/NewCource.tsx";
import { RrTrainer } from "./Pages/AlgorithmTrainerPage/Scheduling/RrTrainer.tsx";
import { NonpreemptiveSjfTrainer } from "./Pages/AlgorithmTrainerPage/Scheduling/NonpreemptiveSjf.tsx";
import { PreemptiveSjfTrainer } from "./Pages/AlgorithmTrainerPage/Scheduling/PreemptiveSjf.tsx";
import { PreemptivePriorityTrainer } from "./Pages/AlgorithmTrainerPage/Scheduling/PreemptivePriorityTrainer.tsx";
import { NonpreemptivePriorityTrainer } from "./Pages/AlgorithmTrainerPage/Scheduling/NonpreemptivePriorityTrainer.tsx";
import SelfTest from "./Pages/Student/DashboardLearn/SelfTesting.tsx";
import { LruTrainer } from "./Pages/AlgorithmTrainerPage/PR/LruTrainer.tsx";
import { FifoTrainer } from "./Pages/AlgorithmTrainerPage/PR/FifoTrainer.tsx";
import { AvoidDeadlocksAlgorithmCards } from "./Pages/Student/DashboardLearn/DeadlocksAvoidanceCards.tsx";
import { PageReplacementTrainer } from './Pages/AlgorithmTrainerPage/PR/PageReplacement.Trainer.tsx';
import { ResourceAllocationTrainer } from "./Pages/AlgorithmTrainerPage/DeadlocksAvoidance/ResourceAllocationTrainer.tsx";
import BankersAlgorithmTrainer from "./Pages/AlgorithmTrainerPage/DeadlocksAvoidance/BankirTrainer.tsx";
import LandingPage from "../src/Pages/Landing/Landing.tsx";
import { AvailableSimulators } from "./Pages/Teacher/AvailableSimulators/AvailableSimulators.tsx";

const isLoggedIn = !!localStorage.getItem("accessToken") || !!localStorage.getItem("refreshToken");

const router = createBrowserRouter([
  {
    path: "/",
    element: isLoggedIn ? <Navigate to="/home" /> : <LandingPage />,
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
    path: "/available_simulators",
    element: <AvailableSimulators />,
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
    path: "/practice/fifo",
    element: <FifoTrainer />,
  },
  {
    path: "/scheduling",
    element: <SchedulingAlgorithmCards />,
  },
  {
    path: "/page-replacement",
    element: <PageReplacementAlgorithmCards />,
  },
  {
    path: "/newCourse",
    element: <NewCourse />,
  },
  {
    path: "/test/:algorithmId",
    element: <SelfTest />,
  },
  {
    path: "/practice/lru/:isStack",
    element: <LruTrainer />,
  },
  {
    path: "/practice/page-replacement/:algorithm",
    element: <PageReplacementTrainer />,
  },
  {
    path: "/avoid-deadlocks",
    element: <AvoidDeadlocksAlgorithmCards />,
  },
  {
    path: "/practice/avoid-deadlocks/graph",
    element: <ResourceAllocationTrainer />,
  },
  {
    path: "/practice/avoid-deadlock/bankir",
    element: <BankersAlgorithmTrainer />,
  }
]);

export default router;
