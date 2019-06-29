import { foxsports } from './foxsports1';

type APIResponseDictionary  = {
    [name: string]: Tabula.ApiResponse
};

const fixtures: APIResponseDictionary = {
    'foxsports': foxsports
};

export { fixtures };
