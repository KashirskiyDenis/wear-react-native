import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

function AddButton() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100" fill="none">
      <Circle cx={50} cy={50} r={50} fill="#6fabb3" />
      <Line
        x1={50}
        y1={15}
        x2={50}
        y2={85}
        className="line"
        stroke="#ffffff"
        strokeWidth={10}
        strokeLinecap="round"
      />
      <Line
        x1={15}
        y1={50}
        x2={85}
        y2={50}
        className="line"
        stroke="#ffffff"
        strokeWidth={10}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default AddButton;
