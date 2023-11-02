import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const getRandom = () => {
  return Math.floor(Math.random() * 256);
};

const getRandomColor = () => {
  let red = getRandom();
  let green = getRandom();
  let blue = getRandom();

  return `rgb(${red}, ${green}, ${blue}, 0.35)`;
};

let roundTo = (num, to = 0) => {
  to = Math.pow(10, to);
  return Math.round(num * to) / to;
};

function PaiChart({ widthAndHeight, data }) {
  const radius = '35';
  const strokeWidth = '25';
  const cxy = '47.5';
  const cxyShadow = 52.5;
  const length = roundTo(2 * Math.PI * radius, 4);

  let dataSum = 0;
  let corner = [];
  let newData = [];

  for (let i = 0; i < data.length; i++) {
    dataSum += data[i];
  }

  for (let i = 0; i < data.length; i++) {
    newData[i] = {};
    newData[i].dash = roundTo((data[i] / dataSum) * length, 4);
    newData[i].hole = length - newData[i].dash;
    newData[i].strokeDasharray = `${newData[i].dash} ${newData[i].hole}`;
    newData[i].color = getRandomColor();
    if (i == 0) {
      corner[i] = 0;
      newData[i].transform = 'rotate(0 47.5 47.5)';
      continue;
    }
    corner[i] = roundTo((data[i - 1] / dataSum) * 360 + corner[i - 1]);
    newData[i].transform = `rotate(${corner[i]} 47.5 47.5)`;
  }

  return (
    <View
      style={{
        width: { widthAndHeight },
        height: { widthAndHeight },
        alignItems: 'center',
        padding: 10,
      }}>
      <Svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
        <Circle
          cx={cxyShadow}
          cy={cxyShadow}
          r={radius}
          fill="transparent"
          stroke="#ebebeb"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={cxy}
          cy={cxy}
          r={radius}
          fill="transparent"
          stroke="#ffffff"
          strokeWidth={strokeWidth}
        />        
        {
          newData.map((chank) => {
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
        })
        }
      </Svg>
    </View>
  );
}

export default PaiChart;
