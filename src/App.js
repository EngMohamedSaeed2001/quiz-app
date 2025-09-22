import { useEffect, useReducer } from "react";

import Header from "./Components/Header";
import Main from "./Components/Main";
import Footer from "./Components/Footer";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import Question from "./Components/Question";
import StartScreen from "./Components/StartScreen";
import Progress from "./Components/Progress";
import NextButton from "./Components/NextButton";
import Timer from "./Components/Timer";
import FinishedScreen from "./Components/FinishedScreen";

import "./index.css";

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

function App() {
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

  const quesionsNumber = questions.length;
  const totalPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, [dispatch]);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "dataFailed" && <Error />}
        {status === "ready" && (
          <>
            <StartScreen quesionsNumber={quesionsNumber} dispatch={dispatch} />
          </>
        )}
        {status === "active" && (
          <>
            <Progress
              max={quesionsNumber}
              index={index}
              answer={answer}
              totalPoints={totalPoints}
              correctOption={correctOption}
              points={points}
            />
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />

            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                quesionsNumber={quesionsNumber}
              />
            </Footer>
          </>
        )}

        {status === "finish" && (
          <FinishedScreen
            score={score}
            totalPoints={totalPoints}
            dispatch={dispatch}
            points={points}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
