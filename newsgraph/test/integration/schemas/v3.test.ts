import * as mocha from 'mocha';
import { should, expect } from 'chai';
import * as supertest from 'supertest';
import { root } from '../lib/v3/root';
import { initialize } from '../../../src/index';

const request = supertest(initialize(root));

describe('POST /graphql/v3', () => {
    it('collection', (done) => {
        request
            .post('/graphql/v3')
            .set('Accept', 'application/json')
            .type('form')
            .send({ query: `query  {
                getV3(id: "5f145d128a3c4ad74fd1c2a58401781f", apiKey: "123") {
                    content {
                        ... on V3Collection {
                            id
                            link { self }
                            type
                            status
                            draft
                            platform {
                                userUpdated
                                systemUpdated
                                instanceUpdated
                            }
                            date {
                                live
                                updated
                                created
                                processed
                            }

                            related
                            references
                        }
                    }
                }
            }`})
            .expect(200, {
                data: {
                    getV3: {
                        content: {
                            date: {
                                created: '2009-06-24T02:09:32.000Z',
                                live: '2017-10-10T12:02:22.000Z',
                                processed: '2017-10-10T12:02:33.065Z',
                                updated: '2017-10-10T12:02:22.000Z'
                            },
                            draft: false,
                            id: '5f145d128a3c4ad74fd1c2a58401781f',
                            link: {
                                self: 'https://content-dev.api.news/v3/collections/5f145d128a3c4ad74fd1c2a58401781f'
                            },
                            platform: {
                                instanceUpdated: 'PerthNow',
                                systemUpdated: 'wordpress',
                                userUpdated: 'kelapajk',
                            },
                            status: 'active',
                            type: 'collection',
                            related: {
                                primary: {
                                    default: [
                                        'e431e3cfb8e09aaed37de0920b5a5e27',
                                        'a1c9782924a4786f63db3ceecb641c94',
                                        '15859eec5d1f892f52c6435018634bbb',
                                        '690f22f28fb3f1673a32f5f0825fb3da',
                                        '1df5dabcf123af038ad14040dd86dd08',
                                        'd84779211b39cfa7c089ed6afbc91bb3',
                                        '048a90d6277592d536ef81899a78857a',
                                        '7a4242af7a4ba8204e529fe60bef221d',
                                        '554a1170b7be0aa95b70d713d38a4ff0',
                                        '568a6d2587fcb2563ce0bcc2d52e7bbb',
                                        '5c66f5acfb004271cf2f27cd91eef4d2',
                                        '1a4f0629fec1b419d609bb4d25bd8086',
                                        '98497e5a7f5b64d7d08c6eb6e01aa73b',
                                        'a994d3b8e2f6a243ed56f918e5e1b108',
                                        'e50683aa8d71665b5837042e962d36ad',
                                        '8d2ed1b1aa0bc68ebec6e0bc6e3060a4',
                                        'ffe0e0759e54e49dd158e574bf277554',
                                        '716d34dc4a45c2414b0e048cc59ce9ff',
                                        '2276fa37b922e19a98b2215ba8f1266d',
                                        '3f8a1c4cfcb6992d87940d78e0b11644',
                                        '7045bbc3e4e80d79c6489d08732e8f5f',
                                        'dc42c5598f4c63e0e9689d6eacaf3b07',
                                        'fe284a8a813a4c986adbd3b7c8f4b042',
                                        'a391999184e3fc600467d3370e34f69e',
                                        'b7f84db5c445c1d4c41865af42503b83',
                                        'ebe7dc9e5c77c271f885176085260d7a',
                                        '158099e4a729c6964aaaeea9c0ba6e5e',
                                        'd4e2ce3f2583a115d5621506342ce78a',
                                        'c04d59a2a9df929f9e50c22438881b8c',
                                        '0d6d6138affc04560b3170eedd9054ca',
                                        'ee215aaf6b6479fd423c4cf2ffe48a5c'
                                    ]
                                }
                            },
                            references: {
                                '716d34dc4a45c2414b0e048cc59ce9ff': {
                                    'id': '716d34dc4a45c2414b0e048cc59ce9ff',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': 'ef6de720-ad4a-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/716d34dc4a45c2414b0e048cc59ce9ff'
                                    }
                                },
                                '690f22f28fb3f1673a32f5f0825fb3da': {
                                    'id': '690f22f28fb3f1673a32f5f0825fb3da',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425910',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/690f22f28fb3f1673a32f5f0825fb3da'
                                    }
                                },
                                'ebe7dc9e5c77c271f885176085260d7a': {
                                    'id': 'ebe7dc9e5c77c271f885176085260d7a',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'Quest Newspapers'
                                    },
                                    'platform': {
                                        'id': 'dd7f418c-ad34-11e7-83be-43d5974e9c9c',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/ebe7dc9e5c77c271f885176085260d7a'
                                    }
                                },
                                '0d6d6138affc04560b3170eedd9054ca': {
                                    'id': '0d6d6138affc04560b3170eedd9054ca',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2424758',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/0d6d6138affc04560b3170eedd9054ca'
                                    }
                                },
                                'dc42c5598f4c63e0e9689d6eacaf3b07': {
                                    'id': 'dc42c5598f4c63e0e9689d6eacaf3b07',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': 'aafa6650-ad3a-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/dc42c5598f4c63e0e9689d6eacaf3b07'
                                    }
                                },
                                'a1c9782924a4786f63db3ceecb641c94': {
                                    'id': 'a1c9782924a4786f63db3ceecb641c94',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2426055',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/a1c9782924a4786f63db3ceecb641c94'
                                    }
                                },
                                'ee215aaf6b6479fd423c4cf2ffe48a5c': {
                                    'id': 'ee215aaf6b6479fd423c4cf2ffe48a5c',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2424621',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/ee215aaf6b6479fd423c4cf2ffe48a5c'
                                    }
                                },
                                'a391999184e3fc600467d3370e34f69e': {
                                    'id': 'a391999184e3fc600467d3370e34f69e',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia'
                                    },
                                    'platform': {
                                        'id': '2804fc82-acff-11e7-b6da-99213aeb1f33',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/a391999184e3fc600467d3370e34f69e'
                                    }
                                },
                                '8d2ed1b1aa0bc68ebec6e0bc6e3060a4': {
                                    'id': '8d2ed1b1aa0bc68ebec6e0bc6e3060a4',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425594',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/8d2ed1b1aa0bc68ebec6e0bc6e3060a4'
                                    }
                                },
                                '3f8a1c4cfcb6992d87940d78e0b11644': {
                                    'id': '3f8a1c4cfcb6992d87940d78e0b11644',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2424787',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/3f8a1c4cfcb6992d87940d78e0b11644'
                                    }
                                },
                                '7045bbc3e4e80d79c6489d08732e8f5f': {
                                    'id': '7045bbc3e4e80d79c6489d08732e8f5f',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': 'd126e852-ad31-11e7-b6da-99213aeb1f33',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/7045bbc3e4e80d79c6489d08732e8f5f'
                                    }
                                },
                                'b7f84db5c445c1d4c41865af42503b83': {
                                    'id': 'b7f84db5c445c1d4c41865af42503b83',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': '4f442f68-ad16-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/b7f84db5c445c1d4c41865af42503b83'
                                    }
                                },
                                '7a4242af7a4ba8204e529fe60bef221d': {
                                    'id': '7a4242af7a4ba8204e529fe60bef221d',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425892',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/7a4242af7a4ba8204e529fe60bef221d'
                                    }
                                },
                                'a994d3b8e2f6a243ed56f918e5e1b108': {
                                    'id': 'a994d3b8e2f6a243ed56f918e5e1b108',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425850',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/a994d3b8e2f6a243ed56f918e5e1b108'
                                    }
                                },
                                '554a1170b7be0aa95b70d713d38a4ff0': {
                                    'id': '554a1170b7be0aa95b70d713d38a4ff0',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': 'f681c3da-ad7a-11e7-b6da-99213aeb1f33',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/554a1170b7be0aa95b70d713d38a4ff0'
                                    }
                                },
                                'd4e2ce3f2583a115d5621506342ce78a': {
                                    'id': 'd4e2ce3f2583a115d5621506342ce78a',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': 'c3c6dfd2-acb9-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/d4e2ce3f2583a115d5621506342ce78a'
                                    }
                                },
                                'e431e3cfb8e09aaed37de0920b5a5e27': {
                                    'id': 'e431e3cfb8e09aaed37de0920b5a5e27',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2426087',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/e431e3cfb8e09aaed37de0920b5a5e27'
                                    }
                                },
                                '158099e4a729c6964aaaeea9c0ba6e5e': {
                                    'id': '158099e4a729c6964aaaeea9c0ba6e5e',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2424873',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/158099e4a729c6964aaaeea9c0ba6e5e'
                                    }
                                },
                                '98497e5a7f5b64d7d08c6eb6e01aa73b': {
                                    'id': '98497e5a7f5b64d7d08c6eb6e01aa73b',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'Herald Sun'
                                    },
                                    'platform': {
                                        'id': '2cf88d7e-ad5b-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/98497e5a7f5b64d7d08c6eb6e01aa73b'
                                    }
                                },
                                'c04d59a2a9df929f9e50c22438881b8c': {
                                    'id': 'c04d59a2a9df929f9e50c22438881b8c',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2424972',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/c04d59a2a9df929f9e50c22438881b8c'
                                    }
                                },
                                'ffe0e0759e54e49dd158e574bf277554': {
                                    'id': 'ffe0e0759e54e49dd158e574bf277554',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': '9acafb7e-ad4d-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/ffe0e0759e54e49dd158e574bf277554'
                                    }
                                },
                                'd84779211b39cfa7c089ed6afbc91bb3': {
                                    'id': 'd84779211b39cfa7c089ed6afbc91bb3',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'The Daily Telegraph'
                                    },
                                    'platform': {
                                        'id': '041ec5b2-ad56-11e7-b6da-99213aeb1f33',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/d84779211b39cfa7c089ed6afbc91bb3'
                                    }
                                },
                                '2276fa37b922e19a98b2215ba8f1266d': {
                                    'id': '2276fa37b922e19a98b2215ba8f1266d',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': '646645d8-ad49-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/2276fa37b922e19a98b2215ba8f1266d'
                                    }
                                },
                                'fe284a8a813a4c986adbd3b7c8f4b042': {
                                    'id': 'fe284a8a813a4c986adbd3b7c8f4b042',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'The Daily Telegraph'
                                    },
                                    'platform': {
                                        'id': 'cc00292a-ad3f-11e7-a182-b1c918163bc8',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/fe284a8a813a4c986adbd3b7c8f4b042'
                                    }
                                },
                                'e50683aa8d71665b5837042e962d36ad': {
                                    'id': 'e50683aa8d71665b5837042e962d36ad',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'The Daily Telegraph'
                                    },
                                    'platform': {
                                        'id': '23acb06e-ad66-11e7-b6da-99213aeb1f33',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/e50683aa8d71665b5837042e962d36ad'
                                    }
                                },
                                '1a4f0629fec1b419d609bb4d25bd8086': {
                                    'id': '1a4f0629fec1b419d609bb4d25bd8086',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425035',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/1a4f0629fec1b419d609bb4d25bd8086'
                                    }
                                },
                                '568a6d2587fcb2563ce0bcc2d52e7bbb': {
                                    'id': '568a6d2587fcb2563ce0bcc2d52e7bbb',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'News Corp Australia Network'
                                    },
                                    'platform': {
                                        'id': '32aa5a74-ad86-11e7-a182-b1c918163bc8',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/568a6d2587fcb2563ce0bcc2d52e7bbb'
                                    }
                                },
                                '1df5dabcf123af038ad14040dd86dd08': {
                                    'id': '1df5dabcf123af038ad14040dd86dd08',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425955',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/1df5dabcf123af038ad14040dd86dd08'
                                    }
                                },
                                '15859eec5d1f892f52c6435018634bbb': {
                                    'id': '15859eec5d1f892f52c6435018634bbb',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2426004',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/15859eec5d1f892f52c6435018634bbb'
                                    }
                                },
                                '5c66f5acfb004271cf2f27cd91eef4d2': {
                                    'id': '5c66f5acfb004271cf2f27cd91eef4d2',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'PerthNow'
                                    },
                                    'platform': {
                                        'id': 'PerthNow-2425605',
                                        'system': 'wordpress'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/5c66f5acfb004271cf2f27cd91eef4d2'
                                    }
                                },
                                '048a90d6277592d536ef81899a78857a': {
                                    'id': '048a90d6277592d536ef81899a78857a',
                                    'type': 'article',
                                    'rightsMetadata': {
                                        'originatedSource': 'FOX SPORTS'
                                    },
                                    'platform': {
                                        'id': 'c2788826-ad9d-11e7-870b-f10c52fa763b',
                                        'system': 'methode'
                                    },
                                    'link': {
                                        'self': 'https://content-dev.api.news/v3/articles/048a90d6277592d536ef81899a78857a'
                                    }
                                }
                            }
                        }
                    }
                }
            })
            .end(done);
    });

    it('articleBasicSearch', (done) => {
        request
        .post('/graphql/v3')
        .set('Accept', 'application/json')
        .type('form')
        .send({ query: `query  {
            articleBasicSearch(apiKey: "123", size: 3) {
                results {
                    ... on V3Article {
                        id
                        link { self }
                    }
                }
                totalHits
                hits
                size
                page
            }
        }`})
        .expect(200, {
            data: {
                articleBasicSearch: {
                    hits: 3,
                    page: 1,
                    results: [
                        {
                            id: 'ba4a71df01c7ad4b3f28baca1489c144',
                            link: {
                                self: 'https://content-sit.api.news/v3/articles/ba4a71df01c7ad4b3f28baca1489c144'
                            }
                        },
                        {
                            id: '05bc658b33a0ded6af338f48b2ad90bc',
                            link: {
                                self: 'https://content-sit.api.news/v3/articles/05bc658b33a0ded6af338f48b2ad90bc'
                            }
                        },
                        {
                            id: 'b9ddf95cf3ae2fcb35bb3db74be12f99',
                            link: {
                                self: 'https://content-sit.api.news/v3/articles/b9ddf95cf3ae2fcb35bb3db74be12f99'
                            }
                        }
                    ],
                    size: 3,
                    totalHits: 388122
                }
            }
        })
        .end(done);
    });

    it('image', (done) => {
        request
            .post('/graphql/v3')
            .set('Accept', 'application/json')
            .type('form')
            .send({ query: `query  {
                getV3(id: "3b25867dee63719309825c33d6b8711a", apiKey: "456") {
                    content {
                        ... on V3Image {
                            id
                            link { self media }
                            type
                            status
                            platform {
                                documentId
                                userUpdated
                                systemUpdated
                            }
                            date {
                                live
                                updated
                                created
                                processed
                            }
                            accessType
                            caption
                            altText
                            mimeType
                            width
                            height
                            cropName
                            transformTranslateX
                            transformTranslateY
                            transformScaleHeight
                            transformScaleWidth
                        }
                    }
                }
            }`}).expect(200, {
                data: {
                    getV3: {
                        content: {
                            accessType: 'free',
                            altText: 'Peter Gogarty',
                            caption: 'Child sex abuse survivor Peter Gogarty takes comfort in the conviction of Archbishop Philip Wilson.',
                            cropName: '4:3-Thumbnail',
                            date: {
                                created: '2018-07-03T03:01:29.488Z',
                                live: '2018-07-03T03:00:02.000Z',
                                processed: '2018-07-03T03:01:29.523Z',
                                updated: '2018-07-03T02:59:40.000Z',
                            },
                            height: 75,
                            id: '3b25867dee63719309825c33d6b8711a',
                            link: {
                                media: 'https://content-sit.api.news/v3/images/bin/3b25867dee63719309825c33d6b8711a',
                                self: 'https://content-sit.api.news/v3/images/3b25867dee63719309825c33d6b8711a'
                            },
                            mimeType: 'image/jpeg',
                            platform: {
                                documentId: '05b4bf2a-d06e-48a3-9b3d-7d143b36f092',
                                systemUpdated: 'aap_live',
                                userUpdated: 'v3-ingester'
                            },
                            status: 'active',
                            transformScaleHeight: 0,
                            transformScaleWidth: 0,
                            transformTranslateX: 0,
                            transformTranslateY: 0,
                            type: 'image',
                            width: 100
                        }
                    }
                }
            }).end(done);
    });

    it('video', (done) => {
        request
            .post('/graphql/v3')
            .set('Accept', 'application/json')
            .type('form')
            .send({ query: `query  {
            getV3(id: "98485290c72e31ce538c6b5de08912b6", apiKey: "456") {
                content {
                    ... on V3Video {
                        id
                        link { self }
                        type
                        status
                        platform {
                            documentId
                            userUpdated
                            systemUpdated
                        }
                        date {
                            live
                            updated
                            created
                            processed
                        }

                        categories
                        target
                        keywords
                        headline { default }
                        caption
                        related
                        references
                    }
                }
            }
        }`})
        .expect(200, {
            data: {
                getV3: {
                    content: {
                        status: 'active',
                        type: 'video',
                        caption: 'this is the UPDATED long description.',
                        date: {
                            created: '2018-02-22T18:10:12.000Z',
                            live: '2018-02-22T18:10:12.000Z',
                            processed: '2018-02-23T03:51:58.344Z',
                            updated: '2018-02-23T03:52:10.000Z'
                        },
                        headline: {
                            default: 'This is the UPDATED name'
                        },
                        id: '98485290c72e31ce538c6b5de08912b6',
                        keywords: [
                            'Flip (acrobatic)',
                            'Spring break',
                            'Drone',
                            'Wakeboarding',
                            'Barbecue',
                            'Skimboarding',
                            'Dog',
                            'Surfing',
                            'Pet',
                            'Rope Swing',
                            'Boat'
                        ],
                        link: {
                            self: 'https://content-sit.api.news/v3/videos/98485290c72e31ce538c6b5de08912b6'
                        },
                        platform: {
                            documentId: 'c23cfc7c-f53c-4842-80ec-9df3de932c14',
                            systemUpdated: 'brightcove',
                            userUpdated: 'synchroniser'
                        },
                        'categories': {
                            'keyword': [
                                {
                                    'id': 'c9e38655f6b4be4d6d075336963da077',
                                    'slug': 'keyword-flipacrobatic',
                                    'path': '/keyword/Flip (acrobatic)',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/c9e38655f6b4be4d6d075336963da077'
                                    }
                                },
                                {
                                    'id': 'a744db27af22d723458f6d177c12d3ae',
                                    'slug': 'keyword-springbreak',
                                    'path': '/keyword/Spring break',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/a744db27af22d723458f6d177c12d3ae'
                                    }
                                },
                                {
                                    'id': '2d7968524f5d1d86f80d4da25d115ca2',
                                    'slug': 'keyword-drone',
                                    'path': '/keyword/Drone',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/2d7968524f5d1d86f80d4da25d115ca2'
                                    }
                                },
                                {
                                    'id': 'cd9fc6b508eb7c5ebecaba62839b4e5e',
                                    'slug': 'keyword-wakeboarding',
                                    'path': '/keyword/Wakeboarding',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/cd9fc6b508eb7c5ebecaba62839b4e5e'
                                    }
                                },
                                {
                                    'id': 'c374a7405294075c4bc066f1c8b30fb2',
                                    'slug': 'keyword-barbecue',
                                    'path': '/keyword/Barbecue',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/c374a7405294075c4bc066f1c8b30fb2'
                                    }
                                },
                                {
                                    'id': '67a36dcead1eed52387775caff265121',
                                    'slug': 'keyword-skimboarding',
                                    'path': '/keyword/Skimboarding',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/67a36dcead1eed52387775caff265121'
                                    }
                                },
                                {
                                    'id': '0d191b0560d9b87a60258db03d74267d',
                                    'slug': 'keyword-dog',
                                    'path': '/keyword/Dog',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/0d191b0560d9b87a60258db03d74267d'
                                    }
                                },
                                {
                                    'id': 'aac0baaae2c1e1ed615deca688479caf',
                                    'slug': 'keyword-surfing',
                                    'path': '/keyword/Surfing',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/aac0baaae2c1e1ed615deca688479caf'
                                    }
                                },
                                {
                                    'id': '336a41c2f68cd7caca431f1546067cc8',
                                    'slug': 'keyword-pet',
                                    'path': '/keyword/Pet',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/336a41c2f68cd7caca431f1546067cc8'
                                    }
                                },
                                {
                                    'id': '08ccca57b9cd19f6b9f44d152b7f0f64',
                                    'slug': 'keyword-ropeswing',
                                    'path': '/keyword/Rope Swing',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/08ccca57b9cd19f6b9f44d152b7f0f64'
                                    }
                                },
                                {
                                    'id': '0e54ade5a0a904c862c2ddce81080591',
                                    'slug': 'keyword-boat',
                                    'path': '/keyword/Boat',
                                    'provider': 'brightcove',
                                    'providerSource': 'editor',
                                    'providerSourceId': 'none',
                                    'classification': 'manual',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/categories/0e54ade5a0a904c862c2ddce81080591'
                                    }
                                }
                            ]
                        },
                        'target': {
                            'domainLink': {
                                'news.com.au': {
                                    'link': 'https://www.news.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.news.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'national',
                                    'adTarget': 'NATIONAL',
                                    'metered': false
                                },
                                'perthnow.com.au': {
                                    'link': 'https://www.perthnow.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.perthnow.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'heraldsun.com.au': {
                                    'link': 'https://www.heraldsun.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.heraldsun.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'dailytelegraph.com.au': {
                                    'link': 'https://www.dailytelegraph.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.dailytelegraph.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'adelaidenow.com.au': {
                                    'link': 'https://www.adelaidenow.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.adelaidenow.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'couriermail.com.au': {
                                    'link': 'https://www.couriermail.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.couriermail.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'themercury.com.au': {
                                    'link': 'https://www.themercury.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.themercury.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'goldcoastbulletin.com.au': {
                                    'link': 'https://www.goldcoastbulletin.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.goldcoastbulletin.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'weeklytimesnow.com.au': {
                                    'link': 'https://www.weeklytimesnow.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.weeklytimesnow.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'ntnews.com.au': {
                                    'link': 'https://www.ntnews.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.ntnews.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'geelongadvertiser.com.au': {
                                    'link': 'https://www.geelongadvertiser.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.geelongadvertiser.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'cairnspost.com.au': {
                                    'link': 'https://www.cairnspost.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.cairnspost.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'townsvillebulletin.com.au': {
                                    'link': 'https://www.townsvillebulletin.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.townsvillebulletin.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news/national',
                                    'adTarget': 'NEWS.NATIONAL',
                                    'metered': true
                                },
                                'theaustralian.com.au': {
                                    'link': 'https://www.theaustralian.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'dynamicLink': 'https://www.theaustralian.com.au/video/id-5348771526001-5738669451001/this-is-the-updated-name',
                                    'route': 'news',
                                    'adTarget': 'NEWS',
                                    'metered': false
                                }
                            },
                            'domains': [
                                'heraldsun.com.au',
                                '_ANY',
                                'themercury.com.au',
                                'adelaidenow.com.au',
                                'goldcoastbulletin.com.au',
                                'dailytelegraph.com.au',
                                'perthnow.com.au',
                                'ntnews.com.au',
                                'news.com.au',
                                'geelongadvertiser.com.au',
                                'theaustralian.com.au',
                                'cairnspost.com.au',
                                'weeklytimesnow.com.au',
                                'townsvillebulletin.com.au',
                                'couriermail.com.au'
                            ],
                            'sections': [
                                {
                                    'id': '1226490441611',
                                    'path': '/section/main/newscorpaustralia.com/Web/NewsNetwork/Network News/National',
                                    'slug': 'section-main-newscorpaustraliacom-web-newsnetwork-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226490441611'
                                    }
                                },
                                {
                                    'id': '1111112088738',
                                    'path': '/section/aux/theaustralian.com.au/Web/TheAustralian/News',
                                    'slug': 'section-aux-theaustraliancomau-web-theaustralian-news',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1111112088738'
                                    }
                                }
                            ],
                            'displays': [
                                {
                                    'id': '1226312254910',
                                    'path': '/display/news.com.au/National News',
                                    'slug': 'display-newscomau-nationalnews',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226312254910'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226596458827',
                                    'path': '/display/perthnow.com.au/Network News/National',
                                    'slug': 'display-perthnowcomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226596458827'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226618420663',
                                    'path': '/display/heraldsun.com.au/Network News/National',
                                    'slug': 'display-heraldsuncomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226618420663'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226618420664',
                                    'path': '/display/dailytelegraph.com.au/Network News/National',
                                    'slug': 'display-dailytelegraphcomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226618420664'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226628352059',
                                    'path': '/display/adelaidenow.com.au/Network News/National',
                                    'slug': 'display-adelaidenowcomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226628352059'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226646734598',
                                    'path': '/display/couriermail.com.au/Network News/National',
                                    'slug': 'display-couriermailcomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226646734598'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226683748532',
                                    'path': '/display/themercury.com.au/Network News/National',
                                    'slug': 'display-themercurycomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226683748532'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226692643376',
                                    'path': '/display/goldcoastbulletin.com.au/Network News/National',
                                    'slug': 'display-goldcoastbulletincomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226692643376'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226696905239',
                                    'path': '/display/weeklytimesnow.com.au/Network News/National',
                                    'slug': 'display-weeklytimesnowcomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226696905239'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226696905240',
                                    'path': '/display/ntnews.com.au/Network News/National',
                                    'slug': 'display-ntnewscomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226696905240'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226696905241',
                                    'path': '/display/geelongadvertiser.com.au/Network News/National',
                                    'slug': 'display-geelongadvertisercomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226696905241'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226696905242',
                                    'path': '/display/cairnspost.com.au/Network News/National',
                                    'slug': 'display-cairnspostcomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226696905242'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1226696905243',
                                    'path': '/display/townsvillebulletin.com.au/Network News/National',
                                    'slug': 'display-townsvillebulletincomau-networknews-national',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1226696905243'
                                    },
                                    'dominant': true
                                },
                                {
                                    'id': '1111112088738',
                                    'path': '/display/theaustralian.com.au/News',
                                    'slug': 'display-theaustraliancomau-news',
                                    'link': {
                                        'self': 'https://content-sit.api.news/v3/sections/1111112088738'
                                    },
                                    'dominant': true
                                }
                            ]
                        },
                        'related': {
                            'thumbnail': {
                                'default': [
                                    '9cfa5f7e9fc75b8064004fba842e418f'
                                ]
                            },
                            'primary': {
                                'default': [
                                    '736d45561435b42c2cd58198abc6aaa9'
                                ]
                            }
                        },
                        'references': {
                            '9cfa5f7e9fc75b8064004fba842e418f': {
                                'id': '9cfa5f7e9fc75b8064004fba842e418f',
                                'type': 'image',
                                'rightsMetadata': {
                                    'originatedSource': 'Storyful'
                                },
                                'platform': {
                                    'id': '5348771526001-5738669451001-thumbnail',
                                    'system': 'brightcove'
                                },
                                'link': {
                                    'self': 'https://content-sit.api.news/v3/images/9cfa5f7e9fc75b8064004fba842e418f',
                                    'media': 'https://content-sit.api.news/v3/images/bin/9cfa5f7e9fc75b8064004fba842e418f'
                                },
                                'width': 151,
                                'height': 85,
                                'altText': 'This is the UPDATED name',
                                'mimeType': 'image/jpeg'
                            },
                            '736d45561435b42c2cd58198abc6aaa9': {
                                'id': '736d45561435b42c2cd58198abc6aaa9',
                                'type': 'image',
                                'rightsMetadata': {
                                    'originatedSource': 'Storyful'
                                },
                                'platform': {
                                    'id': '5348771526001-5738669451001-poster',
                                    'system': 'brightcove'
                                },
                                'link': {
                                    'self': 'https://content-sit.api.news/v3/images/736d45561435b42c2cd58198abc6aaa9',
                                    'media': 'https://content-sit.api.news/v3/images/bin/736d45561435b42c2cd58198abc6aaa9'
                                },
                                'width': 649,
                                'height': 365,
                                'altText': 'This is the UPDATED name',
                                'mimeType': 'image/jpeg'
                            }
                        }
                    }
                }
            }
        })
        .end(done);
    });

    it('article', (done) => {
        request
            .post('/graphql/v3')
            .set('Accept', 'application/json')
            .type('form')
            .send({ query: `query  {
            getV3(id: "e8a0b180f614a76cf5935e8e02b86a32101", apiKey: "456") {
                content {
                    ... on V3Article {
                        id
                        link { self }
                        type
                        subtype
                        status
                        platform {
                            documentId
                            userUpdated
                            systemUpdated
                            instanceUpdated
                        }
                        date {
                            live
                            updated
                            custom
                            created
                            processed
                        }

                        draft
                        body            { default }
                        headline        { default }
                        standfirst      { default }
                        intro           { default }
                        commentsAllowed { default }
                        keywords
                        target
                        categories
                    }
                }
            }
        }`}).expect(200, {
            data: {
                getV3: {
                    content: {
                        id: 'e8a0b180f614a76cf5935e8e02b86a32101',
                        keywords: [
                            'keyword article 001',
                            'Suburb',
                            'SubContinent',
                            'State',
                            'person article 001',
                            'ContinentalRegion',
                            'Korea'
                        ],
                        link: {
                            self: 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/articles/e8a0b180f614a76cf5935e8e02b86a32101'
                        },
                        platform: {
                            documentId: '92cd048a-cf74-4cb8-b7d3-5be2432970e6',
                            instanceUpdated: 'dailytelegraph',
                            systemUpdated: 'wordpress',
                            userUpdated: 'AT_testuser'
                        },
                        date: {
                            created: '2017-01-18T00:03:26.000Z',
                            custom: '2017-01-18T00:03:26.001Z',
                            live: '2017-03-18T00:03:26.000Z',
                            processed: '2018-01-11T03:12:39.002Z',
                            updated: '2018-01-11T03:12:39.096Z'
                        },
                        status: 'active',
                        subtype: 'news',
                        categories: {
                            person: [
                               {
                                  id: 'e02b88c4b450011ea07d0bc2b84ebd6a8ff',
                                  subtype: 'singer',
                                  slug: 'person-personarticle001',
                                  path: '/person/person article 001',
                                  provider: 'kurator',
                                  providerId: 'kurator uuid',
                                  confidence: 80,
                                  relevancy: 66,
                                  frequency: 3,
                                  classification: 'suggested',
                                  link: {
                                     self: 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/categories/e02b88c4b450011ea07d0bc2b84ebd6a8ff'
                                  },
                                  aliases: [

                                  ]
                               }
                            ],
                            location: [
                               {
                                  id: 'bb66b34d066d39f9a1d5a2ec27ab43cb8ff',
                                  slug: 'location-subcontinent-continentalregion-korea-state-suburb',
                                  path: '/location/SubContinent/ContinentalRegion/Korea/State/Suburb',
                                  provider: 'kurator',
                                  providerId: 'kurator uuid',
                                  confidence: 80,
                                  relevancy: 66,
                                  frequency: 3,
                                  geoPoint: {
                                    lat: -27.468056,
                                     lon: 153.028056
                                  },
                                  classification: 'experiment',
                                  link: {
                                    self: 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/categories/bb66b34d066d39f9a1d5a2ec27ab43cb8ff'
                                  },
                                  aliases: [

                                  ]
                               }
                            ],
                            keyword: [
                                {
                                   id: 'bd5d75f5eef05907ae938559738220ae8ff',
                                   slug: 'keyword-keywordarticle001',
                                   path: '/keyword/keyword article 001',
                                   provider: 'kurator',
                                   providerId: 'kurator uuid',
                                   confidence: 80,
                                   relevancy: 66,
                                   frequency: 3,
                                   classification: 'suggested',
                                   link: {
                                      self: 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/categories/bd5d75f5eef05907ae938559738220ae8ff'
                                   },
                                   aliases: [

                                   ]
                                }
                            ]
                        },
                        target: {
                            displays: [
                                {
                                    dominant: true,
                                    id: '1226643946953',
                                    link: {
                                        self: 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/sections/1226643946953'
                                    },
                                    path: '/display/heraldsun.com.au/HeraldSun/Best from Around',
                                    slug: 'display-heraldsuncomau-heraldsun-bestfromaround'
                                },
                                {
                                    dominant: true,
                                    id: '1228020697923',
                                    link: {
                                        self: 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/sections/1228020697923'
                                    },
                                    path: '/display/perthnow.com.au/HeraldSun/Best from Around',
                                    slug: 'display-perthnowcomau-heraldsun-bestfromaround'
                                }
                            ],
                            domainLink: {
                                'heraldsun.com.au': {
                                    adTarget: 'NEWS',
                                    dynamicLink: 'https://www.heraldsun.com.au/news/boy-george-has-signed-on-for-the-2017-season/news-story/e8a0b180f614a76cf5935e8e02b86a32101',
                                    link: 'https://www.heraldsun.com.au/news/boy-george-has-signed-on-for-the-2017-season/news-story/e8a0b180f614a76cf5935e8e02b86a32101',
                                    metered: true,
                                    route: 'news'
                                },
                                'perthnow.com.au': {
                                    adTarget: 'NEWS',
                                    dynamicLink: 'https://www.perthnow.com.au/news/boy-george-has-signed-on-for-the-2017-season/news-story/e8a0b180f614a76cf5935e8e02b86a32101',
                                    link: 'https://www.perthnow.com.au/news/boy-george-has-signed-on-for-the-2017-season/news-story/e8a0b180f614a76cf5935e8e02b86a32101',
                                    metered: true,
                                    route: 'news'
                                }
                            },
                            domains: [
                                'perthnow.com.au',
                                'heraldsun.com.au',
                                '_ANY'
                            ],
                            sections: [
                                {
                                    id: '1226620527953',
                                    link: {
                                        'self': 'https://newsapi3-sit-client.nprod.newsapi.com.au/v3/sections/1226620527953'
                                    },
                                    path: '/section/Web/HeraldSun/Best from Around',
                                    slug: 'section-web-heraldsun-bestfromaround'
                                }
                            ]
                        },
                        type: 'article',
                        draft: false,
                        body: { default: '<h1>h1 tag</h1><h2>h2 tag</h2><p>paragraph 1 paragraph 2</p>' },
                        headline: { default:  'BOY George has signed on for the 2017 season' },
                        intro: { default: 'BOY George is joining The Voice Australia in 2017.' },
                        standfirst: { default: 'BOY George has signed on for the 2017 season' },
                        commentsAllowed: { default: 'true' }
                    }
                }
            }
        }).end(done);
    });
});
