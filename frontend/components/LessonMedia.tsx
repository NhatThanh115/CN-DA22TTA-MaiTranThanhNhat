import React from "react";
import { Card } from "./ui/card";
import { ImageIcon, Video, Play } from "lucide-react";

interface MediaItem {
  type: 'image' | 'video';
  url?: string;
  placeholder: string;
  caption?: string;
}

interface LessonMediaProps {
  media: MediaItem[];
}

export function LessonMedia({ media }: LessonMediaProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="mb-4">📸 Learning Materials</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {media.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            {item.type === 'image' ? (
              <div className="relative">
                {item.url ? (
                  <img 
                    src={item.url} 
                    alt={item.caption || `Learning material ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-[#e6f2ff] to-[#dbeafe] flex flex-col items-center justify-center border-2 border-dashed border-[#225d9c]/30">
                    <ImageIcon className="w-16 h-16 text-[#225d9c]/40 mb-3" />
                    <p className="text-sm text-[#225d9c]/60 text-center px-4">
                      {item.placeholder}
                    </p>
                  </div>
                )}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 text-sm">
                    {item.caption}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                {item.url ? (
                  <div className="relative w-full h-64">
                    <video 
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-[#e6f7f7] to-[#ccfbf1] flex flex-col items-center justify-center border-2 border-dashed border-[#288f8a]/30 cursor-pointer hover:bg-[#e6f7f7]/80 transition-colors">
                    <div className="relative">
                      <Video className="w-16 h-16 text-[#288f8a]/40 mb-3" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#288f8a]/60" />
                      </div>
                    </div>
                    <p className="text-sm text-[#288f8a]/60 text-center px-4">
                      {item.placeholder}
                    </p>
                  </div>
                )}
                {item.caption && !item.url && (
                  <div className="px-4 py-2 text-sm text-center text-muted-foreground">
                    {item.caption}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
