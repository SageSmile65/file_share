'use strict';

function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  const limit = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function checkPrime(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    console.error('Error: please provide a valid integer.');
    return 1;
  }

  if (num < 2) {
    console.log(`${num} is not prime`);
    return 0;
  }

  if (isPrime(num)) {
    console.log(`${num} is prime`);
  } else {
    console.log(`${num} is not prime`);
  }
  return 0;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    // allow numbers passed with spaces (e.g. "- 17")
    process.exit(Number(checkPrime(args.join(' '))) || 0);
  } else {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Enter an integer to test for primality: ', (answer) => {
      checkPrime(answer);
      rl.close();
    });
  }
}

module.exports = { isPrime, checkPrime };