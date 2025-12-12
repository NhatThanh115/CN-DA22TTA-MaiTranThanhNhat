import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { 
  Send, 
  Bot, 
  User, 
  BookOpen,
  MessageCircle,
  Lightbulb,
  Plus,
  Loader2 // Imported a loading icon
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import React from "react";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CoachPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const quickPrompts = [
    { icon: <BookOpen className="w-5 h-5" />, text: t('coach.prompts.grammar') || "Help me check my grammar" },
    { icon: <MessageCircle className="w-5 h-5" />, text: t('coach.prompts.conversation') || "Let's practice conversation" },
    { icon: <Lightbulb className="w-5 h-5" />, text: t('coach.prompts.tips') || "Give me a learning tip" },
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userContent = input;
    setInput(''); // Clear input early for better UX

    // 1. Add User Message to State
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 2. Prepare History for Gemini (Map 'assistant' -> 'model')
      const history: Content[] = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // 3. Initialize Model with System Instruction
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite",
        systemInstruction: "Bạn là một huấn luyện viên tiếng Anh thân thiện và luôn khích lệ. Mục tiêu của bạn là giúp người dùng cải thiện kỹ năng tiếng Anh thông qua giao tiếp, sửa lỗi ngữ pháp và các mẹo hữu ích. Hãy giữ cho câu trả lời của bạn ngắn gọn và dễ hiểu."
      });

      // 4. Start Chat with History and Send Message
      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 500,
        },
      });

      const result = await chat.sendMessage(userContent);
      const responseText = result.response.text();

      // 5. Add AI Response to State
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Xin lỗi, tôi đang gặp sự cố. Xin vui lòng thử lại sau.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#225d9c] rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">{t('coach.title') || "AI Coach"}</h2>
          </div>
        </div>
        <Button
          onClick={handleNewChat}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center px-4 max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-[#225d9c] rounded-full flex items-center justify-center mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl mb-2 text-center">{t('coach.title') || "AI Language Coach"}</h1>
            <p className="text-gray-600 mb-8 text-center text-lg max-w-2xl">
              {t('coach.subtitle') || "I'm here to help you practice English, correct your grammar, and answer your questions."}
            </p>
            
            {/* Quick Start Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-[#225d9c] mt-1">{prompt.icon}</div>
                    <p className="text-sm">{prompt.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-3xl mx-auto w-full pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`group px-4 py-6 ${
                  message.role === 'user' ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex gap-4 max-w-3xl mx-auto">
                  {/* Avatar - AI on left */}
                  {message.role === 'assistant' && (
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#225d9c] rounded-sm flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="flex-1 space-y-2 overflow-hidden">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>

                  {/* Avatar - User on right */}
                  {message.role === 'user' && (
                    <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#288f8a] rounded-sm flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
               <div className="px-4 py-6 bg-gray-50">
                 <div className="flex gap-4 max-w-3xl mx-auto">
                   <div className="shrink-0">
                      <div className="w-8 h-8 bg-[#225d9c] rounded-sm flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                   </div>
                   <div className="flex items-center">
                     <span className="text-gray-500 text-sm animate-pulse">Thinking...</span>
                   </div>
                 </div>
               </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t('coach.inputPlaceholder') || "Ask me anything..."}
                rows={1}
                disabled={isLoading}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-[#225d9c] focus:border-transparent max-h-[200px] overflow-y-auto disabled:bg-gray-100"
                style={{ minHeight: '52px' }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-[#225d9c] hover:bg-[#1a4a7a] text-white rounded-lg h-[52px] px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            {t('coach.disclaimer') || "AI can make mistakes. Consider checking important information."}
          </p>
        </div>
      </div>
    </div>
  );
}