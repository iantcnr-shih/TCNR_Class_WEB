// export default Navbar;
import React, { useState, useEffect } from 'react';
import { Newspaper, Utensils, Sparkles, Calendar, MessageSquare, BarChart3, Brain, Users, Menu, X, Bell, Search, User, Settings, ChevronRight, TrendingUp, Clock, CheckCircle, ArrowRightCircle, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

// Navbar Component
const AdminNavbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const menuItems = [
        { id: 'latest-news', name: '最新資訊', icon: Newspaper, url: '/admin/news', color: 'blue', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
        { id: 'meal-order', name: '餐飲管理', icon: Utensils, url: '/admin/meal-order', color: 'orange', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
        { id: 'environment', name: '環境管理', icon: Sparkles, url: '/admin/environment', color: 'emerald', bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { id: 'class-meeting', name: '班務會議', icon: Calendar, url: '/admin/class-meeting', color: 'purple', bgColor: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
        { id: 'tech-forum', name: '知識論壇', icon: MessageSquare, url: '/admin/tech-forum', color: 'cyan', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', textColor: 'text-cyan-600' },
        { id: 'data-analysis', name: '數據分析', icon: BarChart3, url: '/admin/data-analysis', color: 'indigo', bgColor: 'bg-indigo-500', lightBg: 'bg-indigo-50', textColor: 'text-indigo-600' },
        { id: 'ai', name: 'AI 應用', icon: Brain, url: '/admin/ai', color: 'pink', bgColor: 'bg-pink-500', lightBg: 'bg-pink-50', textColor: 'text-pink-600' },
        { id: 'team', name: '團隊開發', icon: Users, url: '/admin/dev-team', color: 'teal', bgColor: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600' },
        { id: 'go-user', name: '前往使用者頁面', icon: ArrowRightCircle, url: '/', color: 'bg-yellow-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-yellow-500' },
        { id: 'logout', name: '登出', icon: LogOut, url: 'logout', color: 'blue', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' }
    ];

    const logout = async () => {
        try {
            await api.post("/api/logout");   // 如果後端有做 token 作廢

        } catch (err) {
            console.error(err);
        } finally {
            // 不管 API 成功或失敗，都清除前端登入狀態
            localStorage.removeItem("token");
            setUser(null);
            delete api.defaults.headers.common["Authorization"];

            navigate("/");   // 🔥 導回首頁
        }
    };

    useEffect(() => {
        const path = location.pathname;
        const currentMenu = menuItems.find(item => path.includes(item.url));
        if (currentMenu) { setActiveMenu(currentMenu.id); }
    }, [location.pathname]);

    return (
        <>
            <div className="flex">
                <aside
                    className={`${sidebarOpen ? 'w-72' : 'w-0'
                        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden fixed top-16 h-[calc(100vh-4rem)] z-30`}
                >
                    <nav className="p-4">
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">主要功能</h3>
                            <div className="space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeMenu === item.id;
                                    const isRoute = item.url && item.url !== '#';

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setActiveMenu(item.id);
                                                if (item.id === "logout") {
                                                    logout();
                                                } else if (isRoute) {
                                                    navigate(item.url);
                                                    setSidebarOpen(false);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                                ? `${item.bgColor} text-white shadow-sm`
                                                : 'text-gray-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.textColor}`} />
                                                <span className="font-medium text-sm">{item.name}</span>
                                            </div>
                                            {isActive && <ChevronRight className="h-4 w-4" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </nav>
                </aside>
            </div>
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40" >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <span className="text-white font-bold text-sm">TC</span>
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">TCNR Class</div>
                                    <p className="text-xs text-gray-500">管理系統</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-4 py-2 border border-gray-200">
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="搜尋功能或內容..."
                                    className="bg-transparent border-none outline-none text-sm w-56 lg:w-76 text-gray-700 placeholder-gray-400"
                                />
                            </div>

                            <div className="p-2 rounded-lg hover:bg-slate-50 relative transition-colors">
                                <Bell className="h-5 w-5 text-gray-600" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                            </div>

                            <div className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                <Settings className="h-5 w-5 text-gray-600" />
                            </div>

                            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                            <div className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors hidden sm:block">
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-slate-700" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden lg:block">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </ >
    )
}
export default AdminNavbar;
