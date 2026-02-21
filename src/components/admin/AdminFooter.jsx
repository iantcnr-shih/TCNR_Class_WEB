// Footer Component
const AdminFooter = () => {
  const footerLinks = {
    platform: [
      { name: '餐飲管理', href: '#meal-order' },
      { name: '環境管理', href: '#environment' },
      { name: '班務會議', href: '#class-meeting' },
      { name: '知識論壇', href: '#tech-forum' },
    ],
    resources: [
      { name: '職涯發展', href: '/job-info' },
      { name: '課程公告', href: '/campus-news' },
      { name: '數據分析', href: '#data-analysis' },
      { name: 'AI 應用', href: '#ai' },
    ],
    about: [
      { name: '開發團隊', href: '#team' },
      { name: '聯繫我們', href: '#contact' },
      { name: '使用條款', href: '#terms' },
      { name: '隱私政策', href: '#privacy' },
    ],
  };

  return (
    <footer className="bg-[rgb(0,61,96)] text-slate-400 border-t border-slate-800">
      {/* Top Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pm-5 pt-12 gap-8">
        {/* 左欄 / Brand */}
        <div className="flex w-full lg:w-1/4 xl:w-1/5 mb-2">
          <div className="mx-auto">
            <div className="flex">
              <div className="flex mx-auto lg:mx-0 items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">TC</span>
                </div>
                <div className="ml-3">
                  <span className="text-lg font-bold text-white block">TCNR Class</span>
                  <span className="text-md font-bold text-white block">智慧管理平台</span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left text-sm text-slate-500 mb-2 leading-relaxed">
              專業、高效、智能的 網頁軟體工程師 整合式工程管理
            </div>
            <div className="text-center lg:text-left text-xs text-slate-600">
              <div>Professional Engineering Management Platform</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4 xl:w-4/5 flex mb-8">
          {/* Links Sections */}
          <div className="grid w-full gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="mx-auto hidden lg:block"></div>
            <div className="mx-auto">
              <div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-4 text-base md:text-lg uppercase tracking-wider">主要功能</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-x-12 gap-y-4 md:gap-x-6 md:gap-y-1 ">
                  {footerLinks.platform.map((link) => (
                    <div key={link.name}>
                      <div href={link.href} className="text-base md:text-lg text-[rgb(87,114,202)] hover:text-[rgb(192,208,233)] transition-colors duration-200">
                        {link.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 sm:mt-0">
              <div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-4 text-base md:text-lg uppercase tracking-wider">學習資源</h3>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-x-12 gap-y-4 md:gap-x-6 md:gap-y-1 ">
                    {footerLinks.resources.map((link) => (
                      <div key={link.name}>
                        <div href={link.href} className="text-base md:text-lg text-[rgb(87,114,202)] hover:text-[rgb(192,208,233)]  transition-colors duration-200">
                          {link.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-6 md:mt-0">
              <div>
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-4 text-base md:text-lg uppercase tracking-wider">關於我們</h3>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-x-12 gap-y-4 md:gap-x-6 md:gap-y-1 ">
                    {footerLinks.about.map((link) => (
                      <div key={link.name}>
                        <div href={link.href} className="text-base md:text-lg text-[rgb(87,114,202)] hover:text-[rgb(192,208,233)] transition-colors duration-200">
                          {link.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Bottom Bar */}
        <div className="py-2 border-t border-slate-800">
          <div className="flex flex-col justify-between items-center text-sm text-slate-500">
            <div className="mb-4">
              <div className="mt-3 w-full flex">
                <div className="mx-auto text-slate-500">© 2026 TCNR Class. All Rights Reserved.</div>
              </div>
              <div className="w-full flex">
                <div className="mx-auto text-slate-500">Developed by Ian, Billy, Tako</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;