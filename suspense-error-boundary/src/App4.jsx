import { ErrorBoundary } from "react-error-boundary";

function Bbb() {
  const b = window.a.b;

  return <div>{b}</div>;
}

export default function App() {
  return (
    <ErrorBoundary fallbackRender={({error}) => {
      return <div>
        <p>出错了</p>
        <div>{error.message}</div>
      </div>
    }}>
      <Bbb></Bbb>
    </ErrorBoundary>
  );
}
