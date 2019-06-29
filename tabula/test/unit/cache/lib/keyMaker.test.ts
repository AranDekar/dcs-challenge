import { expect } from 'chai';
import { make } from '../../../../src/cache/lib/keyMaker';


const url = 'http://api.newsapi.com.au/content/v2/methode/origin:fatwire.1227301982432?api_key=ttbayy2pngchv75egary59su&bustTime=0&cacheSkip=true&domain=couriermail.com.au&html=full%2Call&includeDraft=false&includeDynamicMetadata=true&includeRelated=true&maxRelatedLevel=2&a=1';

describe('KeyMaker', () => {
    let key: string;

    beforeEach(() => {
        key = make(url);
    });

    // it('uses the prefix in the KeyType', () => {
    //     expect(key).to.include(testKey.prefix);
    // });

    it('normalises the url', () => {
    expect(key).to.match(/.*\?a=1.*/);
    });
});
