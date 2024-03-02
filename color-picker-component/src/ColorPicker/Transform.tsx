import React, { forwardRef } from 'react';

export interface TransformOffset {
  x: number;
  y: number;
};

interface TransformProps {
  offset?: TransformOffset;
  children?: React.ReactNode;
};

const Transform = forwardRef<HTMLDivElement, TransformProps>((props, ref) => {
  const { offset, children } = props;
  return (
    <div
      ref={ref}
      style={{
        zIndex: 1,
        position: 'absolute',
        left: offset?.x ?? 0,
        top: offset?.y ?? 0,
      }}
    >
      {children}
    </div>
  )
});

export default Transform;
