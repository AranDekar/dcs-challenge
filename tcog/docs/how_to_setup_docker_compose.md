## tcog & docker compose

The following instructions assume you are developing on a Mac. 

### Install Docker Toolbox

Download and install [Docker for Mac](https://docs.docker.com/engine/installation/mac).

### Build a docker image of tcog

Go to your tcog installation then run:

```
docker build -t tcog .
```

### Run tcog in docker-compose

```
docker-compose up
```

### Visiting tcog in docker

Go to http://localhost:3001

