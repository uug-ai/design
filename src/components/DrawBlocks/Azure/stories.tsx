import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/Azure',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const AzureVirtualMachines: Story = { name: 'Virtual Machines', args: { blockKey: 'azure-virtual-machines' } }
export const AzureFunctions: Story = { name: 'Functions', args: { blockKey: 'azure-functions' } }
export const AzureBatch: Story = { name: 'Batch', args: { blockKey: 'azure-batch' } }
export const AzureContainerApps: Story = { name: 'Container Apps', args: { blockKey: 'azure-container-apps' } }
export const AzureAks: Story = { name: 'AKS', args: { blockKey: 'azure-aks' } }
export const AzureBlobStorage: Story = { name: 'Blob Storage', args: { blockKey: 'azure-blob-storage' } }
export const AzureServiceBus: Story = { name: 'Service Bus', args: { blockKey: 'azure-service-bus' } }
export const AzureEventGrid: Story = { name: 'Event Grid', args: { blockKey: 'azure-event-grid' } }
export const AzureEventHubs: Story = { name: 'Event Hubs', args: { blockKey: 'azure-event-hubs' } }
export const AzureIotHub: Story = { name: 'IoT Hub', args: { blockKey: 'azure-iot-hub' } }
export const AzureCosmosDb: Story = { name: 'Cosmos DB', args: { blockKey: 'azure-cosmos-db' } }
export const AzureSqlDatabase: Story = { name: 'SQL Database', args: { blockKey: 'azure-sql-database' } }
export const AzureManagedRedis: Story = { name: 'Managed Redis', args: { blockKey: 'azure-managed-redis' } }
export const AzureMachineLearning: Story = { name: 'Machine Learning', args: { blockKey: 'azure-machine-learning' } }
export const AzureAiVision: Story = { name: 'AI Vision', args: { blockKey: 'azure-ai-vision' } }
export const AzureVideoIndexer: Story = { name: 'Video Indexer', args: { blockKey: 'azure-video-indexer' } }
export const AzureApiManagement: Story = { name: 'API Management', args: { blockKey: 'azure-api-management' } }
export const AzureFrontDoor: Story = { name: 'Front Door', args: { blockKey: 'azure-front-door' } }
export const AzureMonitor: Story = { name: 'Monitor', args: { blockKey: 'azure-monitor' } }
