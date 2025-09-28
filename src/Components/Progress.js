import { useQuiz } from "../Contexts/QuizProvider";

function Progress() {
  const { questionsNumber, index, answer, totalPoints, points } = useQuiz();
  return (
    <header className="progress">
      <progress
        max={questionsNumber}
        value={index + Number(answer !== null)}
      ></progress>
      <p>
        <strong>{index + 1}</strong> / {questionsNumber}
      </p>

      <p>
        <strong>{points}</strong> / {totalPoints}
      </p>
    </header>
  );
}

export default Progress;
