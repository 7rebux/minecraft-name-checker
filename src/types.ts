type ApplicationConfig = {
  name: string;
  delay: number;
  claim: boolean;
};

type NameAvailability = "AVAILABLE" | "DUPLICATE" | "UPCOMING" | "NOT_ALLOWED";

type MojangNameAvailability = "AVAILABLE" | "DUPLICATE" | "NOT_ALLOWED";

type MojangProfile = {
  name: string;
  id?: string | undefined;
};

type MojangNameChangeInformation = {
  changedAt: string;
  nameChangeAllowed: boolean;
};

type MojangNameChange = {
  response: "SUCCESS" | "INVALID_NAME" | "UNAVAILABLE";
  name?: string | undefined;
  id?: string | undefined;
};
