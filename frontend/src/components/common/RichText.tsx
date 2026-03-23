import React from "react";

interface RichTextProps {
  text: string;
  className?: string;
  accentColor?: string;
}

/**
 * A lightweight renderer that parses plain text for:
 * 1. Newlines (renders as separate paragraphs or list items)
 * 2. Bullet points (lines starting with -, •, *, or 1.)
 * 3. Emojis (preserved naturally)
 */
const RichText: React.FC<RichTextProps> = ({ 
  text, 
  className = "", 
  accentColor = "bg-blue-400/70" 
}) => {
  if (!text) return null;

  const lines = text.split("\n").filter((l) => l.trim() !== "");

  // Partition consecutive runs into bullet groups and paragraph groups
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
    // Matches common bullet prefixes or numbered lists
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
    // Basic regex for:
    // **bold**, *italics*, ~~strikethrough~~, `code`
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
