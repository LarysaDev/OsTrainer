import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoggedInView } from "../../../common/LoggedInView/LoggedInView";
import { updateActiveLinkByIndex } from "../../../Components/SidePanel/SidePanel";
import { Container, Paper, Typography, Button, Box } from "@mui/material";

interface TestQuestion {
  Id: number;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

const SelfTest = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [testsWereGenerated, setGenerated] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{
    correct: number;
    total: number;
  } | null>(null);

  const fetchRandomQuestions = async () => {
    try {
      const response = await axios.get<TestQuestion[]>(
        "/api/assignment/getrandomtests",
        {
          params: { algorithmId },
        }
      );

      const testQuestions = response.data.tests.$values || [];
      setQuestions(testQuestions);
      setSelectedAnswers(Array(testQuestions.length).fill(-1));
      setResult(null);
      setGenerated(true);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const startTestAgain = () => {
    setSelectedAnswers(Array(questions.length).fill(-1));
    setResult(null);
  };

  const handleAnswerChange = (index: number, answerIndex: number) => {
    if (result) return;
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const checkResults = () => {
    const correctCount = questions.reduce((count, question, index) => {
      return (
        count + (selectedAnswers[index] === question.correctOptionIndex ? 1 : 0)
      );
    }, 0);
    setResult({ correct: correctCount, total: questions.length });
  };

  const renderQuestions = () => {
    return questions.map((question, index) => (
      <Box key={question.Id} mb={2}>
        <Typography variant="h6">{question.questionText}</Typography>
        {question.options.$values.map((option, optionIndex) => (
          <div key={optionIndex}>
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                checked={selectedAnswers[index] === optionIndex}
                onChange={() => handleAnswerChange(index, optionIndex)}
                disabled={result !== null}
              />
              {option}
            </label>
          </div>
        ))}
        {result && (
          <Typography
            mt={1}
            color={
              selectedAnswers[index] === question.correctOptionIndex
                ? "green"
                : "red"
            }
          >
            {selectedAnswers[index] === question.correctOptionIndex
              ? "Правильно"
              : "Неправильно"}
          </Typography>
        )}
      </Box>
    ));
  };

  return (
    <LoggedInView links={updateActiveLinkByIndex(-1)}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          p: 2,
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            p: 2,
            height: "60vh",
          }}
        >
          <Container sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Самостійне тестування
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchRandomQuestions}
            >
              Отримати 5 випадкових питань
            </Button>

            {questions.length > 0 && (
              <Paper
                elevation={3}
                sx={{ maxHeight: "400px", overflowY: "auto", mt: 3, p: 2 }}
              >
                {renderQuestions()}
              </Paper>
            )}
            <Box mt={3}>
              {testsWereGenerated && (
                <>
                  {result ? (
                    <Typography variant="h6" mt={2}>
                      Результати: {result.correct} з {result.total} правильних
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={checkResults}
                    >
                      Перевірити результати
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={result ? startTestAgain : fetchRandomQuestions}
                    sx={{ ml: 2 }}
                  >
                    {result
                      ? "Почати тестування наново"
                      : "Перегенерувати тести"}
                  </Button>
                </>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </LoggedInView>
  );
};

export default SelfTest;
