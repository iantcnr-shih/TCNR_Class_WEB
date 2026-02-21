import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════ */

/* 知識論壇 */
const forumCategories = ["全部", "技術討論", "學習資源", "問題求助", "心得分享", "職涯交流"];
const forumPosts = [
  { id: 1, cat: "技術討論", title: "React Server Components 和 Client Components 的使用時機？", author: "Ian", avatar: "👨‍💻", time: "2 小時前", likes: 24, replies: 8, views: 142, hot: true },
  { id: 2, cat: "問題求助", title: "useEffect 的 cleanup function 何時會被呼叫？", author: "Tako", avatar: "🚀", time: "5 小時前", likes: 12, replies: 15, views: 89, hot: false },
  { id: 3, cat: "學習資源", title: "分享：2026 最完整的 TypeScript 學習路線圖", author: "Billy", avatar: "🎨", time: "1 天前", likes: 67, replies: 22, views: 534, hot: true },
  { id: 4, cat: "心得分享", title: "從 0 到 1：我的全端學習三個月心得", author: "Ian", avatar: "👨‍💻", time: "2 天前", likes: 95, replies: 31, views: 872, hot: true },
  { id: 5, cat: "職涯交流", title: "大廠 vs 新創，工程師薪資差距真的那麼大嗎？", author: "Tako", avatar: "🚀", time: "3 天前", likes: 44, replies: 18, views: 320, hot: false },
  { id: 6, cat: "技術討論", title: "Tailwind CSS v4 有哪些重大更新值得關注？", author: "Billy", avatar: "🎨", time: "4 天前", likes: 33, replies: 9, views: 215, hot: false },
];

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-6 md:mb-8">
    <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
    <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
    <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>
);

/* ═══════════════════════════════════════════════════════════════════════
   PAGE: 知識論壇
═══════════════════════════════════════════════════════════════════════ */
export default function KnowledgeForum() {
  const [activeCategory, setActiveCategory] = useState("全部");

  const filtered = activeCategory === "全部"
    ? forumPosts
    : forumPosts.filter(p => p.cat === activeCategory);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader title="知識論壇" subtitle="專業交流平台，促進經驗分享與思想碰撞" />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {forumCategories.map(cat => (
            <div key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer
                ${activeCategory === cat ? "bg-red-800 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-700"}`}>
              {cat}
            </div>
          ))}
        </div>
        <div className="bg-red-800 hover:bg-red-900 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto">
          ✏️ 發起討論
        </div>
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {filtered.map((post) => (
          <Card key={post.id} className="max-w-3xl  p-4 md:p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      post.cat === "技術討論" ? "bg-blue-100 text-blue-700" :
                      post.cat === "問題求助" ? "bg-red-100 text-red-700" :
                      post.cat === "學習資源" ? "bg-emerald-100 text-emerald-700" :
                      post.cat === "心得分享" ? "bg-orange-100 text-orange-700" :
                      "bg-violet-100 text-violet-700"
                    }`}>{post.cat}</span>
                    {post.hot && <span className="text-xs text-red-500 font-bold">🔥 熱門</span>}
                  </div>
                </div>
                <p className="font-semibold text-gray-800 text-sm md:text-base leading-snug group-hover:text-red-800 transition-colors">{post.title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                  <span>{post.author} · {post.time}</span>
                  <span>👀 {post.views}</span>
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.replies} 則回覆</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
