import classNames from "classnames";
import React from "react";
import './index.scss';

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
    size = 'small', 
    direction = 'horizontal',
    align,
    split,
    ...otherProps
  } = props;

  const childNodes = React.Children.toArray(props.children);
  const mergedAlign = direction === 'horizontal' && align === undefined ? 'center' : align;
  const cn = classNames(
    'space',
    `space-${direction}`,
    {
      [`space-align-${mergedAlign}`]: mergedAlign,
    },
    className,
  );
  const nodes = childNodes.map((child: any, i) => {
    const key = child && child.key || `space-item-${i}`;

    return <div className="space-item" key={key}>
      {child}
    </div>
  });

  return <div
    className={cn}
    style={style}
    {...otherProps}
  >
    {nodes}
  </div>
};

export default Space;
