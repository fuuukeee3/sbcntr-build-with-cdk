import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './resources/network';
import { Ecs } from './resources/ecs'
// import { Cloud9 } from './resources/cloud9';

export class SbcntrBuildWithCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'Network', {})

    // const cloud9 = new Cloud9(this, 'Cloud9', {
    //   publicSubnetManagement1A: network.publicSubnetManagement1A,
    // })

    const ecs = new Ecs(this, 'Ecs', {})
  }
}
