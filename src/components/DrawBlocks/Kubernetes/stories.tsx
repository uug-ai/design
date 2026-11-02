import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawBlockPreview } from '../component'

const meta = {
  title: 'Draw/Building blocks/Kubernetes',
  component: DrawBlockPreview,
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof DrawBlockPreview>

export default meta
type Story = StoryObj<typeof meta>

export const K8sControlPlane: Story = { name: 'Control plane', args: { blockKey: 'k8s-control-plane' } }
export const K8sNode: Story = { name: 'Node', args: { blockKey: 'k8s-node' } }
export const K8sEtcd: Story = { name: 'etcd', args: { blockKey: 'k8s-etcd' } }
export const K8sNamespace: Story = { name: 'Namespace', args: { blockKey: 'k8s-namespace' } }
export const K8sPod: Story = { name: 'Pod', args: { blockKey: 'k8s-pod' } }
export const K8sDeployment: Story = { name: 'Deployment', args: { blockKey: 'k8s-deployment' } }
export const K8sStatefulset: Story = { name: 'StatefulSet', args: { blockKey: 'k8s-statefulset' } }
export const K8sDaemonset: Story = { name: 'DaemonSet', args: { blockKey: 'k8s-daemonset' } }
export const K8sJob: Story = { name: 'Job', args: { blockKey: 'k8s-job' } }
export const K8sCronjob: Story = { name: 'CronJob', args: { blockKey: 'k8s-cronjob' } }
export const K8sHpa: Story = { name: 'HPA', args: { blockKey: 'k8s-hpa' } }
export const K8sService: Story = { name: 'Service', args: { blockKey: 'k8s-service' } }
export const K8sIngress: Story = { name: 'Ingress', args: { blockKey: 'k8s-ingress' } }
export const K8sNetworkPolicy: Story = { name: 'NetworkPolicy', args: { blockKey: 'k8s-network-policy' } }
export const K8sConfigmap: Story = { name: 'ConfigMap', args: { blockKey: 'k8s-configmap' } }
export const K8sSecret: Story = { name: 'Secret', args: { blockKey: 'k8s-secret' } }
export const K8sPvc: Story = { name: 'PVC', args: { blockKey: 'k8s-pvc' } }
export const K8sPv: Story = { name: 'PV', args: { blockKey: 'k8s-pv' } }
export const K8sStorageClass: Story = { name: 'StorageClass', args: { blockKey: 'k8s-storage-class' } }
export const K8sServiceAccount: Story = { name: 'ServiceAccount', args: { blockKey: 'k8s-service-account' } }
export const K8sCrd: Story = { name: 'CRD', args: { blockKey: 'k8s-crd' } }
