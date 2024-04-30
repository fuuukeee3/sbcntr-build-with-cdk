import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface NetworkProps {

}

export class Network extends Construct {
  // public readonly publicSubnetManagement1A: ec2.CfnSubnet;

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

    // IGW
    const igw = new ec2.CfnInternetGateway(this, 'igw', {
      tags: [{
        key: 'Name',
        value: 'sbcntr-igw',
      }],
    });

    const vpcGatewayAttachment = new ec2.CfnVPCGatewayAttachment(this, 'vpcGatewayAttachment', {
      vpcId: vpc.vpcId,
      internetGatewayId: igw.attrInternetGatewayId,
    });
    
    // Ingress用サブネット
    const publicSubnetIngress1A = new ec2.CfnSubnet(this, 'publicSubnetIngress1A', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.0.0/24',
      availabilityZone: 'ap-northeast-1a',
      mapPublicIpOnLaunch: true
    });
    cdk.Tags.of(publicSubnetIngress1A).add('Name',  'sbcntr-subnet-public-ingress-1a');
    cdk.Tags.of(publicSubnetIngress1A).add('Type',  'Public');

    const publicSubnetIngress1C = new ec2.CfnSubnet(this, 'publicSubnetIngress1C', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: 'ap-northeast-1c',
      mapPublicIpOnLaunch: true
    });
    cdk.Tags.of(publicSubnetIngress1C).add('Name',  'sbcntr-subnet-public-ingress-1c');
    cdk.Tags.of(publicSubnetIngress1C).add('Type',  'Public');

    // Ingress用ルートテーブル
    const routeTableIngress = new ec2.CfnRouteTable(this, 'routeTableIngress', {
      vpcId: vpc.vpcId,
      tags: [{
        key: 'Name',
        value: 'sbcntr-route-ingress',
      }],
    });

    // ルートテーブル関連付け
    const routeTableIngressAssociation1A = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableIngressAssociation1A', {
      routeTableId: routeTableIngress.attrRouteTableId,
      subnetId: publicSubnetIngress1A.attrSubnetId,
    });

    const routeTableIngressAssociation1C = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableIngressAssociation1C', {
      routeTableId: routeTableIngress.attrRouteTableId,
      subnetId: publicSubnetIngress1C.attrSubnetId,
    });

    const cfnRouteIngress = new ec2.CfnRoute(this, 'MyCfnRoute', {
      routeTableId: routeTableIngress.attrRouteTableId,
      destinationCidrBlock: '0.0.0.0/0',
      gatewayId: igw.attrInternetGatewayId
    });
    cfnRouteIngress.addDependency(vpcGatewayAttachment)
    
     // 管理用用パブリックサブネット
     const publicSubnetManagement1A = new ec2.CfnSubnet(this, 'publicSubnetManagement1A', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.240.0/24',
      availabilityZone: 'ap-northeast-1a',
      mapPublicIpOnLaunch: true
    });
    cdk.Tags.of(publicSubnetManagement1A).add('Name',  'sbcntr-subnet-public-management-1a');
    cdk.Tags.of(publicSubnetManagement1A).add('Type',  'Public');

    const publicSubnetManagement1C = new ec2.CfnSubnet(this, 'publicSubnetManagement1C', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.241.0/24',
      availabilityZone: 'ap-northeast-1c',
      mapPublicIpOnLaunch: true
    });
    cdk.Tags.of(publicSubnetManagement1C).add('Name',  'sbcntr-subnet-public-management-1c');
    cdk.Tags.of(publicSubnetManagement1C).add('Type',  'Public');

    // ルートテーブル関連付け
    const routeTableManagementAssociation1A = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableManagementAssociation1A', {
      routeTableId: routeTableIngress.attrRouteTableId,
      subnetId: publicSubnetManagement1A.attrSubnetId,
    });
    
    const routeTableManagementAssociation1C = new ec2.CfnSubnetRouteTableAssociation(this, 'routeTableManagementAssociation1C', {
      routeTableId: routeTableIngress.attrRouteTableId,
      subnetId: publicSubnetManagement1C.attrSubnetId,
    });

    // --- Security Group ---
    // インターネット公開用
    const ingressSG = new ec2.CfnSecurityGroup(this, 'ingressSG', {
      groupDescription: "Security group for ingress",
      groupName: "ingres",
      securityGroupEgress: [{
        ipProtocol: '-1',
        cidrIp: '0.0.0.0/0',
        description: 'Allow all outbound traffic by default',
      }],
      securityGroupIngress: [{
        cidrIp: '0.0.0.0/0',
        description: 'from 0.0.0.0/0:80',
        ipProtocol: 'tcp',
        fromPort: 80,
        toPort: 80,
      }, {
        cidrIpv6: '::/0',
        description: 'from ::/0:80',
        ipProtocol: 'tcp',
        fromPort: 80,
        toPort: 80,
      }],
      tags: [{
        key: 'Name',
        value: 'sbcntr-sg-ingress',
      }],
      vpcId: vpc.vpcId,
    });

    // マネジメント用
    const managementSG = new ec2.SecurityGroup(this, 'managementSG', {
      vpc,
      allowAllOutbound: true,
      description: "Security group for management",
      securityGroupName: "management",
    });
    cdk.Tags.of(managementSG).add('Name',  'sbcntr-sg-management');

    // バックエンド用
    const backendSG = new ec2.SecurityGroup(this, 'backendSG', {
      vpc,
      allowAllOutbound: true,
      description: "Security group for backend app",
      securityGroupName: "backend",
    });
    cdk.Tags.of(backendSG).add('Name',  'sbcntr-sg-backend');

     // フロントエンド用
     const frontendSG = new ec2.SecurityGroup(this, 'frontendSG', {
      vpc,
      allowAllOutbound: true,
      description: "Security group for frontend app",
      securityGroupName: "frontend",
    });
    cdk.Tags.of(frontendSG).add('Name',  'sbcntr-sg-frontend');
    
    // 内部ロードバランサ用
    const internalSG = new ec2.SecurityGroup(this, 'internalSG', {
      vpc,
      allowAllOutbound: true,
      description: "Security group for internal load balancer",
      securityGroupName: "internal",
    });
    cdk.Tags.of(internalSG).add('Name',  'sbcntr-sg-internal');

    // DB用
    const dbSG = new ec2.SecurityGroup(this, 'dbSG', {
      vpc,
      allowAllOutbound: true,
      description: "Security group for database",
      securityGroupName: "database",
    });
    cdk.Tags.of(dbSG).add('Name',  'sbcntr-sg-database');

    // SG ルール紐づけ
    // Ingress => Front
    const frontFromIngress = new ec2.CfnSecurityGroupIngress(this, 'frontFromIngress', {
      ipProtocol: "tcp",
      description: "HTTP for Ingress",
      fromPort: 80,
      toPort: 80,
      groupId: frontendSG.securityGroupId,
      sourceSecurityGroupId: ingressSG.attrGroupId,
    });

    // Front => Internal
    const internalFromFront = new ec2.CfnSecurityGroupIngress(this, 'internalFromFront', {
      ipProtocol: "tcp",
      description: "HTTP for front container",
      fromPort: 80,
      toPort: 80,
      groupId: internalSG.securityGroupId,
      sourceSecurityGroupId: frontendSG.securityGroupId,
    });

    // Internal => Backend
    const BackendFromInternal = new ec2.CfnSecurityGroupIngress(this, 'BackendFromInternal', {
      ipProtocol: "tcp",
      description: "HTTP for front interal",
      fromPort: 80,
      toPort: 80,
      groupId: backendSG.securityGroupId,
      sourceSecurityGroupId: internalSG.securityGroupId,
    });

    // Backend => DB
    const dbFromBackend = new ec2.CfnSecurityGroupIngress(this, 'dbFromBackend', {
      ipProtocol: "tcp",
      description: "MySQL for front backend",
      fromPort: 3306,
      toPort: 3306,
      groupId: dbSG.securityGroupId,
      sourceSecurityGroupId: backendSG.securityGroupId,
    });

    // Frontend => DB
    const dbFromFrontend = new ec2.CfnSecurityGroupIngress(this, 'dbFromFrontend', {
      ipProtocol: "tcp",
      description: "MySQL for front frontend",
      fromPort: 3306,
      toPort: 3306,
      groupId: dbSG.securityGroupId,
      sourceSecurityGroupId: frontendSG.securityGroupId,
    });

     // Management => DB
     const dbFromManagement = new ec2.CfnSecurityGroupIngress(this, 'dbFromManagement', {
      ipProtocol: "tcp",
      description: "MySQL for front management",
      fromPort: 3306,
      toPort: 3306,
      groupId: dbSG.securityGroupId,
      sourceSecurityGroupId: managementSG.securityGroupId,
    });

    // Management => Internal
    const internalFromManagement = new ec2.CfnSecurityGroupIngress(this, 'internalFromManagement', {
      ipProtocol: "tcp",
      description: "HTTP for front management",
      fromPort: 80,
      toPort: 80,
      groupId: internalSG.securityGroupId,
      sourceSecurityGroupId: managementSG.securityGroupId,
    });

    // 外部からのリソース参照用
    // this.publicSubnetManagement1A = publicSubnetManagement1A;
  }
}
