import useCounter from "./useCounter";

function App() {
  const [count, increment, decrement] = useCounter();
  return (
    <div className="App">
      <div>{count}</div>
      <div>
        <button onClick={() => increment(1)}>add</button>
        <button onClick={() => decrement(1)}>sub</button>
      </div>
    </div>
  );
}

export default App;
