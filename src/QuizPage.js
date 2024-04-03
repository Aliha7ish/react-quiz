import { useEffect } from "react";
export default function QuizPage({
  questions,
  curQuestionIndex,
  dispatch,
  nextBtn,
  selectedAnswer,
  secondsRemaining,
  points,
}) {
  const activeQuestion = questions[curQuestionIndex];
  const totalQuestionPoints = questions.reduce((acc, cur) => {
    return acc + cur.points;
  }, 0);

  return (
    <div>
      {curQuestionIndex < questions.length && secondsRemaining > 0 ? (
        <>
          <div className="progress">
            <progress
              value={curQuestionIndex + 1}
              max={questions.length}
            ></progress>
            <label>
              Question {curQuestionIndex + 1}/{questions.length}
            </label>
            <label>
              {points}/{totalQuestionPoints}
            </label>
          </div>
          <div>
            <h3>{activeQuestion.question}</h3>
            <div className="options">
              {activeQuestion.options.map((option, i) => {
                return (
                  <button
                    className={`btn btn-option ${
                      selectedAnswer !== null
                        ? selectedAnswer === activeQuestion.correctOption &&
                          selectedAnswer === i
                          ? "answer correct"
                          : selectedAnswer === i &&
                            selectedAnswer !== activeQuestion.correctOption
                          ? "answer wrong"
                          : selectedAnswer !== i &&
                            i === activeQuestion.correctOption
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    key={i}
                    disabled={selectedAnswer !== null && true}
                    onClick={() => {
                      dispatch({
                        type: "questionIsAnswered",
                        payload: (selectedAnswer = i),
                      });
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              {nextBtn && curQuestionIndex < questions.length ? (
                <button
                  className="btn btn-ui"
                  onClick={() => dispatch({ type: "nextBtnIsClicked" })}
                >
                  Next
                </button>
              ) : (
                ""
              )}
            </Footer>
          </div>
        </>
      ) : (
        <FinishScreen
          userPoints={points}
          totalQuestionPoints={totalQuestionPoints}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

function Footer({ children }) {
  return <footer>{children}</footer>;
}

function Timer({ secondsRemaining, dispatch }) {
  const min = Math.floor(secondsRemaining / 60);
  const sec = secondsRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(() => {
        dispatch({ type: "startTimer" });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {min.toString().padStart(2, "0")}:{sec.toString().padStart(2, "0")}
    </div>
  );
}

function FinishScreen({ dispatch, userPoints, totalQuestionPoints }) {
  const percent = (userPoints / totalQuestionPoints) * 100;
  return (
    <>
      <div className="result">
        <p>
          You've Scored {userPoints} out of {totalQuestionPoints} (
          {percent.toFixed(1)}%)
        </p>
        <p className="highscore"></p>
      </div>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        restart
      </button>
    </>
  );
}
