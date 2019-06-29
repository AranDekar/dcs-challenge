

# 1 Create the new configuration

2 configurations are needed.

## Bamboo bake config

Specify this value when baking the environment - in tcogsubdomain.

NetworkSecurityEnv - prod.


## Tcog conf in the codebase.

The environment config file - nca (news.com.au).

Create conf/products/nca.json

Tcog discovers the new conf file to read from via the $env environment variable from shell (see end of cfn/files/core/app_update.sh).

## Create the new SQS queue.

Go to http://bamboo.news.com.au/browse/NEWSTECH-TCOGSQSDEPLOY .

Run a customized build. 

NetworkSecurityEnv - prod

tcogsubdomain - nca

The new build number & tcogsubdomain will indicate the SQS queue to use in the next step.

This will create an SQS queue like 'https://ap-southeast-2.queue.amazonaws.com/877800914193/tcog-nca-22-sqs'.

Once you have created the SQS queue ensure the CAPI team have updated Percolate
on their side to publish into the queue.

## Create the new env file for the new stack

Create conf/env/nca.json

Look at an existing env file for another product. Copy the contents into the new file.

Usually, the only values to change are the redis host and the sqs queue.

## Create the Cloud Formation Redis config for the new stack

In `cnf/redis-redis.json` add a an entry for the new stack to `Mappings/ResourceSize/CacheInstance`:

e.g. 

```
        "apps" : "cache.m3.xlarge",
        "nca" : "cache.r3.xlarge"

```

## Bake a new Redis

This process is basically the same as what is described in `How to Release and Deploy Tcog Infrastructure'. Provided the configuration has been 
created correctly, as described above, you will be create a new Redis instance on Bamboo - http://bamboo.news.com.au/browse/NEWSTECH-REDI

## Bake a new tcog stack 

As above, this is described in 'How to Release and Deploy Tcog Applications.'

## Ensure the Route 53 mapping exists for the new product, in Akamai.

Route 53 has already been configured for product related CNAMEs ahead of time. If you are creating a new one, make it point to tcog core prod.

Next, you will need to cooridinate updating Akamai to map the new stack (origin host), in this case 'nca', to the correct CNAME - nca.tcog.com.au.
 
These will have to be performed by ops.

See PerthNow or The Australian Akamai config as an example (wp.mastheads.prod is the Akamai config for tcog sites).

Change origins from tcog.new.com.au to <env>.tcog.news.com.au. This way the only change you'll have to perform to switchover is at the Route 53 level.

## Update the tcog Akamai config

The Akamai config is called 'tcog'. 

The Akamai tcog config is responsible for routing from an Akamai URL (e.g. a.tcog.new.com.au/etc?t_product=foo) to an internal URL that maps directly to a tcog call (e.g. tcog.news.com.au/component/etc?t_product=foo)
otherwise known as the Origin URL.

The 'a.tcog.news.com.au' CNAME layer is there to allow for indirection. 

## Nginx conf check

A further, underlying detail, is to ensure that nginx also knows about any new CNAMEs. As above, many CNAMEs for products have already been pre-configured but
be aware that new CNAMEs will also need to be mapped in an nginx.conf.

## Now map Route53 for the new Redis

Go to Route 53 in AWS.

You need to create a new CNAME for redis in the tcog proper domain section. A cname has already been created, automatically, by baking the new Redis instance - e.g. nca-1.redis-redis.builds.tcog.cp1.news.com.au .

The new CNAME that you create will look like:

nca.redis-redis.tcog.cp1.news.com.au and it will have a TTL of 60 seconds and a Value of the corresponding CNAME for the new redis generated via bamboo.

## Validate the new environment
Look for the newly created ASG that has been produced via baking the new tcog image.

If it's a brand new CNAME that has not been in production before you can switch Route53 to point to the new stack. 

