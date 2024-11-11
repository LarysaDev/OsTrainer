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

export const AvoidDeadlocksAlgorithmCards = () => {
  return (
    <AuthorizeView>
      <div className={styles.container}>
        <div style={{ width: "20%" }}>
          <SidePanel links={updateActiveLinkByIndex(3)} />
        </div>
        <div className={styles.main}>
          <p className={styles.headerText}>УНИКНЕННЯ ТУПИКОВИХ СИТУАЦІЙ</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
            {algorithms.map((algorithm, index) => (
              <Card key={index} variant="outlined" sx={{ minWidth: 275 }}>
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
                  <Button
                    size="small"
                    href={algorithm.testsLink}
                    target="_blank"
                  >
                    Тести
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

const categoryName = "Униклення дедлоків"

const algorithms: Algorithm[] = [
  {
    name: "Граф розподілу ресурсів",
    theoryLink: "",
    practiceLink: "/practice/avoid-deadlocks/graph",
    category: categoryName,
    testsLink: ""
  },
  {
    name: "Алгоритм Банкіра",
    theoryLink: "",
    practiceLink: "/practice/avoid-deadlock/bankir",
    category: categoryName,
    testsLink: ""
  }
];
