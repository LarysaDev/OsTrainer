import * as React from "react";
import LogoutLink from "../Components/LogoutLink.tsx";
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";

const TeacherPage: React.FC = () => {
    return (
        <AuthorizeView>
            <span><LogoutLink>Logout <AuthorizedUser value="email" /></LogoutLink></span>
            <h1>Welcome Teacher</h1>
        </AuthorizeView>
    );
};

export default TeacherPage;
