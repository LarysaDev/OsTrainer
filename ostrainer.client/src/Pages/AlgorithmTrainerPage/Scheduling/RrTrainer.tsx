import { useState } from "react";
import styles from "../Trainer.module.less";
import {
  SidePanel,
  updateActiveLinkByIndex,
} from "../../../Components/SidePanel/SidePanel";
import AuthorizeView from "../../../Components/AuthorizeView";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { generateRoundRobinData } from "../../../common/RandomGenerators/AlgorithmRandomDataGenerator";

export const RrTrainer: React.FC = () => {
  const [timeQuantum, setTimeQuantum] = useState<number>(0);
  const [arrivalTimes, setArrivalTimes] = useState<string>("");
  const [burstTimes, setBurstTimes] = useState<string>("");
  const [arrivalError, setArrivalError] = useState<string | null>(null);
  const [burstError, setBurstError] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<(string | number)[][]>([]);
  const [userMatrix, setUserMatrix] = useState<(string | number)[][]>([]);
  const [colorMatrix, setColorMatrix] = useState<(string | number)[][]>([]);

  const validateInputs = () => {
    const trimmedArrivalTimes = arrivalTimes.replace(/\s+/g, "");
    const trimmedBurstTimes = burstTimes.replace(/\s+/g, "");

    const arrivalArray = trimmedArrivalTimes.split(",");
    const burstArray = trimmedBurstTimes.split(",");

    let valid = true;

    if (arrivalArray.length !== burstArray.length) {
      setArrivalError(
        "Arrival Times та Burst Times повинні мати однакову кількість значень."
      );
      setBurstError(
        "Arrival Times та Burst Times повинні мати однакову кількість значень."
      );
      valid = false;
    } else {
      setArrivalError(null);
      setBurstError(null);
    }

    const arrivalInvalid = arrivalArray.some(
      (value) => isNaN(Number(value)) || value === ""
    );
    const burstInvalid = burstArray.some(
      (value) => isNaN(Number(value)) || value === ""
    );

    if (arrivalInvalid) {
      setArrivalError(
        "Arrival Times повинні містити тільки коректні числові значення."
      );
      valid = false;
    } else if (!arrivalError) {
      setArrivalError(null);
    }

    if (burstInvalid) {
      setBurstError(
        "Burst Times повинні містити тільки коректні числові значення."
      );
      valid = false;
    } else if (!burstError) {
      setBurstError(null);
    }

    return valid;
  };

  const handleAutocompleteInput = () => {
    const [arrivalTimes, burstTimes, timeQuantum] = generateRoundRobinData();
    setArrivalTimes(arrivalTimes.join(","));
    setBurstTimes(burstTimes.join(","));
    setTimeQuantum(timeQuantum);
  };

  const handleGenerate = async () => {
    if (!validateInputs()) {
      return;
    }

    const arrivalArray = arrivalTimes
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);
    const burstArray = burstTimes.replace(/\s+/g, "").split(",").map(Number);

    try {
      generateMatrixTable(arrivalArray, burstArray, timeQuantum);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (
    arrivalTime: number[],
    burstArray: number[],
    timeQuantum: number
  ) => {
    let statesMatrix = roundRobinScheduler(
      arrivalTime,
      burstArray,
      timeQuantum
    );

    console.log(statesMatrix);

    setMatrix(statesMatrix);
    setUserMatrix(
      statesMatrix.map((row) =>
        row.map((cell) => (typeof cell === "number" ? cell : ""))
      )
    );
    setColorMatrix(statesMatrix.map((row) => row.map(() => "")));
  };

  const handleUserInputChange = (
    rowIndex: number,
    cellIndex: number,
    value: string
  ) => {
    const newUserMatrix = [...userMatrix];
    newUserMatrix[rowIndex][cellIndex] = value;
    setUserMatrix(newUserMatrix);
  };

  const handleVerify = () => {
    const newColorMatrix = matrix.map((row, i) =>
      row.map((cell, j) => {
        if (i === 0 || j === 0) return "";
        return userMatrix[i][j] === cell ? "rgb(232, 245, 233)" : "rgb(255, 235, 238)";
      })
    );
    setColorMatrix(newColorMatrix);
  };

  const handleClearAll = () => {
    setUserMatrix(
      matrix.map((row) =>
        row.map((cell) => (typeof cell === "number" ? cell : ""))
      )
    );
    setColorMatrix(matrix.map((row) => row.map(() => "")));
  };

  const handleFillCalculatedValues = () => {
    setUserMatrix(matrix);
  };

  return (
    <div className={styles.container}>
      <AuthorizeView>
        <div className={styles.sidePanel}>
          <SidePanel links={updateActiveLinkByIndex(1)} />
        </div>
        <div className={styles.main}>
          <div className={styles.chartContainer}>
            <h1>Round-Robin</h1>
            <form>
              <TextField
                label="Arrival Times (через кому)"
                variant="outlined"
                value={arrivalTimes}
                onChange={(e) => setArrivalTimes(e.target.value)}
                error={!!arrivalError}
                helperText={arrivalError}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Burst Times (через кому)"
                variant="outlined"
                value={burstTimes}
                onChange={(e) => setBurstTimes(e.target.value)}
                error={!!burstError}
                helperText={burstError}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Time Quantum"
                variant="outlined"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(+e.target.value)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
              >
                Згенерувати матрицю
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAutocompleteInput}
                sx={{ marginLeft: "10px" }}
              >
                Автозаповнити вхідні дані
              </Button>
            </form>
            <h2>Матриця статусу процесів відносно моментів часу</h2>
            <Typography variant="body1" style={{ margin: "20px 0" }}>
              <strong>-</strong> : Виконання не розпочалось <br />
              <strong>e</strong> : Виконується <br />
              <strong>w</strong> : Очікує <br />
            </Typography>
            <TableContainer
              component={Paper}
              style={{ maxWidth: "1000px", overflowX: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {matrix[0]?.map((header, index) => (
                      <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matrix.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell>{row[0]}</TableCell>
                      {row.slice(1).map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <input
                            value={userMatrix[rowIndex + 1][cellIndex + 1]}
                            onChange={(e) =>
                              handleUserInputChange(
                                rowIndex + 1,
                                cellIndex + 1,
                                e.target.value
                              )
                            }
                            style={{
                              width: "30px",
                              textAlign: "center",
                              backgroundColor:
                                colorMatrix[rowIndex + 1][cellIndex + 1], 
                              border: "1px solid #ccc", 
                              borderRadius: "4px",
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerify}
              >
                Перевірити
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClearAll}
                style={{ marginLeft: "10px" }}
              >
                Очистити все
              </Button>
              <Button
                variant="contained"
                onClick={handleFillCalculatedValues}
                style={{ marginLeft: "10px" }}
              >
                Заповнити правильними значеннями
              </Button>
            </Box>
          </div>
        </div>
      </AuthorizeView>
    </div>
  );
};

function roundRobinScheduler(arrivalTimes, burstTimes, timeQuantum) {
  const processes = arrivalTimes.map((at, index) => ({
    id: index + 1,
    arrivalTime: at,
    burstTime: burstTimes[index],
    remainingTime: burstTimes[index],
    inQueue: false,
    lastExecutionTime: -1, // Track when process was last executed
  }));

  let currentTime = Math.min(...arrivalTimes);
  let completed = 0;
  let queue = [];
  let statesMatrix = [["Process\\Time"]];

  processes.forEach((process, index) => {
    statesMatrix.push([`P${index + 1}`]);
  });

  // Fill initial waiting states
  for (let t = 0; t < currentTime; t++) {
    processes.forEach((process, index) => {
      statesMatrix[index + 1].push("-");
    });
  }

  while (completed < processes.length) {
    // Add newly arrived processes to queue
    processes.forEach((process) => {
      if (
        process.arrivalTime <= currentTime &&
        process.remainingTime > 0 &&
        !process.inQueue
      ) {
        queue.push(process);
        process.inQueue = true;
      }
    });

    if (queue.length === 0) {
      processes.forEach((process, index) => {
        statesMatrix[index + 1].push("-");
      });
      currentTime++;
      continue;
    }

    // Get next process
    const currentProcess = queue.shift();
    currentProcess.inQueue = false;

    // Execute for time quantum or remaining time
    const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

    // Update states during execution
    for (let t = 0; t < executeTime; t++) {
      processes.forEach((process, index) => {
        if (process.id === currentProcess.id) {
          statesMatrix[index + 1].push("e");
        } else if (process.remainingTime === 0) {
          statesMatrix[index + 1].push("");
        } else if (process.arrivalTime <= currentTime) {
          statesMatrix[index + 1].push("w");
        } else {
          statesMatrix[index + 1].push("-");
        }
      });
      currentTime++;
      currentProcess.lastExecutionTime = currentTime;
    }

    // Update remaining time
    currentProcess.remainingTime -= executeTime;

    // Handle process completion or re-queueing
    if (currentProcess.remainingTime === 0) {
      completed++;
    } else {
      // Check for any new arrivals before re-queueing
      processes.forEach((process) => {
        if (
          process.arrivalTime <= currentTime &&
          process.remainingTime > 0 &&
          !process.inQueue &&
          process.id !== currentProcess.id
        ) {
          queue.push(process);
          process.inQueue = true;
        }
      });
      // Add current process back to queue
      queue.push(currentProcess);
      currentProcess.inQueue = true;
    }
  }

  // Add time headers
  const timeHeader = Array.from(
    { length: statesMatrix[1].length - 1 },
    (_, i) => i
  );
  statesMatrix[0] = ["Process\\Time", ...timeHeader];

  return statesMatrix;
}
