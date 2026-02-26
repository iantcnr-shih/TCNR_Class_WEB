// export default Navbar;
import React, { useState, useEffect } from 'react';
import { Newspaper, Utensils, Sparkles, Calendar, MessageSquare, BarChart3, Brain, Users, Menu, X, Bell, Search, User, Settings, ChevronRight, TrendingUp, Clock, CheckCircle, ArrowRightCircle, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

function AaminLeftSode() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
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

            navigate("/");
        }
    };

    useEffect(() => {
        const path = location.pathname;
        const currentMenu = menuItems.find(item => path.includes(item.url));
        if (currentMenu) { setActiveMenu(currentMenu.id); }
    }, [location.pathname]);

    return (
        <div className="flex">
            <aside
                className={`w-72 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden top-16 h-[calc(100vh-4rem)]`}
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
    )
}
export default AaminLeftSode;