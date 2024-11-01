import { useState } from "react";
import axios from "axios";
import styles from "../Trainer.module.less";
import {
  SidePanel,
  SidePanelLink,
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

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/" },
  { label: "Scheduling", link: "/scheduling", active: true },
  { label: "Page Replacement", link: "/page-replacement" },
  { label: "Avoiding Deadlocks", link: "/" },
  { label: "Assignments", link: "/" },
];

export const FcfsTrainer: React.FC = () => {
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
      const response = await axios.post("/api/ganttchart/fcfs", processList);
      generateMatrixTable(response.data.$values);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  function generateMatrixTable(processes) {
    const n = processes.length;
    const matrix = [];
    const completionTimes = new Array(n).fill(0);
    const waitingTimes = new Array(n).fill(0);
    const turnaroundTimes = new Array(n).fill(0);

    // Calculate completion, waiting, and turnaround times
    let currentTime = 0;
    for (let i = 0; i < n; i++) {
      if (currentTime < processes[i].arrivalTime) {
        currentTime = processes[i].arrivalTime;
      }
      currentTime += processes[i].burstTime;
      completionTimes[i] = currentTime;
      turnaroundTimes[i] = completionTimes[i] - processes[i].arrivalTime;
      waitingTimes[i] = turnaroundTimes[i] - processes[i].burstTime;
    }

    // Create the header row
    const headerRow = ["Process\\Time"];
    const maxTime = Math.max(...completionTimes);
    for (let t = 0; t <= maxTime; t++) {
      headerRow.push(t);
    }
    matrix.push(headerRow);

    // Fill rows for each process in FCFS order
    for (let i = 0; i < n; i++) {
      const row = [`P${i + 1}`];
      let startTime = completionTimes[i] - processes[i].burstTime; // When this process starts
      let endTime = completionTimes[i]; // When this process completes

      for (let t = 0; t <= maxTime; t++) {
        if (t < processes[i].arrivalTime) {
          row.push("-"); // Process not yet arrived
        } else if (t >= startTime && t < endTime) {
          row.push("e"); // Process executing
        } else if (t >= endTime) {
          row.push(""); // Process completed
        } else {
          row.push("w"); // Waiting
        }
      }
      matrix.push(row);
    }

    setMatrix(matrix);
    setUserMatrix(
      matrix.map((row) =>
        row.map((cell) => (typeof cell === "number" ? cell : ""))
      )
    );
    setColorMatrix(matrix.map((row) => row.map(() => "")));
  }

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
