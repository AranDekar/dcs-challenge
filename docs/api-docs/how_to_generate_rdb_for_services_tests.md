
# **LOCAL** code change
Since we want the data never expire in rdb, ttl should not be set. Change the code where to set the ttl from `redis.expire(key, ttl);` to `redis.expire(key);`

**Please do not checkin this change**

# **LOCAL** redis config change
In order to save/load to/from rdb in redis, two configs need to be enabled in redis config file.

`dbfilename dump.rdb`

`dir /usr/local/etc/redis`

**Please do not checkin this change**

# Build docker containers

The docker-compose.yml file contains all the logic to hookup docker containers and their dependency relationships. To trigger the build in different environments, different proxy settings is needed. All the docker build related proxy settings are stored in an executable. The location of the configs is `bin/docker/build/`

## Navigate to the pp-services folder

`cd <PP_SERVICES>`

## docker-compose build

`grep -o -i '^  [^ :]\{1,\}' docker-compose.yml | xargs ./bin/docker/build/vpn`

# docker-compose up

`docker-compose up`

# Start to collect and persist content

`cd tests`

`node src/testDataManager.ts`

# Persist data from redis

## Login redis to check the cache

### Login in redis

`redis-cli`

### Check the cache content ATM

`keys *`

### Make sure the ttl is as desired (-1 for this case)

`ttl <KEY>`

## Once the data is satisfied

`save`

## Data would be saved in `dir` and `dbfilename` specified in redis config

# Load the data from rdb

## Restart docker-compose

`docker-compose down; docker-compose up`

## Login in redis and check