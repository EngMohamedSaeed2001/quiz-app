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
import { useQuiz } from "./Contexts/QuizProvider";

function App() {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "dataFailed" && <Error />}
        {status === "ready" && (
          <>
            <StartScreen />
          </>
        )}
        {status === "active" && (
          <>
            <Progress />
            <Question />

            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}

        {status === "finish" && <FinishedScreen />}
      </Main>
    </div>
  );
}

export default App;
