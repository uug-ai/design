import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/Google Cloud',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const GcpComputeEngine: Story = { name: 'Compute Engine', args: { blockKey: 'gcp-compute-engine' } }
export const GcpCloudRunFunctions: Story = { name: 'Cloud Run functions', args: { blockKey: 'gcp-cloud-run-functions' } }
export const GcpBatch: Story = { name: 'Batch', args: { blockKey: 'gcp-batch' } }
export const GcpCloudRun: Story = { name: 'Cloud Run', args: { blockKey: 'gcp-cloud-run' } }
export const GcpGke: Story = { name: 'GKE', args: { blockKey: 'gcp-gke' } }
export const GcpCloudStorage: Story = { name: 'Cloud Storage', args: { blockKey: 'gcp-cloud-storage' } }
export const GcpPubsub: Story = { name: 'Pub/Sub', args: { blockKey: 'gcp-pubsub' } }
export const GcpDataflow: Story = { name: 'Dataflow', args: { blockKey: 'gcp-dataflow' } }
export const GcpFirestore: Story = { name: 'Firestore', args: { blockKey: 'gcp-firestore' } }
export const GcpCloudSql: Story = { name: 'Cloud SQL', args: { blockKey: 'gcp-cloud-sql' } }
export const GcpBigquery: Story = { name: 'BigQuery', args: { blockKey: 'gcp-bigquery' } }
export const GcpMemorystore: Story = { name: 'Memorystore', args: { blockKey: 'gcp-memorystore' } }
export const GcpVertexAi: Story = { name: 'Vertex AI', args: { blockKey: 'gcp-vertex-ai' } }
export const GcpVideoIntelligence: Story = { name: 'Video Intelligence', args: { blockKey: 'gcp-video-intelligence' } }
export const GcpApiGateway: Story = { name: 'API Gateway', args: { blockKey: 'gcp-api-gateway' } }
export const GcpCloudCdn: Story = { name: 'Cloud CDN', args: { blockKey: 'gcp-cloud-cdn' } }
export const GcpCloudMonitoring: Story = { name: 'Cloud Monitoring', args: { blockKey: 'gcp-cloud-monitoring' } }
