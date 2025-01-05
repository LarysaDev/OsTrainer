import { useState } from "react";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlgorithmType } from "../../../common/AlgorithmType";
import {
  teacherLinks as links,
  updateActiveLinkByIndex,
} from "../../../Components/SidePanel/SidePanel";
import {
  generateRandomData,
  generatePageReplacementData,
  generatePrioritySchedulingData,
  generateRoundRobinData,
  generateBankerAlgorithmData,
} from "../../../common/RandomGenerators/AlgorithmRandomDataGenerator";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

export const NewCourse = () => {
  const navigate = useNavigate();
  const [showFilledTable, setShowFilledTable] = useState<boolean>(true);
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    algorithmType: AlgorithmType.FCFS,
    arrivalTimes: "",
    burstTimes: "",
    timeQuantum: "",
    priorities: "",
    pageRequests: [0],
    frames: 0,
    resources: 0,
    processes: 0,
  });

  const [error, setError] = useState<string | null>(null);

  const schedulingAlorithms: AlgorithmType[] = [
    AlgorithmType.FCFS,
    AlgorithmType.RR,
    AlgorithmType.SJF_PREEMPTIVE,
    AlgorithmType.SJF_NON_PREEMPTIVE,
    AlgorithmType.PRIORITY_NON_PREEMPTIVE,
    AlgorithmType.PRIORITY_PREEMPTIVE,
  ];
  const replacementAlgorithms: AlgorithmType[] = [
    AlgorithmType.FIFO,
    AlgorithmType.LFU,
    AlgorithmType.CLOCK,
    AlgorithmType.LRU,
    AlgorithmType.MFU,
    AlgorithmType.LRU_STACK,
  ];
  const deadlockAvoidAlgorithms: AlgorithmType[] = [AlgorithmType.BANKER];

  const handleAutocompleteInput = () => {
    if (courseData.algorithmType == AlgorithmType.RR) {
      const [arrivalTimes, burstTimes, timeQuantum] = generateRoundRobinData();
      setCourseData({
        ...courseData,
        arrivalTimes: arrivalTimes.join(","),
        burstTimes: burstTimes.join(","),
        timeQuantum: timeQuantum.toString(),
      });
    } else if (
      courseData.algorithmType == AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
      courseData.algorithmType == AlgorithmType.PRIORITY_PREEMPTIVE
    ) {
      const [arrivalTimes, burstTimes, priorities] =
        generatePrioritySchedulingData();
      setCourseData({
        ...courseData,
        arrivalTimes: arrivalTimes.join(","),
        burstTimes: burstTimes.join(","),
        priorities: priorities.join(","),
      });
    } else if (schedulingAlorithms.includes(courseData.algorithmType)) {
      const [arrivalTimes, burstTimes] = generateRandomData();
      setCourseData({
        ...courseData,
        arrivalTimes: arrivalTimes.join(","),
        burstTimes: burstTimes.join(","),
      });
    } else if (replacementAlgorithms.includes(courseData.algorithmType)) {
      const [pages, frameSize] = generatePageReplacementData();
      setCourseData({
        ...courseData,
        pageRequests: pages,
        frames: frameSize,
      });
    } else if (deadlockAvoidAlgorithms.includes(courseData.algorithmType)) {
      const [resourceCount, processCount] = generateBankerAlgorithmData();
      setCourseData({
        ...courseData,
        resources: resourceCount,
        processes: processCount,
      });
    }
  };

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
      (!courseData.timeQuantum ||
        isNaN(Number(courseData.timeQuantum)) ||
        Number(courseData.timeQuantum) <= 0)
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
      <LoggedInView links={updateActiveLinkByIndex(1, links)}>
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
          <h3>
            📑 Створюйте та завантажуйте завдання у вигляді білету в зручному
            форматі
          </h3>
          <TextField
            label="Назва"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            fullWidth
            inputProps={{ maxLength: 255 }}
          />
          <TextField
            label="Опис"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            select
            label="Виберіть алгоритм"
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
              helperText={
                error && courseData.algorithmType === AlgorithmType.RR
                  ? error
                  : ""
              }
            />
          )}
          {(courseData.algorithmType ===
            AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
            courseData.algorithmType === AlgorithmType.PRIORITY_PREEMPTIVE) && (
            <TextField
              label="Priorities (через кому)"
              name="priorities"
              value={courseData.priorities}
              onChange={handleChange}
              fullWidth
              error={
                !!error &&
                (courseData.algorithmType ===
                  AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
                  courseData.algorithmType ===
                    AlgorithmType.PRIORITY_PREEMPTIVE)
              }
              helperText={
                error &&
                (courseData.algorithmType ===
                  AlgorithmType.PRIORITY_NON_PREEMPTIVE ||
                  courseData.algorithmType ===
                    AlgorithmType.PRIORITY_PREEMPTIVE)
                  ? error
                  : ""
              }
            />
          )}
          {schedulingAlorithms.includes(courseData.algorithmType) && (
            <>
              <TextField
                label="Arrival Times (через кому)"
                name="arrivalTimes"
                value={courseData.arrivalTimes}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Burst Times (через кому)"
                name="burstTimes"
                value={courseData.burstTimes}
                onChange={handleChange}
                fullWidth
              />{" "}
            </>
          )}
          {replacementAlgorithms.includes(courseData.algorithmType) && (
            <>
              <TextField
                label="Сторінки для завантаження (через кому)"
                name="pageRequests"
                value={courseData.pageRequests}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Кількість кадрів"
                name="frames"
                value={courseData.frames}
                onChange={handleChange}
                fullWidth
              />{" "}
            </>
          )}
          {deadlockAvoidAlgorithms.includes(courseData.algorithmType) && (
            <>
              <TextField
                label="Кількість ресурсів"
                name="resources"
                value={courseData.resources}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Кількість процесів"
                name="processes"
                value={courseData.processes}
                onChange={handleChange}
                fullWidth
              />
            </>
          )}
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={showFilledTable}
                onChange={(e) => setShowFilledTable(e.target.checked)}
              />
            }
            label="Створити завдання із заповненою матрицею станів процесів"
          /> */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAutocompleteInput}
            >
              Автозаповнити вхідні дані
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ marginLeft: "15px" }}
            >
              Створити
            </Button>
          </Box>
        </Box>
      </LoggedInView>
    </>
  );
};
