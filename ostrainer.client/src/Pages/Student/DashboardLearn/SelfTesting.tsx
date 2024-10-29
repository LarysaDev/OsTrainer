import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

interface TestQuestion {
  Id: number;
  QuestionText: string;
  Options: string[];
  CorrectOptionIndex: number;
}

const SelfTest = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  const fetchRandomQuestions = async () => {
    try {
      const response = await axios.get<TestQuestion[]>("/api/assignment/getrandomtests", {
        params: { algorithmId },
      });
      
      const testQuestions = response.data.tests.$values || [];
      setQuestions(testQuestions);
      setSelectedAnswers(Array(testQuestions.length).fill(-1));
      setResult(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswerChange = (index: number, answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const checkResults = () => {
    const correctCount = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correctOptionIndex ? 1 : 0);
    }, 0);
    setResult({ correct: correctCount, total: questions.length });
  };

  const renderQuestions = () => {
    console.log(questions[0])
    return questions.map((question, index) => (
      <div key={question.Id} style={{ marginBottom: '15px' }}>
        <h4>{question.questionText}</h4>
        {question.options.$values.map((option, optionIndex) => (
          <div key={optionIndex}>
            <label>
              <input
                type="radio"
                name={`question-${index}`}
                checked={selectedAnswers[index] === optionIndex}
                onChange={() => handleAnswerChange(index, optionIndex)}
              />
              {option}
            </label>
          </div>
        ))}
        {result && (
          <div style={{ marginTop: '5px', color: selectedAnswers[index] === question.correctOptionIndex ? 'green' : 'red' }}>
            {selectedAnswers[index] === question.correctOptionIndex ? 'Правильно' : 'Неправильно'}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
      <h2>Самостійне тестування</h2>
      <button onClick={fetchRandomQuestions}>Отримати 5 рандомних питань</button>
      {questions.length > 0 && renderQuestions()}
      <div style={{ marginTop: '20px' }}>
        <button onClick={checkResults}>Перевірити результати</button>
        <button onClick={fetchRandomQuestions} style={{ marginLeft: '10px' }}>Перегенерувати тести</button>
      </div>
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Результати: {result.correct} з {result.total} правильних</h3>
        </div>
      )}
    </div>
  );
};

export default SelfTest;
