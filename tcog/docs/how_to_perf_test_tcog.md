General documentation about running a performance test is available here: http://wiki.news.com.au/display/STP/Running+An+Automated+Performance+Test.

There are at least two different types of Performance tests we do; (1) testing a specific feature and (2) testing that deploying a release to production under load will be successful.

This HowTo assumes you have made a release and deployed it to our perf environment.

## 1. Test a feature branch

### Set up 6 ec2 instances in the perf ASG

* Go to AWS Console.
* Go into EC2 instances.
* Click on Auto Scaling Groups in the left hand side menu.
* Search for 'tcog-perf'

You will probably find a number of different ASG's. If you do you must check the DNS entry of perf.core.tcog.cp1.news.com.au in Route 53.

* Open a new AWS console
* Go into Route 53
* Click on Hosted Zones
* Search for 'tcog'
* Click on tcog.cp1.news.com.au
* Now, search for 'perf'
* You will find a Value for the 'perf.core.tcog.cp1.news.com.au' DNS indicating which ASG it is pointing to.

* Back in the original AWS console, select the correct ASG.
* Wait for its information to load in the lower half of the console. When it does click 'Edit' (far right hand corner) in the Details branch.
* Change Desired to 6.
* Change min to 6.
* Max is generally 20 but this might vary depending on your testing needs.
* This will provision 6 tcog instances. 

### Confirm the deployment
* Confirm that your tcog instance is running by going to http://perf.tcog.news.com.au. You should see the tcog homepage.

Sometimes a release branch will have a problem which will make it shutdown quickly on ec2. So spend some time verifying the release
is running and serving tcog before launching a performance test.

### Launch the performance test

The instructions at http://wiki.news.com.au/display/STP/Running+An+Automated+Performance+Test be adequate to explain how to run the TCOG perf test.

## 2. Test production deployment under load

tcog uses a 'hot code deployment' which will automatically deploy the new application to production in a live state. So, we need 
to verify that this process will actually work under conditions which are as close to production as possible. 

You will be repeating the steps above *except* you will initially deploy the last known good state build, ideally the 
one currently running on production that you want to retire.

### Watch for stability in metrics before deploying the release

Using AWS console, monitor the stable build while the test runs. You want to decide when the test and the release 
are in a stable relationship to each other. This is important because it establishes a grounded comparison point 
when the new release is deployed. Key metrics will depend upon on what you are testing but should include:

* latency
* 5xx counts
* use of instance CPU
* memory usage

When these indicators are stable, deploy the new build and continue monitoring.