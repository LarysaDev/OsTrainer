import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { teacherLinks as links, updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export const TeacherDashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <LoggedInView links={updateActiveLinkByIndex(0, links)}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", height: "100vh", textAlign: "center", p: 3 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" gutterBottom>
            Ласкаво просимо, {user?.name || "Викладач"}!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Тут ви можете створювати та завантажувати білети, переглядати алгоритми та демонстрації.
          </Typography>
        </motion.div>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3, justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card sx={{ minWidth: 300, maxWidth: 300, height: '250px' }}>
              <CardContent>
                <Typography variant="h6">Створення білетів</Typography>
                <br/>
                <Typography variant="body2">
                  Створюйте та редагуйте білети, які доступні як для завантаження умов, так і білетів з розв'язками.
                  Доступні формати: PDF, DOCX, TXT.
                </Typography>
                <br/>
                <Button variant="contained" sx={{ mt: 1, backgroundColor: "#FBB471", '&:hover': { backgroundColor: "#E69A50" } }} href="/newCourse">
                  Перейти
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card sx={{ minWidth: 300, maxWidth: 300, height: '250px' }}>
              <CardContent>
                <Typography variant="h6">Перегляд алгоритмів</Typography>
                <br/>
                <Typography variant="body2">Переглядайте та аналізуйте алгоритми операційнийх систем: алгоритмів планування потоків, заміщення сторінок та уникнення дедлоків.</Typography>
                <br/>
                <Button variant="contained" sx={{ mt: 1, backgroundColor: "#FBB471", '&:hover': { backgroundColor: "#E69A50" } }} href="/available_simulators">
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