import fetch, { RequestInit } from "node-fetch";
import * as dotenv from "dotenv";
import assert from "assert";

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
assert(ACCESS_TOKEN, Error("No access token defined"));

export const isNameValid = (name: string): boolean => {
  return (
    name.length >= 3 &&
    name.length <= 16 &&
    [...name.toLowerCase()].every((x) =>
      "abcdefghijklmnopqrstuvwxyz0123456789_".includes(x)
    )
  );
};

const apiRequest = async (
  method: "GET" | "PUT",
  url: string,
  authorize: boolean = true
): Promise<any> => {
  const requestInit: RequestInit = {
    method: method,
    headers: authorize
      ? {
          "content-type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        }
      : {
          "content-type": "application/json",
        },
  };
  const response = await fetch(url, requestInit);

  if (response.ok) return await response.json();

  return Promise.reject({
    status: response.status,
    statusText: response.statusText,
  });
};

export const getNameAvailability = async (
  name: string
): Promise<MojangNameAvailability> => {
  return await apiRequest(
    "GET",
    `https://api.minecraftservices.com/minecraft/profile/name/${name}/available`
  )
    .then((data) => {
      return data.status;
    })
    .catch((cause) => {
      return Promise.reject(cause);
    });
};

export const setName = async (name: string): Promise<MojangNameChange> => {
  return await apiRequest(
    "PUT",
    `https://api.minecraftservices.com/minecraft/profile/name/${name}`
  )
    .then((data) => {
      return {
        response: "SUCCESS",
        name: data.name,
        id: data.id,
      } as MojangNameChange;
    })
    .catch(({ status, statusText }) => {
      if (status == 400) return { response: "INVALID_NAME" };
      else if (status == 403) return { response: "UNAVAILABLE" };
      else {
        return Promise.reject({
          status: status,
          statusText: statusText,
        });
      }
    });
};

export const getProfile = async (name: string): Promise<MojangProfile> => {
  return apiRequest(
    "GET",
    `https://api.mojang.com/users/profiles/minecraft/${name}`,
    false
  )
    .then((data) => {
      return {
        name: data.name,
        id: data.id,
      };
    })
    .catch(({ status, statusText }) => {
      if (status == 404) return { name: name };

      return Promise.reject({
        status: status,
        statusText: statusText,
      });
    });
};

export const getMyProfile = async (): Promise<MojangProfile> => {
  return apiRequest(
    "GET",
    "https://api.minecraftservices.com/minecraft/profile",
    true
  )
    .then((data) => {
      return {
        id: data.id,
        name: data.name,
      };
    })
    .catch(({ status, statusText }) => {
      return Promise.reject({
        status,
        statusText,
      });
    });
};

export const getNameChangeInformation =
  async (): Promise<MojangNameChangeInformation> => {
    return apiRequest(
      "GET",
      "https://api.minecraftservices.com/minecraft/profile/namechange",
      true
    )
      .then((data) => {
        return {
          changedAt: data.changedAt,
          nameChangeAllowed: data.nameChangeAllowed,
        };
      })
      .catch(({ status, statusText }) => {
        return Promise.reject({
          status,
          statusText,
        });
      });
  };
