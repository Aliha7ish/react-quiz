export default function MainPage({ numQuestions, dispatch }) { 
    return (  
      <div className="start">
        <h2>Welcome to the ReactQuiz</h2>
        <h3>{numQuestions} questions to start your React mastery</h3>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "start" })}
        >
          let's start!
        </button>
      </div>
    );
  }