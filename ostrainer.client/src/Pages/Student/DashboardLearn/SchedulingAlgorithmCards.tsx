import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./LearnAlgorithms.module.less";
import {
  updateActiveLinkByIndex,
} from "../../../Components/SidePanel/SidePanel";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";

export const SchedulingAlgorithmCards = () => {
  return (
    <LoggedInView links={updateActiveLinkByIndex(1)}>
      <p className={styles.headerText}>ПЛАНУВАННЯ ПОТОКІВ</p>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          p: 2,
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
            height: "60vh",
          }}
        >
          {algorithms.map((algorithm, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{ minWidth: 275, maxHeight: "180px" }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {algorithm.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Категорія: {algorithm.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  href={algorithm.theoryLink}
                  target="_blank"
                >
                  Теорія
                </Button>
                <Button
                  size="small"
                  href={algorithm.practiceLink}
                  target="_blank"
                >
                  Практика
                </Button>
                <Button size="small" href={algorithm.testsLink} target="_blank">
                  Тести
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </LoggedInView>
  );
};

type Algorithm = {
  name: string;
  theoryLink: string;
  practiceLink: string;
  testsLink: string;
  category: string;
};

const categoryName = "Планування потоків";

const algorithms: Algorithm[] = [
  {
    name: "FCFS",
    theoryLink: "https://www.tutorialspoint.com/fcfs-scheduling",
    practiceLink: "/practice/fcfs",
    category: categoryName,
    testsLink: "/test/1",
  },
  {
    name: "Round-Robin",
    theoryLink:
      "https://www.javatpoint.com/os-round-robin-scheduling-algorithm",
    practiceLink: "/practice/rr",
    category: categoryName,
    testsLink: "/test/2",
  },
  {
    name: "SJF (невитісняючий)",
    theoryLink: "https://www.guru99.com/shortest-job-first-sjf-scheduling.html",
    practiceLink: "/practice/nonpreemptive_sjf",
    category: categoryName,
    testsLink: "/test/3",
  },
  {
    name: "SJF (витісняючий)",
    theoryLink: "https://www.guru99.com/shortest-job-first-sjf-scheduling.html",
    practiceLink: "/practice/preemptive_sjf",
    category: categoryName,
    testsLink: "/test/4",
  },
  {
    name: "Priority (невитісняючий)",
    theoryLink: "https://www.guru99.com/priority-scheduling-program.html",
    practiceLink: "/practice/nonpreemptive_priority",
    category: categoryName,
    testsLink: "/test/5",
  },
  {
    name: "Priority (витісняючий)",
    theoryLink: "https://www.guru99.com/priority-scheduling-program.html",
    practiceLink: "/practice/preemptive_priority",
    category: categoryName,
    testsLink: "/test/6",
  },
];
