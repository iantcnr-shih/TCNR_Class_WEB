import { Users, Utensils, Calendar, Sparkles, MessageSquare, Briefcase, BarChart3, Brain } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// Features Section
const Features = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: Utensils,
      title: '訂餐管理',
      description: '智能訂餐系統，優化用餐體驗，提升行政效率',
      iconColor: 'text-[#FC801C]',
      iconBg: 'bg-orange-50',
      url: '/meal-order',
    },
    {
      icon: Sparkles,
      title: '環境管理',
      description: '數位化分配，環境維護流程化管理，責任追蹤',
      iconColor: 'text-[#FFBDB0]',
      iconBg: 'bg-orange-50',
      url: '/environment',
    },
    {
      icon: Calendar,
      title: '班務會議',
      description: '議題討論與決策機制，促進團隊共識與執行效能',
      iconColor: 'text-[#BB496B]',
      iconBg: 'bg-pink-50',
      url: '/class-meeting',
    },

    {
      icon: MessageSquare,
      title: '知識論壇',
      description: '專業交流平台，促進經驗分享與思想碰撞',
      iconColor: 'text-[#FC801C]',
      iconBg: 'bg-orange-50',
      url: '#tech-forum',
    },
    {
      icon: Briefcase,
      title: '職涯發展',
      description: '整合產業資源，拓展職業發展機會',
      iconColor: 'text-[#BB496B]',
      iconBg: 'bg-pink-50',
      url: '#job-info',
    },
    {
      icon: BarChart3,
      title: '數據分析',
      description: '視覺化儀表板，支持數據驅動的決策制定',
      iconColor: 'text-[#311418]',
      iconBg: 'bg-slate-50',
      url: '#data-analysis',
    },
    {
      icon: Brain,
      title: 'AI 應用',
      description: '人工智慧賦能，探索前沿技術應用場景',
      iconColor: 'text-[#FC801C]',
      iconBg: 'bg-orange-50',
      url: '#ai',
    },
    {
      icon: Users,
      title: '團隊開發',
      description: '建立專業人脈網絡，促進跨界合作交流',
      iconColor: 'text-[#BB496B]',
      iconBg: 'bg-pink-50',
      url: '/dev-team',
    },
  ];

  return (
    <div id="features" className="py-5 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 lg:mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-[#FC801C] tracking-wider uppercase">Core Functions</span>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">整合性管理</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FC801C] to-[#BB496B] mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            八大核心功能模組，全方位支持專業培訓學習與管理需求
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-4 md:p-8 border-2 border-slate-200 hover:border-[#FC801C]/30 hover:shadow-xl transition-all duration-300"
              onClick={() => {
                if (feature.url && feature.url.startsWith("#")) {
                  alert("功能尚未實裝, 敬請期待");
                } else {
                  navigate(feature.url);
                }
              }}
            >
              {/* Hover Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FC801C] to-[#BB496B] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>

              <div className={`w-14 h-14 ${feature.iconBg} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Features;