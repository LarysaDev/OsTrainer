import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeacherDashboard } from "./Teacher/Dashboard/TeacherDashboard";
import { StudentDashboard } from "../Pages/Student/Dashboard/Dashboard";
import AuthorizeView from "../Components/AuthorizeView";
import { selectUser } from "../app/userSlice";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector(selectUser);

  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('here')

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setRole(user?.role ?? "");
    }
  }, [user, navigate]);

  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {role === "Teacher" ? (
        <TeacherDashboard />
      ) : role === "Student" ? (
        <StudentDashboard />
      ) : (
        <AuthorizeView>Invalid Role</AuthorizeView>
      )}
    </>
  );
}

export default Home;
