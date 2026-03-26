import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
}

function CodeBlock({ code, language = 'text' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="code-block">
      <button
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
