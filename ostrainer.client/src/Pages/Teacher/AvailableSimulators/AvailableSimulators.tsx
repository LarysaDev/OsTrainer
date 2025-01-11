import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./AvailableSimulators.module.less";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import {
  teacherLinks as links,
  updateActiveLinkByIndex,
} from "../../../Components/SidePanel/SidePanel";

export const AvailableSimulators = () => {
  return (
    <LoggedInView links={updateActiveLinkByIndex(2, links)}>
      <div className={styles.container}>
        <div className={styles.main}>
          <p className={styles.headerText}>ПЛАНУВАННЯ ПОТОКІВ</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
            {algorithmsScheduling.map((algorithm, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{ minWidth: 275, display: "flex", alignItems: "center" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h7" component="div">
                    {algorithm.name}
                  </Typography>
                  <Button
                    size="small"
                    href={algorithm.practiceLink}
                    target="_blank"
                    sx={{ marginLeft: 1 }} // додавання відступу між текстом і кнопкою
                  >
                    Практика
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
          <p className={styles.headerText}>ЗАМІЩЕННЯ СТОРІНОК</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
            {algorithmsPageReplacement.map((algorithm, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{ minWidth: 275, display: "flex", alignItems: "center" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h7" component="div">
                    {algorithm.name}
                  </Typography>
                  <Button
                    size="small"
                    href={algorithm.practiceLink}
                    target="_blank"
                    sx={{ marginLeft: 1 }} // додавання відступу між текстом і кнопкою
                  >
                    Практика
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
          <p className={styles.headerText}>УНИКНЕННЯ ТУПИКОВИХ СИТУАЦІЙ</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
            {algorithmsDeadlock.map((algorithm, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{ minWidth: 275, display: "flex", alignItems: "center" }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h7" component="div">
                    {algorithm.name}
                  </Typography>
                  <Button
                    size="small"
                    href={algorithm.practiceLink}
                    target="_blank"
                    sx={{ marginLeft: 1 }} // додавання відступу між текстом і кнопкою
                  >
                    Практика
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </div>
      </div>
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

const algorithmsScheduling: Algorithm[] = [
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

const algorithmsPageReplacement: Algorithm[] = [
  {
    name: "FIFO",
    theoryLink: "",
    practiceLink: "/practice/fifo",
    category: categoryName,
    testsLink: "/test/7",
  },
  {
    name: "Clock",
    theoryLink: "",
    practiceLink: "/practice/page-replacement/clock",
    category: categoryName,
    testsLink: "/test/8",
  },
  {
    name: "LRU",
    theoryLink: "",
    practiceLink: "/practice/lru/false",
    category: categoryName,
    testsLink: "/test/9",
  },
  {
    name: "LRU (stack)",
    theoryLink: "",
    practiceLink: "/practice/lru/true",
    category: categoryName,
    testsLink: "/test/10",
  },
  {
    name: "LFU",
    theoryLink: "",
    practiceLink: "/practice/page-replacement/lfu",
    category: categoryName,
    testsLink: "/test/11",
  },
  {
    name: "MFU",
    theoryLink: "",
    practiceLink: "/practice/page-replacement/mfu",
    category: categoryName,
    testsLink: "/test/12",
  },
];

const algorithmsDeadlock: Algorithm[] = [
  {
    name: "Алгоритм Банкіра",
    theoryLink: "",
    practiceLink: "/practice/avoid-deadlock/bankir",
    category: categoryName,
    testsLink: "/test/13",
  },
];
