import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./LearnAlgorithms.module.less";
import {
  SidePanel,
  updateActiveLinkByIndex,
} from "../../../Components/SidePanel/SidePanel";
import AuthorizeView from "../../../Components/AuthorizeView";

export const SchedulingAlgorithmCards = () => {
  return (
    <AuthorizeView>
      <div className={styles.container}>
        <div style={{ width: "20%" }}>
          <SidePanel links={updateActiveLinkByIndex(1)} />
        </div>
        <div className={styles.main}>
          <p className={styles.headerText}>LEARN ALGORITHMS</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
            {algorithms.map((algorithm, index) => (
              <Card key={index} variant="outlined" sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {algorithm.name}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Category: {algorithm.category}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    href={algorithm.theoryLink}
                    target="_blank"
                  >
                    Theory
                  </Button>
                  <Button
                    size="small"
                    href={algorithm.practiceLink}
                    target="_blank"
                  >
                    Practice
                  </Button>
                  <Button
                    size="small"
                    href={algorithm.testsLink}
                    target="_blank"
                  >
                    Tests
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </div>
      </div>
    </AuthorizeView>
  );
};

type Algorithm = {
  name: string;
  theoryLink: string;
  practiceLink: string;
  testsLink: string;
  category: string;
};

const algorithms: Algorithm[] = [
  {
    name: "FCFS",
    theoryLink: "https://www.tutorialspoint.com/fcfs-scheduling",
    practiceLink: "/practice/fcfs",
    category: "Thread Scheduling",
    testsLink: "/test/1"
  },
  {
    name: "Round-Robin Scheduling",
    theoryLink: "https://www.javatpoint.com/os-round-robin-scheduling-algorithm",
    practiceLink: "/practice/rr",
    category: "Thread Scheduling",
    testsLink: "/test/2"
  },
  {
    name: "SJF (Non-preemptive)",
    theoryLink: "https://www.guru99.com/shortest-job-first-sjf-scheduling.html",
    practiceLink: "/practice/nonpreemptive_sjf",
    category: "Thread Scheduling",
    testsLink: "/test/3"
  },
  {
    name: "SJF (Preemptive)",
    theoryLink: "https://www.guru99.com/shortest-job-first-sjf-scheduling.html",
    practiceLink: "/practice/preemptive_sjf",
    category: "Thread Scheduling",
    testsLink: "/test/4"
  },
  {
    name: "Priority (Non-preemptive)",
    theoryLink: "https://www.guru99.com/priority-scheduling-program.html",
    practiceLink: "/practice/nonpreemptive_priority",
    category: "Thread Scheduling",
    testsLink: "/test/5"
  },
  {
    name: "Priority (Preemptive)",
    theoryLink: "https://www.guru99.com/priority-scheduling-program.html",
    practiceLink: "/practice/preemptive_priority",
    category: "Thread Scheduling",
    testsLink: "/test/6"
  },
];
