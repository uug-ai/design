import badgeHtml from '../StatusBadge/example.html?raw'
import badgeCss from '../StatusBadge/component.css?raw'
import emptyHtml from '../EmptyState/example.html?raw'
import emptyCss from '../EmptyState/component.css?raw'
import metricHtml from '../MetricCard/example.html?raw'
import metricCss from '../MetricCard/component.css?raw'
import segmentedHtml from '../SegmentedControl/example.html?raw'
import segmentedCss from '../SegmentedControl/component.css?raw'
import searchHtml from '../SearchField/example.html?raw'
import searchCss from '../SearchField/component.css?raw'
import noticeHtml from '../Notice/example.html?raw'
import noticeCss from '../Notice/component.css?raw'
import layoutHtml from '../ApplicationLayout/example.html?raw'
import layoutCss from '../ApplicationLayout/component.css?raw'
import '../StatusBadge/component.css'
import '../EmptyState/component.css'
import '../MetricCard/component.css'
import '../SegmentedControl/component.css'
import '../SearchField/component.css'
import '../Notice/component.css'
import '../ApplicationLayout/component.css'

export const applicationLayoutExample = {
  id: 'application-layout', name: 'Application layout', html: layoutHtml, css: layoutCss,
  dependencies: ['status-badge', 'empty-state', 'metric-card', 'segmented-control', 'search-field', 'notice'],
} as const

export const htmlComponents = [
  applicationLayoutExample,
  { id: 'status-badge', name: 'Status badge', html: badgeHtml, css: badgeCss, dependencies: [] },
  { id: 'empty-state', name: 'Empty state', html: emptyHtml, css: emptyCss, dependencies: [] },
  { id: 'metric-card', name: 'Metric card', html: metricHtml, css: metricCss, dependencies: [] },
  { id: 'segmented-control', name: 'Segmented control', html: segmentedHtml, css: segmentedCss, dependencies: [] },
  { id: 'search-field', name: 'Search field', html: searchHtml, css: searchCss, dependencies: [] },
  { id: 'notice', name: 'Inline notice', html: noticeHtml, css: noticeCss, dependencies: [] },
] as const

export type HtmlComponentId = (typeof htmlComponents)[number]['id']
