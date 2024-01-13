import * as logger from "./logging.js";
import { getNameAvailability, getProfile, setName } from "./mojangApi.js";

export const scan = async (config: ApplicationConfig) => {
  const { name, delay, claim } = config;
  let counter = 0;

  while (true) {
    try {
      const availability = await getAvailabilty(name);

      if (availability === "DUPLICATE") {
        logger.error(`Name "${name}" most likely was taken by someone else`);
        return;
      }

      if (availability === "AVAILABLE") {
        logger.info(`Name "${name}" is available`);

        if (!claim) return;

        const success = await claimName(name);

        if (!success) {
          logger.info("Resuming scan...");
        } else {
          return;
        }
      }

      logger.footer(
        `Attempts: ${++counter} | Last availability: ${availability}`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      if (error.status === 429) {
        logger.footer(`Attempts: ${++counter} | Waiting for rate limit`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 10));
      } else {
        throw error;
      }
    }
  }
};

export const getAvailabilty = async (
  name: string
): Promise<NameAvailability> => {
  const profile = await getProfile(name);

  if (profile.id) return "DUPLICATE";

  switch (await getNameAvailability(name)) {
    case "AVAILABLE":
      return "AVAILABLE";
    case "DUPLICATE":
      return "UPCOMING";
    case "NOT_ALLOWED":
      return "NOT_ALLOWED";
  }
};

export const claimName = async (name: string): Promise<boolean> => {
  logger.info("Attempting name change...");

  const response = await setName(name);

  if (response.response == "SUCCESS") {
    logger.info(`Successfully changed name to "${response.name}"`);
    return true;
  } else {
    logger.error(`Failed to change name (${response.response})`);
    return false;
  }
};
