import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/Generic',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Generic node', args: { blockKey: 'default' } }
export const Client: Story = { name: 'Client', args: { blockKey: 'client' } }
export const User: Story = { name: 'User', args: { blockKey: 'user' } }
export const Service: Story = { name: 'Service', args: { blockKey: 'service' } }
export const Api: Story = { name: 'API', args: { blockKey: 'api' } }
export const ApiGateway: Story = { name: 'API Gateway', args: { blockKey: 'api-gateway' } }
export const ApiManagement: Story = { name: 'API Management', args: { blockKey: 'api-management' } }
export const LoadBalancer: Story = { name: 'Load Balancer', args: { blockKey: 'load-balancer' } }
export const ReverseProxy: Story = { name: 'Reverse Proxy', args: { blockKey: 'reverse-proxy' } }
export const Cdn: Story = { name: 'CDN', args: { blockKey: 'cdn' } }
export const Dns: Story = { name: 'DNS', args: { blockKey: 'dns' } }
export const Firewall: Story = { name: 'Firewall', args: { blockKey: 'firewall' } }
export const Vpn: Story = { name: 'VPN', args: { blockKey: 'vpn' } }
export const MessageBroker: Story = { name: 'Message Broker', args: { blockKey: 'message-broker' } }
export const MessageQueue: Story = { name: 'Message Queue', args: { blockKey: 'message-queue' } }
export const EventStream: Story = { name: 'Event Stream', args: { blockKey: 'event-stream' } }
export const Amqp: Story = { name: 'AMQP', args: { blockKey: 'amqp' } }
export const Mqtt: Story = { name: 'MQTT', args: { blockKey: 'mqtt' } }
export const Server: Story = { name: 'Server', args: { blockKey: 'server' } }
export const Container: Story = { name: 'Container', args: { blockKey: 'container' } }
export const Function: Story = { name: 'Function', args: { blockKey: 'function' } }
export const Worker: Story = { name: 'Worker', args: { blockKey: 'worker' } }
export const Scheduler: Story = { name: 'Scheduler', args: { blockKey: 'scheduler' } }
export const AiModel: Story = { name: 'AI Model', args: { blockKey: 'ai-model' } }
export const Database: Story = { name: 'Database', args: { blockKey: 'database' } }
export const Cache: Story = { name: 'Cache', args: { blockKey: 'cache' } }
export const Storage: Story = { name: 'Object Storage', args: { blockKey: 'storage' } }
export const FileStorage: Story = { name: 'File Storage', args: { blockKey: 'file-storage' } }
export const SearchIndex: Story = { name: 'Search Index', args: { blockKey: 'search-index' } }
export const DataWarehouse: Story = { name: 'Data Warehouse', args: { blockKey: 'data-warehouse' } }
export const IdentityProvider: Story = { name: 'Identity Provider', args: { blockKey: 'identity-provider' } }
export const Secrets: Story = { name: 'Secrets Vault', args: { blockKey: 'secrets' } }
export const Monitoring: Story = { name: 'Monitoring', args: { blockKey: 'monitoring' } }
export const Logging: Story = { name: 'Logging', args: { blockKey: 'logging' } }
export const CiCd: Story = { name: 'CI/CD', args: { blockKey: 'ci-cd' } }
export const Camera: Story = { name: 'Camera', args: { blockKey: 'camera' } }
export const Turn: Story = { name: 'TURN', args: { blockKey: 'turn' } }
export const Webrtc: Story = { name: 'WebRTC', args: { blockKey: 'webrtc' } }
export const Moq: Story = { name: 'MoQ relay', args: { blockKey: 'moq' } }
export const Hls: Story = { name: 'HLS', args: { blockKey: 'hls' } }
