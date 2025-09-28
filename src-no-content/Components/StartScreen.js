function StartScreen({ quesionsNumber, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to The Quiz</h2>
      <h3>{quesionsNumber} questions to test your knowledge</h3>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
