import { dynamicImport } from './dynamicImport.mjs';

async function run() {
  console.log('--- Importing example.mjs ---');
  const example = await dynamicImport('./example.mjs');
  if (typeof example === 'function') example();

  console.log('\n--- Importing math.mjs ---');
  const math = await dynamicImport('./math.mjs');
  console.log('2 + 3 =', math.add(2, 3));
  console.log('2 * 3 =', math.mul(2, 3));

  console.log('\n--- Importing config.json ---');
  const config = await dynamicImport('./config.json');
  console.log(config);
}

run();