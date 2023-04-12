import { 
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

const TOO_MANY_REQUESTS = 429;
const UNAUTHORIZED = 401; 

export const scan = async (config: ApplicationConfig): Promise<ScanResult> => {
  const result: ScanResult = {
    available: [],
    upcoming: [],
    duplicate: [],
    deactivated: [],
    banned: []
  };

  for (const [i, name] of config.input.entries()) {
    await new Promise(resolve => setTimeout(resolve, config.delay));
    footer(`${progressBar(i + 1, config.input.length)} ${name}`);

    // validate name
    if (config.filterInvalids && !isNameValid(name)) continue;

    // check if a profile with the name exists
    getProfile(name)
      .then(profile => {
        if (profile.id)
          result.duplicate.push(profile.name);
        else {
          // check mojang name availability
          getNameAvailability(name)
            .then(nameAvailability => {
              switch (nameAvailability) {
                case MojangNameAvailability.AVAILABLE:
                  // TODO claim
                  result.available.push(name);
                  break;
                case MojangNameAvailability.DUPLICATE:
                  // TODO either deactivated or upcoming
                  break;
                case MojangNameAvailability.NOT_ALLOWED:
                  result.banned.push(name);
              }
            })
            .catch(reason => {
              if (reason.status == TOO_MANY_REQUESTS)
                error('Too many requests to getNameAvailability!');
              else if (reason.status == UNAUTHORIZED)
                error('Unauthorized!');
            });
        }
      })
      .catch(reason => {
        if (reason.status == TOO_MANY_REQUESTS)
          error('Too many requests to getProfile!');
      });
  }

  return result;
};

const claim = async (name: string, burst: boolean) => {
  const response = await setName(name);
};
