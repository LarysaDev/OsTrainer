import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { links, updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export const StudentDashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <LoggedInView links={updateActiveLinkByIndex(0, links)}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "start", height: "100vh", textAlign: "center", p: 3 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" gutterBottom>
            Ласкаво просимо!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Тут ви можете переглядати курси, досліджувати навчальні матеріали та відстежувати свій прогрес.
          </Typography>
        </motion.div>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3, justifyContent: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card sx={{ width: 300, height: '150px' }}>
              <CardContent>
                <Typography variant="h6">Вивчення алгоритмів 📚</Typography>
                <br/>
                <Typography variant="body2">Вивчайте алгоритми заміщення, планування та уникнення дедлоків, проходьте тести до відповідних тем.</Typography>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card sx={{ width: 300, height: '150px' }}>
              <CardContent>
                <Typography variant="h6">Навчальні матеріали 🧠</Typography>
                <br/>
                <Typography variant="body2">Досліджуйте матеріали для підготовки до занять.</Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </LoggedInView>
  );
};