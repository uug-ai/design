import { storyNameFromExport, toId } from 'storybook/internal/csf'
import { blockSections } from './production/blocks'
import type { BlockType } from './production/blocks'

const categories = new Map<string, BlockType[]>()
for (const section of blockSections) {
  const name = section.group === 'General' ? 'Generic' : section.group ?? section.title
  categories.set(name, [...(categories.get(name) ?? []), ...section.blocks])
}

export const drawBlockCategories = Array.from(categories, ([name, blocks]) => ({
  name, blocks, id: toId('draw-category', name),
}))

export function drawBlockStoryId(category: string, blockKey: string) {
  // Storybook derives IDs from named exports, not their displayed labels.
  const exportName = blockKey.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('')
  return toId(`Draw/Building blocks/${category}`, storyNameFromExport(exportName))
}
