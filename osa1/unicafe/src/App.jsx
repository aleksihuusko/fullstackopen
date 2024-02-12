import { useState } from 'react';

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <>
      <Feedback
        good={good}
        neutral={neutral}
        bad={bad}
        setGood={setGood}
        setNeutral={setNeutral}
        setBad={setBad}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;

const Feedback = ({ bad, neutral, good, setBad, setNeutral, setGood }) => {
  return (
    <>
      <h2>Give Feedback</h2>
      <FeedbackButton value={bad} setValue={setBad} text="bad" />
      <FeedbackButton value={neutral} setValue={setNeutral} text="neutral" />
      <FeedbackButton value={good} setValue={setGood} text="good" />
    </>
  );
};

const FeedbackButton = ({ value, setValue, text }) => {
  return <button onClick={() => setValue(value + 1)}>{text}</button>;
};

const Statistics = ({ bad, neutral, good }) => {
  const total = bad + neutral + good;

  const average = total > 0 ? (good * 1 + neutral * 0 + bad * -1) / total : 0;

  const positive = (good / total) * 100;

  if (total < 1) return <p>No feedback given</p>;

  return (
    <>
      <h2>Statistics</h2>
      <table>
        <tbody>
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="all" value={total} />
          <StatisticsLine text="average" value={average.toFixed(1)} />
          <StatisticsLine text="positive" value={positive.toFixed(1) + '%'} />
        </tbody>
      </table>
    </>
  );
};

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};
