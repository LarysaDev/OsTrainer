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
  TextField,
} from "@mui/material";

export const links: SidePanelLink[] = [
  { label: "Dashboard", link: "/" },
  { label: "Scheduling", link: "/scheduling" },
  { label: "Page Replacement", link: "/page-replacement", active: true },
  { label: "Avoiding Deadlocks", link: "/" },
  { label: "Assignments", link: "/" },
];

export const FifoTrainer: React.FC = () => {
  const [pageRequests, setPageRequests] = useState<string>("");
  const [frameSize, setFrameSize] = useState<number>(0);
  const [pageError, setPageError] = useState<string | null>(null);
  const [frameError, setFrameError] = useState<string | null>(null);
  const [draftMatrix, setDraftMatrix] = useState<(string | number)[][]>([]);
  const [userMatrix, setUserMatrix] = useState<(string | number)[][]>([]);
  const [finalFrames, setFinalFrames] = useState<string>("");
  const [finalPageFaults, setFinalPageFaults] = useState<number | null>(null);
  const [result, setResult] = useState<{
    finalFrames: number[];
    pageFaults: boolean[];
  } | null>(null);

  const validateInputs = () => {
    const trimmedPageRequests = pageRequests.replace(/\s+/g, "");
    const requestArray = trimmedPageRequests.split(",");

    let valid = true;

    if (isNaN(frameSize) || frameSize <= 0) {
      setFrameError("Frame Size must be a valid positive number.");
      valid = false;
    } else {
      setFrameError(null);
    }

    const pageInvalid = requestArray.some(
      (value) => isNaN(Number(value)) || value === ""
    );

    if (pageInvalid) {
      setPageError("Page Requests must contain only valid numbers.");
      valid = false;
    } else {
      setPageError(null);
    }

    return valid;
  };

  const resetColors = () => {
    const finalFramesInput = document.getElementById("final-frames") as HTMLInputElement;
    const pageFaultsInput = document.getElementById("page-faults") as HTMLInputElement;

    if (finalFramesInput) finalFramesInput.style.backgroundColor = "";
    if (pageFaultsInput) pageFaultsInput.style.backgroundColor = "";
  };

  const handleGenerate = async () => {
    resetColors(); // Reset colors when generating a new matrix
    if (!validateInputs()) {
      return;
    }

    const requestArray = pageRequests
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);

    const matrix: (string | number)[][] = [
      ["Page Requests", ...requestArray],
      ...Array.from({ length: frameSize }, () => [
        "",
        ...Array.from({ length: requestArray.length }, () => ""),
      ]),
      ["Page Fault?", ...Array.from({ length: requestArray.length }, () => "")],
    ];

    setDraftMatrix(matrix);
    setUserMatrix(matrix.map((row) => row.map(() => "")));
    
    // Clear the Final Frames and Page Faults Count fields
    setFinalFrames("");
    setFinalPageFaults(null);
  };

  const handleShowResults = () => {
    if (result) {
      const { finalFrames, pageFaults } = result;

      // Update the Final Frames field
      setFinalFrames(finalFrames.$values.join(","));

      // Calculate the correct page faults count
      setFinalPageFaults(pageFaults);
    }
  };

  const handleVerify = async () => {
    if (!validateInputs()) {
      return;
    }

    const requestArray = pageRequests
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);

    try {
      const requestData = {
        pages: requestArray,
        frameCount: frameSize,
      };
      const response = await axios.post(
        "/api/pagereplacement/fifo",
        requestData
      );
      setResult(response.data);

      // Check results against user input
      const isFinalFramesCorrect =
        finalFrames.split(",").map(Number).toString() === response.data.finalFrames.$values.join(",").toString();
      const isPageFaultsCorrect = finalPageFaults === response.data.pageFaults;

      // Highlight fields based on correctness
      const finalFramesInput = document.getElementById("final-frames") as HTMLInputElement;
      const pageFaultsInput = document.getElementById("page-faults") as HTMLInputElement;

      finalFramesInput.style.backgroundColor = isFinalFramesCorrect ? "#c8e6c9" : "#ffccbc"; // Green or Coral
      pageFaultsInput.style.backgroundColor = isPageFaultsCorrect ? "#c8e6c9" : "#ffccbc"; // Green or Coral
    } catch (error) {
      console.error("Error generating FIFO matrix", error);
    }
  };

  const handleClearFields = () => {
    setFinalFrames("");
    setFinalPageFaults(null);
    resetColors(); // Reset colors when clearing fields
  };

  return (
    <div className={styles.container}>
      <AuthorizeView>
        <div className={styles.sidePanel}>
          <SidePanel links={links} />
        </div>
        <div className={styles.main}>
          <div className={styles.chartContainer}>
            <h1>Page Replacement Trainer: FIFO</h1>
            <form>
              <TextField
                label="Page Requests (comma-separated)"
                variant="outlined"
                value={pageRequests}
                onChange={(e) => setPageRequests(e.target.value)}
                error={!!pageError}
                helperText={pageError}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Frame Size"
                variant="outlined"
                type="number"
                value={frameSize}
                onChange={(e) => setFrameSize(parseInt(e.target.value, 10))}
                error={!!frameError}
                helperText={frameError}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
              >
                Generate Draft Matrix
              </Button>
            </form>
            <h2>Draft Matrix of Page Requests</h2>
            <TableContainer
              component={Paper}
              style={{ maxWidth: "1000px", overflowX: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {draftMatrix[0]?.map((header, index) => (
                      <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {draftMatrix.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {cellIndex === 0 ? (
                            cell
                          ) : (
                            <input
                              value={userMatrix[rowIndex + 1][cellIndex]}
                              onChange={(e) =>
                                setUserMatrix((prev) => {
                                  const newMatrix = [...prev];
                                  newMatrix[rowIndex + 1][cellIndex] =
                                    e.target.value;
                                  return newMatrix;
                                })
                              }
                              style={{ width: "50px", textAlign: "center" }}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <TextField
                id="final-frames"
                label="Final Frames (comma-separated)"
                variant="outlined"
                value={finalFrames}
                onChange={(e) => setFinalFrames(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                id="page-faults"
                label="Page Faults Count"
                variant="outlined"
                type="number"
                value={finalPageFaults === null ? "" : finalPageFaults}
                onChange={(e) => setFinalPageFaults(parseInt(e.target.value, 10) || null)}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleVerify}
                style={{ marginTop: "10px" }}
              >
                Verify
              </Button>
              <Button
                variant="contained"
                onClick={handleShowResults}
                style={{ marginLeft: "10px", marginTop: "10px" }}
              >
                Show Results
              </Button>
              <Button
                variant="contained"
                onClick={handleClearFields}
                style={{ marginLeft: "10px", marginTop: "10px" }}
              >
                Clear Final Fields
              </Button>
            </Box>
          </div>
        </div>
      </AuthorizeView>
    </div>
  );
};
