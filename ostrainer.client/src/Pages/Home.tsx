import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboard from './TeacherHome';
import StudentDashboard from './StudentHome';

const Home: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (!userRole) {
            navigate('/login');
        } else {
            setRole(userRole);
        }
    }, [navigate]);

    if (!role) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {role === 'Teacher' && <TeacherDashboard />}
            {role === 'Student' && <StudentDashboard />}
        </div>
    );
};

export default Home;
