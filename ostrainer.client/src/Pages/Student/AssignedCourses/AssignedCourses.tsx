import { courses } from "./dump";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from './AssignedCourses.module.less';

export const AssignedCourses = () => {
  return (
    <>
      <p className={styles.headerText}>MY COURSES</p>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
        {courses.map((course) => (
          <Card key={course.id} variant="outlined" sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {course.status}
              </Typography>
              <Typography variant="h5" component="div">
                {course.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Author: {course.author}
              </Typography>
              <Typography variant="body2">Mark: {course.mark == 0 ? 'Not Estimated' : course.mark}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Open assignment</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
};

export type CourseStatus = "Assigned" | "Estimated";

export type AssignedCourse = {
  id: number;
  name: string;
  author: string;
  status: CourseStatus;
  mark: number;
};
