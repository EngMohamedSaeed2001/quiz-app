import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
const URL = "http://localhost:9000/questions";
const intialQuestions = {
  questions: [],
  //loading, error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
  score: 0,
};

const SECS_REMAINING_PER_QUESTION = 30;
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_REMAINING_PER_QUESTION,
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? question.points + state.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,

        answer: null,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finish" : state.status,
      };
    case "finish":
      return {
        ...state,
        status: "finish",
        score: state.points > state.score ? state.points : state.score,
      };
    case "restart":
      return {
        ...intialQuestions,
        questions: state.questions,
        status: "ready",
      };

    default:
      throw new Error("Unknown action");
  }
}

function QuizProvider({ children }) {
  const [
    {
      status,
      questions,
      index,
      answer,
      correctOption,
      points,
      secondsRemaining,
      score,
    },
    dispatch,
  ] = useReducer(reducer, intialQuestions);

  const totalPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  const questionsNumber = questions.length;

  useEffect(() => {
    fetch(`${URL}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => {
        dispatch({ type: "dataFailed" });
        console.log(err);
      });
  }, [dispatch]);

  return (
    <QuizContext.Provider
      value={{
        status,
        questions,
        index,
        answer,
        correctOption,
        points,
        secondsRemaining,
        score,
        questionsNumber,
        totalPoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("The Questions context is used outside Provider");
  return context;
}

export { useQuiz, QuizProvider };
