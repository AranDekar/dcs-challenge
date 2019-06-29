Tcog release cycles involve both releasing application code and infrastructure. 

This document is concerned with releasing code changes. 

# Building an application release

* Begin at the tcog [Bamboo dashboard](http://bamboo.news.com.au/browse/NEWSTECH-TCOG).
* In the top left of the screen, select the branch you wish to build from the dropdown.
* You will now see the build history. Bamboo automatically builds each branch but let's create a new build.

## Build

* In the top right hand corner, choose `Run branch`. You will notice that your branch's build is assigned a build number.

Should you wish to change the version of Node.js the build is run against, select `Run customized` and override the build variable `fe.node.version`. The format is `v<version>`

## Release

* On the right hand side of the build screen upon completion you will see a 'Create release' button. Click it.
* The 'Create new release' screen will let you create a release from a build. Click 'Create release'.

> A full list of created releases can be review [here](http://bamboo.news.com.au/deploy/viewDeploymentProjectVersions.action?id=117243905).

## Deploy a Release

* After creating a release, a list of environments will be presented. The far right hand side has a deploy option under Actions. Click it (the upward arrow icon).
* The next screen will ask you to confirm your selection.

All deployable environments can be seen [here](http://bamboo.news.com.au/deploy/viewDeploymentProjectEnvironments.action?id=117243905).

### During a release

During a release the following dashboards can be reviewed to understand the impact the code change has.

- [logstash](http://logstash.ni.news.com.au/#/dashboard/elasticsearch/TCOG%20Analytics%20(prod))
- [cloudwatch](https://ap-southeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-southeast-2#LoadBalancers:search=tcog-prod)
- [stackdriver](https://app.stackdriver.com/groups/4555/tcog/prod)

### How does a release work?

As part of a release the AWS API is queried to determine which autoscale group is currently active for a given environment.
Once determined the application artifact is uploaded to the s3 location [news-tech-content-tcog/deployments/](https://console.aws.amazon.com/s3/home?region=ap-southeast-2#&bucket=news-tech-content-tcog&prefix=deployments/)
under a key of `TCOG-<env>-<no>-core-autoscale`.

Once the artifact is uploaded, Bamboo executes a script that sshes into each ec2 instance in the active autoscale group and runs app_update.sh.

\* See `tcog:/cfn/files/core/app_update.sh`