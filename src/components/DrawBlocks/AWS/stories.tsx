import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/AWS',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const AwsEc2: Story = { name: 'EC2', args: { blockKey: 'aws-ec2' } }
export const AwsLambda: Story = { name: 'Lambda', args: { blockKey: 'aws-lambda' } }
export const AwsBatch: Story = { name: 'Batch', args: { blockKey: 'aws-batch' } }
export const AwsEcs: Story = { name: 'ECS', args: { blockKey: 'aws-ecs' } }
export const AwsEks: Story = { name: 'EKS', args: { blockKey: 'aws-eks' } }
export const AwsS3: Story = { name: 'S3', args: { blockKey: 'aws-s3' } }
export const AwsSqs: Story = { name: 'SQS', args: { blockKey: 'aws-sqs' } }
export const AwsSns: Story = { name: 'SNS', args: { blockKey: 'aws-sns' } }
export const AwsKinesis: Story = { name: 'Kinesis', args: { blockKey: 'aws-kinesis' } }
export const AwsKinesisVideo: Story = { name: 'Kinesis Video', args: { blockKey: 'aws-kinesis-video' } }
export const AwsIotCore: Story = { name: 'IoT Core', args: { blockKey: 'aws-iot-core' } }
export const AwsDynamodb: Story = { name: 'DynamoDB', args: { blockKey: 'aws-dynamodb' } }
export const AwsRds: Story = { name: 'RDS', args: { blockKey: 'aws-rds' } }
export const AwsElasticache: Story = { name: 'ElastiCache', args: { blockKey: 'aws-elasticache' } }
export const AwsSagemaker: Story = { name: 'SageMaker AI', args: { blockKey: 'aws-sagemaker' } }
export const AwsRekognition: Story = { name: 'Rekognition', args: { blockKey: 'aws-rekognition' } }
export const AwsApiGateway: Story = { name: 'API Gateway', args: { blockKey: 'aws-api-gateway' } }
export const AwsCloudfront: Story = { name: 'CloudFront', args: { blockKey: 'aws-cloudfront' } }
export const AwsStepFunctions: Story = { name: 'Step Functions', args: { blockKey: 'aws-step-functions' } }
export const AwsCloudwatch: Story = { name: 'CloudWatch', args: { blockKey: 'aws-cloudwatch' } }
