import { query as blobFragment } from '../blob';
import { query as iframeFragment } from '../iframe';
import { query as imageFragment } from '../image';
import { query as imageGalleryFragment } from '../imageGallery';
import { query as newsStoryFragment } from '../newsStory';
import { query as promoFragment } from '../promo';
import { query as videoFragment } from '../video';

export const query = (level: number = 0): string => {
    return `
    ${
        (level => {
            if (level > 0)
                return `
${ blobFragment(level - 1) }
${ imageFragment(level - 1) }
${ newsStoryFragment(level - 1) }
${ videoFragment(level - 1) }
${ imageGalleryFragment(level - 1) }
${ iframeFragment(level - 1) }
${ promoFragment(level - 1) }
`;
            else
                // V2Null is used to provide required mappings where we expect data not to be returned to get an empty array.
                return '... on V2Null { id { value link } }';
        })(level)
    }
`; };
