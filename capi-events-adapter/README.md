CAPI Events Adapter
===================

Adapts CAPI SQS events into Redis Channel Events.

Example CAPI Event
------------------

```
{
  type: 'CAPI',
  id: '654fee5d03199ac271e703cb79eed8ea',
  capiId: '6341e1bf43e16259bf68523d68c77f8b',
  percolateId: '7e8b5b8f1702eb20696d25fdfaf98a1a',
  status: 'ACTIVE',
  responseMessage: null,
  responseCode: null,
  origin: 'CAINER',
  contentType: 'NEWS_STORY',
  version: 'PUBLISHED',
  docRevision: 7430,
  documentId: null,
  originId: 'weekly-sagittarius',
  dateLive: '2017-09-08T07:24:58.844Z',
  assetMetadata: { methodeCapiId: null, activeVersion: true },
  occurrenceMetadata: null
}
```

Example Redis Event
-------------------

```
{
  id: uuid.v4(),
  type: 'UPDATE',
  source: 'CAPI',
  sourceId: '6341e1bf43e16259bf68523d68c77f8b',
  timeUTC: Date.now()
}
```

Run
---

```
DEBUG=* yarn start
```

Test
----

```
DEBUG=* yarn test
```