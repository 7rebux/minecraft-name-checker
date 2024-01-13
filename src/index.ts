import prompts from "prompts";
import * as logger from "./logging.js";
import { claimName, getAvailabilty, scan } from "./scanner.js";
import {
  getMyProfile,
  getNameChangeInformation,
  isNameValid,
} from "./mojangApi.js";

const answers = await prompts([
  {
    type: "text",
    name: "name",
    message: "Enter the name to check:",
  },
  {
    type: "number",
    name: "delay",
    message: "Enter request delay (ms):",
  },
  {
    type: "toggle",
    name: "claim",
    message: "Claim if available?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
]);

const config = {
  name: answers.name,
  delay: answers.delay,
  claim: answers.claim,
};

async function main() {
  if (!isNameValid(config.name)) {
    logger.error(`Name "${config.name}" is invalid`);
    return;
  }

  const profile = await getMyProfile();
  const info = await getNameChangeInformation();
  const availability = await getAvailabilty(config.name);

  logger.info(`Using account: ${profile.name} (${profile.id})`);
  logger.info(`Last name change: ${info.changedAt}`);
  if (!info.nameChangeAllowed) {
    logger.warn("This account is not able to change its name");
    if (config.claim) return;
  }

  logger.info(`Testing name availability for "${config.name}"...`);
  logger.info(`NameMC search: https://de.namemc.com/search?q=${config.name}`);
  switch (availability) {
    case "DUPLICATE": {
      logger.error(
        `Name "${config.name}" is currently taken by another player`
      );
      logger.info(
        `More information here: https://namemc.com/profile/${config.name}`
      );
      return;
    }
    case "NOT_ALLOWED": {
      logger.error(
        `Name "${config.name}" is not allowed due to Mojang/Microsoft restrictions`
      );
      return;
    }
    case "AVAILABLE": {
      logger.info(`Name "${config.name}" seems to already be available`);

      if (!config.claim) return;

      const success = await claimName(config.name);

      if (!success) {
        logger.info("Resuming scan...");
        break;
      } else {
        return;
      }
    }
    case "UPCOMING": {
      logger.info(`Name "${config.name}" is either upcoming or deactivated`);
    }
  }

  logger.info("Starting scan...");
  scan(config);
}

try {
  main();
} catch (error) {
  logger.error("Encountered unexpected error!");
  console.log(error);
}
