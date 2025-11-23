import React from "react";

interface Example {
  text: string;
  highlight?: string;
}

interface ContentSectionProps {
  title: string;
  description: string;
  examples?: Example[];
  note?: string;
}

export function ContentSection({ title, description, examples, note }: ContentSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-4">{title}</h1>
        <div className="border-l-4 border-primary bg-[#f6f8fa] p-4 mb-6">
          <p>{description}</p>
        </div>
      </div>

      {examples && examples.length > 0 && (
        <div>
          <h2 className="mb-4">Examples</h2>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-[#f6f8fa] p-4 rounded-lg border">
                <p className="font-mono">
                  {example.highlight ? (
                    <>
                      {example.text.split(example.highlight).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="bg-accent px-1 rounded">{example.highlight}</span>
                          )}
                        </span>
                      ))}
                    </>
                  ) : (
                    example.text
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {note && (
        <div className="bg-[#fff3cd] border border-[#ffc107] rounded-lg p-4">
          <h4 className="mb-2">Note:</h4>
          <p className="text-sm">{note}</p>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t">
        <button className="px-4 py-2 bg-[#288f8a] text-white rounded hover:opacity-90 transition-opacity">
          ← Previous
        </button>
        <button className="px-4 py-2 bg-[#288f8a] text-white rounded hover:opacity-90 transition-opacity">
          Next →
        </button>
      </div>
    </div>
  );
}
