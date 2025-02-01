import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Про проект
            </Typography>
            <Typography variant="body2" color="text.secondary">
              OSTrainer - це інтерактивна платформу для вивчення алгоритмів
              операційних систем, яка включає інструменти для моделювання,
              тестування та теоретичного навчання.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Зв'яжіться з нами
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Львів, Україна
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: larusamatolinec@gmail.com
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            {/* <Link color="inherit" href="https://github.com/LarysaDev/OsTrainer//"> */}
              OsTrainer
            {/* </Link>*/} 
            {" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
