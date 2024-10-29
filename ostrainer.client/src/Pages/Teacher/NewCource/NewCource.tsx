import { useState } from "react";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { SidePanelLink } from "../../../Components/SidePanel/SidePanel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlgorithmType } from "../../../common/AlgorithmType";

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
    timeQuantum: "",
    priorities: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateFields = () => {
    if (
      courseData.algorithmType === AlgorithmType.RR &&
      (!courseData.timeQuantum || isNaN(Number(courseData.timeQuantum)) || Number(courseData.timeQuantum) <= 0)
    ) {
      setError("Time Quantum must be a positive number.");
      return false;
    }
    if (
      (courseData.algorithmType === AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
        courseData.algorithmType === AlgorithmType.PRIORITY_PREEMPTIVE) &&
      !/^(\d+,)*\d+$/.test(courseData.priorities)
    ) {
      setError("Priorities must be a comma-separated list of integers.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      const response = await axios.post("/api/course/create", courseData);
      if (response.status === 200) {
        navigate("/");
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
            {Object.values(AlgorithmType).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          {courseData.algorithmType === AlgorithmType.RR && (
            <TextField
              label="Time Quantum"
              name="timeQuantum"
              value={courseData.timeQuantum}
              onChange={handleChange}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              error={!!error && courseData.algorithmType === AlgorithmType.RR}
              helperText={error && courseData.algorithmType === AlgorithmType.RR ? error : ""}
            />
          )}
          {(courseData.algorithmType === AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
            courseData.algorithmType === AlgorithmType.PRIORITY_PREEMPTIVE) && (
            <TextField
              label="Priorities (comma-separated)"
              name="priorities"
              value={courseData.priorities}
              onChange={handleChange}
              fullWidth
              error={!!error && (courseData.algorithmType === AlgorithmType.PRIORITY_NON_PREEMPTIVE || courseData.algorithmType === AlgorithmType.PRIORITY_PREEMPTIVE)}
              helperText={
                error && (courseData.algorithmType === AlgorithmType.PRIORITY_NON_PREEMPTIVE || courseData.algorithmType === AlgorithmType.PRIORITY_PREEMPTIVE) ? error : ""
              }
            />
          )}
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
