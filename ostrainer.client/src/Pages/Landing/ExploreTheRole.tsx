import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import styles from "./Landing.module.css";
import { roleResources } from "./resources/landingResources";

interface ExploreTheRoleProps {
  role: "student" | "teacher";
  theme: "light" | "dark";
}

export default function ExploreTheRole(props: ExploreTheRoleProps) {
  const resources = props.role == "student" ? roleResources.student : roleResources.teacher;
  const isDarkTheme = props.theme == 'dark';
  const background = isDarkTheme ? '#AB9D9D' : '#F1A65F';

  return (
    <div className={styles.explore_item}>
      <div className={styles.explore_heading} style={{background: background}}>
        {resources.title} <br></br>
        <br></br>
        {resources.description}
      </div>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
            width: '500px'
          },
        }}
      >
        {resources.options.map((option) => {
          return (
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color={isDarkTheme ? 'grey' : 'warning'} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>{option}</TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
}
