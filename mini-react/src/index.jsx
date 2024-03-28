const { render, useState, useEffect } = window.MiniReact;

function App() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log('useEffect', count);
  }, []);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      <h1>h1</h1>
      <p>
        <h2>h2</h2>
      </p>
    </div>
  );
}

render(<App />, document.getElementById('root'));
