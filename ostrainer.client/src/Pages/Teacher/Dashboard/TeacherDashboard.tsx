import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { SidePanelLink } from "../../../Components/SidePanel/SidePanel";
import { CourseStatus } from "../../Student/AssignedCourses/AssignedCourses";

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/", active: true },
  { label: "Create Course", link: "/" },
];

export const TeacherDashboard = () => {
  return (
    <>
      <LoggedInView links={links}>
        <div>
            MY COURCES
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
}
