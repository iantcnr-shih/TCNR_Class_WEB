import React, { useState, useEffect } from 'react';
import { Newspaper, Utensils, Sparkles, Calendar, MessageSquare, BarChart3, Brain, Users, Menu, X, Bell, Search, User, Settings, ChevronRight, ChevronLeft, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import api from "@/api/axios";

const AdminMealOrder = () => {

  const [systemMode, setSystemMode] = useState("base");
  const [today, setToday] = useState([]);
  const [userIP, setUserIP] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  const menuItems = [
    { id: 'latest-news', name: '最新資訊', icon: Newspaper, url: '#latest-news', color: 'blue', bgColor: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600' },
    { id: 'meal-order', name: '餐飲管理', icon: Utensils, url: '#meal-order', color: 'orange', bgColor: 'bg-orange-500', lightBg: 'bg-orange-50', textColor: 'text-orange-600' },
    { id: 'environment', name: '環境管理', icon: Sparkles, url: '#environment', color: 'emerald', bgColor: 'bg-emerald-500', lightBg: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { id: 'class-meeting', name: '班務會議', icon: Calendar, url: '#class-meeting', color: 'purple', bgColor: 'bg-purple-500', lightBg: 'bg-purple-50', textColor: 'text-purple-600' },
    { id: 'tech-forum', name: '知識論壇', icon: MessageSquare, url: '#tech-forum', color: 'cyan', bgColor: 'bg-cyan-500', lightBg: 'bg-cyan-50', textColor: 'text-cyan-600' },
    { id: 'data-analysis', name: '數據分析', icon: BarChart3, url: '#data-analysis', color: 'indigo', bgColor: 'bg-indigo-500', lightBg: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { id: 'ai', name: 'AI 應用', icon: Brain, url: '#ai', color: 'pink', bgColor: 'bg-pink-500', lightBg: 'bg-pink-50', textColor: 'text-pink-600' },
    { id: 'team', name: '團隊開發', icon: Users, url: '#team', color: 'teal', bgColor: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600' },
  ];

  const getContentForMenu = (menuId) => {
    const content = {
      'latest-news': {
        title: '最新資訊',
        description: '系統動態與重要通知',
        items: [
          { name: '系統更新通知', status: 'new', date: '2024-02-15' },
          { name: '重要公告', status: 'important', date: '2024-02-14' },
          { name: '活動資訊', status: 'normal', date: '2024-02-13' },
          { name: '政策更新', status: 'normal', date: '2024-02-12' },
          { name: '維護通知', status: 'normal', date: '2024-02-11' },
          { name: '功能上線', status: 'new', date: '2024-02-10' }
        ]
      },
      'meal-order': {
        title: '餐飲管理',
        description: '餐點訂購與飲食安排',
        items: [
          { name: '今日菜單', status: 'active', date: '2024-02-15' },
          { name: '訂餐記錄', status: 'normal', date: '2024-02-15' },
          { name: '飲食偏好設定', status: 'normal', date: '2024-02-14' },
          { name: '營養分析', status: 'normal', date: '2024-02-13' },
          { name: '供應商管理', status: 'normal', date: '2024-02-12' },
          { name: '費用統計', status: 'normal', date: '2024-02-11' }
        ]
      },
      'environment': {
        title: '環境管理',
        description: '環境清潔與維護',
        items: [
          { name: '清潔排程', status: 'active', date: '2024-02-15' },
          { name: '環境檢查', status: 'normal', date: '2024-02-14' },
          { name: '設備維護', status: 'normal', date: '2024-02-13' },
          { name: '物資管理', status: 'normal', date: '2024-02-12' },
          { name: '品質評估', status: 'normal', date: '2024-02-11' },
          { name: '改善建議', status: 'normal', date: '2024-02-10' }
        ]
      },
      'class-meeting': {
        title: '班務會議',
        description: '會議安排與記錄',
        items: [
          { name: '會議日程', status: 'active', date: '2024-02-15' },
          { name: '會議記錄', status: 'normal', date: '2024-02-14' },
          { name: '待辦事項', status: 'important', date: '2024-02-13' },
          { name: '決議追蹤', status: 'normal', date: '2024-02-12' },
          { name: '參會人員', status: 'normal', date: '2024-02-11' },
          { name: '會議室預約', status: 'normal', date: '2024-02-10' }
        ]
      },
      'tech-forum': {
        title: '知識論壇',
        description: '技術交流與知識分享',
        items: [
          { name: '熱門話題', status: 'active', date: '2024-02-15' },
          { name: '我的文章', status: 'normal', date: '2024-02-14' },
          { name: '收藏內容', status: 'normal', date: '2024-02-13' },
          { name: '專家問答', status: 'normal', date: '2024-02-12' },
          { name: '學習資源', status: 'normal', date: '2024-02-11' },
          { name: '技術分享', status: 'new', date: '2024-02-10' }
        ]
      },
      'data-analysis': {
        title: '數據分析',
        description: '數據統計與分析報表',
        items: [
          { name: '數據儀表板', status: 'active', date: '2024-02-15' },
          { name: '統計報表', status: 'normal', date: '2024-02-14' },
          { name: '趨勢分析', status: 'normal', date: '2024-02-13' },
          { name: '績效指標', status: 'normal', date: '2024-02-12' },
          { name: '預測模型', status: 'normal', date: '2024-02-11' },
          { name: '數據匯出', status: 'normal', date: '2024-02-10' }
        ]
      },
      'ai': {
        title: 'AI 應用',
        description: '人工智慧與機器學習',
        items: [
          { name: '模型訓練', status: 'active', date: '2024-02-15' },
          { name: '預測分析', status: 'normal', date: '2024-02-14' },
          { name: 'AI 工具', status: 'new', date: '2024-02-13' },
          { name: '智能推薦', status: 'normal', date: '2024-02-12' },
          { name: '自動化流程', status: 'normal', date: '2024-02-11' },
          { name: '效能優化', status: 'normal', date: '2024-02-10' }
        ]
      },
      'team': {
        title: '團隊開發',
        description: '團隊協作與專案管理',
        items: [
          { name: '專案列表', status: 'active', date: '2024-02-15' },
          { name: '任務分配', status: 'important', date: '2024-02-14' },
          { name: '團隊成員', status: 'normal', date: '2024-02-13' },
          { name: '進度追蹤', status: 'normal', date: '2024-02-12' },
          { name: '協作工具', status: 'normal', date: '2024-02-11' },
          { name: '績效評估', status: 'normal', date: '2024-02-10' }
        ]
      }
    };
    return content[menuId];
  };

  const currentContent = getContentForMenu("meal-order");


  const getStatusBadge = (status) => {
    const badges = {
      new: 'bg-blue-100 text-blue-700 border border-blue-200',
      important: 'bg-red-100 text-red-700 border border-red-200',
      active: 'bg-green-100 text-green-700 border border-green-200',
      normal: 'bg-gray-100 text-gray-700 border border-gray-200'
    };
    const labels = {
      new: '新',
      important: '重要',
      active: '進行中',
      normal: '一般'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const activeMenuItem = menuItems.find(item => item.id === "meal-order");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滾動
    }); // 滾到最上方
    const fetchUserIP = async () => {
      try {
        const res = await api.get("/api/getUserIP");
        if (res.status === 200) {
          if (Array.isArray(today) && today.length === 0) {
            setToday(res.data.today);  // 設置今天的日期與星期
          }
          setUserIP(res.data.user_ip);
        }
      } catch (err) {
        console.error(err);
        setUserIP("未知");
      }
    };
    fetchUserIP();
  }, []);

  useEffect(() => {
    if (userIP && userIP !== "未知") {
      // 提取 IP 最後一段數字
      const lastSegment = userIP.split('.').pop(); // 取得最後一個數字
      const seatNo = parseInt(lastSegment) - 1;  // 加 1
      setSeatNumber(seatNo);
    }
  }, [userIP])

  return (
    <div className="d-block min-h-screen bg-slate-50">
      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 lg:ml-0`}>
          {/* Header Section */}
          <div className="bg-white border-b border-gray-200 px-6 lg:px-8 py-6">
            <div className="flex">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${activeMenuItem?.bgColor} rounded-xl shadow-sm`}>
                    {React.createElement(activeMenuItem?.icon, { className: "h-6 w-6 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">{currentContent?.title}</h2>
                    <p className="text-sm text-gray-600 mt-0.5">{currentContent?.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex ml-auto items-center justify-between">
                {systemMode === "base" &&
                  <div className={`hidden sm:flex ml-auto mr-2 px-4 py-2 ${activeMenuItem?.bgColor} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-lg hover:scale-105`}
                    onClick={() => setSystemMode("meal")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>今日點餐管理</span>
                  </div>
                }
                {systemMode === "meal" &&
                  <div className={`hidden sm:flex ml-auto mr-2 px-4 py-2 ${activeMenuItem?.bgColor} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-lg hover:scale-105`}
                    onClick={() => setSystemMode("base")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>回系統概況</span>
                  </div>
                }
                <div className={`px-4 py-2 ${activeMenuItem?.bgColor} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center gap-2 shadow-sm hover:scale-105`}>
                  <span>新增項目</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="flex sm:hidden mt-4 mb-[-0.5rem] ml-auto items-center justify-between">
              {systemMode === "base" &&
                <div className={`mr-auto px-4 py-2 ${activeMenuItem?.bgColor} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-lg hover:scale-105`}
                  onClick={() => setSystemMode("meal")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>今日點餐管理</span>
                </div>
              }
              {systemMode === "meal" &&
                <div className={`sm:ml-auto mr-2 px-4 py-2 ${activeMenuItem?.bgColor} text-white rounded-lg hover:opacity-90 transition-all text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-lg hover:scale-105`}
                  onClick={() => setSystemMode("base")}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>回系統概況</span>
                </div>
              }
            </div>
          </div>
          {systemMode === "base" &&
            <div className="px-6 lg:px-8 py-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">+12%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">1,234</div>
                  <div className="text-sm text-gray-600 mt-1">總訪問次數</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">+8%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">856</div>
                  <div className="text-sm text-gray-600 mt-1">活躍用戶</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-orange-500 rounded-lg shadow-sm">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">23 項</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">23</div>
                  <div className="text-sm text-gray-600 mt-1">待處理事項</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">100%</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">正常</div>
                  <div className="text-sm text-gray-600 mt-1">系統狀態</div>
                </div>
              </div>

              {/* Content Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-slate-900">項目列表</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">項目名稱</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">狀態</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">日期</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentContent?.items.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 ${activeMenuItem?.bgColor} rounded-full`}></div>
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{item.date}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`text-sm ${activeMenuItem?.textColor} hover:opacity-70 font-medium inline-flex items-center gap-1 transition-opacity`}>
                              查看詳情
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
          {systemMode === "meal" &&
            <div className="px-6 lg:px-8 py-6">
              <div className="mb-8 max-w-2xl">
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100 p-5 hover:shadow-md transition-shadow">
                  <div>
                    <div className="
                      inline-block
                      bg-[rgb(255,239,234)]
                      border
                      border-[rgba(224,92,42,0.25)]
                      text-[rgb(84,39,24)]
                      text-xs
                      px-[14px]
                      py-1
                      rounded-full
                      font-medium
                    ">📅 {today.date}　{today.day}</div>
                  </div>
                  {/* <div id='abc'>
                    <div>
                      今日點餐總覽 <span>switch</span>
                    </div>
                    <div>
                      餐點啟用狀態 <span>switch</span>
                    </div>
                    <div>
                      飲料啟用狀態 <span>switch</span>
                    </div>
                    <div>
                      點餐收費值日生 (座號) <span><input type="number" /></span>
                    </div>
                    <div>
                      飲料揪團網址 <span><input type="text" /></span>
                    </div>
                    <div>
                      餐點種類 <span><select></select></span>
                    </div>
                    <div>
                      總體餐點次數 <span><input type="number" /></span>
                    </div>
                  </div> */}
                  <div className=" mt-6 space-y-5 text-sm ">
                    {/* 標題 */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-800">
                        今日點餐設定
                      </h3>
                      <span className="text-xs text-gray-400">
                        今日有效
                      </span>
                    </div>

                    {/* 設定清單 */}
                    <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white">
                      {/* 今日點餐總覽 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">今日點餐總覽</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className=" w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                      </div>

                      {/* 餐點啟用狀態 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">餐點啟用狀態</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className=" w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                      </div>

                      {/* 飲料啟用狀態 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">飲料啟用狀態</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className=" w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-orange-500 transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                      </div>

                      {/* 點餐收費值日生 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">點餐收費值日生（座號）</span>
                        <input
                          type="number"
                          min={1}
                          max={29}
                          step={1}
                          defaultValue={25}
                          placeholder="例：25"
                          className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right focus:border-orange-400 focus:outline-none"

                        />
                      </div>

                      {/* 飲料揪團網址 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">飲料揪團網址：</span>
                        <input
                          type="text"
                          className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-orange-400 focus:outline-none"
                          placeholder="貼上連結"
                        />
                      </div>

                      {/* 餐點種類 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">餐點種類</span>
                        <select className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-orange-400 focus:outline-none">
                          <option value="1">午餐</option>
                          <option value="2">晚餐</option>
                        </select>
                      </div>

                      {/* 總體餐點次數 */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-gray-700">總體餐點次數</span>
                        <span className='ml-auto'>
                          第<input
                            type="number"
                            min={1}
                            max={10}
                            step={1}
                            defaultValue={1}
                            className="w-10 rounded-md border border-gray-300 mx-1 px-2 py-1 text-right focus:border-orange-400 focus:outline-none"
                          /> 輪點餐
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </main>
      </div>
    </div>
  );
};

export default AdminMealOrder;