import styles from "./Landing.module.css";

function ResponsiveAppBar() {
  return (
    <div className={styles.header_container}>
      <div className={styles.header}>
        <div>OS TRAINER</div>
        <div className={styles.header_actions}>
          <div className={styles.header_action}>Вхід</div>
          <div className={styles.header_action}>Реєстрація</div>
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
