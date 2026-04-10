import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ScanChatProps {
  onClose?: () => void;
  leadName?: string;
}

export const ScanChat = ({ onClose, leadName: initialLeadName }: ScanChatProps) => {
  const [leadName, setLeadName] = useState(initialLeadName || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (started && !isStreaming) {
      inputRef.current?.focus();
    }
  }, [started, isStreaming]);

  // Listen for scan-start event from Astro page
  useEffect(() => {
    const handler = ((e: CustomEvent) => {
      if (!started) {
        const name = e.detail?.leadName || '';
        if (name) setLeadName(name);
        handleStart(name);
      }
    }) as EventListener;
    window.addEventListener('scan-start', handler);
    return () => window.removeEventListener('scan-start', handler);
  }, [started]);

  const sendMessage = async (userMessage: string, allMessages: Message[] = messages) => {
    const newMessages: Message[] = [...allMessages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/scan/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Erro na conexão');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Stream indisponível');

      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages([...newMessages, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantMessage += parsed.text;
              setMessages([
                ...newMessages,
                { role: 'assistant', content: assistantMessage },
              ]);
            }
            if (parsed.error) {
              assistantMessage += `\n\n[Erro: ${parsed.error}]`;
              setMessages([
                ...newMessages,
                { role: 'assistant', content: assistantMessage },
              ]);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `Desculpe, ocorreu um erro: ${errorMsg}. Tente novamente.` },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStart = (name?: string) => {
    setStarted(true);
    const initialMessage: Message[] = [];
    const resolvedName = name || leadName;
    const greeting = resolvedName
      ? `Olá, sou ${resolvedName} e quero fazer meu Scan de Autoridade Cadarn.`
      : 'Olá, quero fazer meu Scan de Autoridade Cadarn.';
    sendMessage(greeting, initialMessage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input.trim());
  };

  if (!started) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-navy">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-offwhite/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-caramelo animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-offwhite/60">
            Scan de Autoridade Cadarn
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-widest text-offwhite/40 transition-colors hover:text-offwhite"
          >
            Fechar
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 ${
                  msg.role === 'user'
                    ? 'border border-caramelo/30 bg-caramelo/10 text-offwhite'
                    : 'bg-offwhite/5 text-offwhite/90'
                }`}
              >
                <p className="whitespace-pre-wrap font-body text-sm leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex justify-start">
              <div className="bg-offwhite/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-caramelo animate-pulse" />
                  <span className="font-mono text-xs text-offwhite/40">
                    analisando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-offwhite/10 px-4 py-3">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder={isStreaming ? 'Aguarde...' : 'Digite sua resposta...'}
            className="flex-1 border border-offwhite/20 bg-transparent px-4 py-2.5 font-body text-sm text-offwhite placeholder:text-offwhite/20 focus:border-caramelo focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="border border-caramelo/30 bg-caramelo/20 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-caramelo transition-colors hover:bg-caramelo/30 disabled:opacity-30"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScanChat;
