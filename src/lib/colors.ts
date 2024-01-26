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
];
const shades = ['light', undefined, 'dark'];

export const colors = shades
  .map((shade) =>
    hues.map((hue) => {
      return randomColor({ luminosity: shade, hue, count: 20 });
    })
  )
  .flat(1);
