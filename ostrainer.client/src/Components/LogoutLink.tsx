
import { useNavigate } from "react-router-dom";

function LogoutLink(props: { children: React.ReactNode }) {
    const navigate = useNavigate();


    const handleSubmit = (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");

        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + accessToken
            },
            body: ""

        })
            .then((data) => {
                if (data.ok) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("os_trainer_role");

                    navigate("/login");
                }
                else { 
                    console.log("Error while logging out");
                }


            })
            .catch((error) => {
                console.error(error);
            })

    };

    return (
        <>
            <a style={{ textDecoration: "none", color: "#9a9a9a" }} href="#" onClick={handleSubmit}>{props.children}</a>
        </>
    );
}

export default LogoutLink;