import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class Iam extends Construct {
  constructor(scope: Construct, id: string, props: {}) {
    super(scope, id);

    const ecsCodeDeployRole = new iam.Role(this, 'ecsCodeDeployRole', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
      description: "Allows CodeDeploy to read S3 objects, invoke Lambda functions, publish to SNS topics, and update ECS services on your behalf.",
      roleName: "ecsCodeDeployRole",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AWSCodeDeployRoleForECS")
      ],
    });
  }
}