type ApplicationConfig = {
  inputFile: string;
  input: Array<string>;
  filterInvalids: boolean;
  delay: number;
  claim: boolean;
  loop: boolean;
};

type NameAvailability = 'AVAILABLE' | 'UPCOMING' | 'DUPLICATE' | 'DEACTIVATED' | 'NOT_ALLOWED';

type MojangNameAvailability = 'AVAILABLE' | 'DUPLICATE' | 'NOT_ALLOWED';

type MojangProfile = {
  name: string;
  id?: string | undefined;
};

type MojangNameChange = {
  response: 'SUCCESS' | 'INVALID_NAME' | 'UNAVAILABLE';
  name?: string | undefined;
  id?: string | undefined;
};
