import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.less";
import { useLoginMutation } from "../../app/authApi";
import { User } from "../../app/types";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "rememberme") setRememberme(e.target.checked);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else {
      setError("");
      try {
        const user: User = await login({ email, password }).unwrap();
        console.log('Authorizing new user...', user);

        localStorage.setItem('os_trainer_role', user.role);
        localStorage.setItem('accessToken', user.token);
        localStorage.setItem('refreshToken', user.refreshToken);
        navigate("/home"); 
      } catch (err) {
        setError("Error Logging in.");
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h3 className={styles.heading}>ВХІД</h3>
        <div className={styles.buttonGroupFront}>
          <button className={styles.buttonFront} type="submit">
            УВІЙТИ
          </button>
          <button
            className={styles.buttonFrontInactive}
            onClick={handleRegisterClick}
          >
            ЗАРЕЄСТРУВАТИСЯ
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
              Запам'ятати мене
            </label>
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.button} type="submit" disabled={isLoading}>
              УВІЙТИ
            </button>
          </div>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
