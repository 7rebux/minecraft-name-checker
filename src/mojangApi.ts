import fetch, { RequestInit } from 'node-fetch';
import * as dotenv from 'dotenv';
import assert from 'assert';

dotenv.config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN
assert(ACCESS_TOKEN, Error('No access token defined'));

export const isNameValid = (name: string): boolean => {
  return name.length >= 3 
    && name.length <= 16 
    && [...name.toLowerCase()].every(x => "abcdefghijklmnopqrstuvwxyz0123456789_".includes(x));
};

const apiRequest = async(
  method: 'GET' | 'PUT',
  url: string,
  authorize: boolean = true
): Promise<any> => {
  const requestInit: RequestInit = {
    method: method,
    headers: authorize ? { 
      'content-type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    } : {
      'content-type': 'application/json',
    }
  };
  const response = await fetch(url, requestInit);

  if (response.ok)
    return await response.json();

  return Promise.reject({ 
    status: response.status, 
    statusText: response.statusText 
  });
};

export const getNameAvailability = async (name: string): Promise<MojangNameAvailability> => {
  return await apiRequest('GET', `https://api.minecraftservices.com/minecraft/profile/name/${name}/available`)
    .then(data => { return data.status })
    .catch(cause => { return Promise.reject(cause) });
};

export const setName = async (name: string): Promise<MojangNameChange> => {
  return await apiRequest('PUT', `https://api.minecraftservices.com/minecraft/profile/name/${name}`)
    .then(data => {
      return {
        response: MojangNameChangeResponse.SUCCESS,
        name: data.name,
        id: data.id
      };
    })
    .catch(({ status, statusText }) => {
      if (status == 400)
        return { response: MojangNameChangeResponse.INVALID_NAME };
      else if (status == 403)
        return { response: MojangNameChangeResponse.UNAVAILABLE };
      else {
        return Promise.reject({ 
          status: status, 
          statusText: statusText 
        });
      }
    });
};

export const getProfile = async (name: string): Promise<MojangProfile> => {
  return apiRequest('GET', `https://api.mojang.com/users/profiles/minecraft/${name}`, false)
    .then(data => {
      return { 
        name: data.name,
        id: data.id
      };
    })
    .catch(({ status, statusText }) => {
      if (status == 404)
        return { name: name };

      return Promise.reject({ 
        status: status, 
        statusText: statusText 
      });
    });
};
