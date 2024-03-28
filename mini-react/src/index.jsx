const { render, useState, useEffect } = window.MiniReact;

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(100);

  useEffect(() => {
    console.log('useEffect log:', count1, count2);
  }, [count1]);

  return (
    <div>
      <p>{count1}</p>
      <button onClick={() => setCount1(prev => prev + 1)}>plus count1</button>
      <button onClick={() => setCount1(prev => prev - 1)}>minus count1</button>
      <p>{count2}</p>
      <button onClick={() => setCount2(prev => prev + 1)}>plus count2</button>
      <button onClick={() => setCount2(prev => prev - 1)}>minus count2</button>
      <h1>h1</h1>
      <p>
        <h2>h2</h2>
      </p>
    </div>
  );
}

render(<App />, document.getElementById('root'));
