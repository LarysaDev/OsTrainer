import { useState } from "react";
import axios from "axios";
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
      setArrivalError("Arrival Times повинні містити тільки коректні числові значення.");
      valid = false;
    } else if (!arrivalError) {
      setArrivalError(null);
    }

    if (burstInvalid) {
      setBurstError("Burst Times повинні містити тільки коректні числові значення.");
      valid = false;
    } else if (!burstError) {
      setBurstError(null);
    }

    return valid;
  };

  const handleAutocompleteInput = () => {
    const [ arrivalTimes, burstTimes, timeQuantum ] = generateRoundRobinData();
    setArrivalTimes(arrivalTimes.join(','));
    setBurstTimes(burstTimes.join(','));
    setTimeQuantum(timeQuantum);
  }

  const handleGenerate = async () => {
    if (!validateInputs()) {
      return;
    }

    const arrivalArray = arrivalTimes
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);
    const burstArray = burstTimes.replace(/\s+/g, "").split(",").map(Number);

    const processList = arrivalArray.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstArray[index],
    }));

    try {
      const requestData = {
        processes: processList,
        timeQuantum: timeQuantum,
      };
      const response = await axios.post("/api/ganttchart/rr", requestData);
      generateMatrixTable(arrivalArray, burstArray, timeQuantum);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (arrivalTime: number[], burstArray: number[],  timeQuantum: number) => {
    let statesMatrix = roundRobinScheduler(arrivalTime, burstArray, timeQuantum);

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
        return userMatrix[i][j] === cell ? "green" : "red";
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
                sx={{marginLeft: '10px'}}
              >
                Автозаповнити вхідні дані
              </Button>
            </form>
            <h2>Матриця статусу потоків відносно моментів часу</h2>
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
                        <TableCell
                          key={cellIndex}
                          style={{
                            backgroundColor:
                              colorMatrix[rowIndex + 1][cellIndex + 1],
                          }}
                        >
                          <input
                            value={userMatrix[rowIndex + 1][cellIndex + 1]}
                            onChange={(e) =>
                              handleUserInputChange(
                                rowIndex + 1,
                                cellIndex + 1,
                                e.target.value
                              )
                            }
                            style={{ width: "30px", textAlign: "center" }}
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
  // Створюємо масив процесів
  const processes = arrivalTimes.map((at, index) => ({
      id: index + 1,
      arrivalTime: at,
      burstTime: burstTimes[index],
      remainingTime: burstTimes[index],
      states: []
  }));

  let currentTime = 0;
  let completed = 0;
  let queue = [];
  let statesMatrix = [["Process\\Time"]];
  // Ініціалізуємо початкові стани для всіх процесів
  processes.forEach((process, index) => {
      statesMatrix.push([`P${index + 1}`]); // Add process row headers
  });

  // Продовжуємо поки всі процеси не завершаться
  while (completed < processes.length) {
      // Додаємо нові процеси в чергу
      for (let i = 0; i < processes.length; i++) {
          if (processes[i].arrivalTime <= currentTime &&
              processes[i].remainingTime > 0 &&
              !queue.includes(processes[i]) &&
              !processes[i].inQueue) {
              queue.push(processes[i]);
              processes[i].inQueue = true;
          }
      }

      // Якщо в черзі немає процесів, просто очікуємо
      if (queue.length === 0) {
          processes.forEach((process, index) => {
              statesMatrix[index + 1].push("-");
          });
          currentTime++;
          continue;
      }

      // Беремо перший процес з черги
      let currentProcess = queue.shift();
      currentProcess.inQueue = false;

      // Визначаємо час виконання
      const executeTime = Math.min(timeQuantum, currentProcess.remainingTime);

      // Оновлюємо стани для всіх процесів протягом виконання
      for (let t = 0; t < executeTime; t++) {
          processes.forEach((process, index) => {
              let state;
              if (process.id === currentProcess.id) {
                  state = "e"; // Executing
              } else if (process.remainingTime === 0) {
                  state = ""; // Completed
              } else if (process.arrivalTime <= currentTime + t && process.remainingTime > 0) {
                  state = "w"; // Waiting
              } else {
                  state = "-"; // Not arrived
              }
              statesMatrix[index + 1].push(state);
          });
      }

      // Оновлюємо час виконання процесу
      currentProcess.remainingTime -= executeTime;
      currentTime += executeTime;

      // Якщо процес завершено
      if (currentProcess.remainingTime === 0) {
          completed++;
          // Заповнюємо стани X для завершеного процесу
          const processIndex = currentProcess.id - 1;
          while (statesMatrix[processIndex + 1].length < statesMatrix[0].length) {
              statesMatrix[processIndex + 1].push("X");
          }
      } else {
          // Повертаємо процес в кінець черги
          queue.push(currentProcess);
          currentProcess.inQueue = true;
      }
  }

  // Заповнюємо перший рядок всіма значеннями від 0 до currentTime
  const timeHeader = Array.from({ length: currentTime + 1 }, (_, i) => i);
  statesMatrix[0] = [...statesMatrix[0], ...timeHeader];

  // Вирівнюємо довжини всіх рядків до максимальної
  const maxLength = statesMatrix[0].length;
  for (let i = 1; i < statesMatrix.length; i++) {
      while (statesMatrix[i].length < maxLength) {
          statesMatrix[i].push("");
      }
  }

  return statesMatrix;
}
