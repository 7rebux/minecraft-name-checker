import prompts from 'prompts';
import { info } from './logging.js';
import { scan } from './scanner.js';
import { readFileSync } from 'fs';

const answers = await prompts([
  {
    type: 'text',
    name: 'inputFile',
    message: 'Enter input file:'
  },
  {
    type: 'toggle',
    name: 'filterInvalids',
    message: 'Filter out invalid names?',
    initial: true,
    active: 'yes',
    inactive: 'no'
  },
  {
    type: 'number',
    name: 'delay',
    message: 'Enter request delay:'
  },
  {
    type: 'toggle',
    name: 'claim',
    message: 'Claim first valid name?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  },
  {
    type: 'toggle',
    name: 'loop',
    message: 'Loop scan?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  }
]);
const config: ApplicationConfig = {
  inputFile: answers.inputFile,
  input: readFileSync(answers.inputFile, 'utf-8')
    .split('\n')
    .map(x => x.replace(/[\r\n]/gm, '')),
  delay: answers.delay,
  filterInvalids: answers.filterInvalids,
  claim: answers.claim,
  loop: answers.loop
};

info(`Loaded ${config.input.length} names from ${config.inputFile}`);
info(`Starting scan..`);

while (true) {
  const result = await scan(config);
  console.log(result);

  if (!config.loop) break;
}
