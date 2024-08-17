
import { useNavigate } from "react-router-dom";
import { clearUser } from "../app/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

function LogoutLink(props: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
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
                    dispatch(clearUser());
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
            <a href="#" onClick={handleSubmit}>{props.children}</a>
        </>
    );
}

export default LogoutLink;