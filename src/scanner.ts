import { 
  info,
  footer, 
  progressBar,
  error 
} from './logging.js';
import { 
  getNameAvailability, 
  getProfile, 
  isNameValid, 
  setName
} from './mojangApi.js';

export const scan = async (config: ApplicationConfig) => {
  const result: {[key in NameAvailability]: string[]} = {
    AVAILABLE: [],
    UPCOMING: [],
    DUPLICATE: [],
    DEACTIVATED: [],
    NOT_ALLOWED: []
  };

  for (const [i, name] of config.input.entries()) {
    await new Promise(resolve => setTimeout(resolve, config.delay));
    footer(`${progressBar(i + 1, config.input.length)} -- ${name}`);

    // validate name
    if (config.filterInvalids && !isNameValid(name)) continue;

    // check name availability
    const availability = await getAvailabilty(name);
    
    result[availability].push(name);

    if (availability == 'AVAILABLE') {
      info(`Found available name: ${name}`)
      
      if (!config.claim) continue;
      
      // claim name
      info('Attempting name change..')

      if (await claim(name)) {
        info('Aborting..');
        process.exit();
      } else {
        info('Resuming scan..')
      }
    }
  }

  return result;
};

const getAvailabilty = async (name: string): Promise<NameAvailability> => {
  const profile = await getProfile(name);

  // check if a minecraft profile with the name exists
  if (profile.id) return 'DUPLICATE';

  // check mojang api name availability
  switch (await getNameAvailability(name)) {
    case 'AVAILABLE': return 'AVAILABLE';
    case 'DUPLICATE': return 'DEACTIVATED'; // TODO or upcoming
    case 'NOT_ALLOWED': return 'NOT_ALLOWED';
  }
}

const claim = async (name: string): Promise<boolean> => {
  const response = await setName(name);

  if (response.response == 'SUCCESS') {
    info(`Successfully changed name to ${response.name}!`);
    info(`NameMC: https://de.namemc.com/search?q=${response.id}`);

    return true;
  } else {
    error(`Failed to change name to ${name}!`);

    return false;
  }
}
