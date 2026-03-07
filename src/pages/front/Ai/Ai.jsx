import { useState, useRef, useEffect, forwardRef } from "react";
import Swal from "sweetalert2";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

const aiTools = [
  {
    id: "chat",
    icon: "🤖",
    title: "AI 學習助理",
    desc: "與 AI 即時對話，解答技術問題、解釋概念、生成程式碼範例",
    tag: "聊天",
    tagColor: "blue",
    color: "blue",
  },
  {
    id: "review",
    icon: "🔍",
    title: "程式碼審查",
    desc: "貼上你的程式碼，AI 幫你找出問題、提供重構建議與最佳實踐",
    tag: "工具",
    tagColor: "emerald",
    color: "emerald",
  },
  {
    id: "quiz",
    icon: "🧩",
    title: "AI 出題練習",
    desc: "依照你指定的主題與難度，AI 自動生成測驗題目與詳解",
    tag: "練習",
    tagColor: "orange",
    color: "orange",
  },
  {
    id: "summary",
    icon: "📝",
    title: "學習摘要生成",
    desc: "貼入筆記或文章，AI 自動整理重點、生成結構化摘要",
    tag: "工具",
    tagColor: "violet",
    color: "violet",
  },
];

const quickPrompts = {
  chat: [
    "用簡單的比喻解釋 React useEffect",
    "什麼是 TypeScript 泛型？給我一個實際例子",
    "REST API 和 GraphQL 的主要差異是什麼？",
    "解釋 JavaScript 的 event loop",
  ],
  review: [
    "幫我審查以下 React 元件的效能問題",
    "這段 SQL 查詢有沒有可以優化的地方？",
    "找出這個 async/await 程式碼的潛在問題",
    "這段程式碼符合 SOLID 原則嗎？",
  ],
  quiz: [
    "出 5 題 React Hooks 的中級題目",
    "給我 3 題關於 CSS Grid 的實作題",
    "出一題 JavaScript 的 Promise 練習題",
    "考我 Node.js 非同步處理，難度困難",
  ],
  summary: [
    "請把以下內容整理成重點條列",
    "幫我生成這份筆記的學習摘要",
    "把這段技術文件轉成初學者易懂的版本",
    "提取這篇文章中最重要的 3 個觀念",
  ],
};

const systemPrompts = {
  chat: "你是一位友善、專業的全端工程師助教，專門輔助學員學習 React、Node.js、TypeScript、資料庫等全端技術。請用繁體中文回覆，回答要清晰、有條理，適當使用程式碼範例。",
  review: "你是一位資深程式碼審查者，擅長 React、Node.js、TypeScript、SQL 等技術。請用繁體中文分析使用者提供的程式碼，指出問題、說明原因，並提供改善建議與最佳實踐。",
  quiz: "你是一位技術面試官，專門出全端工程相關的測驗題目。請用繁體中文出題，包含題目描述、選項（若為選擇題）、標準答案與詳細解說。",
  summary: "你是一位擅長整理技術資料的助手。請用繁體中文將使用者提供的內容整理成清晰的結構化摘要，包含重點條列、關鍵概念解釋。",
};

const tagColor = {
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  violet: "bg-violet-100 text-violet-700",
};
const toolAccent = {
  blue: { card: "border-t-4 border-blue-500", icon: "bg-blue-50", btn: "bg-blue-600 hover:bg-blue-700", ring: "ring-blue-200", text: "text-blue-700", bubble: "bg-blue-600" },
  emerald: { card: "border-t-4 border-emerald-500", icon: "bg-emerald-50", btn: "bg-emerald-600 hover:bg-emerald-700", ring: "ring-emerald-200", text: "text-emerald-700", bubble: "bg-emerald-600" },
  orange: { card: "border-t-4 border-orange-500", icon: "bg-orange-50", btn: "bg-orange-500 hover:bg-orange-600", ring: "ring-orange-200", text: "text-orange-700", bubble: "bg-orange-500" },
  violet: { card: "border-t-4 border-violet-500", icon: "bg-violet-50", btn: "bg-violet-600 hover:bg-violet-700", ring: "ring-violet-200", text: "text-violet-700", bubble: "bg-violet-600" },
};

/* ═══════════════════════════════════════════════════════════════════════
   SHARED
═══════════════════════════════════════════════════════════════════════ */

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

const Card = forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      className={`bg-white rounded-2xl shadow-sm border ${className}`}
    >
      {children}
    </div>
  )
);

Card.displayName = "Card";

/* ═══════════════════════════════════════════════════════════════════════
   CHAT INTERFACE (shared by all tools)
═══════════════════════════════════════════════════════════════════════ */

function ChatInterface({ tool, onBack }) {
  const accent = toolAccent[tool.color];
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `你好！我是【${tool.title}】。${tool.id === "chat" ? "有任何技術問題都可以問我！" :
        tool.id === "review" ? "請把你想審查的程式碼貼給我，我來幫你找問題！" :
          tool.id === "quiz" ? "告訴我你想練習的主題和難度，我來幫你出題！" :
            "把你想整理的內容貼過來，我幫你生成摘要！"
        }`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = text ?? input.trim();
    if (!userText) {
      Swal.fire({
        title: "請輸入傳送訊息",
        icon: "warning",
      });
    }
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompts[tool.id],
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text).join("") ?? "（發生錯誤，請稍後再試）";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ 無法連線，請確認網路後再試。" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const formatContent = (text) => {
    // Simple code block formatting
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
        return (
          <pre key={i} className="bg-gray-900 text-green-300 rounded-xl p-3 text-xs overflow-x-auto mt-2 mb-2 font-mono">
            <code>{code}</code>
          </pre>
        );
      }
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)]">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 md:px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
        <div onClick={onBack}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors flex-shrink-0">
          ←
        </div>
        <div className={`w-9 h-9 rounded-xl ${accent.icon} flex items-center justify-center text-lg flex-shrink-0`}>
          {tool.icon}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-800 text-sm">{tool.title}</p>
          <p className="text-xs text-gray-400 truncate hidden sm:block">{tool.desc}</p>
        </div>
        <div onClick={() => setMessages([{ role: "assistant", content: `對話已重置。有什麼需要幫忙的嗎？` }])}
          className="ml-auto text-xs text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          🗑️ 清除
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-4 md:px-6 py-3 bg-gray-50 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
        <div className="flex gap-2">
          {quickPrompts[tool.id].map((p, i) => (
            <button key={i} onClick={() => send(p)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border cursor-pointer whitespace-nowrap transition-all flex-shrink-0
                ${accent.ring} bg-white hover:bg-gray-50 ${accent.text} border-current/20`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold
              ${m.role === "user" ? "bg-red-800 text-white" : `${accent.icon} ${accent.text}`}`}>
              {m.role === "user" ? "我" : tool.icon}
            </div>
            {/* Bubble */}
            <div className={`max-w-[78%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${m.role === "user"
                ? "bg-red-800 text-white rounded-tr-sm"
                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm"}`}>
              {formatContent(m.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className={`w-8 h-8 rounded-full ${accent.icon} ${accent.text} flex items-center justify-center text-sm flex-shrink-0`}>
              {tool.icon}
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map(j => (
                  <span key={j} className={`w-2 h-2 rounded-full ${accent.bubble} animate-bounce`}
                    style={{ animationDelay: `${j * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 md:px-6 py-4 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`傳送訊息給 ${tool.title}… (Enter 送出，Shift+Enter 換行)`}
            rows={1}
            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all leading-relaxed"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <div
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold transition-all cursor-pointer flex-shrink-0
              ${input.trim() && !loading ? `${accent.btn}` : "bg-gray-200 cursor-not-allowed"}`}>
            ↑
          </div>
        </div>
        <p className="text-xs text-gray-300 mt-2 text-center">AI 生成內容僅供參考，請自行判斷正確性</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: AI 應用
═══════════════════════════════════════════════════════════════════════ */

export default function Ai() {
  const [activeTool, setActiveTool] = useState(null);

  if (activeTool) {
    return (
      <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Noto Sans TC', 'Microsoft JhengHei', sans-serif" }}>
        <ChatInterface tool={activeTool} onBack={() => setActiveTool(null)} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="AI 應用" subtitle="人工智慧賦能，探索前沿技術應用場景" />

      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-6 md:p-8 mb-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🧠</span>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Powered by Claude</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black mb-2">AI 學習工具套件</h2>
          <p className="text-red-100 text-sm md:text-base max-w-lg leading-relaxed">
            四款 AI 驅動工具，全面輔助你的學習旅程。從即時問答、程式碼審查到智能出題，讓 AI 成為你最強的學習夥伴。
          </p>
          <div className="flex gap-6 mt-5 flex-wrap">
            {[["4", "AI 工具"], ["∞", "對話次數"], ["24/7", "全天候"], ["中文", "繁體支援"]].map(([val, label]) => (
              <div key={label}>
                <p className="text-xl md:text-2xl font-black">{val}</p>
                <p className="text-xs text-red-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tool cards — 1 col mobile, 2 col sm, 2 col md */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {aiTools.map((tool) => {
          const accent = toolAccent[tool.color];
          return (
            <Card key={tool.id} className={`p-5 md:p-6 ${accent.card} hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              onClick={() => setActiveTool(tool)}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl ${accent.icon} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-gray-800">{tool.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tagColor[tool.tagColor]}`}>{tool.tag}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {quickPrompts[tool.id].slice(0, 2).map((p, i) => (
                    <span key={i} className={`text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500`}>{p.slice(0, 12)}…</span>
                  ))}
                </div>
                <div className={`text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex-shrink-0 ml-2 ${accent.btn}`}>
                  開始使用
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Usage tips */}
      <Card className="p-5 md:p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-sm">💡</span>
          使用小技巧
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎯", title: "描述要具體", desc: "提問時說明使用的語言、框架版本，AI 回答會更精準" },
            { icon: "📋", title: "程式碼加脈絡", desc: "貼程式碼時一併說明預期行為與實際問題" },
            { icon: "🔄", title: "追問深化", desc: "對 AI 的回答繼續追問，可以獲得更深入的解說" },
            { icon: "✅", title: "自行驗證", desc: "AI 生成的程式碼建議在本機測試後再使用" },
          ].map((tip, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <span className="text-xl mb-2 block">{tip.icon}</span>
              <p className="font-bold text-gray-800 text-sm mb-1">{tip.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
