import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.less";
import { useDispatch } from 'react-redux';
import { setUser } from "../../app/userSlice";
import { AppDispatch } from "../../app/store";
import { User } from "../../app/types";

function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const handleUpdateUser = (userToUpdate: User) => {
    const newUser = {
      id: userToUpdate?.id,
      name: userToUpdate?.name,
      email: userToUpdate?.email,
    };
    
    dispatch(setUser(newUser));
  };

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "rememberme") setRememberme(e.target.checked);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else {
      setError("");

      var loginurl = "";
      if (rememberme == true) loginurl = "/api/Auth/login?useCookies=true";
      else loginurl = "/api/Auth/login?useSessionCookies=true";

      fetch(loginurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then((data) => {
          if (data.ok) {
            handleUpdateUser({email: email} as User);
            data.json().then((jsonData) => {
              const role = jsonData.role as string;
              console.log(role);
              localStorage.setItem("role", role);
              navigate("/home");
            });
          } else setError("Error Logging In.");
        })
        .catch((error) => {
          console.error(error);
          setError("Error Logging in.");
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3 className={styles.heading}>LOGIN FORM</h3>
        <div className={styles.buttonGroupFront}>
          <button className={styles.buttonFront} type="submit">
            LOGIN
          </button>
          <button
            className={styles.buttonFrontInactive}
            onClick={handleRegisterClick}
          >
            REGISTER
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div className={styles.checkboxGroup}>
            <input
              className={styles.checkbox}
              type="checkbox"
              id="rememberme"
              name="rememberme"
              checked={rememberme}
              onChange={handleChange}
            />
            <label className={styles.checkboxLabel} htmlFor="rememberme">
              Remember Me
            </label>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} type="submit">
              LOGIN
            </button>
          </div>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
