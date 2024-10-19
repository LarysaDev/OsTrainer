import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./LearnAlgorithms.module.less";
import {
  SidePanel,
  SidePanelLink,
} from "../../../Components/SidePanel/SidePanel";
import AuthorizeView from "../../../Components/AuthorizeView";

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/" },
  { label: "Scheduling", link: "/scheduling", active: true },
  { label: "Page Replacement", link: "/" },
  { label: "Avoiding Deadlocks", link: "/" },
  { label: "Assignments", link: "/" },
];

export const SchedulingAlgorithmCards = () => {
  return (
    <AuthorizeView>
      <div className={styles.container}>
        <div style={{ width: "20%" }}>
          <SidePanel links={links} />
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
  category: string;
};

const algorithms: Algorithm[] = [
  {
    name: "FCFS",
    theoryLink: "https://example.com/theory/fcfs",
    practiceLink: "/practice/fcfs",
    category: "Thread Scheduling",
  },
  {
    name: "Round-Robin Scheduling",
    theoryLink: "https://example.com/theory/round-robin",
    practiceLink: "/practice/rr",
    category: "Thread Scheduling",
  },
  {
    name: "SJF (Non-preemptive)",
    theoryLink: "https://example.com/theory/sjf-non-preemptive",
    practiceLink: "https://example.com/practice/sjf-non-preemptive",
    category: "Thread Scheduling",
  },
  {
    name: "SJF (Preemptive)",
    theoryLink: "https://example.com/theory/sjf-preemptive",
    practiceLink: "https://example.com/practice/sjf-preemptive",
    category: "Thread Scheduling",
  },
  {
    name: "Priority (Non-preemptive)",
    theoryLink: "https://example.com/theory/priority-non-preemptive",
    practiceLink: "https://example.com/practice/priority-non-preemptive",
    category: "Thread Scheduling",
  },
  {
    name: "Priority (Preemptive)",
    theoryLink: "https://example.com/theory/priority-preemptive",
    practiceLink: "https://example.com/practice/priority-preemptive",
    category: "Thread Scheduling",
  },
];
