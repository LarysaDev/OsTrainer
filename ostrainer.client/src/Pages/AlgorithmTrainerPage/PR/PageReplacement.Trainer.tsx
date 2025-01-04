import { useState } from "react";
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
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { generatePageReplacementData } from "../../../common/RandomGenerators/AlgorithmRandomDataGenerator";

const generateMatrix = (
  pageRequests: number[],
  frameCount: number,
  algorithm: string
) => {
  if (algorithm == "lfu") {
    return generateLFUMatrix(pageRequests, frameCount);
  } else if (algorithm == "clock") {
    return generateClockMatrix(pageRequests, frameCount);
  } else if (algorithm == "mfu") {
    return generateMFUMatrix(pageRequests, frameCount);
  }
};

export const PageReplacementTrainer: React.FC = () => {
  const { algorithm } = useParams<{ algorithm: string }>();
  const [pageRequests, setPageRequests] = useState<string>("");
  const [frameSize, setFrameSize] = useState<number>(0);
  const [pageError, setPageError] = useState<string | null>(null);
  const [frameError, setFrameError] = useState<string | null>(null);
  const [userMatrix, setUserMatrix] = useState<(string | number)[][]>([]);
  const [correctMatrix, setCorrectMatrix] = useState<(number | null)[][]>([]);
  const [correctPageFaults, setCorrectPageFaults] = useState<boolean[]>([]);
  const [cellValidation, setCellValidation] = useState<boolean[][]>([]);
  const [pageFaultValidation, setPageFaultValidation] = useState<boolean[]>([]);

  const validateInputs = () => {
    const trimmedPageRequests = pageRequests.replace(/\s+/g, "");
    const requestArray = trimmedPageRequests.split(",");

    let valid = true;

    if (isNaN(frameSize) || frameSize <= 0) {
      setFrameError("Кількість кадрів має бути більше, ніж 0");
      valid = false;
    } else {
      setFrameError(null);
    }

    const pageInvalid = requestArray.some(
      (value) => isNaN(Number(value)) || value === ""
    );

    if (pageInvalid) {
      setPageError(
        "Сторінки для завантаження повинні містити тільки коректні значення"
      );
      valid = false;
    } else {
      setPageError(null);
    }

    return valid;
  };

  const handleCellChange = (
    rowIndex: number,
    cellIndex: number,
    value: string
  ) => {
    setUserMatrix((prev) => {
      const newMatrix = [...prev];
      newMatrix[rowIndex + 1][cellIndex] = value;
      return newMatrix;
    });
  };

  const handleAutocompleteInput = () => {
    const [pages, frameSize] = generatePageReplacementData();
    setPageRequests(pages.join(","));
    setFrameSize(frameSize);
  };

  const handleVerifyMatrix = () => {
    if (!correctMatrix.length) return;

    const validationMatrix: boolean[][] = [];
    const pageFaultValidations: boolean[] = [];

    for (let i = 1; i < userMatrix.length - 1; i++) {
      validationMatrix[i - 1] = [];
      for (let j = 1; j < userMatrix[i].length; j++) {
        const userValue =
          userMatrix[i][j] === "" ? null : Number(userMatrix[i][j]);
        const correctValue = correctMatrix[i - 1][j - 1];
        validationMatrix[i - 1][j - 1] = userValue === correctValue;
      }
    }

    const lastRow = userMatrix[userMatrix.length - 1];
    for (let j = 1; j < lastRow.length; j++) {
      const userFault = lastRow[j] === "f";
      const correctFault = correctPageFaults[j - 1];
      pageFaultValidations[j - 1] = userFault === correctFault;
    }

    setCellValidation(validationMatrix);
    setPageFaultValidation(pageFaultValidations);
  };

  const getCellStyle = (
    rowIndex: number,
    cellIndex: number,
    isPageFaultRow: boolean = false
  ) => {
    if (cellIndex === 0) return {};

    if (isPageFaultRow) {
      const isValid = pageFaultValidation[cellIndex - 1];
      if (isValid === undefined) return {};
      return {
        backgroundColor: isValid ? "#e8f5e9" : "#ffebee",
        borderRadius: "4px",
      };
    }

    const isValid = cellValidation[rowIndex]?.[cellIndex - 1];
    if (isValid === undefined) return {};

    return {
      backgroundColor: isValid ? "#e8f5e9" : "#ffebee",
      borderRadius: "4px",
    };
  };

  const handleGenerate = () => {
    if (!validateInputs()) return;

    const requestArray = pageRequests
      .replace(/\s+/g, "")
      .split(",")
      .map(Number);

    const { matrix: correctFrameMatrix, pageFaults } = generateMatrix(
      requestArray,
      frameSize,
      algorithm
    );
    setCorrectMatrix(correctFrameMatrix);
    setCorrectPageFaults(pageFaults);

    const userMatrixTemplate: (string | number)[][] = [
      ["Page Requests", ...requestArray],
      ...Array.from({ length: frameSize }, (_, index) => [
        `frame ${index + 1}`,
        ...Array.from({ length: requestArray.length }, () => ""),
      ]),
      ["Page Fault?", ...Array.from({ length: requestArray.length }, () => "")],
    ];

    setUserMatrix(userMatrixTemplate);
    setCellValidation([]);
    setPageFaultValidation([]);
  };

  const handleFillMatrix = () => {
    if (!correctMatrix.length) return;

    const filledMatrix = [
      userMatrix[0],
      ...correctMatrix.map((row, index) => [
        `frame ${index + 1}`,
        ...row.map((val) => (val === null ? "" : val)),
      ]),
      ["Page Fault?", ...correctPageFaults.map((fault) => (fault ? "f" : ""))],
    ];

    setUserMatrix(filledMatrix);
  };

  const handleClearMatrix = () => {
    if (!userMatrix.length) return;

    const clearedMatrix = userMatrix.map((row, rowIndex) => {
      if (rowIndex === 0) return row;
      return row.map((cell, cellIndex) => (cellIndex === 0 ? cell : ""));
    });

    setUserMatrix(clearedMatrix);
    setCellValidation([]);
    setPageFaultValidation([]);
  };

  return (
    <div className={styles.container}>
      <AuthorizeView>
        <div className={styles.sidePanel}>
          <SidePanel links={updateActiveLinkByIndex(2)} />
        </div>
        <div className={styles.main}>
          <div className={styles.chartContainer}>
            <h1>{algorithm?.toUpperCase()}</h1>
            <form>
              <TextField
                label="Сторінки для завантаження"
                variant="outlined"
                value={pageRequests}
                onChange={(e) => setPageRequests(e.target.value)}
                error={!!pageError}
                helperText={pageError}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Кількість кадрів"
                variant="outlined"
                type="number"
                value={frameSize}
                onChange={(e) => setFrameSize(parseInt(e.target.value, 10))}
                error={!!frameError}
                helperText={frameError}
                fullWidth
                margin="normal"
              />
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerate}
                  sx={{ mr: 1 }}
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
                <Typography sx={{ marginTop: "15px" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleFillMatrix}
                    sx={{ mr: 1 }}
                  >
                    Заповнити правильними значеннями
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={handleVerifyMatrix}
                    sx={{ mr: 1 }}
                  >
                    Перевірити
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearMatrix}
                  >
                    Очистити все
                  </Button>
                </Typography>
              </Box>
            </form>

            <TableContainer
              component={Paper}
              style={{ maxWidth: "1000px", overflowX: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {userMatrix[0]?.map((header, index) => (
                      <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userMatrix.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} align="center">
                          {cellIndex === 0 ? (
                            cell
                          ) : (
                            <input
                              value={cell}
                              onChange={(e) =>
                                handleCellChange(
                                  rowIndex,
                                  cellIndex,
                                  e.target.value
                                )
                              }
                              style={{
                                width: "50px",
                                textAlign: "center",
                                padding: "4px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                ...getCellStyle(
                                  rowIndex,
                                  cellIndex,
                                  rowIndex === userMatrix.length - 2
                                ),
                              }}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </AuthorizeView>
    </div>
  );
};

const generateLFUMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];
  const counters = new Map();

  pageRequests.forEach((page, columnIndex) => {
    const isPagePresent = frames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.push(page);
        counters.set(page, 1);
      } else {
        let minCount = Infinity;
        let leastFrequent = null;

        for (const frame of frames) {
          if (counters.get(frame) < minCount) {
            minCount = counters.get(frame);
            leastFrequent = frame;
          }
        }

        const replaceIndex = frames.indexOf(leastFrequent);
        frames[replaceIndex] = page;
        counters.delete(leastFrequent);
        counters.set(page, 1);
      }
    } else {
      pageFaults.push(false);
      counters.set(page, counters.get(page) + 1);
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i] ?? null;
    }
  });

  return { matrix, pageFaults };
};

const generateMFUMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames: number[] = [];
  const pageFaults: boolean[] = [];
  const counters = new Map();

  pageRequests.forEach((page, columnIndex) => {
    const isPagePresent = frames.includes(page);

    if (!isPagePresent) {
      pageFaults.push(true);

      if (frames.length < frameCount) {
        frames.push(page);
        counters.set(page, 1);
      } else {
        let maxCount = -1;
        let mostFrequent = null;

        for (const frame of frames) {
          if (counters.get(frame) > maxCount) {
            maxCount = counters.get(frame);
            mostFrequent = frame;
          }
        }

        const replaceIndex = frames.indexOf(mostFrequent);
        frames[replaceIndex] = page;
        counters.delete(mostFrequent);
        counters.set(page, 1);
      }
    } else {
      pageFaults.push(false);
      counters.set(page, counters.get(page) + 1);
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i] ?? null;
    }
  });

  return { matrix, pageFaults };
};

const generateClockMatrix = (pageRequests: number[], frameCount: number) => {
  const matrix = Array.from({ length: frameCount }, () =>
    new Array(pageRequests.length).fill(null)
  );
  const frames = new Array(frameCount).fill(null);
  const secondChanceBits = new Array(frameCount).fill(0);
  const pageFaults: boolean = [];
  let pointer = 0;

  pageRequests.forEach((page, columnIndex) => {
    const frameIndex = frames.indexOf(page);

    if (frameIndex === -1) {
      pageFaults.push(true);

      if (frames.includes(null)) {
        const emptyIndex = frames.indexOf(null);
        frames[emptyIndex] = page;
        secondChanceBits[emptyIndex] = 1;
      } else {
        while (secondChanceBits[pointer] === 1) {
          secondChanceBits[pointer] = 0;
          pointer = (pointer + 1) % frameCount;
        }
        frames[pointer] = page;
        secondChanceBits[pointer] = 1;
        pointer = (pointer + 1) % frameCount;
      }
    } else {
      pageFaults.push(false);
      secondChanceBits[frameIndex] = 1;
    }

    for (let i = 0; i < frameCount; i++) {
      matrix[i][columnIndex] = frames[i];
    }
  });

  return { matrix, pageFaults };
};
