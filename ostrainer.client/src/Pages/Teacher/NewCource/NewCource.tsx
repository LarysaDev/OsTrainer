import { useState } from "react";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import {
  generateSchedulingMatrixData,
  generatePageReplacementMatrixData,
} from "../../../common/MatrixGenerator/Matrixgenerator";
import { useNavigate } from "react-router-dom";
import {
  AlgorithmType,
  AlgorithmTypeMapping,
  isDeadlockAvoiding,
  isReplacingType,
  isSchedulingType,
} from "../../../common/AlgorithmType";
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
import { useGenerateFileMutation } from "../../../app/fileGenerationApi";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Download } from "@mui/icons-material";
import {
  DownloadType,
  DownloadFormat,
  InputData,
  MatrixData,
} from "../../../common/FileDownloading/types";
import { Select, SelectChangeEvent } from "@mui/material";
import { Typography } from "@mui/material";

export const NewCourse = () => {
  const userRole = localStorage.getItem("os_trainer_role");

  const [downloadType, setDownloadType] = useState<DownloadType>(
    DownloadType.ToSolve
  );
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>(
    DownloadFormat.word
  );

  const navigate = useNavigate();
  const [system, setSystem] = useState("Linux");

  const [courseData, setCourseData] = useState<InputData>({
    name: "",
    description: "",
    algorithmType: AlgorithmType.FCFS,
    arrivalTimes: "",
    burstTimes: "",
    timeQuantum: "",
    priorities: "",
    pageRequests: "",
    frames: 0,
    resources: 0,
    processes: 0,
    os: system,
  });

  const [error, setError] = useState<string | null>(null);

  const handleDownloadTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadType((event.target as HTMLInputElement).value as DownloadType);
  };

  const handleDownloadFormatChange = (
    event: SelectChangeEvent<DownloadFormat>
  ) => {
    setDownloadFormat(event.target.value as DownloadFormat);
  };

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
    } else if (isSchedulingType(courseData.algorithmType)) {
      const [arrivalTimes, burstTimes] = generateRandomData();
      setCourseData({
        ...courseData,
        arrivalTimes: arrivalTimes.join(","),
        burstTimes: burstTimes.join(","),
      });
    } else if (isReplacingType(courseData.algorithmType)) {
      const [pages, frameSize] = generatePageReplacementData();
      setCourseData({
        ...courseData,
        pageRequests: pages.join(","),
        frames: frameSize,
      });
    } else if (isDeadlockAvoiding(courseData.algorithmType)) {
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

  const handleGenerate = () => {
    const alorithm = courseData.algorithmType;

    if (isSchedulingType(alorithm)) {
      const generatedData = generateSchedulingMatrixData(
        courseData.arrivalTimes,
        courseData.burstTimes,
        courseData.priorities,
        Number(courseData.timeQuantum),
        courseData.algorithmType,
        system
      );

      return {
        correctMatrix: generatedData.correctMatrix,
        userMatrix: generatedData.userMatrix,
      };
    } else if (isReplacingType(alorithm)) {
      const generatedData = generatePageReplacementMatrixData(
        courseData.pageRequests,
        courseData.frames,
        courseData.algorithmType
      );

      return {
        correctMatrix: generatedData.correctMatrix,
        userMatrix: generatedData.userMatrix,
      };
    }

    return getDefaultMatrix();
  };

  if (userRole !== "Teacher") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error">
          🚫 Сторінка недоступна для вашого типу акаунту
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          На головну 🏠
        </Button>
      </Box>
    );
  }

  const [generateFile, { isLoading }] = useGenerateFileMutation();

  const handleDownload = async (
    inputData: InputData,
    matrixData: MatrixData,
    type: DownloadType,
    format: DownloadFormat
  ) => {
    try {
      const response = await generateFile({
        fileType: format.toString(),
        type: type,
        request: {
          ...inputData,
          algorithmType: AlgorithmTypeMapping[inputData.algorithmType],
        },
        matrixData: matrixData,
      }).unwrap();

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${inputData.name}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Помилка при генерації файлу:", error);
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
            minHeight: 10,
            gap: 2,
            p: 3,
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
            label="Опис завдання"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={1}
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
            <>
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
              <FormControl component="fieldset">
                <FormLabel component="legend">Оберіть ОС</FormLabel>
                <RadioGroup
                  row
                  value={system}
                  onChange={(e) => setSystem(e.target.value)}
                >
                  <FormControlLabel
                    value="Windows"
                    control={<Radio />}
                    label="Windows"
                  />
                  <FormControlLabel
                    value="Linux"
                    control={<Radio />}
                    label="Linux"
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}
          {isSchedulingType(courseData.algorithmType) && (
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
          {isReplacingType(courseData.algorithmType) && (
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
          {isDeadlockAvoiding(courseData.algorithmType) && (
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
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAutocompleteInput}
            >
              Автозаповнити вхідні дані
            </Button>
          </Box>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Оберіть тип завантаження
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="toSolve"
              name="radio-buttons-group"
              onChange={handleDownloadTypeChange}
            >
              <FormControlLabel
                value="toSolve"
                control={<Radio />}
                label="Білет для розв'язання"
              />
              <FormControlLabel
                value="solved"
                control={<Radio />}
                label="Білет з відповідями"
              />
            </RadioGroup>
          </FormControl>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <Box>
            <FormControl fullWidth sx={{ marginBottom: "15px" }}>
              <FormLabel id="demo-radio-buttons-group-label">
                Оберіть формат завантаження
              </FormLabel>
              <Select
                labelId="file-format-label"
                value={downloadFormat}
                onChange={handleDownloadFormatChange}
              >
                <MenuItem value="docx">DOCX</MenuItem>
                <MenuItem value="xlsx">Excel</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const matrix: MatrixData = handleGenerate();
                handleDownload(courseData, matrix, downloadType, downloadFormat);
              }}
            >
              Завантажити білет <Download sx={{ marginLeft: "10px" }} />
            </Button>
          </Box>
        </Box>
      </LoggedInView>
    </>
  );
};

const getDefaultMatrix = () => {
  return {
    correctMatrix: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    userMatrix: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  };
};
