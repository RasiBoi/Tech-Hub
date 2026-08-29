import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { MS_PERERA_AVATAR } from './VoiceBubble';

const markdownComponents = {
  table: ({ children }) => (
    <div className="dispute-md-table-wrap my-3 overflow-x-auto rounded-xl">
      <table className="dispute-md-table w-full text-left text-[12px] sm:text-[13px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  th: ({ children }) => (
    <th className="px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="px-3 py-2.5 align-top">{children}</td>,
  tr: ({ children }) => <tr className="transition-colors">{children}</tr>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded text-[12px] font-mono">{children}</code>
    ) : (
      <code
        className="block p-3 rounded-xl text-[12px] font-mono overflow-x-auto my-2"
        style={{ background: 'var(--sup-panel-2)', border: '1px solid var(--sup-line)' }}
      >
        {children}
      </code>
    ),
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>,
  p: ({ children }) => <p className="m-0 mb-2 last:mb-0 leading-relaxed">{children}</p>,
};

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className="shrink-0 size-9 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: isUser ? 'var(--sup-accent)' : 'var(--sup-panel-2)',
          border: '1px solid var(--sup-line)',
          color: isUser ? 'var(--sup-on-accent)' : 'var(--sup-muted)',
        }}
      >
        {isUser ? (
          <User size={16} />
        ) : (
          <img
            src={MS_PERERA_AVATAR}
            alt="Ms. Perera"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 22%' }}
          />
        )}
      </div>

      <div className={`max-w-[88%] space-y-1.5 ${isUser ? 'items-end text-right' : ''}`}>
        {!isUser && <span className="sup-eyebrow px-1">Ms. Perera</span>}
        <div
          className={`px-4 py-3 text-sm leading-relaxed ${
            isUser ? 'rounded-2xl rounded-tr-md' : 'rounded-2xl rounded-tl-md'
          }`}
          style={
            isUser
              ? { background: 'var(--sup-accent)', color: 'var(--sup-on-accent)' }
              : {
                  background: 'var(--sup-panel-2)',
                  border: '1px solid var(--sup-line)',
                  color: 'var(--sup-ink)',
                  boxShadow: 'var(--sup-shadow-soft)',
                }
          }
        >
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap text-left">{message.content}</p>
          ) : (
            <div className="dispute-markdown text-left">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content || '…'}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {message.meta?.route && (
          <div className={`flex flex-wrap gap-1.5 px-1 ${isUser ? 'justify-end' : ''}`}>
            <span
              className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{
                background: 'var(--sup-accent-tint)',
                color: 'var(--sup-accent-ink)',
                border: '1px solid var(--sup-accent-line)',
              }}
            >
              {message.meta.route}
            </span>
            {typeof message.meta.latency_ms === 'number' && (
              <span className="text-[9px] font-medium sup-faint self-center">
                {Math.round(message.meta.latency_ms)} ms
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
