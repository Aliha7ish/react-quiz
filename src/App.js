import { useReducer, useEffect } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import MainPage from "./MainPage";
import QuizPage from "./QuizPage";

const SEC_PER_QUESTION = 30;
const initialState = {
  questions: [],
  //Loading, ready, error, finished
  status: "loading",
  quizStart: false,
  curQuestionIndex: 0,
  nextBtn: false,
  selectedAnswer: null,
  points: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        quizStart: true,
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "questionIsAnswered":
      let { selectedAnswer } = state;
      selectedAnswer = action.payload;
      return {
        ...state,
        nextBtn: true,
        selectedAnswer: selectedAnswer,
        points:
          selectedAnswer ===
          state.questions[state.curQuestionIndex].correctOption
            ? (state.points += state.questions[state.curQuestionIndex].points)
            : state.points,
      };
    case "nextBtnIsClicked":
      return {
        ...state,
        curQuestionIndex: state.curQuestionIndex + 1,
        nextBtn: false,
        selectedAnswer: null,
      };
    case "startTimer":
      return { ...state, secondsRemaining: state.secondsRemaining - 1 };
    case "restart":
      return {
        ...state,
        curQuestionIndex: 0,
        points: 0,
      };
    default:
      return "Can not fetch the questions!";
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    quizStart,
    curQuestionIndex,
    nextBtn,
    selectedAnswer,
    secondsRemaining,
    points,
  } = state;
  const numQuestions = questions.length;

  useEffect(function () {
    async function getQuestions() {
      try {
        const res = await fetch("http://localhost:5000/questions");
        const data = await res.json();
        dispatch({ type: "dataRecieved", payload: data });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    }
    getQuestions();
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "error" && <Error />}
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen
            quizStart={quizStart}
            numQuestions={numQuestions}
            dispatch={dispatch}
            questions={questions}
            curQuestionIndex={curQuestionIndex}
            nextBtn={nextBtn}
            selectedAnswer={selectedAnswer}
            secondsRemaining={secondsRemaining}
            points={points}
          />
        )}
      </Main>
    </div>
  );
}

function StartScreen({
  numQuestions,
  dispatch,
  quizStart,
  questions,
  curQuestionIndex,
  nextBtn,
  selectedAnswer,
  secondsRemaining,
  points,
}) {
  return (
    <div className="start">
      {quizStart ? (
        <QuizPage
          questions={questions}
          curQuestionIndex={curQuestionIndex}
          dispatch={dispatch}
          nextBtn={nextBtn}
          selectedAnswer={selectedAnswer}
          secondsRemaining={secondsRemaining}
          points={points}
        />
      ) : (
        <MainPage numQuestions={numQuestions} dispatch={dispatch} />
      )}
    </div>
  );
}
