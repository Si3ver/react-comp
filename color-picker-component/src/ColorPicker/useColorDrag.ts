import { useEffect, useRef, useState } from "react";
import { TransformOffset } from "./Transform";

type EventType = 
  | MouseEvent
  | React.MouseEvent<Element, MouseEvent>

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
  offset?: TransformOffset;
  targetRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  direction?: 'x' | 'y';
  onDragChange?: (offset: TransformOffset) => void;
}

function useColorDrag(
  props: useColorDragProps,
): [TransformOffset, EventHandle] {

  const {
    offset,
    targetRef,
    containerRef,
    direction,
    onDragChange,
  } = props;

  const [offsetValue, setOffsetValue] = useState(offset || {x: 0, y: 0});
  const dragRef = useRef({
    flag: false, // 是否正在拖动
  });

  useEffect(() => {
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragStop);
  }, []);

  const updateOffset: EventHandle = e => {
    
  };

  const onDragStop: EventHandle = e => {
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragStop);

    dragRef.current.flag = false;
  };

  const onDragMove: EventHandle = e => {
    e.preventDefault();
    updateOffset(e);
  };

  const onDragStart: EventHandle = e => {
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragStop);

    dragRef.current.flag = true;
  };

  return [offsetValue, onDragStart];
}

export { useColorDrag };
