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

export const PageReplacementAlgorithmCards = () => {
  return (
    <LoggedInView links={updateActiveLinkByIndex(2)}>
      <p className={styles.headerText}>ЗАМІЩЕННЯ СТОРІНОК</p>
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
            <Card key={index} variant="outlined" sx={{ minWidth: 275, maxHeight: "180px" }}>
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

const categoryName = "Заміщення сторінок";

const algorithms: Algorithm[] = [
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
