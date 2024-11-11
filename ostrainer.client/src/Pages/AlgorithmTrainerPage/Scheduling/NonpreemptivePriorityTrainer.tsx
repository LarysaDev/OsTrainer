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

export const NonpreemptivePriorityTrainer: React.FC = () => {
  const [arrivalTimes, setArrivalTimes] = useState<string>("");
  const [burstTimes, setBurstTimes] = useState<string>("");
  const [priorities, setPriorities] = useState<string>("");
  const [arrivalError, setArrivalError] = useState<string | null>(null);
  const [burstError, setBurstError] = useState<string | null>(null);
  const [prioritiesError, setPrioritiesError] = useState<string | null>(null);
  const [matrix, setMatrix] = useState<(string | number)[][]>([]);
  const [userMatrix, setUserMatrix] = useState<(string | number)[][]>([]);
  const [colorMatrix, setColorMatrix] = useState<(string | number)[][]>([]);

  const validateInputs = () => {
    const trimmedArrivalTimes = arrivalTimes.replace(/\s+/g, "");
    const trimmedBurstTimes = burstTimes.replace(/\s+/g, "");
    const trimmedPriorities = priorities.replace(/\s+/g, "");

    const arrivalArray = trimmedArrivalTimes.split(",");
    const burstArray = trimmedBurstTimes.split(",");
    const priorityArray = trimmedPriorities.split(",");

    let valid = true;

    if (arrivalArray.length !== burstArray.length) {
      setArrivalError(
        "Arrival Times та Burst Times повинні мати однакову кількість значень."
      );
      setBurstError(
        "Arrival Times та Burst Times повинні мати однакову кількість значень."
      );
      valid = false;
    } else if (arrivalArray.length !== priorityArray.length) {
      setPrioritiesError(
        "Arrival Times, Burst Times, та Priorities повинні мати однакову кількість значень."
      );
      valid = false;
    } else {
      setArrivalError(null);
      setBurstError(null);
      setPrioritiesError(null);
    }

    const arrivalInvalid = arrivalArray.some(
      (value) => isNaN(Number(value)) || value === ""
    );
    const burstInvalid = burstArray.some(
      (value) => isNaN(Number(value)) || value === ""
    );
    const priorityInvalid = priorityArray.some(
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

    if (priorityInvalid) {
      setPrioritiesError("Priority повинні містити тільки коректні числові значення.");
      valid = false;
    } else if (!prioritiesError) {
      setPrioritiesError(null);
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
    const priorityArray = priorities.replace(/\s+/g, "").split(",").map(Number);

    const processList = arrivalArray.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstArray[index],
      priority: priorityArray[index],
    }));

    try {
      const response = await axios.post(
        "/api/ganttchart/nonpreemptive_sjf",
        processList
      );
      generateMatrixTable(arrivalArray, burstArray, priorityArray);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (
    arrivalTimes: number[],
    burstTimes: number[],
    priorities: number[]
  ) => {
    // Ініціалізуємо процеси
    let processes: Process[] = arrivalTimes.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstTimes[index],
      priority: priorities[index],
      remainingTime: burstTimes[index],
    }));

    const n = processes.length;
    let currentTime = Math.min(...arrivalTimes);
    let completedProcesses = 0;
    let executionHistory: { time: number; processId: number }[] = [];

    while (completedProcesses < n) {
      // Знаходимо всі доступні процеси на поточний момент часу
      let availableProcesses = processes.filter(
        (p) => p.arrivalTime <= currentTime && p.remainingTime! > 0
      );

      if (availableProcesses.length === 0) {
        // Якщо немає доступних процесів, переходимо до наступного часу прибуття
        let nextArrival = Math.min(
          ...processes
            .filter((p) => p.remainingTime! > 0)
            .map((p) => p.arrivalTime)
        );
        currentTime = nextArrival;
        continue;
      }

      // Вибираємо процес з найвищим пріоритетом (найменше числове значення)
      let selectedProcess = availableProcesses.reduce((prev, current) =>
        prev.priority <= current.priority ? prev : current
      );

      // Записуємо час початку, якщо це перший старт процесу
      if (!processes[selectedProcess.id - 1].startTime) {
        processes[selectedProcess.id - 1].startTime = currentTime;
      }

      // Записуємо історію виконання для всього часу виконання процесу
      for (
        let t = currentTime;
        t < currentTime + selectedProcess.remainingTime!;
        t++
      ) {
        executionHistory.push({ time: t, processId: selectedProcess.id });
      }

      // Оновлюємо час завершення та remaining time
      currentTime += selectedProcess.remainingTime!;
      processes[selectedProcess.id - 1].completionTime = currentTime;
      processes[selectedProcess.id - 1].remainingTime = 0;
      completedProcesses++;
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
          // Перевіряємо чи процес виконується в цей момент
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
            <h1>Невитісняюче планування з пріоритетом</h1>
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
                label="Priorities (через кому)"
                variant="outlined"
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
                error={!!prioritiesError}
                helperText={prioritiesError}
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
            </form>
            <h2>Матриця статусу потоків відносно моментів часу</h2>
            <Typography variant="body1" style={{ margin: "20px 0" }}>
              <strong>-</strong> : Виконання не розпочалось <br />
              <strong>e</strong> : Виконується <br />
              <strong>w</strong> : Очікує <br />
            </Typography>
            <Typography>Найвищий пріоритет - 0</Typography>
            <br />

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
