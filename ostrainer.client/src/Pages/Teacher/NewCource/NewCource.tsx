import { useState } from "react";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { SidePanelLink } from "../../../Components/SidePanel/SidePanel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/", active: false },
  { label: "Create Course", link: "/new-course", active: true },
];

export const NewCourse = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    algorithmType: "",
    arrivalTimes: "",
    burstTimes: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/course/create", courseData);
      if (response.status === 200) {
        navigate("/");  // Redirect to dashboard after successful creation
      }
    } catch (err) {
      setError("Failed to create course.");
    }
  };

  return (
    <>
      <LoggedInView links={links}>
        <Box
          sx={{
            maxWidth: 600,
            margin: "auto",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h2>Create new practice task</h2>
          <TextField
            label="Name"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            fullWidth
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            label="Description"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            select
            label="Algorithm Type"
            name="algorithmType"
            value={courseData.algorithmType}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="FCFS">FCFS</MenuItem>
            <MenuItem value="SJF">SJF</MenuItem>
            <MenuItem value="RR">RR</MenuItem>
          </TextField>
          <TextField
            label="Arrival Times (comma-separated)"
            name="arrivalTimes"
            value={courseData.arrivalTimes}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Burst Times (comma-separated)"
            name="burstTimes"
            value={courseData.burstTimes}
            onChange={handleChange}
            fullWidth
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Course
          </Button>
        </Box>
      </LoggedInView>
    </>
  );
};
