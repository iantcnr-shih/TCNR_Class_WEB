import { Users, Utensils, Calendar, Sparkles, MessageSquare, Briefcase, BarChart3, Brain } from 'lucide-react';

// Banner Component
const Banner = () => {
  return (
    <div className='w-full bg-white py-10 md:px-10'>
      <div className="relative bg-gradient-to-br from-[#311418] via-[#BB496B] to-[#FC801C] overflow-hidden md:rounded-2xl">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h1v100H0zM0 0h100v1H0z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FC801C] via-[#FFBDB0] to-[#FC801C]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                <span className="w-2 h-2 bg-[#FFBDB0] rounded-full mr-2"></span>
                <span className="text-sm font-medium text-slate-200">Executive Engineering Management Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">卓越領導</span>
                <span className="block text-[#FFBDB0]">智慧管理</span>
              </h1>

              <p className="text-xl text-slate-200 mb-8 leading-relaxed">
                專業網頁軟體工程師整合式工程管理平台<br />
                提升開發效率，強化團隊協作，實現數據導向與系統化決策。
              </p>

              <div className="flex flex-wrap gap-4">
                <div
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#FC801C] to-[#BB496B] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                  onClick={() => {
                    document.getElementById("features")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  探索平台功能
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '', label: '活躍學員', sublabel: 'Active Members' },
                { value: '', label: '協作互動', sublabel: 'Collaborations' },
                { value: '', label: '知識分享', sublabel: 'Knowledge Shares' },
                { value: '', label: '職涯機會', sublabel: 'Career Opportunities' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-[#FFBDB0]/50 transition-all duration-300">
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-200">{stat.label}</div>
                  <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </div>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: Utensils,
      title: '餐飲管理',
      description: '智能訂餐系統，優化用餐體驗，提升行政效率',
      iconColor: 'text-[#FC801C]',
      iconBg: 'bg-orange-50'
    },
    {
      icon: Sparkles,
      title: '環境管理',
      description: '數位化分配，環境維護流程化管理，責任追蹤',
      iconColor: 'text-[#FFBDB0]',
      iconBg: 'bg-orange-50'
    },
    {
      icon: Calendar,
      title: '班務會議',
      description: '議題討論與決策機制，促進團隊共識與執行效能',
      iconColor: 'text-[#BB496B]',
      iconBg: 'bg-pink-50'
    },

    {
      icon: MessageSquare,
      title: '知識論壇',
      description: '專業交流平台，促進經驗分享與思想碰撞',
      iconColor: 'text-[#FC801C]',
      iconBg: 'bg-orange-50'
    },
    {
      icon: Briefcase,
      title: '職涯發展',
      description: '整合產業資源，拓展職業發展機會',
      iconColor: 'text-[#BB496B]',
      iconBg: 'bg-pink-50'
    },
    {
      icon: BarChart3,
      title: '數據分析',
      description: '視覺化儀表板，支持數據驅動的決策制定',
      iconColor: 'text-[#311418]',
      iconBg: 'bg-slate-50'
    },
    {
      icon: Brain,
      title: 'AI 應用',
      description: '人工智慧賦能，探索前沿技術應用場景',
      iconColor: 'text-[#FC801C]',
      iconBg: 'bg-orange-50'
    },
    {
      icon: Users,
      title: '團隊開發',
      description: '建立專業人脈網絡，促進跨界合作交流',
      iconColor: 'text-[#BB496B]',
      iconBg: 'bg-pink-50'
    },
  ];

  return (
    <div id="features" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
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
              className="group relative bg-white rounded-xl p-8 border-2 border-slate-200 hover:border-[#FC801C]/30 hover:shadow-xl transition-all duration-300"
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

// Main HomePage Component
const Home = () => {
  return (
    <>
      <Features />
      <Banner />
    </>
  );
};

export default Home;
