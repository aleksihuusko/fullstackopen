import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ];

  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0);

  const nextAnecdote = () => {
    const nextIndex = selected + 1;
    if (nextIndex >= anecdotes.length) {
      setSelected(0);
    } else {
      setSelected(nextIndex);
    }
  };

  const randomAnecdote = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * anecdotes.length);
    } while (randomIndex === selected);
    setSelected(randomIndex);
  };

  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  };

  const maxVotesIndex = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>
        {anecdotes[selected]}
        <br />
        has {votes[selected]} votes
      </p>
      <button onClick={handleVote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <button onClick={randomAnecdote}>random anecdote</button>
      <h2>Anecdote with most votes</h2>
      <MostVotes anecdotes={anecdotes} votes={votes} maxVotesIndex={maxVotesIndex} />
    </div>
  );
};

export default App;

const MostVotes = ({ anecdotes, votes, maxVotesIndex }) => {
  return (
    <>
      {votes[maxVotesIndex] > 0 ? (
        <p>
          {anecdotes[maxVotesIndex]}
          <br />
          has {votes[maxVotesIndex]} votes
        </p>
      ) : (
        <p>No votes yet.</p>
      )}
    </>
  );
};
