import React, { useState } from 'react';
import { Menu, X, Home, Users, Utensils, Calendar, Broom, MessageSquare, Briefcase, BarChart3, Brain, ChevronDown } from 'lucide-react';

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = [
    { name: '首頁', icon: Home, href: '#home' },
    { name: '訂餐系統', icon: Utensils, href: '#meal-order' },
    { name: '班會活動', icon: Calendar, href: '#class-meeting' },
    { name: '掃地分配', icon: Broom, href: '#cleaning' },
    { name: '技術交流', icon: MessageSquare, href: '#tech-forum' },
    { 
      name: '最新消息', 
      icon: Briefcase, 
      href: '#news',
      dropdown: [
        { name: '就業資訊', href: '#job-info' },
        { name: '校園公告', href: '#campus-news' },
      ]
    },
    { name: '資料分析', icon: BarChart3, href: '#data-analysis' },
    { name: '機器學習', icon: Brain, href: '#ml-zone' },
    { name: '團隊成員', icon: Users, href: '#team' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">班</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">班級管理平台</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                    >
                      <item.icon className="w-4 h-4 mr-1.5" />
                      {item.name}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                    {activeDropdown === item.name && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                  >
                    <item.icon className="w-4 h-4 mr-1.5" />
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
                {item.dropdown && (
                  <div className="ml-8 space-y-1">
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        {subItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Banner Component
const Banner = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            歡迎來到
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
              班級管理平台
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl sm:text-2xl text-blue-100">
            整合訂餐、班會、清潔分配、技術交流與就業資訊的一站式平台
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <a
              href="#features"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transform hover:scale-105 transition-all"
            >
              開始探索
            </a>
            <a
              href="#team"
              className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-800 transform hover:scale-105 transition-all border-2 border-white"
            >
              認識團隊
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: '活躍用戶', value: '150+' },
            { label: '訂餐次數', value: '500+' },
            { label: '技術文章', value: '80+' },
            { label: '就業機會', value: '30+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-blue-100 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave Shape */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </div>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      icon: Utensils,
      title: '訂餐系統',
      description: '便捷的班級訂餐管理，統計與結帳一次搞定',
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: Calendar,
      title: '班會活動',
      description: '規劃與記錄班級活動，凝聚班級向心力',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Broom,
      title: '掃地分配',
      description: '公平的清潔區域分配系統，保持環境整潔',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: '技術交流',
      description: '分享學習心得，討論技術問題的園地',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Briefcase,
      title: '就業資訊',
      description: '最新的實習與就業機會，助你職涯發展',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: BarChart3,
      title: '資料分析',
      description: '視覺化數據分析工具，洞察班級數據',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Brain,
      title: '機器學習',
      description: 'ML專案展示與學習資源分享平台',
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: Users,
      title: '團隊成員',
      description: '認識開發團隊與班級夥伴',
      color: 'from-teal-400 to-green-500'
    },
  ];

  return (
    <div id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">平台功能</h2>
          <p className="mt-4 text-lg text-gray-600">一站式解決班級管理的所有需求</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const footerLinks = {
    platform: [
      { name: '訂餐系統', href: '#meal-order' },
      { name: '班會活動', href: '#class-meeting' },
      { name: '掃地分配', href: '#cleaning' },
      { name: '技術交流', href: '#tech-forum' },
    ],
    resources: [
      { name: '就業資訊', href: '#job-info' },
      { name: '資料分析', href: '#data-analysis' },
      { name: '機器學習', href: '#ml-zone' },
      { name: '團隊成員', href: '#team' },
    ],
    about: [
      { name: '關於我們', href: '#about' },
      { name: '聯絡方式', href: '#contact' },
      { name: '使用條款', href: '#terms' },
      { name: '隱私政策', href: '#privacy' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">班</span>
              </div>
              <span className="ml-3 text-xl font-bold text-white">班級管理平台</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              整合多元功能的班級管理解決方案，讓班級運作更有效率。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">平台功能</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">學習資源</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4">關於</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 班級管理平台. All rights reserved.
            </p>
            <p className="text-sm text-gray-400 mt-2 md:mt-0">
              Made with ❤️ by 班級開發團隊
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage Component
const HomePage = () => {
  return (
    <Layout>
      <Banner />
      <Features />
    </Layout>
  );
};

export default HomePage;
