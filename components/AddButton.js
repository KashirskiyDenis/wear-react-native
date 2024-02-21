import Svg, {
  Circle,
  Defs,
  Line,
  RadialGradient,
  Stop,
} from 'react-native-svg';

function AddButton() {
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100" fill="none">
      <Defs>
        <RadialGradient id="shadow">
          <Stop offset="80%" stopColor="#a8a8a8" />
          <Stop offset="100%" stopColor="#ffffff" />
        </RadialGradient>
      </Defs>
      <Circle cx={57.5} cy={57.5} r={40} fill="url(#shadow)" />
      <Circle cx={50} cy={50} r={40} fill="#6fabb3" />
      <Line
        x1={50}
        y1={35}
        x2={50}
        y2={65}
        className="line"
        stroke="#ffffff"
        strokeWidth={7}
        strokeLinecap="round"
      />
      <Line
        x1={35}
        y1={50}
        x2={65}
        y2={50}
        className="line"
        stroke="#ffffff"
        strokeWidth={7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default AddButton;
