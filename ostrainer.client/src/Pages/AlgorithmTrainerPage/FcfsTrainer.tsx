import { useState } from "react";
import axios from "axios";
import styles from "./Trainer.module.less";
import { links } from "../Student/Dashboard/Dashboard";
import { SidePanel } from "../../Components/SidePanel/SidePanel";

interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
}

const FcfsTrainer: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [arrivalTimes, setArrivalTimes] = useState<string>("");
  const [burstTimes, setBurstTimes] = useState<string>("");
  const [matrix, setMatrix] = useState<(string | number)[][]>([]);
  const [error, setError] = useState<string>("");

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
      setProcesses(response.data);
      generateMatrixTable(response.data);
    } catch (error) {
      console.error("Error generating Gantt chart", error);
    }
  };

  const generateMatrixTable = (processes: Process[]) => {
    const completionTimes = processes.map((p) => p.completionTime || 0);
    const arrivalArray = processes.map((p) => p.arrivalTime);
    const burstArray = processes.map((p) => p.burstTime);

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
  };

  return (
    <div>
      <SidePanel links={links} />
      <h1>Gantt Chart Generator: FCFS</h1>
      <form>
        <label>
          Arrival Times (comma-separated):
          <input
            type="text"
            value={arrivalTimes}
            onChange={(e) => setArrivalTimes(e.target.value)}
          />
        </label>
        <label>
          Burst Times (comma-separated):
          <input
            type="text"
            value={burstTimes}
            onChange={(e) => setBurstTimes(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleGenerate}>
          Generate Gantt Chart
        </button>
      </form>
      <h2>Gantt Chart: Output</h2>
      <div id="ganttChart">
        <table>
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              <th>Completion Time</th>
              <th>Turnaround Time</th>
              <th>Waiting Time</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id}>
                <td>{process.id}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.burstTime}</td>
                <td>{process.completionTime}</td>
                <td>{process.turnaroundTime}</td>
                <td>{process.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Matrix of process status</h2>
        <table>
          <thead>
            <tr>
              {matrix[0]?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FcfsTrainer;
