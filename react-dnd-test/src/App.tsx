import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './App.css';

interface ItemType {
  color: string;
}

interface BoxProps {
  color: string;
}

function Box(props: BoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag]= useDrag({
    type: 'box',
    item: {
      color: props.color,
    }
  });

  drag(ref);

  return <div ref={ref} className='box' style={
    { background: props.color || 'blue' }
  }></div>
}

function Container() {
  
  const [boxes, setBoxes] = useState<ItemType[]>([]);

  const ref = useRef(null);

  const [,drop] = useDrop(() => {
    return {
      accept: 'box',
      drop(item: ItemType) {
        setBoxes((boxes) => [...boxes, item]);
      }
    }
  });
  drop(ref);

  return <div ref={ref} className="container">
    {
      boxes.map(item => {
        return <Box color={item.color}></Box>
      })
    }
  </div>
}

function App() {
  return <div>
    <Container></Container>
    <Box color="blue"></Box>
    <Box color="red"></Box>
    <Box color="green"></Box>
  </div>
}

export default App;
