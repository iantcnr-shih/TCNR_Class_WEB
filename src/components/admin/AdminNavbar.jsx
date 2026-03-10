// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { useAdminUser } from "@/components/admin/AdminUserProvider";
import { Newspaper, Utensils, Sparkles, Calendar, MessageSquare, BarChart3, Brain, Users, Menu, X, Bell, Search, User, Settings, ChevronRight, TrendingUp, Clock, CheckCircle, ArrowRightCircle, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "@/api/axios";

// Navbar Component
const AdminNavbar = () => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const userdropdownRef = useRef(null);
    const { user, setUser } = useAdminUser();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const [showAdminMenu, setShowAdminMenu] = useState(false);
    const menuItems = [
        { id: 'latest-news', name: '最新資訊', icon: Newspaper, url: '/admin/news', color: 'blue', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
        { id: 'meal-order', name: '餐飲管理', icon: Utensils, url: '/admin/meal-order', color: 'orange', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
        { id: 'environment', name: '環境管理', icon: Sparkles, url: '/admin/environment', color: 'emerald', bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { id: 'class-meeting', name: '班務會議', icon: Calendar, url: '/admin/class-meeting', color: 'purple', bgColor: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
        { id: 'tech-forum', name: '知識論壇', icon: MessageSquare, url: '/admin/tech-forum', color: 'cyan', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', textColor: 'text-cyan-600' },
        { id: 'data-analysis', name: '數據分析', icon: BarChart3, url: '/admin/data-analysis', color: 'indigo', bgColor: 'bg-indigo-500', lightBg: 'bg-indigo-50', textColor: 'text-indigo-600' },
        { id: 'ai', name: 'AI 應用', icon: Brain, url: '/admin/ai', color: 'pink', bgColor: 'bg-pink-500', lightBg: 'bg-pink-50', textColor: 'text-pink-600' },
        { id: 'team', name: '開發團隊', icon: Users, url: '/dev-team', color: 'teal', bgColor: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600' },
        { id: 'go-user', name: '前往使用者頁面', icon: ArrowRightCircle, url: '/', color: 'bg-yellow-500', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-yellow-500' },
        { id: 'login', name: '登入', icon: LogIn, url: '/login', color: 'green', bgColor: 'bg-green-500', lightBg: 'bg-green-50', textColor: 'text-green-600' },
        { id: 'logout', name: '登出', icon: LogOut, url: 'logout', color: 'blue', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' }
    ];

    const AdminMenuItems = [
        { name: "會員資料", path: "/profile", roles: ["admin", "student"] },
        { name: "前往使用者頁面", path: "/", roles: ["admin"] },
        { name: "登出", action: "logout", roles: [""] },
    ];


    const logout = async () => {
        try {
            await api.post("/api/logout");   // 如果後端有做 token 作廢
            await Swal.fire({
                title: "登出成功",
                icon: "success",
                confirmButtonText: "確定",
            });
        } catch (err) {
            console.error(err);
            await Swal.fire({
                title: "登出失敗",
                icon: "error",
                confirmButtonText: "確定",
            });
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

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setTimeout(() => {
                    setSidebarOpen(false);
                }, 0);
            }
            if (userdropdownRef.current && !userdropdownRef.current.contains(event.target)) {
                setTimeout(() => {
                    setShowAdminMenu(false);
                }, 0);
            }
        }
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="flex">
                <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden fixed top-16 h-[calc(100vh-4rem)] z-30`}>
                    <nav className="p-4">
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">主要功能</h3>
                            <div className="space-y-1">
                                {menuItems
                                    .filter(item => {
                                        if (user) {
                                            return item.id !== "login";   // ✅ return boolean
                                        } else {
                                            return item.id !== "logout";  // ✅ return boolean
                                        }
                                    })
                                    .map(item => {
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
                                                className={[
                                                    "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                                                    isActive ? `${item.bgColor} text-white shadow-sm` : 'text-gray-700 hover:bg-slate-50',
                                                    (item.id === "go-user" || item.id === "login" || item.id === "logout") && "block sm:hidden"
                                                ].filter(Boolean).join(" ")}
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
            </div >
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40"
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <div
                                ref={dropdownRef}
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

                            <div
                                ref={userdropdownRef}
                                className="relative flex items-center rounded-lg transition-colors hidden sm:block"
                            >
                                {user ? (
                                    <>
                                        {/* <div onClick={() => setShowAdminMenu(prev => !prev)}>
                                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-slate-700" />
                                            </div>
                                            <span className="text-center text-sm font-medium text-gray-700 hidden lg:block">{user?.user?.user_name ? `${user.user.user_name.slice(-2)}` : "Admin"}</span>
                                        </div>
                                        {showAdminMenu &&
                                            <div className={`
                                                    absolute right-0 mt-2 w-48 bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg rounded-lg py-2 z-50
                                                    transition-all duration-300 ease-out transform origin-top-right
                                                    ${AdminMenuItems ? "opacity-100 scale-100 translate-y-0"
                                                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                                                `}
                                            >
                                                {AdminMenuItems
                                                    .filter(item => item.roles.includes("") || item.roles.some(role => user?.user?.roles?.includes(role)))
                                                    .map(item => (
                                                        <div
                                                            key={item.name}
                                                            className="px-4 py-2 text-[rgb(42,30,173)] hover:bg-gray-200 hover:text-[rgb(1,6,53)] cursor-pointer transition-colors"
                                                            onClick={() => {
                                                                if (item.action === "logout") {
                                                                    logout();
                                                                } else {
                                                                    if (item.path && item.path.startsWith("#")) {
                                                                        Swal.fire({
                                                                            title: "功能尚未實裝, 敬請期待",
                                                                            icon: "warning",
                                                                        });
                                                                    } else {
                                                                        navigate(item.path);
                                                                        window.scrollTo({
                                                                            top: 0,
                                                                            behavior: "smooth"
                                                                        });
                                                                    }
                                                                }
                                                                setShowAdminMenu(false);
                                                            }}
                                                        >
                                                            {item.name}
                                                        </div>
                                                    ))}
                                            </div>
                                        } */}
                                        <div className="relative cursor-pointer"
                                            ref={userdropdownRef}
                                            onClick={() => setShowAdminMenu(prev => !prev)}
                                        >
                                            <div
                                                className=""
                                            >
                                                {user?.user?.avatar ? (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[rgb(210,225,250)] to-[rgb(147,172,243)] text-white flex items-center justify-center font-bold border-2 border-blue-400">
                                                        <span className='scale-[1.2]'>{user.user.avatar}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                                                            <User className="h-4 w-4 text-slate-700" />
                                                        </div>
                                                        <span className="text-center text-sm font-medium text-gray-700 hidden lg:block">{user?.user?.user_name ? `${user.user.user_name.slice(-2)}` : "Admin"}</span>
                                                    </>
                                                )}
                                            </div>

                                            {showAdminMenu &&
                                                <div className={`
                                                    absolute right-0 mt-2 w-48 bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg rounded-lg py-2 z-50
                                                    transition-all duration-300 ease-out transform origin-top-right
                                                    ${AdminMenuItems ? "opacity-100 scale-100 translate-y-0"
                                                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                                                `}
                                                >
                                                    {AdminMenuItems
                                                        .filter(item => item.roles.includes("") || item.roles.some(role => user?.user?.roles?.includes(role)))
                                                        .map(item => (
                                                            <div
                                                                key={item.name}
                                                                className="px-4 py-2 text-[rgb(42,30,173)] hover:bg-gray-200 hover:text-[rgb(1,6,53)] cursor-pointer transition-colors"
                                                                onClick={() => {
                                                                    if (item.action === "logout") {
                                                                        logout();
                                                                    } else {
                                                                        if (item.path && item.path.startsWith("#")) {
                                                                            Swal.fire({
                                                                                title: "功能尚未實裝, 敬請期待",
                                                                                icon: "warning",
                                                                            });
                                                                        } else {
                                                                            navigate(item.path);
                                                                            window.scrollTo({
                                                                                top: 0,
                                                                                behavior: "smooth"
                                                                            });
                                                                        }
                                                                    }
                                                                    setShowAdminMenu(false);
                                                                }}
                                                            >
                                                                {item.name}
                                                            </div>
                                                        ))}
                                                </div>
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <div className='text-sm'>
                                        <span className='mx-1 px-2 py-3 hover:text-[rgb(53,44,124)] hover:font-bold hover:bg-[rgb(230,239,247)] rounded-md'
                                            onClick={() => navigate("/")}
                                        >使用者頁面</span>
                                        |
                                        <span className='mx-1 px-2 py-3 hover:text-[rgb(53,44,124)] hover:font-bold hover:bg-[rgb(230,239,247)] rounded-md'
                                            onClick={() => navigate("/login")}
                                        >登入</span>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </nav >
        </ >
    )
}
export default AdminNavbar;
