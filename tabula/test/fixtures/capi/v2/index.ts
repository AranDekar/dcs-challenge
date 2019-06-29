import { category } from './category1';
import { omnitureCollection } from './omnitureCollection';
import { capiCollection } from './capiCollection';
import { component } from './component1';
import { iframe } from './iframe1';
import { imageGallery } from './imageGallery1';
import { newsStory } from './newsStory1';
import { promo } from './promo1';
import { search } from './search1';
import { video } from './video1';

type APIResponseDictionary  = {
    [name: string]: Tabula.ApiResponse
};

const v2Fixtures: APIResponseDictionary = {
    'category': category,
    'component': component,
    'capiCollection': capiCollection,
    'iframe': iframe,
    'imageGallery': imageGallery,
    'newsStory': newsStory,
    'omnitureCollection': omnitureCollection,
    'promo': promo,
    'search': search,
    'video': video
};

export { v2Fixtures };
