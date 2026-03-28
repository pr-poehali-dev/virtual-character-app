import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Message {
  id: string;
  role: "user" | "mahito";
  text: string;
  timestamp: Date;
}

const MAHITO_AVATAR = "https://cdn.poehali.dev/projects/884f2e30-0100-4d08-ae51-60ed92bdee29/bucket/02e7cfbc-4805-407a-8e91-ab6c9d9a48ed.jpg";

const MAHITO_CHAT_URL = "https://functions.poehali.dev/287c2e86-db50-4a41-9cb5-e55df7723344";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "mahito",
      text: "...Ты явился. Что ж, это любопытно. Люди редко решаются подойти ко мне сами. Говори — я слушаю. Пока.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [showSettings, setShowSettings] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const res = await fetch(MAHITO_CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text.trim(),
        history: messages.map((m) => ({ role: m.role, text: m.text })),
      }),
    });
    const data = await res.json();
    const mahitoMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "mahito",
      text: data.reply || "...",
      timestamp: new Date(),
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, mahitoMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      sendMessage("Голосовое сообщение...");
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background hex-pattern scanline">
      {/* Ambient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(195 90% 55%), transparent)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(270 60% 50%), transparent)" }}
      />

      {/* Top line */}
      <div
        className="absolute top-0 left-0 w-full h-px opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, hsl(195 90% 55%), transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-px opacity-20"
        style={{ background: "linear-gradient(90deg, transparent, hsl(270 60% 50%), transparent)" }}
      />

      {/* Main layout */}
      <div className="relative z-10 flex h-full max-w-6xl mx-auto">

        {/* Left Panel — Avatar */}
        <div className="w-72 flex-shrink-0 flex flex-col items-center justify-between py-8 px-4 border-r border-white/5">
          {/* Logo */}
          <div className="text-center w-full">
            <div className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">
              呪術廻戦
            </div>
            <div
              className="w-16 h-px mx-auto opacity-30"
              style={{ background: "linear-gradient(90deg, transparent, hsl(195 90% 55%), transparent)" }}
            />
          </div>

          {/* Avatar area */}
          <div className="relative flex flex-col items-center gap-4">
            {/* Orbital ring */}
            <div
              className="absolute w-52 h-52 rounded-full border opacity-20"
              style={{ borderColor: "hsl(195 90% 55% / 0.3)" }}
            />

            {/* Floating orbs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "hsl(195 90% 65%)" : "hsl(270 60% 60%)",
                    transform: `rotate(${deg}deg) translateX(90px)`,
                    opacity: 0.3,
                    transition: "opacity 0.3s ease",
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "hsl(195 90% 65%)" : "hsl(270 60% 60%)"}`,
                    animation: `orb-spin ${6 + i}s linear infinite`,
                    animationDelay: `${i * -1}s`,
                  }}
                />
              ))}
            </div>

            {/* Avatar image */}
            <div
              className="relative w-44 h-44 rounded-full overflow-hidden animate-float"
              style={{
                border: "2px solid hsl(195 90% 55% / 0.3)",
                boxShadow: "0 0 20px hsl(195 90% 55% / 0.2), 0 0 50px hsl(270 60% 50% / 0.1)",
              }}
            >
              <img
                src={MAHITO_AVATAR}
                alt="Махито"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name */}
            <div className="text-center">
              <h1 className="font-cinzel text-xl font-semibold text-foreground cursed-glow-text tracking-wide">
                МАХИТО
              </h1>
              <div className="font-noto text-xs text-muted-foreground mt-0.5 tracking-wider">
                真人 · Проклятый дух
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "hsl(195 90% 55% / 0.4)",
                  }}
                />
                <span className="font-rajdhani text-xs text-muted-foreground tracking-widest uppercase">
                  {isTyping ? "думает" : "ждёт"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full" />
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Tabs + actions */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex gap-1">
              {(["chat", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="font-rajdhani text-sm px-4 py-1.5 rounded-md tracking-wider uppercase transition-all"
                  style={{
                    background:
                      activeTab === tab ? "hsl(195 90% 55% / 0.15)" : "transparent",
                    color:
                      activeTab === tab
                        ? "hsl(195 90% 65%)"
                        : "hsl(220 15% 45%)",
                    border: `1px solid ${activeTab === tab ? "hsl(195 90% 55% / 0.3)" : "transparent"}`,
                  }}
                >
                  {tab === "chat" ? "Чат" : "История"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings((v) => !v)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-white/5"
              >
                <Icon name="Settings2" size={16} />
              </button>
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: "0",
                      role: "mahito",
                      text: "...Снова ты. Хорошо. Говори.",
                      timestamp: new Date(),
                    },
                  ])
                }
                className="font-rajdhani text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase px-3 py-1.5 rounded-md hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                Очистить
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div className="mx-6 mt-3 p-4 rounded-xl glass-card animate-fade-in">
              <div className="font-cinzel text-xs tracking-widest text-muted-foreground uppercase mb-3">
                Системный промпт
              </div>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 font-noto text-xs text-foreground resize-none outline-none focus:border-cyan-400/30 transition-colors"
                rows={3}
                defaultValue="Ты — Махито из вселенной Jujutsu Kaisen, говори много, энергично, но с лёгкой надменностью. Твой голос — нежный, но хитрый."
              />
            </div>
          )}

          {/* Chat messages */}
          {activeTab === "chat" && (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="animate-message-in">
                  {msg.role === "mahito" ? (
                    <div className="flex gap-3 max-w-2xl">
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-0.5"
                        style={{ border: "1px solid hsl(195 90% 55% / 0.3)" }}
                      >
                        <img
                          src={MAHITO_AVATAR}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-cinzel text-xs text-cyan-400/70 tracking-wider">
                            МАХИТО
                          </span>
                          <span className="font-noto text-xs text-muted-foreground/50">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className="font-noto text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm"
                          style={{
                            background: "hsl(240 14% 10% / 0.8)",
                            border: "1px solid hsl(195 90% 55% / 0.12)",
                            color: "hsl(220 20% 88%)",
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 max-w-xl ml-auto flex-row-reverse">
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                        style={{
                          background: "hsl(270 60% 30%)",
                          border: "1px solid hsl(270 60% 50% / 0.3)",
                        }}
                      >
                        <Icon name="User" size={14} className="text-purple-300" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                          <span className="font-cinzel text-xs text-purple-400/70 tracking-wider">
                            ВЫ
                          </span>
                          <span className="font-noto text-xs text-muted-foreground/50">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div
                          className="font-noto text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tr-sm"
                          style={{
                            background: "hsl(270 40% 15% / 0.8)",
                            border: "1px solid hsl(270 60% 50% / 0.2)",
                            color: "hsl(220 20% 88%)",
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing dots */}
              {isTyping && (
                <div className="flex gap-3 max-w-2xl animate-fade-in">
                  <div
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: "1px solid hsl(195 90% 55% / 0.3)" }}
                  >
                    <img
                      src={MAHITO_AVATAR}
                      alt=""
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div
                    className="px-5 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2"
                    style={{
                      background: "hsl(240 14% 10% / 0.8)",
                      border: "1px solid hsl(195 90% 55% / 0.12)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "hsl(195 90% 55%)",
                          animation: "pulse-cursed 1.2s ease-in-out infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* History tab */}
          {activeTab === "history" && (
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                {messages.filter((m) => m.role === "user").length === 0 ? (
                  <div className="text-center py-16">
                    <div className="font-cinzel text-muted-foreground/40 text-sm tracking-wider">
                      История пуста
                    </div>
                  </div>
                ) : (
                  messages
                    .filter((m) => m.role === "user")
                    .map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setActiveTab("chat");
                          setInput(msg.text);
                          inputRef.current?.focus();
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl glass-card hover:border-cyan-400/20 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-noto text-sm text-foreground/70 group-hover:text-foreground transition-colors line-clamp-2">
                            {msg.text}
                          </span>
                          <span className="font-noto text-xs text-muted-foreground flex-shrink-0">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="px-6 py-4 border-t border-white/5">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
              style={{
                background: "hsl(240 14% 9%)",
                border: `1px solid ${input ? "hsl(195 90% 55% / 0.25)" : "hsl(240 14% 15%)"}`,
                boxShadow: input ? "0 0 20px hsl(195 90% 55% / 0.05)" : "none",
              }}
            >
              {/* Mic */}
              <button
                onClick={toggleRecording}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isRecording
                    ? "hsl(0 80% 55% / 0.2)"
                    : "hsl(240 14% 14%)",
                  border: `1px solid ${isRecording ? "hsl(0 80% 55% / 0.5)" : "hsl(240 14% 20%)"}`,
                  animation: isRecording
                    ? "recording-pulse 1.2s ease-in-out infinite"
                    : "none",
                }}
              >
                <Icon
                  name={isRecording ? "MicOff" : "Mic"}
                  size={15}
                  className={isRecording ? "text-red-400" : "text-muted-foreground"}
                />
              </button>

              {/* Text */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Говори, смертный..."
                className="flex-1 bg-transparent outline-none font-noto text-sm text-foreground placeholder:text-muted-foreground/40"
              />

              {/* Send */}
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, hsl(195 90% 55%), hsl(270 60% 50%))"
                    : "hsl(240 14% 14%)",
                  border: `1px solid ${input.trim() ? "transparent" : "hsl(240 14% 20%)"}`,
                  opacity: input.trim() ? 1 : 0.5,
                  boxShadow: input.trim()
                    ? "0 0 15px hsl(195 90% 55% / 0.3)"
                    : "none",
                }}
              >
                <Icon
                  name="Send"
                  size={14}
                  className={input.trim() ? "text-background" : "text-muted-foreground"}
                />
              </button>
            </div>

            <div className="flex items-center justify-center mt-2">
              <span className="font-rajdhani text-xs text-muted-foreground/40 tracking-wider">
                ENTER для отправки · MIC для голоса
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}