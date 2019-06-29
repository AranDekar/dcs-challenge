# Config

Most operations require the following to be set:

```
AWS_REGION=ap-southeast-2 AWS_PROFILE="Digital:DEV:TCOGAdminsRole"
```


# Deploy

```
./bin/deploy env/digidev
```

# Docker Login

```
eval $(aws ecr get-login --no-include-email --region ap-southeast-2 | sed 's|https://||')
```

# Build and Push Docker Images

```
./bin/push-images
```

# Build with Proxy Build Args and Push Docker Images

```
./bin/push-images --build-arg http_proxy="http://proxy-dev.cp1.news.com.au:8080" --build-arg https_proxy="http://proxy-dev.cp1.news.com.au:8080" --build-arg HTTP_PROXY="http://proxy-dev.cp1.news.com.au:8080" --build-arg HTTPS_PROXY="http://proxy-dev.cp1.news.com.au:8080"
```

# How to create/update a stack's Cloud Formation from Command Line ...

An example command, when bringing up SIT2 in DIGUAT.

```
AWS_S3_BUCKET=digawsuat01-dcs-templates AWS_PROFILE=Digital:UAT:TCOGAdminsRole AWS_STACK_NAME=dcs-sit ./bin/deploy env/duat-sit Tag=$(git rev-parse --short HEAD)
```

# How to push docker images from command line

1. Log into the Docker AWS repo.

```
eval $(AWS_PROFILE=Digital:UAT:TCOGAdminsRole aws ecr get-login --no-include-email --region ap-southeast-2 | sed 's|https://||')
```

The AWS client outputs a login command to repeat, then ...

```
AWS_ACCOUNT_ID=168146562322 ./bin/push-images
```

The AWS_ACCOUNT_ID can be located on your IAM SSO login page.