import React, { useMemo } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onNavigateInternal?: (path: string) => void;
}

export default function MarkdownRenderer({ content, className = '', onNavigateInternal }: MarkdownRendererProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyCode = (codeText: string, index: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parsedNodes = useMemo(() => {
    if (!content) return [];

    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let i = 0;
    let codeBlockCount = 0;

    const renderInline = (text: string): React.ReactNode => {
      // Parse markdown inline elements: links, bold, italic, code, badges
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let key = 0;

      while (remaining.length > 0) {
        // Image ![alt](url)
        const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          const [full, altText, imgUrl] = imgMatch;
          parts.push(
            <span key={`img-${key++}`} className="block my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
              <img
                src={imgUrl}
                alt={altText || 'Article image'}
                className="w-full h-auto max-h-[550px] object-contain mx-auto bg-slate-950"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {altText && (
                <span className="block px-4 py-2.5 bg-slate-900/90 border-t border-slate-800 text-center text-xs font-mono text-slate-400">
                  {altText}
                </span>
              )}
            </span>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Link [text](url)
        const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [full, linkText, linkUrl] = linkMatch;
          const isInternal = linkUrl.startsWith('/') || linkUrl.startsWith('#');
          parts.push(
            <a
              key={`link-${key++}`}
              href={linkUrl}
              onClick={(e) => {
                if (isInternal && onNavigateInternal && !linkUrl.startsWith('#')) {
                  e.preventDefault();
                  onNavigateInternal(linkUrl);
                }
              }}
              target={isInternal ? undefined : '_blank'}
              rel={isInternal ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 hover:decoration-cyan-300 transition-colors"
            >
              <span>{linkText}</span>
              {!isInternal && <ExternalLink className="w-3 h-3 inline-block opacity-75" />}
            </a>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Inline Code `code`
        const codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
          const [full, codeText] = codeMatch;
          parts.push(
            <code
              key={`code-${key++}`}
              className="px-1.5 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700 mx-0.5"
            >
              {codeText}
            </code>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Bold **text** or __text__
        const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
        if (boldMatch) {
          const [full, , boldText] = boldMatch;
          parts.push(
            <strong key={`bold-${key++}`} className="font-bold text-white">
              {renderInline(boldText)}
            </strong>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Italic *text* or _text_
        const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
        if (italicMatch) {
          const [full, , italicText] = italicMatch;
          parts.push(
            <em key={`italic-${key++}`} className="italic text-slate-200">
              {renderInline(italicText)}
            </em>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Strikethrough ~~text~~
        const strikeMatch = remaining.match(/^~~(.*?)~~/);
        if (strikeMatch) {
          const [full, strikeText] = strikeMatch;
          parts.push(
            <del key={`strike-${key++}`} className="line-through text-slate-500">
              {renderInline(strikeText)}
            </del>
          );
          remaining = remaining.slice(full.length);
          continue;
        }

        // Plain text up to next special character
        const nextSpecial = remaining.search(/(!\[|\[|`|\*\*|__|\*|_|~~)/);
        if (nextSpecial === -1) {
          parts.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          parts.push(remaining[0]);
          remaining = remaining.slice(1);
        } else {
          parts.push(remaining.slice(0, nextSpecial));
          remaining = remaining.slice(nextSpecial);
        }
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks (```language ... ```)
      if (line.trim().startsWith('```')) {
        const lang = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        const blockIndex = codeBlockCount++;
        const codeString = codeLines.join('\n');
        nodes.push(
          <div key={`code-block-${blockIndex}`} className="relative my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner group">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="font-semibold text-cyan-400 uppercase tracking-wider">{lang || 'text'}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeString, blockIndex)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
              >
                {copiedIndex === blockIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed">
              <code>{codeString}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Headings (#, ##, ###, ####)
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (level === 1) {
          nodes.push(
            <h1 key={`h1-${i}`} id={id} className="text-3xl sm:text-4xl font-display font-black text-white mt-10 mb-4 scroll-mt-24">
              {renderInline(text)}
            </h1>
          );
        } else if (level === 2) {
          nodes.push(
            <h2 key={`h2-${i}`} id={id} className="text-2xl sm:text-3xl font-display font-bold text-white mt-10 mb-4 pt-6 border-t border-slate-800/60 scroll-mt-24">
              {renderInline(text)}
            </h2>
          );
        } else if (level === 3) {
          nodes.push(
            <h3 key={`h3-${i}`} id={id} className="text-xl sm:text-2xl font-display font-semibold text-cyan-300 mt-6 mb-3 scroll-mt-24">
              {renderInline(text)}
            </h3>
          );
        } else {
          nodes.push(
            <h4 key={`h4-${i}`} id={id} className="text-lg font-display font-medium text-slate-200 mt-4 mb-2 scroll-mt-24">
              {renderInline(text)}
            </h4>
          );
        }
        i++;
        continue;
      }

      // Horizontal rules (--- or ***)
      if (line.trim().match(/^(\*{3,}|-{3,}|_{3,})$/)) {
        nodes.push(<hr key={`hr-${i}`} className="border-slate-800 my-8" />);
        i++;
        continue;
      }

      // Blockquotes (> text)
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        const quoteText = quoteLines.join('\n');
        nodes.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-cyan-500 bg-cyan-500/5 p-4 rounded-r-2xl my-6 text-slate-200 italic">
            <p className="leading-relaxed">{renderInline(quoteText)}</p>
          </blockquote>
        );
        continue;
      }

      // Markdown Tables (| Header 1 | Header 2 |)
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCells = tableLines[0].split('|').slice(1, -1).map(c => c.trim());
          // check if row 1 is separator |---|---|
          const isSeparator = tableLines[1].replace(/[\s|:-]/g, '').length === 0;
          const bodyRows = (isSeparator ? tableLines.slice(2) : tableLines.slice(1)).map(row => 
            row.split('|').slice(1, -1).map(c => c.trim())
          );

          nodes.push(
            <div key={`table-${i}`} className="overflow-x-auto my-6 border border-slate-800 rounded-xl bg-slate-900/40">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-800/80 text-cyan-300 font-mono">
                  <tr>
                    {headerCells.map((h, hIdx) => (
                      <th key={hIdx} className="p-3.5 border-b border-slate-700 font-bold tracking-wide">
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-300">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3.5 text-slate-300">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Lists (- item, * item, 1. item)
      if (line.trim().match(/^[-*]\s+/) || line.trim().match(/^\d+\.\s+/)) {
        const isOrdered = Boolean(line.trim().match(/^\d+\.\s+/));
        const listItems: string[] = [];

        while (i < lines.length) {
          const currentLine = lines[i].trim();
          if (isOrdered && currentLine.match(/^\d+\.\s+(.*)/)) {
            listItems.push(currentLine.replace(/^\d+\.\s+/, ''));
            i++;
          } else if (!isOrdered && currentLine.match(/^[-*]\s+(.*)/)) {
            listItems.push(currentLine.replace(/^[-*]\s+/, ''));
            i++;
          } else {
            break;
          }
        }

        if (isOrdered) {
          nodes.push(
            <ol key={`ol-${i}`} className="space-y-2.5 my-4 pl-6 list-decimal marker:text-cyan-400 marker:font-bold text-slate-300 text-[15px] sm:text-base leading-relaxed">
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1.5">{renderInline(item)}</li>
              ))}
            </ol>
          );
        } else {
          nodes.push(
            <ul key={`ul-${i}`} className="space-y-2.5 my-4 pl-6 list-disc marker:text-cyan-400 text-slate-300 text-[15px] sm:text-base leading-relaxed">
              {listItems.map((item, idx) => (
                <li key={idx} className="pl-1.5">{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        continue;
      }

      // Empty lines
      if (line.trim().length === 0) {
        i++;
        continue;
      }

      // Regular Paragraph
      const pLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().length > 0 &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('```') &&
        !lines[i].trim().startsWith('>') &&
        !lines[i].trim().startsWith('|') &&
        !lines[i].trim().match(/^[-*]\s+/) &&
        !lines[i].trim().match(/^\d+\.\s+/) &&
        !lines[i].trim().match(/^(\*{3,}|-{3,}|_{3,})$/)
      ) {
        pLines.push(lines[i]);
        i++;
      }

      nodes.push(
        <p key={`p-${i}`} className="text-slate-300 leading-relaxed my-4 text-[15px] sm:text-base">
          {renderInline(pLines.join(' '))}
        </p>
      );
    }

    return nodes;
  }, [content, onNavigateInternal, copiedIndex]);

  return <div className={`blog-markdown-content ${className}`}>{parsedNodes}</div>;
}
