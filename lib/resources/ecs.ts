import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';

export interface EcsProps {
}

export class Ecs extends Construct {
  constructor(scope: Construct, id: string, props: EcsProps) {
    super(scope, id);

    // ECR バックエンド
    const repoBackend = new ecr.Repository(this, 'repoBackend', {
      repositoryName: "sbcntr-backend",
      encryption: ecr.RepositoryEncryption.KMS
    });

    // ECR フロントエンド
    const repoFrontend = new ecr.Repository(this, 'repoFrontend', {
      repositoryName: "sbcntr-frontend",
      encryption: ecr.RepositoryEncryption.KMS
    });
  }
}
