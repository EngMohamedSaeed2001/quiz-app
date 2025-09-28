import { useQuiz } from "../Contexts/QuizProvider";
import Options from "./Options";

function Question() {
  const { questions, answer, dispatch, index } = useQuiz();
  return (
    <div>
      <h4>{questions[index].question}</h4>
      <Options
        question={questions[index]}
        answer={answer}
        dispatch={dispatch}
      />
    </div>
  );
}

export default Question;
