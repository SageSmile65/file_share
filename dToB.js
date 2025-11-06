'use strict';

function convertDecimal(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    console.error('Error: please provide a valid integer (decimal).');
    return 1;
  }
  if (num === 0) {
    console.log('Binary: 0');
    console.log('Octal: 0');
    console.log('Hex: 0');
    return 0;
  }

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);
  console.log(`Binary: ${sign}${abs.toString(2)}`);
  console.log(`Octal:  ${sign}${abs.toString(8)}`);
  console.log(`Hex:    ${sign}${abs.toString(16).toUpperCase()}`);
  return 0;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // join all args so user can pass numbers with spaces (e.g. "- 42")
    process.exit(Number(convertDecimal(args.join(' '))) || 0);
  } else {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Enter an integer (decimal): ', (answer) => {
      convertDecimal(answer);
      rl.close();
    });
  }
}

module.exports = { convertDecimal };