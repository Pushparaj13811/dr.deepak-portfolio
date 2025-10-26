import { useState, useRef, useEffect } from "react";
import type { BlogImage } from "../../types";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  images?: BlogImage[];
  onInsertImage?: (imageId: string) => void;
}

export function MarkdownEditor({ value, onChange, placeholder = "Write your content here...", minHeight = "300px", images = [], onInsertImage }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current && !isPreview) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, parseInt(minHeight)) + "px";
    }
  }, [value, isPreview, minHeight]);

  const handleInsert = (before: string, after: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const renderPreview = () => {
    let html = value;

    // Replace image placeholders with actual images
    images.forEach(image => {
      const placeholder = `{{image:${image.id}}}`;
      const imageHtml = `
        <div class="my-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
          <img src="${image.base64}" alt="${image.alt || image.name}" class="w-full max-w-sm rounded border" />
          ${image.caption ? `<p class="text-sm text-gray-600 mt-2 italic">${image.caption}</p>` : ''}
          <p class="text-xs text-gray-500 mt-1">Image: ${image.name}</p>
        </div>
      `;
      html = html.replace(new RegExp(placeholder, 'g'), imageHtml);
    });

    // Enhanced markdown to HTML conversion
    html = html
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
      // Code blocks
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-3 rounded my-3 overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      // Lists
      .replace(/^\* (.+)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)/gim, '<li class="ml-4">$1</li>')
      // Paragraphs and line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags
    html = '<p class="mb-3">' + html + '</p>';

    return { __html: html };
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleInsert("**", "**")}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => handleInsert("*", "*")}
            className="px-3 py-1.5 text-sm italic text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
          >
            <em>I</em>
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            type="button"
            onClick={() => handleInsert("# ")}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => handleInsert("## ")}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => handleInsert("### ")}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Heading 3"
          >
            H3
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            type="button"
            onClick={() => handleInsert("[", "](url)")}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleInsert("* ")}
            className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          {images.length > 0 && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <div className="relative group">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  title="Insert Image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                {/* Image dropdown */}
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2 max-h-48 overflow-y-auto">
                    <div className="text-xs text-gray-500 mb-2 px-2">Click to insert:</div>
                    {images.map((image) => (
                      <button
                        key={image.id}
                        type="button"
                        onClick={() => {
                          handleInsert(`![${image.alt || image.name}]({{image:${image.id}}})`);
                        }}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left"
                      >
                        <img 
                          src={image.base64} 
                          alt={image.alt || image.name}
                          className="w-8 h-8 object-cover rounded border"
                        />
                        <span className="text-sm text-gray-700 truncate">
                          {image.alt || image.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`px-4 py-1.5 text-sm rounded transition-colors ${
            isPreview 
              ? "bg-blue-100 text-blue-700" 
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isPreview ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </span>
          )}
        </button>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {isPreview ? (
          <div
            className="p-6 prose prose-sm max-w-none"
            style={{ minHeight }}
            dangerouslySetInnerHTML={renderPreview()}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-6 bg-white text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm border-0"
            style={{ minHeight }}
          />
        )}
      </div>
    </div>
  );
}