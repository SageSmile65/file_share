(function () {
  'use strict';

  // Count words using Unicode-aware regex when available, fallback to splitting on whitespace.
  function countWords(sentence) {
    if (typeof sentence !== 'string') return 0;
    const trimmed = sentence.trim();
    if (trimmed === '') return 0;

    // Try Unicode-aware word matching first
    try {
      const words = trimmed.match(/\p{L}[\p{L}\p{N}'-]*/gu);
      if (words) return words.length;
    } catch (e) {
      // ignore and fallback
    }

    // Fallback: split on whitespace and filter empties
    return trimmed.split(/\s+/).filter(Boolean).length;
  }

  // Convert integer decimal to binary and octal (strings). Validates input.
  function convertDecimalToBinOct(value) {
    if (value === '' || value === null || value === undefined) {
      throw new Error('No value provided');
    }

    // accept numbers or numeric strings
    const num = Number(value);

    if (!Number.isFinite(num) || !Number.isInteger(num)) {
      throw new Error('Please provide a valid integer');
    }

    if (num === 0) {
      return { binary: '0', octal: '0' };
    }

    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    return {
      binary: sign + abs.toString(2),
      octal: sign + abs.toString(8)
    };
  }

  // Expose utilities for browser and Node
  const appUtils = {
    countWords,
    convertDecimalToBinOct
  };

  if (typeof window !== 'undefined') {
    window.appUtils = appUtils;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = appUtils;
  }

  // Try hooking into DOM elements if they exist (simple UI wiring)
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      // Word counter UI
      const sentenceInput = document.getElementById('sentenceInput');
      const countBtn = document.getElementById('countBtn');
      const countOutput = document.getElementById('countOutput');

      if (sentenceInput && countBtn && countOutput) {
        countBtn.addEventListener('click', () => {
          const sentence = sentenceInput.value || '';
          const n = countWords(sentence);
          countOutput.textContent = `${n}`;
        });
      }

      // Decimal converter UI
      const decimalInput = document.getElementById('decimalInput');
      const convertBtn = document.getElementById('convertBtn');
      const convertOutput = document.getElementById('convertOutput');

      if (decimalInput && convertBtn && convertOutput) {
        convertBtn.addEventListener('click', () => {
          const val = decimalInput.value;
          try {
            const { binary, octal } = convertDecimalToBinOct(val);
            convertOutput.textContent = `Binary: ${binary}  Octal: ${octal}`;
          } catch (err) {
            convertOutput.textContent = `Error: ${err.message}`;
          }
        });
      }

      // If no UI found, print usage to console
      if (!((sentenceInput && countBtn && countOutput) || (decimalInput && convertBtn && convertOutput))) {
        console.info('appUtils available on window. Usage examples:');
        console.info("window.appUtils.countWords('Hello world!') ->", appUtils.countWords('Hello world!'));
        console.info("window.appUtils.convertDecimalToBinOct(42) ->", appUtils.convertDecimalToBinOct(42));
        console.info('To enable on-page UI, add elements with IDs: sentenceInput, countBtn, countOutput, decimalInput, convertBtn, convertOutput');
      }
    });
  } else {
    // Running in Node (no document) - provide CLI input + keep module export
    // If args provided: treat them as the sentence to count.
    // If no args: prompt the user interactively.
    const args = (typeof process !== 'undefined' && process.argv) ? process.argv.slice(2) : [];

    function printCount(sentence) {
      try {
        const n = countWords(sentence);
        console.log(n);
      } catch (err) {
        console.error('Error:', err.message || err);
      }
    }

    if (args.length > 0) {
      // join all args as the sentence
      printCount(args.join(' '));
    } else {
      // interactive prompt
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question('Enter a sentence: ', (answer) => {
        printCount(answer);
        rl.close();
      });
    }
  }
})();