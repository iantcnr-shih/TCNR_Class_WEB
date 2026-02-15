// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn, LogOut, Utensils, Calendar, Sparkles, MessageSquare, Briefcase, BarChart3, Brain, ChevronDown, User, Users, ArrowRightCircle, Newspaper, LayoutDashboard, BookOpen, Code2, ShieldCheck, TrendingUp, Megaphone, GitBranch } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";

// Navbar Component
const Navbar = () => {
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);

    const navItems = [
        {
            name: '最新資訊',
            icon: Briefcase,
            url: '#news',
            dropdown: [
                { name: '職涯發展', url: '#job-info' },
                { name: '課程公告', url: '#campus-news' },
            ]
        },
        { name: '餐飲管理', icon: Utensils, url: '#meal-order' },
        { name: '環境管理', icon: Sparkles, url: '#cleaning' },
        { name: '班務會議', icon: Calendar, url: '#class-meeting' },
        { name: '知識論壇', icon: MessageSquare, url: '#tech-forum' },

        { name: '數據分析', icon: BarChart3, url: '#data-analysis' },
        { name: 'AI 應用', icon: Brain, url: '#ml-zone' },
        { name: '團隊開發', icon: Users, url: '#team' },
        { name: '登入', icon: LogIn, url: '/login' },
        { name: '登出', icon: LogIn, url: 'logout' },
    ];

    const MobileMenuItems = [
        {
            name: '最新資訊',
            icon: Newspaper,
            url: '#news',
            color: 'text-[rgb(194,37,37)]',
            dropdown: [
                { name: '職涯發展', icon: TrendingUp, color: 'text-orange-600', url: '#job-info' },
                { name: '課程公告', icon: Megaphone, color: 'text-emerald-600', url: '#campus-news' },
            ]
        },
        {
            name: '平台功能',
            icon: LayoutDashboard,
            url: '#features',
            color: 'text-purple-600',
            dropdown: [
                { name: '餐飲管理', icon: Utensils, color: 'text-cyan-600', url: '#meal-order' },
                { name: '環境管理', icon: Sparkles, color: 'text-indigo-600', url: '#cleaning' },
                { name: '班務會議', icon: Calendar, color: 'text-pink-600', url: '#class-meeting' },
                { name: '知識論壇', icon: MessageSquare, color: 'text-blue-600', url: '#tech-forum' },
            ]
        },
        {
            name: '學習資源',
            icon: BookOpen,
            url: '#resources',
            color: 'text-teal-600',
            dropdown: [
                { name: '數據分析', icon: BarChart3, color: 'text-blue-600', url: '#data-analysis' },
                { name: 'AI 應用', icon: Brain, color: 'text-orange-600', url: '#ml-zone' },
            ]
        },
        {
            name: '關於我們',
            icon: Users,
            url: '#about',
            color: 'text-pink-600',
            dropdown: [
                { name: '團隊開發', icon: GitBranch, color: 'text-cyan-600', url: '#team' },
            ]
        },
        {
            name: '前往管理專區',
            icon: ShieldCheck,
            url: '/admin/home',
            color: 'text-yellow-600'
        },
        {
            name: '登入',
            icon: LogIn,
            url: '/login',
            color: 'text-green-600'
        },
        {
            name: '登出',
            icon: LogOut,
            url: 'logout',
            color: 'text-blue-900'
        },
    ];

    const menuItems = [
        { name: "個人資料", path: "/profile", roles: ["admin", "student"] },
        { name: "管理專區", path: "/admin/home", roles: ["admin"] },
        { name: "登出", action: "logout", roles: ["admin", "student"] },
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

            navigate("/login");   // 🔥 導回登入頁
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/api/user');
                let user = res.data;
                user.role = "admin";
                setUser(user);
            } catch (error) {
                console.log("user error:", error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setTimeout(() => {
                    setActiveDropdown(null);
                }, 0);
            }
        }
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
            <div className="mx-auto px-4 sm:px-6 py-3 lg:py-0 lg:px-8 
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
                                    <div className="text-xl font-bold text-[rgb(247,237,230)] tracking-tight">生成式AI與全端程式設計 <span className='hidden md:inline'>專業培訓管理平台</span></div>
                                    <div className="text-xs text-[rgb(242,182,168)] tracking-wide">Generative AI & Full-Stack Engineering <span className='hidden md:inline'>Management Platform</span></div>
                                </div>
                            </div>
                        </div>
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


                    {/* Mobile menu button */}
                    <div className="flex ml-auto items-center hidden lg:block text-[rgb(247,237,230)] p-3">
                        {!user ? (
                            <>
                                <span className='mx-1 px-2 py-1 hover:text-[rgb(124,44,58)] hover:bg-[rgb(247,237,230)] rounded-md'
                                    onClick={() => navigate("/admin/home")}
                                >管理專區</span>
                                |
                                <span className='mx-1 px-2 py-1 hover:text-[rgb(124,44,58)] hover:bg-[rgb(247,237,230)] rounded-md'
                                    onClick={() => navigate("/register")}
                                >註冊</span>
                                |
                                <span className='mx-1 px-2 py-1 hover:text-[rgb(124,44,58)] hover:bg-[rgb(247,237,230)] rounded-md'
                                    onClick={() => navigate("/login")}
                                >登入</span>
                            </>
                        ) : (
                            <div className="relative">
                                <div
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <div className="w-15 h-9 rounded-full bg-gradient-to-br from-[rgb(206,21,104)] to-[rgb(186,62,0)] text-white flex items-center justify-center font-bold">
                                        {/* {user.user_name?.charAt(0).toUpperCase()} */}
                                        <User className="h-6 w-8 text-white" />
                                    </div>

                                    <span className="hidden md:block">
                                        {user.user_name}
                                    </span>
                                </div>

                                {/* Dropdown with animation */}
                                <div className={`
                                        absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border
                                        transition-all duration-300 ease-out transform origin-top-right
                                        ${showMenu ? "opacity-100 scale-100 translate-y-0"
                                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                                    `}
                                >
                                    {menuItems
                                        .filter(item => item.roles.includes(user.role))
                                        .map(item => (
                                            <div
                                                key={item.name}
                                                className="px-4 py-2 text-[rgb(124,44,58)] hover:bg-gray-200 hover:text-[rgb(222,96,117)] cursor-pointer transition-colors"
                                                onClick={() => {
                                                    if (item.action === "logout") {
                                                        logout();
                                                    } else {
                                                        navigate(item.path);
                                                    }
                                                    setShowMenu(false);
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-between">
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-1">
                        {navItems.filter(item => item.name !== '登入' && item.name !== '登出')
                            .map((item) => (
                                <div key={item.name} className="relative group"
                                    onClick={() => navigate(item.url)}
                                >
                                    {item.dropdown ? (
                                        <>
                                            <div
                                                className="flex items-center px-4 py-2 text-sm font-medium text-[rgb(252,238,238)] hover:text-[rgb(98,32,32)] hover:bg-[rgb(252,238,238)] transition-colors rounded-md"
                                                onMouseEnter={() => setActiveDropdown(item.name)}
                                                ref={dropdownRef}
                                            >
                                                <item.icon className="w-4 h-4 mr-2" />
                                                {item.name}
                                                <ChevronDown className="w-3 h-3 ml-1" />
                                            </div>
                                            {activeDropdown === item.name && (
                                                <div
                                                    className="absolute top-full left-0 mt-2 px-2 w-48 bg-gradient-to-br from-[#9f3a4b] to-[#5e1f2b] rounded-lg shadow-lg py-2 z-50 border border-slate-200"
                                                >
                                                    {item.dropdown.map((subItem) => (
                                                        <div
                                                            key={subItem.name}
                                                            className="block px-4 py-2.5 text-sm text-[rgb(252,238,238)] hover:text-[rgb(98,32,32)] hover:bg-[rgb(252,238,238)] transition-colors rounded-md"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(subItem.url);
                                                                setActiveDropdown(null);
                                                            }}

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
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-white border-t border-slate-200">

                    <div className="h-1 mt-[-1px] bg-gradient-to-r from-[#FC801C] via-[#FFBDB0] to-[#FC801C]"></div>
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {/* {MobileMenuItems.map((item) => (
                            <div key={item.name}>
                                <div
                                    className="flex items-center px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md"
                                    onClick={() => navigate(item.url)}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </div>
                                {item.dropdown && (
                                    <div className="ml-8 space-y-1">
                                        {item.dropdown.map((subItem) => (
                                            <div
                                                key={subItem.name}
                                                className="block px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                                                onClick={() => navigate(subItem.url)}
                                            >
                                                {subItem.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))} */}
                        {MobileMenuItems
                            .filter((item) => {
                                if (item.name === "登入" && user) return false;
                                if (item.name === "登出" && !user) return false;
                                return true;
                            }).map((item, index) => {
                                const Icon = item.icon;
                                const isOpen = openMenu === index;

                                // 沒有 dropdown 的（例如登入 / 前往管理專區）
                                if (!item.dropdown) {
                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-3 px-4 py-3`}
                                            onClick={() => {
                                                if (item.url === "logout") {
                                                    logout();
                                                } else {
                                                    navigate(item.url);
                                                }
                                            }}
                                        >
                                            <Icon className={`w-5 h-5 ${item.color}`} />
                                            <span>{item.name}</span>
                                        </div>
                                    );
                                }

                                // 有 dropdown 的（大標題）
                                return (
                                    <div key={index} className="">

                                        {/* 大標題 */}
                                        <button
                                            onClick={() =>
                                                setOpenMenu(isOpen ? null : index)
                                            }
                                            className="w-full flex items-center justify-between px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">

                                                <Icon className={`w-5 h-5 text-[rgb(194,37,37)]`} />
                                                <span className="font-medium">{item.name}</span>
                                            </div>

                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </button>

                                        {/* 子選單 */}
                                        {isOpen && (
                                            <div className="bg-gray-50">
                                                {item.dropdown.map((subItem, subIndex) => {
                                                    const SubIcon = subItem.icon;

                                                    return (
                                                        <div
                                                            key={subIndex}
                                                            className="flex items-center gap-3 px-8 py-2 text-sm hover:bg-gray-100"
                                                        >
                                                            {SubIcon && <SubIcon className={`w-4 h-4 text-yellow-500`} />}
                                                            <span>{subItem.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
            {/* Accent Line */}
            <div className="h-1 bg-gradient-to-r from-[#FC801C] via-[#FFBDB0] to-[#FC801C]"></div>
        </nav>
    );
};

export default Navbar;