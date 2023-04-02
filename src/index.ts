require('dotenv').config();
const chalk = require('chalk');
const fs = require('fs');
const prompts = require('prompts');
const fetch = require('node-fetch');
const footer = require("cli-progress-footer")();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const checkProfile = async (ign: string): Promise<boolean> => {
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`);
	return await response.status == 404;
};

const checkAvailability = async (ign: string): Promise<string> => {
	const response = await fetch(
		`https://api.minecraftservices.com/minecraft/profile/name/${ign}/available`,
		{
			method: 'GET',
			headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
		} 
	);
	const body = await response.json();

	return body.status;
};

const tryNameChange = async (ign: string): Promise<boolean> => {
	const response = await fetch(
		`https://api.minecraftservices.com/minecraft/profile/name/${ign}`,
		{
			method: 'PUT',
			headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
		}
	)

	return await response.status == 200;
};

const progressBar = (current: number, max: number) => {
	const barWidth = 20;
	const percentage = (current / max * 100).toFixed(1);
	const progress = current / max * barWidth;

	return `${chalk.green(`${'█'.repeat(progress)}${'░'.repeat(barWidth - progress)}`)} ${percentage}% | ${current}/${max}`;
};

(async () => {
	const path = await prompts({
		type: 'text',
		name: 'path',
		message: 'Enter input file:'
	});
	const delay = await prompts({
		type: 'number',
		name: 'delay',
		message: 'Enter request delay:'
	});
	const nameChange = await prompts({
		type: 'toggle',
		name: 'value',
		message: 'Should a hit change your name?',
		initial: false,
		active: 'yes',
		inactive: 'no'
	});
	const input = fs.readFileSync(path.path, 'utf-8').split("\n");

	var hits = [];
	var blocked = [];
	var deactivated = [];

	console.log(chalk.blue('i') + ' Loaded input file (%d entries)', input.length);
	console.log(chalk.blue('i') + ' Starting scan..');

	footer.shouldAddProgressAnimationPrefix = true;
	footer.progressAnimationPrefixFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

	for (const [i, ingameName] of input.entries()) {
		footer.updateProgress(`\n${chalk.green(`Available: ${hits.length}`)} | ${chalk.yellow(`Deactivated: ${deactivated.length}`)} | ${chalk.red(`Blocked: ${blocked.length}`)}\n${progressBar(i + 1, input.length)} | Checking ${chalk.yellow(ingameName)}`);

		if (await checkProfile(ingameName)) {
			const status = await checkAvailability(ingameName);

			switch (status) {
				case 'DUPLICATE':
					console.log(`${chalk.yellow('!')} Found deactivated ${chalk.yellow(ingameName)}`);
					deactivated.push(i);
					break;
				case 'NOT_ALLOWED':
					console.log(`${chalk.red('!')} Found blocked ${chalk.red(ingameName)}`);
					blocked.push(i);
					break;
				case 'AVAILABLE':
					console.log(`${chalk.green('!')} Found available ${chalk.green(ingameName)}`);
					if (nameChange.value) {
						console.log(chalk.blue('i') + ' Attempting name change..');

						if (await tryNameChange(ingameName)) {
							console.log(chalk.green(`! Success: Successfully changed name to ${ingameName}`));
							console.log(chalk.blue('i') + ' Aborting..');
							break;
						} else {
							console.log(chalk.red(`! Error: Failed to change name to ${ingameName}`));
							console.log(chalk.blue('i') + ' Continuing scan..');
						}
					}
					hits.push(i);
			}
		}

		await new Promise(resolve => setTimeout(resolve, delay.delay));
	}

	footer.shouldAddProgressAnimationPrefix = false;
	footer.updateProgress(`\n${chalk.green(`Available: ${hits.length}`)} | ${chalk.yellow(`Deactivated: ${deactivated.length}`)} | ${chalk.red(`Blocked: ${blocked.length}`)}\n${progressBar(input.length, input.length)} | Done!}`);
})();
