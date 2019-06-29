# misc

## /lib

### lib/middleware/fresh.js

The fresh middleware is a custom implementation for etags. Expresses default etag was too compute intensive since it effectively md5'd the content. Instead we adopted a weak etag based upon dates instead.

Depending upon how tcog was accessed, either tcog or via akamai a different expiry header is sent back to the browser. 5 minutes for direct origin hits vs 1 minute for Akamai. This was done to permit revalidation.

### lib/template-loader

The template loader is responsible for loading both templates found locally within tcog and those remotely within s3.

Upon initialisation, local templates are pre-processed and cached indefinately. This is done to ensure no further filesystem access once tcog is loaded.

The template loader has a notion of adapter. S3 for fetching from s3 and core as detailed above.

## package.json

### no_proxy=$npm_package_config_no_proxy

To support connectivity between tcogs current VPC and the new VPC when making requests to APIs located in the new VPC we need to ensure we bypass the DMZ proxies.

This is achieved by passing the no_proxy env variable when starting tcog. Note the first two values are always required.

```
no_proxy=169.254.169.254,localhost,prod.marketdata.digprod.cp1.news.com.au.

1. 169.254.169.254                         : aws instance metadata
2. localhost                               : localhost
3. prod.marketdata.digprod.cp1.news.com.au : new vpc application host
4. .. any other new VPC hosts
```

## /pixelblackhole

This folder should really reside under the /cfn. It's a collection of scripts which can be run in bamboo to update the tcog pixel to point to tcog itself or to a static resource. It's never really been used and so could be safe to delete and instead just managed via the AWS console instead.

More broadly the purpose of the pixel to to help us understand how tcog is being used around the nextwork. As this pixel is loaded in the browser on a per user basis it also provided realtime metrics about how we were being acccessed. Very valuable.

In the early days of tcog the pixel request in addition to returning a 1x1 gif it also do a full render lifecyle behind the scenes but terminating early with the pixel. This effectively provided backout cache updates.

The pixel whilst providing very valuable metrics was turned off to permanentally point to a static 1x1 pixel and not hit tcog. This was dont to provide more headroom.

It was planned to move the pixel capture to it's own microservice and funnel the metrics into ELK.

Note the use of the pixel permits trending projections. See ( feature/trending-transformer branch - a poc of this )

See also lib/middleware/tracking-pixel-endpoint.js

## clearing logs on a remote instance

The script below is a quick and dirty way of clearing old application logs on all tcog remote instances for given environment.

It connects to each box and removes log files which are not owned by the current tcog processes.

```Bash
#!/bin/sh

source ~/.profile

commands='pids=`ps -u svc-tcog -o pid= | awk -vORS=\| "{ print $1 }" | sed "s/|$/\n/" | sed "s/ //g"`; ls -d -1 /srv/tcog/current/logs/*.* | grep -Ev "$pids" | xargs -r rm'

ratchet list -A tcog --host $1 --out $PWD/hosts.txt 2>&1 >/dev/null
pssh --par=3 --inline -l ec2-user -h ./hosts.txt -O StrictHostKeyChecking=no -x "-i /Users/barnettj/.ssh/ec2-syd-tcog.pem" ${commands}
```

## Kibana

Kibana dashboards are stored [here](http://stash.news.com.au/projects/TCOG/repos/tcog-kibana3-dashboards/browse). There is a scheduled bamboo build plan which queries elastic search in order to generate a template performance dashboard.

- [autogen-dashboard](http://stash.news.com.au/projects/TCOG/repos/tcog-kibana-dashboards-autogen/browse)
- [Bamboo](http://bamboo.news.com.au/browse/NEWSTECH-KTA)

## logstash

There is an automated bamboo build plan which curates Kibana indexes dailys.

- [bamboo](http://bamboo.news.com.au/browse/NEWSTECH-CE)

## ssh

Sample SSH config to permit tunneling via centraladmin01 whilst connect to the VPN. It should not be required when you are on the news network.

Make sure you have an account setup first.

```
Host *
   ForwardAgent yes
   StrictHostKeyChecking no

Host 172.31.*
    IdentityFile ~/.ssh/ec2-syd-tcog.pem
    ProxyCommand ssh -W %h:%p <your-username>@centraladmin01.ni.news.com.au
```

### redis tunnel ( connecting to remote redis instances )

The following command can be used to make it easier to connect to remote redis instances.

```
    ssh -v -NL 6378:<redis-host>:6379 ec2-user@<remote-instance-ip>
eg: ssh -v -NL 6378:prod.redis-redis.tcog.cp1.news.com.au:6379 ec2-user@172.31.166.200
```

This should also work via VPN provided your tunnel is setup correctly.
