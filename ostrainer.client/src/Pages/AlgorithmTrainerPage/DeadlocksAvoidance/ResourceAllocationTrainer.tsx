import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Alert,
} from "@mui/material";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";

export const ResourceAllocationTrainer = () => {
  const [processCount, setProcessCount] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [allocationMatrix, setAllocationMatrix] = useState<number[][]>([]);
  const [requestMatrix, setRequestMatrix] = useState<number[][]>([]);
  const [availableResources, setAvailableResources] = useState<number[]>([]);
  const [safeState, setSafeState] = useState<boolean | null>(null);

  const handleGenerateMatrices = () => {
    setAllocationMatrix(
      Array.from({ length: processCount }, () => Array(resourceCount).fill(0))
    );
    setRequestMatrix(
      Array.from({ length: processCount }, () => Array(resourceCount).fill(0))
    );
    setAvailableResources(Array(resourceCount).fill(0));
    setSafeState(null);
  };

  const handleRunSafetyAlgorithm = () => {
    const isSafe = runSafetyAlgorithm(
      requestMatrix,
      allocationMatrix,
      availableResources
    );
    setSafeState(isSafe);
  };

  const handleCellChange = (
    matrixType: "allocation" | "request",
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updatedMatrix =
      matrixType === "allocation" ? [...allocationMatrix] : [...requestMatrix];
    updatedMatrix[rowIndex][colIndex] = Number(value);
    matrixType === "allocation"
      ? setAllocationMatrix(updatedMatrix)
      : setRequestMatrix(updatedMatrix);
  };

  const handleAvailableChange = (index: number, value: string) => {
    const updatedAvailable = [...availableResources];
    updatedAvailable[index] = Number(value);
    setAvailableResources(updatedAvailable);
  };

  // Generate SVG for resource allocation graph
  const generateGraphSVG = () => {
    const svgWidth = 600;
    const svgHeight = 400;
    const processRadius = 25;
    const resourceRadius = 20;

    const processSpacing = svgWidth / (processCount + 1);
    const resourceSpacing = svgWidth / (resourceCount + 1);

    const processes = Array.from({ length: processCount }, (_, i) => ({
      id: `P${i + 1}`,
      x: processSpacing * (i + 1),
      y: 100,
    }));

    const resources = Array.from({ length: resourceCount }, (_, i) => ({
      id: `R${i + 1}`,
      x: resourceSpacing * (i + 1),
      y: 300,
    }));

    const paths = [];

    allocationMatrix.forEach((row, pIdx) => {
      row.forEach((value, rIdx) => {
        if (value > 0) {
          const start = processes[pIdx];
          const end = resources[rIdx];
          paths.push({
            id: `alloc-${pIdx}-${rIdx}`,
            d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
            color: "#1976d2",
          });
        }
      });
    });

    requestMatrix.forEach((row, pIdx) => {
      row.forEach((value, rIdx) => {
        if (value > 0) {
          const start = processes[pIdx];
          const end = resources[rIdx];
          paths.push({
            id: `req-${pIdx}-${rIdx}`,
            d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
            color: "#d32f2f",
            dashed: true,
          });
        }
      });
    });

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "white",
        }}
      >
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            strokeDasharray={path.dashed ? "5,5" : "none"}
          />
        ))}

        {processes.map((process) => (
          <g key={process.id}>
            <circle
              cx={process.x}
              cy={process.y}
              r={processRadius}
              fill="#1976d2"
              style={{ transition: "fill 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.fill = "#2196f3")}
              onMouseOut={(e) => (e.currentTarget.style.fill = "#1976d2")}
            />
            <text
              x={process.x}
              y={process.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              {process.id}
            </text>
          </g>
        ))}

        {resources.map((resource) => (
          <g key={resource.id}>
            <rect
              x={resource.x - resourceRadius}
              y={resource.y - resourceRadius}
              width={resourceRadius * 2}
              height={resourceRadius * 2}
              fill="#2e7d32"
              style={{ transition: "fill 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.fill = "#4caf50")}
              onMouseOut={(e) => (e.currentTarget.style.fill = "#2e7d32")}
            />
            <text
              x={resource.x}
              y={resource.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              {resource.id}
            </text>
          </g>
        ))}

        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
          </marker>
        </defs>
      </svg>
    );
  };

  return (
    <LoggedInView links={updateActiveLinkByIndex(3)}>
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, overflowY: "auto", maxHeight: "80vh" }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Граф розподілу ресурсів
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                label="Number of Processes"
                type="number"
                value={processCount}
                onChange={(e) => setProcessCount(parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
                fullWidth
              />
              <TextField
                label="Number of Resources"
                type="number"
                value={resourceCount}
                onChange={(e) =>
                  setResourceCount(parseInt(e.target.value) || 0)
                }
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button variant="contained" onClick={handleGenerateMatrices}>
                Generate Matrices
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRunSafetyAlgorithm}
              >
                Check Safety
              </Button>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { md: "repeat(2, 1fr)" },
                gap: 3,
              }}
            >
              <MatrixTable
                title="Allocation Matrix"
                matrix={allocationMatrix}
                onChange={(row, col, value) =>
                  handleCellChange("allocation", row, col, value)
                }
              />
              <MatrixTable
                title="Request Matrix"
                matrix={requestMatrix}
                onChange={(row, col, value) =>
                  handleCellChange("request", row, col, value)
                }
              />
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography variant="h5">Available Resources</Typography>
              {availableResources.map((resource, index) => (
                <TextField
                  key={index}
                  label={`Resource ${index + 1}`}
                  type="number"
                  value={resource}
                  onChange={(e) => handleAvailableChange(index, e.target.value)}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography variant="h5">Safety Algorithm Result</Typography>
              {safeState !== null && (
                <Alert severity={safeState ? "success" : "error"}>
                  The system is {safeState ? "in a safe state." : "not in a safe state."}
                </Alert>
              )}
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography variant="h5">Resource Allocation Graph</Typography>
              {generateGraphSVG()}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LoggedInView>
  );
};

const MatrixTable = ({ title, matrix, onChange }) => (
  <Paper>
    <Typography variant="h6" align="center">
      {title}
    </Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Processes / Resources</TableCell>
            {Array.from({ length: matrix[0]?.length || 0 }, (_, i) => (
              <TableCell key={i}>{`R${i + 1}`}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {matrix.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{`P${rowIndex + 1}`}</TableCell>
              {row.map((cellValue, colIndex) => (
                <TableCell key={colIndex}>
                  <TextField
                    type="number"
                    value={cellValue}
                    onChange={(e) => onChange(rowIndex, colIndex, e.target.value)}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

function runSafetyAlgorithm(max: number[][], allocation: number[][], available: number[]): boolean {
    const processCount = max.length;
    const resourceCount = available.length;
  
    const need: number[][] = Array.from({ length: processCount }, (_, i) =>
      Array.from({ length: resourceCount }, (_, j) => max[i][j] - allocation[i][j])
    );
  
    const finish: boolean[] = Array(processCount).fill(false);
    const work: number[] = [...available];
    const safeSequence: number[] = [];
  
    while (safeSequence.length < processCount) {
      let found = false;
  
      for (let i = 0; i < processCount; i++) {
        if (!finish[i]) {
          let canRun = true;
          for (let j = 0; j < resourceCount; j++) {
            if (need[i][j] > work[j]) {
              canRun = false;
              break;
            }
          }
  
          if (canRun) {
            for (let j = 0; j < resourceCount; j++) {
              work[j] += allocation[i][j];
            }
            safeSequence.push(i);
            finish[i] = true;
            found = true;
          }
        }
      }
  
      if (!found) {
        return false;
      }
    }
  
    return true;
}