import './App.css';

function Box() {
  return <div className='box'></div>
}

function Container() {
  return <div className="container"></div>
}

function App() {
  return <div>
    <Container></Container>
    <Box></Box>
  </div>
}

export default App;
