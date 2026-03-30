export const storybookUrl = import.meta.env.DEV
  ? 'http://localhost:6006/'
  : `${import.meta.env.BASE_URL}storybook/`

export function storybookEntryUrl(path: string) {
  return `${storybookUrl}?path=${encodeURIComponent(path)}`
}