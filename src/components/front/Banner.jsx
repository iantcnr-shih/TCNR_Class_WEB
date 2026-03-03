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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-10">
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
                    const element = document.getElementById("features");
                    const offset = 80; // navbar 高度
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset -
                      offset;
                    window.scrollTo({ top: y, behavior: "smooth" });
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
                  <div className="text-md font-medium text-slate-200">{stat.label}</div>
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
export default Banner;