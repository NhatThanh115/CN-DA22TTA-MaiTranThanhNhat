import React from "react";
import { Card } from "./ui/card";
import { ImageIcon, Video, Play } from "lucide-react";
import YouTube from 'react-youtube';

const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

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
      <h2 className="mb-4 text-xl font-semibold">📸 Learning Materials</h2>
      <div className="flex flex-col items-center gap-6">
        {media.map((item, index) => (
          <Card key={index} className="overflow-hidden w-full max-w-4xl shadow-lg">
            {item.type === 'image' ? (
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                {item.url ? (
                  <img 
                    src={item.url} 
                    alt={item.caption || `Learning material ${index + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#e6f2ff] to-[#dbeafe] flex flex-col items-center justify-center border-2 border-dashed border-[#225d9c]/30">
                    <ImageIcon className="w-16 h-16 text-[#225d9c]/40 mb-3" />
                    <p className="text-sm text-[#225d9c]/60 text-center px-4">
                      {item.placeholder}
                    </p>
                  </div>
                )}
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 text-sm z-10">
                    {item.caption}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
                {item.url ? (
                  <div className="absolute top-0 left-0 w-full h-full">
                    {getYouTubeID(item.url) ? (
                      <YouTube 
                        videoId={getYouTubeID(item.url) as string}
                        className="w-full h-full"
                        iframeClassName="w-full h-full"
                        opts={{
                          width: '100%',
                          height: '100%',
                          playerVars: {
                            autoplay: 0,
                          },
                        }}
                        onError={(e: any) => console.error("YouTube Player Error:", e)}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-red-500 border border-red-200">
                        <p>Invalid Video URL</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#e6f7f7] to-[#ccfbf1] flex flex-col items-center justify-center border-2 border-dashed border-[#288f8a]/30 cursor-pointer hover:bg-[#e6f7f7]/80 transition-colors">
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
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}