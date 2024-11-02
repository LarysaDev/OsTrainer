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
import { Process } from "../../common";

export const PreemptiveSjfTrainer: React.FC = () => {
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
        "Arrival Times and Burst Times must have the same number of values."
      );
      setBurstError(
        "Arrival Times and Burst Times must have the same number of values."
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
      setArrivalError("Arrival Times must contain only valid numbers.");
      valid = false;
    } else if (!arrivalError) {
      setArrivalError(null);
    }

    if (burstInvalid) {
      setBurstError("Burst Times must contain only valid numbers.");
      valid = false;
    } else if (!burstError) {
      setBurstError(null);
    }

    return valid;
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

    const processList = arrivalArray.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstArray[index],
    }));

    try {
      const response = await axios.post(
        "/api/ganttchart/preemptive_sjf",
        processList
      );
      generateMatrixTable(arrivalArray, burstArray);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (
    arrivalTimes: number[],
    burstTimes: number[]
  ) => {
    // Створюємо масив процесів з початковими даними
    let processes: Process[] = arrivalTimes.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstTimes[index],
      remainingTime: burstTimes[index],
      startTime: undefined,
      completionTime: undefined,
      currentStartTime: undefined,
    }));

    let currentTime = Math.min(...arrivalTimes);
    let completedProcesses = 0;
    let executionHistory: { time: number; processId: number }[] = [];
    let currentProcess: Process | null = null;

    // Виконуємо планування поки всі процеси не завершаться
    while (completedProcesses < processes.length) {
      // Знаходимо всі доступні процеси на поточний момент часу
      let availableProcesses = processes.filter(
        (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
      );

      if (availableProcesses.length === 0) {
        // Якщо немає доступних процесів, переходимо до наступного часу прибуття
        currentTime = Math.min(
          ...processes
            .filter((p) => p.remainingTime > 0)
            .map((p) => p.arrivalTime)
        );
        continue;
      }

      // Сортуємо за remainingTime
      availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);

      let nextProcess = availableProcesses[0];

      // Перевіряємо умову витіснення
      if (currentProcess && currentProcess.remainingTime > 0) {
        // Витісняємо тільки якщо remaining time нового процесу строго менший
        if (nextProcess.remainingTime < currentProcess.remainingTime) {
          currentProcess = nextProcess;
        }
      } else {
        currentProcess = nextProcess;
      }

      // Записуємо початок виконання, якщо це перший старт процесу
      if (processes[currentProcess.id - 1].startTime === undefined) {
        processes[currentProcess.id - 1].startTime = currentTime;
      }
      processes[currentProcess.id - 1].currentStartTime = currentTime;

      // Додаємо запис в історію виконання
      executionHistory.push({
        time: currentTime,
        processId: currentProcess.id,
      });

      // Виконуємо процес одну одиницю часу
      currentProcess.remainingTime--;
      currentTime++;

      // Перевіряємо, чи завершився процес
      if (currentProcess.remainingTime === 0) {
        processes[currentProcess.id - 1].completionTime = currentTime;
        completedProcesses++;
        currentProcess = null;
      }
    }

    // Генеруємо матрицю станів
    const maxTime = Math.max(...processes.map((p) => p.completionTime!));
    const matrix: (string | number)[][] = [];

    // Заголовок
    const headerRow: (string | number)[] = ["Process\\Time"];
    for (let t = 0; t <= maxTime; t++) {
      headerRow.push(t);
    }
    matrix.push(headerRow);

    // Заповнюємо рядки для кожного процесу
    processes.forEach((process) => {
      const row: (string | number)[] = [`P${process.id}`];
      for (let t = 0; t <= maxTime; t++) {
        if (t < process.arrivalTime) {
          row.push("-"); // Ще не прибув
        } else if (t >= process.completionTime!) {
          row.push(""); // Завершено
        } else {
          // Перевіряємо, чи виконується процес в цей момент
          const isExecuting = executionHistory.find(
            (h) => h.time === t && h.processId === process.id
          );
          if (isExecuting) {
            row.push("e"); // Виконується
          } else {
            row.push("w"); // Очікує
          }
        }
      }
      matrix.push(row);
    });

    setMatrix(matrix);
    setUserMatrix(
      matrix.map((row) =>
        row.map((cell) => (typeof cell === "number" ? cell : ""))
      )
    );
    setColorMatrix(matrix.map((row) => row.map(() => "")));
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
            <h1>Gantt Chart Generator: Preemptive SJF</h1>
            <form>
              <TextField
                label="Arrival Times (comma-separated)"
                variant="outlined"
                value={arrivalTimes}
                onChange={(e) => setArrivalTimes(e.target.value)}
                error={!!arrivalError}
                helperText={arrivalError}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Burst Times (comma-separated)"
                variant="outlined"
                value={burstTimes}
                onChange={(e) => setBurstTimes(e.target.value)}
                error={!!burstError}
                helperText={burstError}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
              >
                Generate Gantt Chart
              </Button>
            </form>
            <h2>Matrix of process statuses</h2>
            <Typography variant="body1" style={{ margin: "20px 0" }}>
              <strong>-</strong> : Not Started <br />
              <strong>e</strong> : Executed <br />
              <strong>w</strong> : Waiting <br />
              <strong>x</strong> : Completed <br />
            </Typography>
            <Typography>Розташуйте процеси в порядку найшвидшого виконання</Typography><br/>
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
                Verify
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClearAll}
                style={{ marginLeft: "10px" }}
              >
                Clear all
              </Button>
              <Button
                variant="contained"
                onClick={handleFillCalculatedValues}
                style={{ marginLeft: "10px" }}
              >
                Fill with calculated values
              </Button>
            </Box>
          </div>
        </div>
      </AuthorizeView>
    </div>
  );
};
