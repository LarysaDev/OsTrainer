import styles from "./Landing.module.css";
import { useNavigate } from "react-router-dom";

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div>OS TRAINER</div>
        <div className={styles.header_actions}>
          <div className={styles.header_action} onClick={handleLoginClick}>Вхід</div>
          <div className={styles.header_action} onClick={handleRegisterClick}>Реєстрація</div>
        </div>
      </div>
      <div className={styles.banner}>
        <div className={styles.banner_text}>
          Вивчай операційні системи легко
        </div>
      </div>
    </div>
  );
}
export default ResponsiveAppBar;
