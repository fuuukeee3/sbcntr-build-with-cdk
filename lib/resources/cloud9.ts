import * as cdk from 'aws-cdk-lib';
import { aws_cloud9 as cloud9 } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface Cloud9Props {
  publicSubnetManagement1A: ec2.CfnSubnet;
}

export class Cloud9 extends Construct {
  constructor(scope: Construct, id: string, props: Cloud9Props) {
    super(scope, id);

    // cloud9
    const cloud9Dev = new cloud9.CfnEnvironmentEC2(this, 'cloud9Dev', {
      imageId: 'amazonlinux-2023-x86_64',
      instanceType: 't2.micro',
      automaticStopTimeMinutes: 30,
      connectionType: 'CONNECT_SSH',
      description: 'Cloud9 for application development',
      name: 'sbcntr-dev',
      subnetId: props.publicSubnetManagement1A.attrSubnetId,
    });
  }
}
