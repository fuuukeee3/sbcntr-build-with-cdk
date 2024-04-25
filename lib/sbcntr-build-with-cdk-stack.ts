import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './resources/network';

export class SbcntrBuildWithCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'Network', {})

  }
}
