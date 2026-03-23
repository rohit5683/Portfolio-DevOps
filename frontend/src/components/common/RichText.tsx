import React from "react";
import DOMPurify from "dompurify";

interface RichTextProps {
  text: string;
  className?: string;
  accentColor?: string;
}

/**
 * A sophisticated renderer that supports both HTML (sanitized) and Markdown.
 * If the content appears to be HTML (starts with <), it uses dangerouslySetInnerHTML with DOMPurify.
 * Otherwise, it falls back to the lightweight Markdown parser.
 */
const RichText: React.FC<RichTextProps> = ({ 
  text, 
  className = "", 
  accentColor = "bg-blue-400/70" 
}) => {
  if (!text) return null;

  // Simple heuristic: if it contains HTML-like tags, treat as HTML
  const isHtml = text.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(text);

  if (isHtml) {
    return (
      <div 
        className={`rich-text-content ${className}`}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
      />
    );
  }

  // Fallback to Markdown Parser
  const lines = text.split("\n").filter((l) => l.trim() !== "");

  type Segment =
    | { kind: "bullets"; items: string[] }
    | { kind: "para"; text: string };

  const segments: Segment[] = [];
  let currentBullets: string[] | null = null;

  const flushBullets = () => {
    if (currentBullets) {
      segments.push({ kind: "bullets", items: currentBullets });
      currentBullets = null;
    }
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^(?:[-•*]|\d+\.)\s+(.+)$/);
    if (bulletMatch) {
      if (!currentBullets) currentBullets = [];
      currentBullets.push(bulletMatch[1]);
    } else {
      flushBullets();
      segments.push({ kind: "para", text: line });
    }
  }
  flushBullets();

  const renderLine = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|~~.*?~~|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} className="italic text-gray-200">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith("~~") && part.endsWith("~~")) {
        return <span key={i} className="line-through text-gray-500">{part.slice(2, -2)}</span>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-black/40 text-blue-300 font-mono text-xs border border-white/5">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className={`mt-1 text-gray-300 leading-relaxed space-y-2 ${className}`}>
      {segments.map((seg, i) => {
        if (seg.kind === "bullets") {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {seg.items.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-gray-300 group/item"
                >
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${accentColor} flex-shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover/item:scale-125 transition-transform`} />
                  <span className="flex-1">{renderLine(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-gray-300 last:mb-0">
            {renderLine(seg.text)}
          </p>
        );
      })}
    </div>
  );
};

export default RichText;
