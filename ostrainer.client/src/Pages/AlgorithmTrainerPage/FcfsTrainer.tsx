import { useState } from "react";
import axios from "axios";
import styles from "./Trainer.module.less";
import { links } from "../Student/Dashboard/Dashboard";
import { SidePanel } from "../../Components/SidePanel/SidePanel";
import AuthorizeView from "../../Components/AuthorizeView";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";

interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
}

export const FcfsTrainer: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [arrivalTimes, setArrivalTimes] = useState<string>("");
  const [burstTimes, setBurstTimes] = useState<string>("");
  const [matrix, setMatrix] = useState<(string | number)[][]>([]);
  const [userMatrix, setUserMatrix] = useState<(string | number)[][]>([]);
  const [colorMatrix, setColorMatrix] = useState<(string | number)[][]>([]);

  const handleGenerate = async () => {
    const arrivalArray = arrivalTimes.split(",").map(Number);
    const burstArray = burstTimes.split(",").map(Number);

    const processList = arrivalArray.map((arrival, index) => ({
      id: index + 1,
      arrivalTime: arrival,
      burstTime: burstArray[index],
    }));

    try {
      const response = await axios.post("/api/ganttchart/fcfs", processList);
      setProcesses(response.data.$values);
      generateMatrixTable(response.data.$values);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (processes: Process[]) => {
    const completionTimes = (processes as Process[]).map((p) => p.completionTime || 0);
    const maxTime = Math.max(...completionTimes);
    const matrix: (string | number)[][] = [];
    const headerRow: (string | number)[] = ["Process\\Time"];
    for (let t = 0; t <= maxTime; t++) {
      headerRow.push(t);
    }
    matrix.push(headerRow);

    (processes as Process[]).forEach((process, index) => {
      const row: (string | number)[] = [`P${index + 1}`];
      for (let t = 0; t <= maxTime; t++) {
        if (t < process.arrivalTime) {
          row.push("-");
        } else if (t >= process.arrivalTime && t < process.completionTime!) {
          if (t - process.arrivalTime < process.burstTime) {
            row.push("e"); // Executing
          } else {
            row.push("w"); // Waiting
          }
        } else {
          row.push("x"); // Completed
        }
      }
      matrix.push(row);
    });

    setMatrix(matrix);
    setUserMatrix(
      matrix.map((row) =>
        row.map((cell) =>
          typeof cell === "number" ? cell : ""
        )
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
        row.map((cell) =>
          typeof cell === "number" ? cell : ""
        )
      )
    );
    setColorMatrix(matrix.map((row) => row.map(() => "")));
  };

  const handleFillCalculatedValues = () => {
    setUserMatrix(matrix);
  };

  const handleProcessInputChange = (
    index: number,
    field: keyof Process,
    value: string
  ) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index] = {
      ...updatedProcesses[index],
      [field]: parseFloat(value),
    };
    setProcesses(updatedProcesses);
  };

  return (
    <div className={styles.container}>
      <AuthorizeView>
        <div className={styles.sidePanel}>
          <SidePanel links={links} />
        </div>
        <div className={styles.main}>
          <div className={styles.chartContainer}>
            <h1>Gantt Chart Generator: FCFS</h1>
            <form>
              <TextField
                label="Arrival Times (comma-separated)"
                variant="outlined"
                value={arrivalTimes}
                onChange={(e) => setArrivalTimes(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Burst Times (comma-separated)"
                variant="outlined"
                value={burstTimes}
                onChange={(e) => setBurstTimes(e.target.value)}
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
            <h2>Gantt Chart: Output</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Process</TableCell>
                    <TableCell>Arrival Time</TableCell>
                    <TableCell>Burst Time</TableCell>
                    <TableCell>Completion Time</TableCell>
                    <TableCell>Turnaround Time</TableCell>
                    <TableCell>Waiting Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processes.map((process, index) => (
                    <TableRow key={process.id}>
                      <TableCell>{process.id}</TableCell>
                      <TableCell>
                        <TextField
                          value={process.arrivalTime || ""}
                          onChange={(e) =>
                            handleProcessInputChange(
                              index,
                              "arrivalTime",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={process.burstTime || ""}
                          onChange={(e) =>
                            handleProcessInputChange(
                              index,
                              "burstTime",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={process.completionTime ?? 0}
                          onChange={(e) =>
                            handleProcessInputChange(
                              index,
                              "completionTime",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={process.turnaroundTime ?? 0}
                          onChange={(e) =>
                            handleProcessInputChange(
                              index,
                              "turnaroundTime",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={process.waitingTime ?? 0}
                          onChange={(e) =>
                            handleProcessInputChange(
                              index,
                              "waitingTime",
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <h2>Matrix of process status</h2>
            <TableContainer component={Paper}>
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
                              colorMatrix[rowIndex + 1][cellIndex + 1].toString() ||
                              "white",
                          }}
                        >
                          <TextField
                            value={userMatrix[rowIndex + 1][cellIndex + 1]}
                            onChange={(e) =>
                              handleUserInputChange(
                                rowIndex + 1,
                                cellIndex + 1,
                                e.target.value
                              )
                            }
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
                color="secondary"
                onClick={handleVerify}
                style={{ marginRight: "10px" }}
              >
                Verify
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClearAll}
                style={{ marginRight: "10px" }}
              >
                Clear all
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFillCalculatedValues}
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
