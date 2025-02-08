import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.less";
import {
  useRegisterMutation,
  useLoginWithGoogleMutation,
} from "../../app/authApi";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [loginWithGoogle] = useLoginWithGoogleMutation();

  const [error, setError] = useState("");

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "name") setUserName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      const result = register({ email, password, role, userName })
        .unwrap()
        .then((data) => {
          console.log(data);
          if (data) setError("Successful register.");
          else setError("Error registering.");
        })
        .catch((error) => {
          console.error(error);
          setError("Error registering.");
        });
    }
  };

  const handleGoogleResponse = async (response: any) => {
    const idToken: string = response.credential;
    console.log(role)
    const user = await loginWithGoogle({
      provider: "Google",
      idToken,
      role,
    }).unwrap();

    console.log("Google user authorized:", user);

    localStorage.setItem("os_trainer_role", user.role);
    localStorage.setItem("accessToken", user.token);
    localStorage.setItem("refreshToken", user.refreshToken);
    navigate("/home");
  };

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id:
        "761148932094-2aog6ek6prnuu76jsk5cbrqefkt8u6cf.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3 className={styles.heading}>РЕЄСТРАЦІЯ</h3>
        <div className={styles.buttonGroupFront}>
          <button className={styles.buttonFront} type="submit">
            ЗАРЕЄСТРУВАТИСЯ
          </button>
          <button
            className={styles.buttonFrontInactive}
            onClick={handleLoginClick}
          >
            УВІЙТИ
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="name"
              id="name"
              name="name"
              value={userName}
              onChange={handleChange}
              placeholder="Ім'я користувача"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email адреса"
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
              placeholder="Пароль"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              className={styles.input}
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Підтвердіть пароль"
            />
          </div>
          <div className={styles.inputGroup}>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="Student">Студент</option>
              <option value="Teacher">Викладач</option>
            </select>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} type="submit">
              ЗАРЕЄСТРУВАТИСЯ
            </button>
          </div>
        </form>
        <div
          id="google-signin-button"
          style={{
            display: "flex",
            marginTop: "50px",
            justifyContent: "center",
          }}
          className={styles.googleButton}
        ></div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;
