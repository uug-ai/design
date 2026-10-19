import type { ReactNode } from 'react'
import CodeBlock from '../components/CodeBlock'
import HtmlExample from '../components/html/HtmlExample'
import { htmlComponents, type HtmlComponentId } from '../components/html/examples'
import nativeBehavior from '../components/html/behaviors.js?raw'
import { storybookEntryUrl } from '../config/storybook'
import './ComponentReferences.css'

const hubSource = 'https://github.com/uug-ai/hub-frontend/blob/main/kerberos.ng/src/app/'
const uiBase = `${import.meta.env.BASE_URL}ui/`

export const HTML_COMPONENT_LINKS = htmlComponents.map(({ id, name }) => ({
  id,
  label: name,
  storybookPath: `/docs/components-${id}--docs`,
}))

interface ComponentNotes {
  source: string
  widget: string
  consumers: string
  usage: string
  visual: string
  accessibility: string
  contract: [string, string][]
  angular?: string
}

const notes: Record<HtmlComponentId, ComponentNotes> = {
  'application-layout': {
    source: 'home/home.component.scss',
    widget: 'Home shell, Block and shared widgets',
    consumers: 'A representative device-management composition using the extracted widget CSS.',
    usage: 'Review components in their actual Hub visual context, not on a marketing card. This fixture is illustrative: navigation and Add device are not wired, search does not filter the rows, and the segment helper only changes selection. Routing, permissions, real data and the mobile overlay menu remain application-owned.',
    visual: 'Hub Inter, #84569f accent, neutral grey surfaces, 4px corners, original shadows, 12px spacing, 250/280px sidebar and 6px top gradient. Container queries adapt the embedded shell at Hub breakpoints; this is not a pixel-for-pixel copy of one live screen.',
    accessibility: 'Use real navigation links, heading levels and landmarks when adopting the shell. The fixture keeps navigation labels non-interactive rather than pretending to route. Hub’s selected sidebar accent has an existing dark-theme contrast gap; it is documented along with feedback contrast limitations, not silently recolored.',
    contract: [
      ['.hub-layout / __shell / __sidebar / __main', 'Responsive visual shell; it does not implement navigation or authorization.'],
      ['.hub-layout__block / __toolbar', 'Current Hub card surfaces and compact control composition.'],
      ['Shared widget classes', 'Load the six dependency stylesheets listed below; the layout does not duplicate their CSS.'],
    ],
  },
  'status-badge': {
    source: 'shared/widgets/badge/badge.component.ts',
    widget: 'Badge',
    consumers: 'Recording details, saved descriptions and device health.',
    usage: 'A read-only status, not a button. Keep quantities separate; use a metric card for counts. Hub alert maps to danger and updating maps to warning.',
    visual: 'Original 24px pill, uppercase 13px Inter, neutral text, 8px dot and 20% semantic tint. Keeping the text visible below Hub’s 769px collapse breakpoint is a deliberate accessibility difference. Unboxed Status/camera-bullet, badge ratios and gold are not represented by this recipe.',
    accessibility: 'Keep the label visible at every screen size. The dot is decorative; neither color nor a tooltip is a substitute for text. The surrounding application owns announcements when status changes.',
    contract: [
      ['.status-badge', 'Inline container with a visible, localized status label.'],
      ['.status-badge--neutral | --info | --success | --warning | --danger', 'Choose one semantic tone; presentation does not determine device health.'],
      ['.status-badge__dot[aria-hidden="true"]', 'Decorative indicator, not an independently announced status.'],
    ],
    angular: '<Badge type="success" [title]="statusLabel" width="fit-content"></Badge>',
  },
  'empty-state': {
    source: 'shared/widgets/placeholder/placeholder.component.ts',
    widget: 'Placeholder',
    consumers: 'Devices, analytics and recording charts.',
    usage: 'Distinguish first use, no matching results and recoverable failure. Never show “no data” while loading or after a failed request. Wire the native action button to the application; CSS cannot clear filters or retry a request.',
    visual: 'Original dashed 2px border, 4px radius, 12px vertical margin, 18px/24px heading and 15px/24px copy. The compact purple action follows Hub ButtonField, including its darker bottom edge. Illustrations are optional extensions, not part of the default Placeholder.',
    accessibility: 'Use h2 or h3 for the host document outline. An illustration is optional and decorative. Keep actions native buttons, use disabled while submitting, and let the caller announce asynchronous result changes.',
    contract: [
      ['.empty-state / .empty-state--error', 'Default empty state or explicit recoverable error.'],
      ['.empty-state__title / __description', 'Semantic heading plus optional next-step guidance.'],
      ['button.empty-state__action[type="button"]', 'Optional action with localized text; native disabled prevents activation.'],
    ],
    angular: `<Placeholder [title]="emptyTitle" [description]="emptyDescription"
  icon="filter" [button]="clearFiltersLabel" [action]="clearFilters">
</Placeholder>`,
  },
  'metric-card': {
    source: 'shared/widgets/kpi/kpi.component.ts',
    widget: 'KPI',
    consumers: 'Device analytics, recording totals and counting summaries.',
    usage: 'Format numbers, durations and comparisons in the caller. Zero is real data. A numeric increase is not automatically good: increased downtime is negative. Keep quotas, directional counting and dwell-time rules in domain wrappers.',
    visual: 'Current KPI composition: centered value in a 150px tile, 4px corners, original shadow and caption below the tile. Value text follows Hub’s 26/33/38/42px breakpoints. Existing unit/comparison contrast limitations remain visible; semantic dl/dt/dd, reliable zero/loading and reduced-motion support are deliberate improvements.',
    accessibility: 'Use dl/dt/dd for label/value relationships. Set aria-busy while loading and replace stale values and trends with localized loading text. Keep the region mounted during updates.',
    contract: [
      ['dl.metric-card / dt.metric-card__label / dd.metric-card__value', 'Semantic label/value order; CSS places the caption below the value as in Hub.'],
      ['.metric-card__trend / --success / --danger', 'Optional comparison with its meaning expressed in text. No modifier means neutral.'],
      ['aria-busy="true" / .metric-card__loading', 'Explicit loading state; do not render stale values or comparisons.'],
    ],
    angular: '<KPI [number]="recordingCount" [footer]="recordingsLabel"></KPI>',
  },
  'segmented-control': {
    source: 'shared/widgets/multitoggle/multitoggle.component.ts',
    widget: 'MultiToggle',
    consumers: 'Device list/grid switching and public-wall preview/live quality.',
    usage: 'A small set of related view modes. HTML/CSS defines the group and selected appearance; the application or optional native helper maintains aria-pressed. Use stable values and independently translated labels.',
    visual: 'Original joined border, 4px outer corners, no inset gap, 6px/12px button padding and Hub-purple active tint, on the card/toolbar surface used by Hub. Dark mode uses the existing stronger 45% tint and light active text. Native buttons preserve keyboard semantics.',
    accessibility: 'A named button group, not a tablist or radiogroup. Tab visits enabled options; Enter and Space activate. Disabled options must not change selection. Icon-only buttons need an accessible label.',
    contract: [
      ['.segmented-control[role="group"][aria-label]', 'Name the group for assistive technology.'],
      ['button.segmented-control__option[aria-pressed]', 'True for the selected option, false for others; type="button" avoids form submission.'],
      ['disabled / data-value', 'Native disabled state and a stable option value for the optional helper.'],
      ['data-ui-component="segmented-control"', 'Opt into native behavior; emits bubbling ui:change with detail.value.'],
    ],
    angular: `<MultiToggle [label]="layoutLabel" [hideText]="true"
  [options]="['list', 'grid']" [option]="selectedIndex"
  [onChange]="onUpdateView">
</MultiToggle>`,
  },
  'search-field': {
    source: 'shared/widgets/search/search.component.ts',
    widget: 'SearchField',
    consumers: 'Devices, case lists and the public wall.',
    usage: 'The input collects a query. Keep fetching, debounce, cancellation and filtering in the application. Bind the native input event, not only keyup, so paste and other input methods work.',
    visual: 'Original borderless transparent control on a Hub card/toolbar surface, 12px/24px padding, original 18px icon and 14px/36px input. The label is visually hidden to preserve Hub density; focus indication is an explicit accessibility improvement. Hub has no clear action: clearable.html and React showClear are optional extensions, off by default.',
    accessibility: 'A visually hidden label references a unique input id; placeholder remains only a hint. Optional clearing needs a localized name and returns focus to the input. Disable both input and optional clear together.',
    contract: [
      ['.query-field__label[for] / input[type="search"][id]', 'A unique label/input pair for every instance.'],
      ['button.query-field__clear[data-ui-clear]', 'Optional extension, not the default Hub recipe. See clearable.html or React showClear.'],
      ['data-ui-component="search-field"', 'Opt in only for the clearable extension. Native helper emits bubbling input on clear.'],
    ],
    angular: `<SearchField [value]="query" [placeholder]="searchHint"
  [change]="onSearch" [disabled]="isLoading">
</SearchField>`,
  },
  notice: {
    source: 'shared/widgets/infobox/infobox.component.ts',
    widget: 'InfoBox',
    consumers: 'Subscriptions, device errors and export validation.',
    usage: 'Contextual guidance or recovery instructions. Hub error maps to danger. Keep links explicit; never make the entire notice clickable around its dismiss button.',
    visual: 'Original 4px corners and shadow, 12px/24px wrapper padding, original 18px glyph and inline 15px/24px message. Info/success/error use 5% tints without borders; warning alone uses an 18% tint and border. Existing feedback text contrast limitations in both themes are reported in Storybook as todo, not hidden with a redesigned palette.',
    accessibility: 'Static by default. Opt into role="status" for polite updates or role="alert" only for urgent failures after an action. Mount the live region before changing its content and verify speech in the consuming app. Dismissal needs a localized name and a deliberate next focus target.',
    contract: [
      ['.notice / --info | --success | --warning | --danger', 'Choose one tone; tone alone does not set announcement urgency.'],
      ['.notice__title / __content / __icon', 'Visible title, optional supporting content and decorative icon.'],
      ['button.notice__dismiss[data-ui-dismiss]', 'Optional localized dismiss action. The native example hides the notice and emits ui:dismiss.'],
      ['[data-ui-notice-example] / [data-ui-restore]', 'Demo-only restoration/focus helpers; applications can handle ui:dismiss and manage their own lifecycle.'],
    ],
    angular: '<InfoBox type="error" role="alert" [text]="submissionError"></InfoBox>',
  },
}

function SourceLink({ path, children }: { path: string; children: ReactNode }) {
  return <a href={`${hubSource}${path}`} target="_blank" rel="noreferrer">{children}</a>
}

export default function ComponentReferences({
  registerSection,
}: {
  registerSection: (id: string, element: HTMLElement | null) => void
}) {
  return (
    <>
      <div className="component-reference">
        <p>
          The following components include native HTML recipes and standalone CSS, shared by the live examples
          and downloadable demos. Load <a href={`${uiBase}hub-tokens.css`} download>the Hub theme foundation</a> and the component stylesheet.
          Angular, React, server-rendered pages and plain HTML can all use the same markup and classes.
          Optional React adapters power the other Storybook controls; they are not a runtime requirement.
        </p>
      </div>
      {htmlComponents.map((component) => {
        const note = notes[component.id]
        return (
          <section key={component.id} id={component.id} className="component-section component-reference"
            ref={(element) => registerSection(component.id, element)} aria-labelledby={`${component.id}-title`}>
            <div className="component-reference__heading">
              <h2 id={`${component.id}-title`}>{component.name}</h2>
              <a href={storybookEntryUrl(`/docs/components-${component.id}--docs`)} target="_blank" rel="noreferrer">View in Storybook</a>
            </div>
            <p>{note.usage}</p>
            <p className="component-reference__source">
              Origin: <SourceLink path={note.source}>{note.widget}</SourceLink>. {note.consumers}
            </p>
            <p><strong>Hub appearance:</strong> {note.visual}</p>
            <div className={`component-reference__preview${component.id === 'application-layout' ? ' component-reference__preview--layout' : ''}`}
              role="group" aria-label={`${component.name} HTML example`}>
              <HtmlExample html={component.html} />
            </div>
            <div className="component-reference__downloads">
              <a href={`${uiBase}${component.id}/`} target="_blank" rel="noreferrer">Open standalone HTML</a>
              <a href={`${uiBase}${component.id}/example.html`} download>Download HTML</a>
              <a href={`${uiBase}${component.id}/component.css`} download>Download CSS</a>
            </div>
            <h3>HTML</h3>
            <CodeBlock language="html" code={[
              `<link rel="stylesheet" href="${uiBase}hub-tokens.css">`,
              ...component.dependencies.map((id) => `<link rel="stylesheet" href="${uiBase}${id}/component.css">`),
              `<link rel="stylesheet" href="${uiBase}${component.id}/component.css">`,
            ].join('\n')} />
            <CodeBlock code={component.html} language="html" />
            {component.id === 'search-field' && <p>
              Optional extension: <a href={`${uiBase}search-field/clearable.html`} download>download clearable HTML</a>.
              This requires the native helper or equivalent application bindings; the default Hub recipe does not.
            </p>}
            <details>
              <summary>Component CSS</summary>
              <CodeBlock code={component.css} language="css" />
            </details>
            <h3>Markup and state contract</h3>
            <div className="component-reference__table-scroll">
              <table>
                <caption>{component.name} HTML/CSS contract</caption>
                <thead><tr><th scope="col">Markup / state</th><th scope="col">Behavior</th></tr></thead>
                <tbody>{note.contract.map(([selector, contract]) => (
                  <tr key={selector}><th scope="row"><code>{selector}</code></th><td>{contract}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <h3>Accessibility</h3>
            <p>{note.accessibility}</p>
            {note.angular && <details>
              <summary>Existing Angular integration</summary>
              <p>Hub currently uses this wrapper. Adopting the shared CSS requires mapping its tokens to the host theme; these examples do not silently restyle the Angular application.</p>
              <CodeBlock code={note.angular} language="html" />
            </details>}
          </section>
        )
      })}
      <section id="native-components" className="component-section component-reference">
        <h2>Using components without a framework</h2>
        <p>
          Serve the exported <code>ui/</code> directory, include <code>hub-tokens.css</code> and the component CSS,
          then copy the HTML recipe. Set <code>data-theme="dark"</code> on a containing element for dark mode.
          Keep <code>fonts/</code> beside <code>hub-tokens.css</code>, including
          {' '}<a href={`${uiBase}fonts/Inter-roman.var.woff2`} download>Hub’s self-hosted Inter variable font</a>
          {' '}and its <a href={`${uiBase}fonts/Inter-LICENSE.txt`} download>SIL Open Font License</a>.
          The documentation site keeps its separate marketing tokens; these previews do not inherit that visual language.
        </p>
        <CodeBlock language="html" code={`<link rel="stylesheet" href="/ui/hub-tokens.css">
<link rel="stylesheet" href="/ui/search-field/component.css">
<!-- Insert the search-field HTML recipe here. -->`} />
        <p>
          CSS cannot update selection, clear a query or dismiss a notice. Either bind those actions in your application
          or use the optional <a href={`${uiBase}behaviors.js`} download>dependency-free JavaScript helper</a>, not both.
          The default borderless search needs no helper; clearing is an optional extension.
          The helper emits native input, ui:change and ui:dismiss events; it does not fetch data or make business decisions.
        </p>
        <CodeBlock language="javascript" code={`import { enhanceComponents } from '/ui/behaviors.js'

const cleanup = enhanceComponents(document.querySelector('#my-components'))
// Call cleanup() before removing or replacing the host.
// Framework templates can bind their own state/events instead.`} />
        <details>
          <summary>Full vanilla JavaScript source</summary>
          <CodeBlock code={nativeBehavior} language="javascript" />
        </details>
        <h3>Extraction notes</h3>
        <p>
          These six components were traced through Hub devices, analytics, recording details, exports and the public wall.
          Buttons, inputs, cards and loaders already have catalogue entries. The next candidates are
          page headers, dialogs, tables and pickers; their navigation, focus, selection and pagination contracts need dedicated work.
          Streams, media containers, timelines and annotation remain domain-owned until transport and lifecycle behavior can be separated safely.
        </p>
      </section>
    </>
  )
}
