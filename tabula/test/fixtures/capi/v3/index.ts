import { article } from './article1';
import { collectionSearch } from './collectionSearch1';

type APIResponseDictionary  = {
    [name: string]: Tabula.ApiResponse
};

const v3Fixtures: APIResponseDictionary = {
    'article': article,
    'collectionSearch': collectionSearch
};

export { v3Fixtures };
