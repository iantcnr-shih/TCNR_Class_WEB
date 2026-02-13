// Footer Component
const Footer = () => {
  const footerLinks = {
    platform: [
      { name: '餐飲管理', href: '#meal-order' },
      { name: '環境管理', href: '#cleaning' },
      { name: '班務會議', href: '#class-meeting' },
      { name: '知識論壇', href: '#tech-forum' },
    ],
    resources: [
      { name: '職涯發展', href: '#job-info' },
      { name: '課程公告', href: '#job-info' },
      { name: '數據分析', href: '#data-analysis' },
      { name: 'AI 應用', href: '#ml-zone' },
    ],
    about: [
      { name: '開發團隊', href: '#team' },
      { name: '聯繫我們', href: '#contact' },
      { name: '使用條款', href: '#terms' },
      { name: '隱私政策', href: '#privacy' },
    ],
  };

  return (
    <footer className="bg-[#311418] text-slate-400 border-t border-slate-800">
      {/* Top Accent */}
      <div className="h-1 bg-gradient-to-r from-[#FC801C] via-[#BB496B] to-[#FC801C]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FC801C] to-[#BB496B] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="ml-3 text-lg font-bold text-white">智慧管理平台</span>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              專業、高效、智能的 網頁軟體工程師 整合式工程管理
            </p>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Engineering Management Platform</div>
              <div>© 2026 All Rights Reserved</div>
            </div>
          </div>
          <div>

          </div>
          {/* Links Sections */}
          <div>
            <div>
              <div className="text-center">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">平台功能</h3>
              </div>
              <div className="space-y-2.5 grid grid-cols-2 sm:grid-cols-1 gap-1 place-items-center">
                {footerLinks.platform.map((link) => (
                  <div key={link.name}>
                    <div href={link.href} className="text-sm text-[rgb(202,87,98)] hover:text-[rgb(233,197,192)] transition-colors duration-200">
                      {link.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div>
              <div className="text-center">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">學習資源</h3>
                <div className="space-y-2.5 grid grid-cols-2 sm:grid-cols-1 gap-1 place-items-center">
                  {footerLinks.resources.map((link) => (
                    <div key={link.name}>
                      <div href={link.href} className="text-sm text-[rgb(202,87,98)] hover:text-[rgb(233,197,192)]  transition-colors duration-200">
                        {link.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div className="text-center">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">關於我們</h3>
                <div className="space-y-2.5 grid grid-cols-2 sm:grid-cols-1 gap-1 place-items-center">
                  {footerLinks.about.map((link) => (
                    <div key={link.name}>
                      <div href={link.href} className="text-sm  text-[rgb(202,87,98)] hover:text-[rgb(233,197,192)] transition-colors duration-200">
                        {link.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <div className="mb-4 md:mb-0">
              Professional Engineering Management Platform
            </div>
            <div className="flex items-center space-x-6 md:mr-16">
              <div href="#" className="hover:text-[#FFBDB0] transition-colors">隱私政策</div>
              <div href="#" className="hover:text-[#FFBDB0] transition-colors">使用條款</div>
              <div href="#" className="hover:text-[#FFBDB0] transition-colors">聯絡我們</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;