
import { useNavigate } from "react-router-dom";

function LogoutLink(props: { children: React.ReactNode }) {
    const navigate = useNavigate();


    const handleSubmit = (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
                else { }


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