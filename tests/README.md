## Tests

To test the integration of Skinny Tcog and Tabula

When `docker-compose up` following containers are constructed
ppservices_redis_1
ppservices_fake-sqs_1
ppservices_mock-server_1
ppservices_capi-events-adapter_1
ppservices_tabula_1
ppservices_test_1

ppservices_mock-server_1 is used to provide the api response to mimic CAPI's behaviour.
ppservices_tabula_1 is used to serve the request for resources and persist the response in redis
ppservices_capi-events-adapter_1 is used to listen to SQS events and publish to redis for tabula to process whenever there is events in SQS

## Roadmap

### Current following scenarios are being tested

- [x] Tabula - Handle requests for CAPI article and store response in redis.
- [x] Tabula - Handle requests for CAPI collection and store response in redis.
- [x] Tabula - Handle requests for CAPI search and store response in redis.
- [x] Tabula - Handle requests for FoxSports and store response in redis.

### Future

- [ ] Tabula - Handle requests for FoxSportsPulse and store response in redis.
- [ ] capi-events-adapter - Handle events from SQS and publish to redis and verify the change made by Tabula

## Test

Test is configured as part of docker-compose. Navigate to pp-services folder.

```
docker-compose up
```

If there is change, then rebuild the changed container. E.g tabula and test are changed.
```
docker-compose up --build tabula test
```

### Types are put in src/types/