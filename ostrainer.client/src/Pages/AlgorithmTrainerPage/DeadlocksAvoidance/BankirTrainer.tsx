import { useState } from "react";
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
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
} from "@mui/material";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";

const BankersAlgorithmTrainer: React.FC = () => {
  const [numResources, setNumResources] = useState<number>(0);
  const [numProcesses, setNumProcesses] = useState<number>(0);
  const [allocation, setAllocation] = useState<number[][]>([]);
  const [maximum, setMaximum] = useState<number[][]>([]);
  const [available, setAvailable] = useState<number[]>([]);
  const [userNeed, setUserNeed] = useState<string[][]>([]);
  const [userIsSafe, setUserIsSafe] = useState<boolean>(false);
  const [userSafeSequence, setUserSafeSequence] = useState<string>("");

  // Validation states
  const [needValidation, setNeedValidation] = useState<boolean[][]>([]);
  const [safeStateValidation, setSafeStateValidation] = useState<
    boolean | null
  >(null);
  const [sequenceValidation, setSequenceValidation] = useState<boolean | null>(
    null
  );
  const [inputError, setInputError] = useState<string | null>(null);

  const validateAndInitialize = () => {
    if (numProcesses <= 0 || numResources <= 0) {
      setInputError("Введіть коректні значення для процесів та ресурсів");
      return false;
    }
    setInputError(null);
    return true;
  };

  const initializeMatrices = () => {
    if (!validateAndInitialize()) return;

    const newAllocation = Array(numProcesses)
      .fill(0)
      .map(() => Array(numResources).fill(0));
    const newMaximum = Array(numProcesses)
      .fill(0)
      .map(() => Array(numResources).fill(0));
    const newAvailable = Array(numResources).fill(0);
    const newUserNeed = Array(numProcesses)
      .fill(0)
      .map(() => Array(numResources).fill(""));

    setAllocation(newAllocation);
    setMaximum(newMaximum);
    setAvailable(newAvailable);
    setUserNeed(newUserNeed);
    setUserSafeSequence("");
    setUserIsSafe(false);

    // Reset validations
    setNeedValidation([]);
    setSafeStateValidation(null);
    setSequenceValidation(null);
  };

  const handleMatrixChange = (
    matrixSetter: React.Dispatch<React.SetStateAction<number[][]>>,
    matrix: number[][],
    row: number,
    col: number,
    value: string
  ) => {
    const newMatrix = matrix.map((r, i) => (i === row ? [...r] : r));
    newMatrix[row][col] = isNaN(parseInt(value)) ? 0 : parseInt(value);
    matrixSetter(newMatrix);
  };

  const handleAvailableChange = (index: number, value: string) => {
    const newAvailable = [...available];
    newAvailable[index] = parseInt(value) || 0;
    setAvailable(newAvailable);
  };

  const handleUserNeedChange = (row: number, col: number, value: string) => {
    const newUserNeed = [...userNeed];
    newUserNeed[row][col] = value;
    setUserNeed(newUserNeed);
  };

  const calculateNeedMatrix = (
    max: number[][],
    alloc: number[][]
  ): number[][] => {
    return max.map((row, i) =>
      row.map((val, j) => Math.max(0, val - alloc[i][j]))
    );
  };

  const fillCalculatedValues = () => {
    const calculatedNeed = calculateNeedMatrix(maximum, allocation);
    const safeStateResult = isSafeState(calculatedNeed, allocation, available);
    setUserNeed(calculatedNeed.map((row) => row.map((val) => val.toString())));
    setUserIsSafe(safeStateResult.isSafe);
    setUserSafeSequence(safeStateResult.sequence.toString());
  };

  const isSafeState = (
    need: number[][],
    alloc: number[][],
    avail: number[]
  ): { isSafe: boolean; sequence: number[] } => {
    const work = [...avail];
    const finish = Array(numProcesses).fill(false);
    const safeSeq: number[] = [];

    const canAllocate = (process: number): boolean => {
      return need[process].every((val, idx) => val <= work[idx]);
    };

    let count = 0;
    while (count < numProcesses) {
      let found = false;
      for (let p = 0; p < numProcesses; p++) {
        if (!finish[p] && canAllocate(p)) {
          work.forEach((_, idx) => {
            work[idx] += alloc[p][idx];
          });
          finish[p] = true;
          safeSeq.push(p);
          found = true;
          count++;
        }
      }
      if (!found) break;
    }

    return {
      isSafe: count === numProcesses,
      sequence: count === numProcesses ? safeSeq : [],
    };
  };

  const resetNeedMatrix = () => {
    setUserNeed(
      Array(numProcesses)
        .fill(0)
        .map(() => Array(numResources).fill(""))
    );
  };

  const resetSafeSequence = () => {
    setUserSafeSequence("");
    setSequenceValidation(null);
  };

  const resetSafeState = () => {
    setUserIsSafe(false);
    setSafeStateValidation(null);
  };

  const verifyAll = () => {
    // Calculate correct need matrix
    const calculatedNeed = calculateNeedMatrix(maximum, allocation);

    // Validate need matrix
    const needValidation = userNeed.map((row, i) =>
      row.map((val, j) => parseInt(val) === calculatedNeed[i][j])
    );
    setNeedValidation(needValidation);

    // Calculate and validate safe state
    const safeStateResult = isSafeState(calculatedNeed, allocation, available);
    setSafeStateValidation(userIsSafe === safeStateResult.isSafe);

    // Validate sequence if system is actually safe
    if (safeStateResult.isSafe) {
      const userSeq = userSafeSequence.trim()
        ? userSafeSequence
            .split(",")
            .map((s) => parseInt(s.trim()))
            .filter((n) => !isNaN(n))
        : [];

      const isValidSequence =
        userSeq.length === safeStateResult.sequence.length &&
        userSeq.every((val, idx) => val === safeStateResult.sequence[idx]);

      setSequenceValidation(isValidSequence);
    }
  };

  return (
    <LoggedInView links={updateActiveLinkByIndex(3)}>
      <Box
        sx={{
          p: 3,
          maxWidth: 1200,
          margin: "0 auto",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        {" "}
        <Typography variant="h4" gutterBottom>
          Алгоритм Банкіра
        </Typography>
        {inputError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {inputError}
          </Alert>
        )}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Кількість ресурсів"
            type="number"
            value={numResources}
            onChange={(e) => setNumResources(parseInt(e.target.value) || 0)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Кількість процесів"
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(parseInt(e.target.value) || 0)}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            onClick={initializeMatrices}
            sx={{ mt: 1 }}
          >
            Почати ініціалізацію
          </Button>
        </Box>
        {allocation.length > 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Доступні ресурси
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {available.map((val, idx) => (
                  <TextField
                    key={idx}
                    label={`R${idx}`}
                    type="number"
                    value={val}
                    onChange={(e) => handleAvailableChange(idx, e.target.value)}
                    size="small"
                  />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Виділені ресурси
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Process</TableCell>
                      {Array(numResources)
                        .fill(0)
                        .map((_, idx) => (
                          <TableCell key={idx}>R{idx}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allocation.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>P{i}</TableCell>
                        {row.map((val, j) => (
                          <TableCell key={j}>
                            <TextField
                              type="number"
                              value={val}
                              onChange={(e) =>
                                handleMatrixChange(
                                  setAllocation,
                                  allocation,
                                  i,
                                  j,
                                  e.target.value
                                )
                              }
                              size="small"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom>
                Маскимальні потреби
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Process</TableCell>
                      {Array(numResources)
                        .fill(0)
                        .map((_, idx) => (
                          <TableCell key={idx}>R{idx}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maximum.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>P{i}</TableCell>
                        {row.map((val, j) => (
                          <TableCell key={j}>
                            <TextField
                              type="number"
                              value={val}
                              onChange={(e) =>
                                handleMatrixChange(
                                  setMaximum,
                                  maximum,
                                  i,
                                  j,
                                  e.target.value
                                )
                              }
                              size="small"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" gutterBottom>
                Залишкові потреби (введіть самостійно)
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Process</TableCell>
                      {Array(numResources)
                        .fill(0)
                        .map((_, idx) => (
                          <TableCell key={idx}>R{idx}</TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userNeed.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>P{i}</TableCell>
                        {row.map((val, j) => (
                          <TableCell
                            key={j}
                            sx={{
                              backgroundColor:
                                needValidation[i]?.[j] === false
                                  ? "#ffebee"
                                  : needValidation[i]?.[j] === true
                                  ? "#e8f5e9"
                                  : "inherit",
                            }}
                          >
                            <TextField
                              type="number"
                              value={val}
                              onChange={(e) =>
                                handleUserNeedChange(i, j, e.target.value)
                              }
                              size="small"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  mb: 2,
                  bgcolor:
                    safeStateValidation === true
                      ? "rgba(76, 175, 80, 0.2)" // Light green for true
                      : safeStateValidation === false
                      ? "rgba(244, 67, 54, 0.2)" // Light red for false
                      : "transparent", // No background for null
                  p: 2, // Add some padding for better visibility
                  borderRadius: 2, // Optional: adds rounded corners
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userIsSafe}
                      onChange={(e) => setUserIsSafe(e.target.checked)}
                      sx={{
                        "&.Mui-checked": {
                          color:
                            safeStateValidation === true
                              ? "success.main"
                              : "error.main",
                        },
                      }}
                    />
                  }
                  label="Система в безпечному стані"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetSafeState}
                >
                  оновити
                </Button>
              </Box>

              <Box sx={{ mb: 2, marginTop: "20px" }}>
                <TextField
                  label="Безпечна послідовність процесів (наприклад: 2, 1, 3)"
                  value={userSafeSequence}
                  onChange={(e) => setUserSafeSequence(e.target.value)}
                  error={sequenceValidation === false}
                  helperText={
                    sequenceValidation === false ? "Incorrect sequence" : ""
                  }
                  sx={{
                    width: "80%",
                    paddingRight: "10px",
                    "& input": {
                      backgroundColor:
                        sequenceValidation === true
                          ? "#e8f5e9"
                          : sequenceValidation === false
                          ? "#ffebee"
                          : "inherit",
                    },
                  }}
                />
                <Button
                  sx={{ marginTop: "8px" }}
                  variant="contained"
                  color="primary"
                  onClick={resetSafeSequence}
                >
                  оновити
                </Button>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={verifyAll}
                sx={{ mr: 2 }}
              >
                Перевірити
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={fillCalculatedValues}
              >
                Заповнити правильними значеннями
              </Button>
            </Box>
          </>
        )}
      </Box>
    </LoggedInView>
  );
};

export default BankersAlgorithmTrainer;
