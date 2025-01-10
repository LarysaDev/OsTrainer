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
import { generateRandomData } from "../../../common/RandomGenerators/AlgorithmRandomDataGenerator";

export const NonpreemptiveSjfTrainer: React.FC = () => {
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
      setBurstError("Burst Times  повинні містити тільки коректні числові значення.");
      valid = false;
    } else if (!burstError) {
      setBurstError(null);
    }

    return valid;
  };

  const handleAutocompleteInput = () => {
    const [ arrivalTimes, burstTimes ] = generateRandomData();
    setArrivalTimes(arrivalTimes.join(','));
    setBurstTimes(burstTimes.join(','));
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
      generateMatrixTable(arrivalArray, burstArray);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  interface Process {
    arrivalTime: number;
    burstTime: number;
    completed?: boolean;
}

const generateMatrixTable = (arrivalTime: number[], burstTime: number[]) => {
    const processes: Process[] = arrivalTime.map((arrival, index) => ({
        arrivalTime: arrival,
        burstTime: burstTime[index],
        completed: false
    }));

    const n = processes.length;
    const completionTimes: number[] = new Array(n).fill(0);
    const startTimes: number[] = new Array(n).fill(0);
    const waitingTimes: number[] = new Array(n).fill(0);
    const turnaroundTimes: number[] = new Array(n).fill(0);

    let currentTime = Math.min(...arrivalTime);
    let completedProcesses = 0;

    while (completedProcesses < n) {
        let selectedProcess: number = -1;
        let shortestBurst = Number.MAX_VALUE;

        for (let i = 0; i < n; i++) {
            if (!processes[i].completed && 
                processes[i].arrivalTime <= currentTime && 
                processes[i].burstTime < shortestBurst) {
                selectedProcess = i;
                shortestBurst = processes[i].burstTime;
            }
        }

        if (selectedProcess !== -1) {
            startTimes[selectedProcess] = currentTime;
            completionTimes[selectedProcess] = currentTime + processes[selectedProcess].burstTime;
            currentTime = completionTimes[selectedProcess];
            processes[selectedProcess].completed = true;
            completedProcesses++;
        } else {
            let nextArrival = Number.MAX_VALUE;
            for (let i = 0; i < n; i++) {
                if (!processes[i].completed && processes[i].arrivalTime > currentTime) {
                    nextArrival = Math.min(nextArrival, processes[i].arrivalTime);
                }
            }
            currentTime = nextArrival;
        }
    }

    for (let i = 0; i < n; i++) {
        turnaroundTimes[i] = completionTimes[i] - processes[i].arrivalTime;
        waitingTimes[i] = turnaroundTimes[i] - processes[i].burstTime;
    }

    const maxTime = Math.max(...completionTimes);
    const matrix: (string | number)[][] = [];
    
    const headerRow: (string | number)[] = ["Process\\Time"];
    for (let t = 0; t <= maxTime; t++) {
        headerRow.push(t);
    }
    matrix.push(headerRow);

    processes.forEach((process, index) => {
        const row: (string | number)[] = [`P${index + 1}`];
        for (let t = 0; t <= maxTime; t++) {
            if (t < process.arrivalTime) {
                row.push("-");
            } else if (t >= startTimes[index] && t < completionTimes[index]) {
                row.push("e");
            } else if (t >= process.arrivalTime && t < startTimes[index]) {
                row.push("w");
            } else {
                row.push("");
            }
        }
        matrix.push(row);
    });

    setMatrix(matrix);
    setUserMatrix(matrix.map(row => row.map(cell => typeof cell === "number" ? cell : "")));
    setColorMatrix(matrix.map(row => row.map(() => "")));
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
            <h1>Невитісняючий SJF</h1>
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
