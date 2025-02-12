import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { links, updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export const StudentDashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <LoggedInView links={updateActiveLinkByIndex(0, links)}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", textAlign: "center", p: 3 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" gutterBottom>
            Ласкаво просимо, {user?.name || "Студент"}!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Тут ви можете переглядати курси, завантажувати навчальні матеріали та відстежувати свій прогрес.
          </Typography>
        </motion.div>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3, justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card sx={{ width: 300 }}>
              <CardContent>
                <Typography variant="h6">Мої курси</Typography>
                <Typography variant="body2">Переглядайте доступні курси та виконуйте завдання.</Typography>
                <Button variant="contained" sx={{ mt: 1, backgroundColor: "#FBB471", '&:hover': { backgroundColor: "#E69A5B" } }} href="/student/courses">
                  Перейти
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card sx={{ width: 300 }}>
              <CardContent>
                <Typography variant="h6">Навчальні матеріали</Typography>
                <Typography variant="body2">Завантажуйте матеріали для підготовки до занять.</Typography>
                <Button variant="contained" sx={{ mt: 1, backgroundColor: "#FBB471", '&:hover': { backgroundColor: "#E69A5B" } }} href="/student/materials">
                  Перейти
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </LoggedInView>
  );
};
