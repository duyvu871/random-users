import { atom } from 'jotai';
import { RandomUserResponse } from 'BAD/api';

export const usersStore = atom<RandomUserResponse['results']>([] as RandomUserResponse['results']);
export const queryInfoStore = atom<RandomUserResponse['info']>(null as unknown as RandomUserResponse['info']);
export const usersPaginatedStore = atom<Record<`${number}`, RandomUserResponse['results']>>({});
export const queryInfoPaginatedStore = atom<Record<`${number}`, RandomUserResponse['info']>>({});
