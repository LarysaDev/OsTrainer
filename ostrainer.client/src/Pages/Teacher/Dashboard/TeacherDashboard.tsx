import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { SidePanelLink } from "../../../Components/SidePanel/SidePanel";
import { CourseStatus } from "../../Student/AssignedCourses/AssignedCourses";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";
import { EditIcon } from "../../../assets/EditIcon";
import DeleteIcon from "../../../assets/DeleteIcon";
import AddUserIcon from "../../../assets/AddUserIcon";
import styles from '../../Student/AssignedCourses/AssignedCourses.module.less';
import { getUserEmail } from "../../../Components/AuthorizeView";
import { teacherLinks as links, updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";

export const TeacherDashboard = () => {
  const user = getUserEmail();

  const [courses, setCourses] = useState<CreatedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<CreatedCourse[]>(
          "/api/assignment/getteacherassignments",
          {
            params: { teacherEmail: user },
          }
        );
        setCourses(response.data.$values);
      } catch (err) {
        setError("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <>
      <LoggedInView links={updateActiveLinkByIndex(0, links)}>
        <div>
        <p className={styles.headerText}>МОЇ КУРСИ</p>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, p: 2 }}>
            {courses?.map((course) => (
              <Card key={course.id} variant="outlined" sx={{ minWidth: 275, borderRadius: '20px', boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14, textAlign: "center" }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {course.status}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ textAlign: "center", mb: 3 }}
                  >
                    {course.name}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    <EditIcon sx={{ cursor: "pointer" }} />
                    <DeleteIcon sx={{ cursor: "pointer" }} />
                    <AddUserIcon sx={{ cursor: "pointer" }} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </div>
      </LoggedInView>
    </>
  );
};

export type CreatedCourse = {
  id: number;
  name: string;
  status: CourseStatus;
  students: Student[];
  mark: number;
};

export type Student = {
  id: number;
  email: string;
};
