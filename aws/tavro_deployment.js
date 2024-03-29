//ARN - arn:aws:lambda:us-west-2:625520450430:function:TavroDeployment
var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
var codedeploy = new aws.CodeDeploy();

exports.handler = function(event, context) {
    var artifact_type;
    var bucket;
    var key;

    /* runtime functions */
    function getS3ObjectAndCreateDeployment() {
    // Get the s3 object to fetch application-name and deploymentgroup-name metadata.
	    s3.headObject({
		    Bucket: bucket,
		    Key: key
	    }, function(err, data) {
            if (err) {
                context.done('Error', 'Error getting s3 object: ' + err);
                console.log('Error getting s3 object: ' + err);
            } else {
                console.log('Creating deployment');
                createDeployment(data);
            }
        });
    }


    function createDeployment(data) {
        if (!data.Metadata['application-name'] || !data.Metadata['deploymentgroup-name']) {
            console.error('application-name and deploymentgroup-name object metadata must be set.');
            context.done();
        }
        var params = {
            applicationName: data.Metadata['application-name'],
            deploymentGroupName: data.Metadata['deploymentgroup-name'],
            description: 'Lambda invoked codedeploy deployment',
            ignoreApplicationStopFailures: false,
            revision: {
                revisionType: 'S3',
                s3Location: {
                    bucket: bucket,
                    bundleType: artifact_type,
                    key: key
                }
            }
        };
        codedeploy.createDeployment(params,
            function (err, data) {
                if (err) {
                    context.done('Error','Error creating deployment: ' + err);
                    console.log('Error creating deployment: ' + err);
                }
                else {
                    console.log(data);           // successful response
                    console.log('Finished executing lambda function');
                    context.done();
                }
        });
    }

    console.log('Received event:');
    console.log(JSON.stringify(event, null, '  '));

    // Get the object from the event
    bucket = event.Records[0].s3.bucket.name;
    key = event.Records[0].s3.object.key;

    tokens = key.split('.');
    artifact_type = tokens[tokens.length - 1];
    if (artifact_type == 'gz') {
        artifact_type = 'tgz';
    } else if (['zip', 'tar', 'tgz'].indexOf(artifact_type) < 0) {
        artifact_type = 'tar';
    }

    getS3ObjectAndCreateDeployment();
};