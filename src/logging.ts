import chalk from "chalk";
import "cli-progress-footer";
import CliProgressFooter from "cli-progress-footer";

const cliProgressFooter = CliProgressFooter();
cliProgressFooter.shouldAddProgressAnimationPrefix = true;
cliProgressFooter.progressAnimationPrefixFrames = [
  "⠋",
  "⠙",
  "⠹",
  "⠸",
  "⠼",
  "⠴",
  "⠦",
  "⠧",
  "⠇",
  "⠏",
];

export const info = (message: string) => {
  console.log(`${chalk.blue("i")} ${message}`);
};

export const warn = (message: string) => {
  console.log(`${chalk.yellow("!")} ${message}`);
};

export const error = (message: string) => {
  console.log(`${chalk.red("!")} ${message}`);
};

export const footer = (message: string) => {
  cliProgressFooter.updateProgress(message);
};
