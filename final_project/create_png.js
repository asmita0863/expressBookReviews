const fs = require('fs');
const text2png = require('text2png');

const text = fs.readFileSync('register_responses.txt', 'utf8');

const buffer = text2png(text, {
  font: '14px Fira Code, Consolas, monospace',
  color: 'black',
  bgColor: 'white',
  lineSpacing: 6,
  padding: 20,
  maxWidth: 1000
});

fs.writeFileSync('6-register.png', buffer);
console.log('Wrote 6-register.png');
