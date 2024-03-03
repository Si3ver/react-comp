import React from "react";

export type SizeType = 'small' | 'middle' | 'large' | number | undefined;

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  size?: SizeType | [SizeType, SizeType];
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end' | 'baseline';
  split?: React.ReactNode;
  wrap?: boolean;
}

const Space: React.FC<SpaceProps> = props => {
  const {
    className,
    style,
    size, 
    direction,
    align,
    split,
    ...otherProps
  } = props;

  const childNodes = React.Children.toArray(props.children);
  const nodes = childNodes.map((child: any, i) => {
    const key = child && child.key || `space-item-${i}`;

    return <div className="space-item" key={key}>
      {child}
    </div>
  });

  return <div
    className={className}
    style={style}
    {...otherProps}
  >
    {nodes}
  </div>
};

export default Space;
