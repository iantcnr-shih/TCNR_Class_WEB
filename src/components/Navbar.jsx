// export default Navbar;
import React, { useState } from 'react';
import { Menu, X, Users, Utensils, Calendar, Sparkles, MessageSquare, Briefcase, BarChart3, Brain, ChevronDown } from 'lucide-react';


// Navbar Component
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const navItems = [
        {
            name: '最新資訊',
            icon: Briefcase,
            href: '#news',
            dropdown: [
                { name: '職涯發展', href: '#job-info' },
                { name: '課程公告', href: '#campus-news' },
            ]
        },
        { name: '餐飲管理', icon: Utensils, href: '#meal-order' },
        { name: '環境管理', icon: Sparkles, href: '#cleaning' },
        { name: '班務會議', icon: Calendar, href: '#class-meeting' },
        { name: '知識論壇', icon: MessageSquare, href: '#tech-forum' },

        { name: '數據分析', icon: BarChart3, href: '#data-analysis' },
        { name: 'AI 應用', icon: Brain, href: '#ml-zone' },
        { name: '團隊開發', icon: Users, href: '#team' },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
bg-gradient-to-b from-[#9f3a4b] to-[#5e1f2b]">
                <div className='flex'>
                    {/* Logo */}
                    <div className="flex items-center p-1">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#FC801C] to-[#BB496B] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">AI</span>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-[rgb(247,237,230)] tracking-tight">生成式AI與全端程式設計 專業培訓管理平台</div>
                                    <div className="text-xs text-[rgb(242,182,168)] tracking-wide">Generative AI & Full-Stack Engineering Management Platform</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-1">
                        {navItems.map((item) => (
                            <div key={item.name} className="relative group">
                                {item.dropdown ? (
                                    <>
                                        <div
                                            className="flex items-center px-4 py-2 text-sm font-medium text-[rgb(252,238,238)] hover:text-[rgb(98,32,32)] hover:bg-[rgb(252,238,238)] transition-colors rounded-md"
                                            onMouseEnter={() => setActiveDropdown(item.name)}
                                        >
                                            <item.icon className="w-4 h-4 mr-2" />
                                            {item.name}
                                            <ChevronDown className="w-3 h-3 ml-1" />
                                        </div>
                                        {activeDropdown === item.name && (
                                            <div
                                                className="absolute top-full left-0 mt-2 px-2 w-48 bg-gradient-to-br from-[#9f3a4b] to-[#5e1f2b] rounded-lg shadow-lg py-2 z-50 border border-slate-200"
                                                onMouseLeave={() => setActiveDropdown(null)}
                                            >
                                                {item.dropdown.map((subItem) => (
                                                    <div
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className="block px-4 py-2.5 text-sm text-[rgb(252,238,238)] hover:text-[rgb(98,32,32)] hover:bg-[rgb(252,238,238)] transition-colors rounded-md"
                                                    >
                                                        {subItem.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div
                                        className="flex items-center px-3 py-2 text-sm font-medium text-[rgb(252,238,238)] hover:text-[rgb(98,32,32)] hover:bg-[rgb(252,238,238)] transition-colors rounded-md"
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex ml-auto items-center lg:hidden">
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 text-[rgb(252,238,238)] hover:text-[rgb(98,32,32)] hover:bg-[rgb(252,238,238)] transition-colors rounded-md focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <div key={item.name}>
                                <div
                                    href={item.href}
                                    className="flex items-center px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md"
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </div>
                                {item.dropdown && (
                                    <div className="ml-8 space-y-1">
                                        {item.dropdown.map((subItem) => (
                                            <div
                                                key={subItem.name}
                                                href={subItem.href}
                                                className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                                            >
                                                {subItem.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* Accent Line */}
            <div className="h-1 bg-gradient-to-r from-[#FC801C] via-[#FFBDB0] to-[#FC801C]"></div>
        </nav>
    );
};

export default Navbar;