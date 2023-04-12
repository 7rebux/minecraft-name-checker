import chalk from 'chalk';
import 'cli-progress-footer';
import CliProgressFooter from 'cli-progress-footer';

const cliProgressFooter = CliProgressFooter();
cliProgressFooter.shouldAddProgressAnimationPrefix = true;
cliProgressFooter.progressAnimationPrefixFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export const info = (message: string) => {
  console.log(`${chalk.blue('i')} ${message}`);
};

export const warn = (message: string) => {
  console.log(`${chalk.yellow('!')} ${message}`);
};

export const error = (message: string) => {
  console.log(`${chalk.red('!')} ${message}`);
};

export const footer = (message: string) => {
  cliProgressFooter.updateProgress(message);
};

export const progressBar = (current: number, max: number): string => {
	const barWidth = 20;
	const percentage = (current / max * 100).toFixed(1);
	const progress = current / max * barWidth;

	return `${chalk.green(`${'█'.repeat(progress)}${chalk.white('█'.repeat(barWidth - progress))}`)} ${percentage}% | ${current}/${max}`;
};
