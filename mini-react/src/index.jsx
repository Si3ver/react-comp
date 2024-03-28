const { render, useState, useEffect } = window.MiniReact;

function App() {
  
  return (
    <div>
      <h1>h1</h1>
      <p>
        <h2>h2</h2>
      </p>
    </div>
  );
}

render(<App />, document.getElementById('root'));
