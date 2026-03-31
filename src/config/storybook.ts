const productionBaseUrl = import.meta.env.BASE_URL.endsWith('/storybook/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}storybook/`

export const storybookUrl = import.meta.env.DEV ? 'http://localhost:6006/' : productionBaseUrl

export function storybookEntryUrl(path: string) {
  return `${storybookUrl}?path=${encodeURIComponent(path)}`
}