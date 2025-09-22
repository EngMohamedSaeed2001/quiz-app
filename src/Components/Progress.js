function Progress({ max, index, answer, totalPoints, correctOption, points }) {
  return (
    <header className="progress">
      <progress max={max} value={index + Number(answer !== null)}></progress>
      <p>
        <strong>{index + 1}</strong> / {max}
      </p>

      <p>
        <strong>{points}</strong> / {totalPoints}
      </p>
    </header>
  );
}

export default Progress;
