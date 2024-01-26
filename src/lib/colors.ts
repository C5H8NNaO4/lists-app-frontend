import randomColor from 'randomcolor';
const hues = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
  'ocre',
  'brown',
];
const shades = ['light'];

export const colors = hues.map((hue) => {
  return randomColor({ hue, count: 10 });
});

console.log('COLORS', colors);
