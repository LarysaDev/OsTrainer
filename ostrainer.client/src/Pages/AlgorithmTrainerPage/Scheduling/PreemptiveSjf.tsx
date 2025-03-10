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
import { generateRandomData } from "../../../common/RandomGenerators/AlgorithmRandomDataGenerator";

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
        "Arrival Times  повинні містити тільки коректні числові значення."
      );
      valid = false;
    } else if (!arrivalError) {
      setArrivalError(null);
    }

    if (burstInvalid) {
      setBurstError(
        "Burst Times  повинні містити тільки коректні числові значення."
      );
      valid = false;
    } else if (!burstError) {
      setBurstError(null);
    }

    return valid;
  };

  const handleAutocompleteInput = () => {
    const [arrivalTimes, burstTimes] = generateRandomData();
    setArrivalTimes(arrivalTimes.join(","));
    setBurstTimes(burstTimes.join(","));
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
      generateMatrixTable(arrivalArray, burstArray);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (
    arrivalTimes: number[],
    burstTimes: number[]
  ) => {
    let processes: Process[] = arrivalTimes.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstTimes[index],
      remainingTime: burstTimes[index],
      startTime: undefined,
      completionTime: undefined,
      currentStartTime: undefined,
    }));
  
    const minArrivalTime = Math.min(...arrivalTimes);
    let currentTime = minArrivalTime;
    let completedProcesses = 0;
    let executionHistory: { time: number; processId: number }[] = [];
    let currentProcess: Process | null = null;
  
    while (completedProcesses < processes.length) {
      let availableProcesses = processes.filter(
        (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
      );
  
      if (availableProcesses.length === 0) {
        currentTime = Math.min(
          ...processes
            .filter((p) => p.remainingTime > 0)
            .map((p) => p.arrivalTime)
        );
        continue;
      }
  
      availableProcesses.sort((a, b) => a.remainingTime - b.remainingTime);
  
      let nextProcess = availableProcesses[0];
  
      if (currentProcess && currentProcess.remainingTime > 0) {
        if (nextProcess.remainingTime < currentProcess.remainingTime) {
          currentProcess = nextProcess;
        }
      } else {
        currentProcess = nextProcess;
      }
  
      if (processes[currentProcess.id - 1].startTime === undefined) {
        processes[currentProcess.id - 1].startTime = currentTime;
      }
  
      processes[currentProcess.id - 1].currentStartTime = currentTime;
  
      executionHistory.push({
        time: currentTime,
        processId: currentProcess.id,
      });
  
      currentProcess.remainingTime--;
      currentTime++;
  
      if (currentProcess.remainingTime === 0) {
        processes[currentProcess.id - 1].completionTime = currentTime;
        completedProcesses++;
        currentProcess = null;
      }
    }
  
    const maxTime = Math.max(...processes.map((p) => p.completionTime!));
  
    const matrix: (string | number)[][] = [];
  
    const headerRow: (string | number)[] = ["Process\\Time"];
    for (let t = minArrivalTime; t <= maxTime; t++) {
      headerRow.push(t);
    }
    matrix.push(headerRow);
  
    processes.forEach((process) => {
      const row: (string | number)[] = [`P${process.id}`];
      for (let t = minArrivalTime; t <= maxTime; t++) {
        if (t < process.arrivalTime) {
          row.push("-");
        } else if (t >= process.completionTime!) {
          row.push("");
        } else {
          const isExecuting = executionHistory.find(
            (h) => h.time === t && h.processId === process.id
          );
          if (isExecuting) {
            row.push("e"); 
          } else {
            row.push("w"); 
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
            <h1>Витісняючий SJF</h1>
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
