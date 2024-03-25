import { View } from 'react-native';
import Svg, { Circle, Defs, G, RadialGradient, Stop } from 'react-native-svg';

let roundTo = (num, to = 0) => {
  to = Math.pow(10, to);
  return Math.round(num * to) / to;
};

function DonutChart({ size, data, colors }) {
  const radius = 35;
  const strokeWidth = 25;
  const cxy = 47.5;
  const cxyShadow = 52.5;
  const length = roundTo(2 * Math.PI * radius, 4);

  let dataSum = 0;
  let corner = [];
  let newData = [];

  size = roundTo(size);

  for (let i = 0; i < data.length; i++) {
    dataSum += data[i];
  }

  for (let i = 0; i < data.length; i++) {
    newData[i] = {};
    newData[i].dash = roundTo((data[i] / dataSum) * length, 4);
    newData[i].hole = roundTo(length - newData[i].dash, 4);
    newData[i].strokeDasharray = `${newData[i].dash} ${newData[i].hole}`;
    newData[i].color = colors[i];
    if (i == 0) {
      corner[i] = 30;
      newData[i].transform = 'rotate(30 47.5 47.5)';
      continue;
    }
    corner[i] = roundTo((data[i - 1] / dataSum) * 360 + corner[i - 1], 1);
    newData[i].transform = `rotate(${corner[i]} 47.5 47.5)`;
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        padding: 10,
      }}>
      <Svg
        width={size - 20}
        height={size - 20}
        viewBox="0 0 100 100"
        fill="none">
        <Defs>
          <RadialGradient id="shadow">
            <Stop offset="50%" stopColor="#ffffff" />
            <Stop offset="60%" stopColor="#a8a8a8" />
            <Stop offset="90%" stopColor="#a8a8a8" />
            <Stop offset="100%" stopColor="#ffffff" />
          </RadialGradient>
        </Defs>
        <Circle cx={cxyShadow} cy={cxyShadow} r={cxy} fill="url(#shadow)" />
        <Circle
          cx={cxy}
          cy={cxy}
          r={radius}
          fill="transparent"
          stroke="#ffffff"
          strokeWidth={strokeWidth}
        />
        {newData.map((chank) => {
          return (
            <G transform={chank.transform}>
              <Circle
                cx={cxy}
                cy={cxy}
                r={radius}
                fill="transparent"
                stroke={chank.color}
                strokeWidth={strokeWidth}
                strokeDasharray={chank.strokeDasharray}
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

export default DonutChart;
