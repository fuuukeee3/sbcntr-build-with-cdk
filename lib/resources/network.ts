import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface NetworkProps {

}

export class Network extends Construct {
  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    // --- VPC
    const vpc = new ec2.Vpc(this, 'sbcntrVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
      vpcName: 'sbcntrVpc',
      subnetConfiguration: [],
    });

    // --- Subnet, RouteTable, IGW

    // コンテナ用プライベートサブネット
    const privateSubnetContainer1A = new ec2.CfnSubnet(this, 'privateSubnetContainer1A', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.8.0/24',
      availabilityZone: 'ap-northeast-1a',
    });
    cdk.Tags.of(privateSubnetContainer1A).add('Name',  'sbcntr-subnet-private-container-1a');
    cdk.Tags.of(privateSubnetContainer1A).add('Type',  'Isolated');

    const privateSubnetContainer1C = new ec2.CfnSubnet(this, 'privateSubnetContainer1C', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.9.0/24',
      availabilityZone: 'ap-northeast-1c',
    });
    cdk.Tags.of(privateSubnetContainer1C).add('Name',  'sbcntr-subnet-private-container-1c');
    cdk.Tags.of(privateSubnetContainer1C).add('Type',  'Isolated');

    // コンテナ用ルートテーブル
    const routeTableApp = new ec2.CfnRouteTable(this, 'routeTableApp', {
      vpcId: vpc.vpcId,
      tags: [{
        key: 'Name',
        value: ' sbcntr-route-app',
      }],
    });

    // ルートテーブル関連付け
    const routeTableAppAssociation1A = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableAppAssociation1A', {
      routeTableId: routeTableApp.attrRouteTableId,
      subnetId: privateSubnetContainer1A.attrSubnetId,
    });

    const routeTableAppAssociation1C = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableAppAssociation1C', {
      routeTableId: routeTableApp.attrRouteTableId,
      subnetId: privateSubnetContainer1C.attrSubnetId,
    });

    // DB用プライベートサブネット
    const privateSubnetDB1A = new ec2.CfnSubnet(this, 'privateSubnetDB1A', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.16.0/24',
      availabilityZone: 'ap-northeast-1a',
    });
    cdk.Tags.of(privateSubnetDB1A).add('Name',  'sbcntr-subnet-private-db-1a');
    cdk.Tags.of(privateSubnetDB1A).add('Type',  'Isolated');

    const privateSubnetDB1C = new ec2.CfnSubnet(this, 'privateSubnetDB1C', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.17.0/24',
      availabilityZone: 'ap-northeast-1c',
    });
    cdk.Tags.of(privateSubnetDB1C).add('Name',  'sbcntr-subnet-private-db-1c');
    cdk.Tags.of(privateSubnetDB1C).add('Type',  'Isolated');

    // DB用ルートテーブル
    const routeTableDB = new ec2.CfnRouteTable(this, 'routeTableDB', {
      vpcId: vpc.vpcId,
      tags: [{
        key: 'Name',
        value: ' sbcntr-route-db',
      }],
    });

    // ルートテーブル関連付け
    const routeTableDBAssociation1A = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableDBAssociation1A', {
      routeTableId: routeTableDB.attrRouteTableId,
      subnetId: privateSubnetDB1A.attrSubnetId,
    });

    const routeTableDBAssociation1C = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableDBAssociation1C', {
      routeTableId: routeTableDB.attrRouteTableId,
      subnetId: privateSubnetDB1C.attrSubnetId,
    });
  }
}