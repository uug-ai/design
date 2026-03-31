function stripIndent(code: string) {
  const lines = code.trim().split('\n')
  const indentation = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length ?? 0)

  const margin = indentation.length > 0 ? Math.min(...indentation) : 0

  return lines.map((line) => line.slice(margin)).join('\n')
}

export function htmlSource(code: string, parameters: Record<string, unknown> = {}) {
  return {
    ...parameters,
    docs: {
      source: {
        code: stripIndent(code),
        language: 'html',
      },
    },
  }
}

export function htmlCssSource(html: string, css: string, parameters: Record<string, unknown> = {}) {
  return htmlSource(
    `${stripIndent(html)}\n\n<style>\n${stripIndent(css)}\n</style>`,
    parameters,
  )
}