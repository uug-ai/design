import { useState } from 'react'
import { Check, Copy } from 'iconoir-react'
import './CodeBlock.css'

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
        type="button"
        aria-label={copied ? 'Code copied' : 'Copy code'}
      >
        <span className="copy-button-icon" aria-hidden="true">
          {copied ? <Check width={16} height={16} /> : <Copy width={16} height={16} />}
        </span>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
