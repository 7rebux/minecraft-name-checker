type ApplicationConfig = {
  inputFile: string;
  input: Array<string>;
  filterInvalids: boolean;
  delay: number;
  claim: boolean;
  burstClaim: boolean;
  loop: boolean;
};

type MojangProfile = {
  name: string;
  id?: string | undefined;
};

type MojangNameChange = {
  response: MojangNameChangeResponse;
  name?: string | undefined;
  id?: string | undefined;
};

enum MojangNameChangeResponse {
  SUCCESS,
  INVALID_NAME,
  UNAVAILABLE
};

enum MojangNameAvailability {
  AVAILABLE,
  DUPLICATE,
  NOT_ALLOWED
};

type ScanResult = {
  available: Array<string>;
  upcoming: Array<UpcomingName>;
  duplicate: Array<string>;
  deactivated: Array<string>;
  banned: Array<string>;
};

type UpcomingName = {
  name: string;
  nameMc: string;
  timestamp: number;
};
