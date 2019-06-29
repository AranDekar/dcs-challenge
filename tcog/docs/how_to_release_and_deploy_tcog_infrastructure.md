Tcog release cycles involve both releasing application code and infrastructure. 

This document is concerned with releasing infrastucture.

# Building an infrastructure release

tcog's infrastructure is provided by Amazon Web Services.

It is worth looking through the /cfn folder, in the tcog codebase, as it contains infrastructure level logic.

## Build
* Begin at the tcog ec2 [Bamboo dashboard](http://bamboo.news.com.au/browse/NEWSTECH-TCOGCORE).
* In the top left of the screen, select the branch you wish to build from the dropdown.
* You will now see the build history. Bamboo automatically builds each branch but let's create a new build.

A build can be made using `Run Branch` that relies upon standard environment variable defaults, provisioning instances 
using the Development environment (awsdev). If you want to build infrastructure for any other environment, you will 
need to use `Run customized`.

In either case, you will notice that your branch's build is assigned a build number

### Run Customized Build Variables

* Select `Run customized` and click on `Override a variable`. You will see a drop down list of vars. 

The following build variables have significance for us.

**NetworkSecurityEnv**

This variable determines which security group tcog is deployed to within our AWS VPC. There are only three possible values. dev, uat & prod. tcogs current mappings are.

```
- [ prod ] tcog.news.com.au
- [ uat  ] uat.tcog.news.com.au
- [ uat  ] sit.tcog.news.com.au
- [ uat  ] sit2.tcog.news.com.au
- [ uat  ] perf.tcog.news.com.au
- [ dev  ] dev.tcog.news.com.au
```

**tcogSubdomain**

This value has a direct bearing upon tcogs dns and the name of the AutoScaling Group. It is assumed that there is a host setup.

```
FORMAT  : TCOG-<tcogSubdomain>-<buld-number>-core-autoscale
EXAMPLE : TCOG-prod-11-core-autoscale
```

> Note in-order for the build to initially succeed there needs to be a successful application code build. This is required to ensure that when the environment starts it has a known good applicaiton build.

### Failures

Should a build fail it's likely due to erroneous metadata stored in AWS or you are attempting to build a new branch against an exisiting security group and there already existing an ASG / cloudformation configuration. Usually this can be fixed with some housekeepin in AWS.

## Release

Infrastructure builds do not have a separate deployment plan. By default once an infrastructure build is complete it is available within AWS via it's internal loadbalancer or via instance IP's directly.

## Deploy a Release

In order for new infrastructure to be made available the DNS for the target environment needs to be updated in Route53 [here](https://console.aws.amazon.com/route53/home?region=ap-southeast-2#resource-record-sets:Z20939JFZTRJAA).

Infrastructure deployment should be co-ordinated with the operations team. It is preferable to do a weighted DNS switchover, gradually shifting a percentage of the traffic over.

### During a release

During a release the following dashboards can be reviewed to understand the impact the code change has.

- [logstash](http://logstash.ni.news.com.au/#/dashboard/elasticsearch/TCOG%20Analytics%20(prod))
- [cloudwatch](https://ap-southeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-southeast-2#LoadBalancers:search=tcog-prod)
- [stackdriver](https://app.stackdriver.com/groups/4555/tcog/prod)
