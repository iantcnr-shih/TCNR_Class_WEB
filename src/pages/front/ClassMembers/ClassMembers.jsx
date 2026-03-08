import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "@/api/axios";


// const ROLES = ["全部", "前端開發", "後端開發", "全端開發", "Figma UI/UX", "Python","資料庫", "行動開發", "資安"];

const colorMap = {
    red: { ring: "ring-red-200", bg: "bg-red-50", text: "text-red-700", badge: "bg-red-100 text-red-700" },
    blue: { ring: "ring-blue-200", bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-700" },
    emerald: { ring: "ring-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-700" },
    pink: { ring: "ring-pink-200", bg: "bg-pink-50", text: "text-pink-700", badge: "bg-pink-100 text-pink-700" },
    indigo: { ring: "ring-indigo-200", bg: "bg-indigo-50", text: "text-indigo-700", badge: "bg-indigo-100 text-indigo-700" },
    violet: { ring: "ring-violet-200", bg: "bg-violet-50", text: "text-violet-700", badge: "bg-violet-100 text-violet-700" },
    amber: { ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    teal: { ring: "ring-teal-200", bg: "bg-teal-50", text: "text-teal-700", badge: "bg-teal-100 text-teal-700" },
    cyan: { ring: "ring-cyan-200", bg: "bg-cyan-50", text: "text-cyan-700", badge: "bg-cyan-100 text-cyan-700" },
    rose: { ring: "ring-rose-200", bg: "bg-rose-50", text: "text-rose-700", badge: "bg-rose-100 text-rose-700" },
    stone: { ring: "ring-stone-200", bg: "bg-stone-50", text: "text-stone-700", badge: "bg-stone-100 text-stone-700" },
    purple: { ring: "ring-purple-200", bg: "bg-purple-50", text: "text-purple-700", badge: "bg-purple-100 text-purple-700" },
    orange: { ring: "ring-orange-200", bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100 text-orange-700" },
};

/* ─── GitHub Icon SVG ──────────────────────────────────────────────── */
const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
);


/* ─── Page Header ──────────────────────────────────────────────────── */
const PageHeader = ({ title, subtitle }) => (
    <div className="">
        <div className="w-10 h-1 bg-orange-500 rounded-full mb-3" />
        <h1 className="text-xl md:text-2xl font-black text-red-900 mb-1">{title}</h1>
        <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
    </div>
);

/* ─── Member Modal ─────────────────────────────────────────────────── */
const MemberModal = ({ member, colorKey, onClose, onGithub, skillLists }) => {
    if (!member) return null;
    const c = colorMap[colorKey] || colorMap.blue;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(20,20,20,0.72)", backdropFilter: "blur(3px)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden"
                style={{ animation: "modalIn 0.2s cubic-bezier(.4,0,.2,1)" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Top accent bar */}
                <div className={`h-1.5 w-full ${c.bg} ${c.ring}`} style={{ background: "" }}>
                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-red-500" />
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 text-xs font-bold transition-all"
                >
                    ✕
                </button>

                <div className="p-6 sm:p-8">
                    {/* Avatar + Info — horizontal layout like profile card */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-5">
                        {/* Avatar */}
                        <div className="flex-shrink-0 flex">
                            <div className={`mx-auto  w-25 h-full min-h-[100px] rounded-2xl ${c.bg} ring-4 ${c.ring} flex items-center justify-center text-4xl shadow-sm`}>
                                {member.avatar}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left min-w-0 flex flex-col justify-between">
                            {/* Name + batch badge */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
                                <h2 className="text-xl font-black text-gray-900 leading-tight">
                                    {member.user_en_name || member.user_nick_name || "學員"}
                                </h2>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold self-center ${c.badge}`}>
                                    {member.position_name}
                                </span>
                            </div>

                            {/* Title */}
                            {member.user_title && (
                                <p className="text-sm text-gray-500 mt-3 sm:mt-1">{member.user_title}</p>
                            )}

                            {/* GitHub button */}
                            <div className="w-full flex">
                                <div className={`flex mt-3 sm:mt-0 mx-auto sm:mx-0 gap-1.5 text-xs font-semibold cursor-pointer
                            ${member.github
                                        ? "bg-rose-100 text-rose-500 hover:bg-rose-200 hover:text-rose-700"
                                        : "bg-gray-100 text-gray-400 cursor-default"
                                    } px-4 py-2.5 rounded-xl transition-all duration-150`}
                                    onClick={() => member.github && onGithub(member.github)}
                                >
                                    <GitHubIcon />
                                    GitHub 作品集
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="text-center sm:text-left min-w-0 w-full">

                            {/* Bio */}
                            {member.bio && (
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                    {member.bio.length > 100 ? `${member.bio.slice(0, 100)}…` : member.bio}
                                </p>
                            )}

                            {/* Skills */}
                            {member.skills?.length > 0 && (
                                <div className="mt-6 w-full">
                                    {/* Skill Tags */}
                                    <div className="flex flex-wrap gap-2 bg-[rgb(255,250,246)] p-3 rounded-xl border border-[rgb(240,220,215)]">
                                        {member.skills
                                            .map(skillId => skillLists.find(s => s.id === skillId))
                                            .filter(Boolean)
                                            .map((skill, idx) => (
                                                <span key={idx} className="bg-white text-[rgb(84,21,21)] text-xs px-3 py-1.5 rounded-lg font-semibold
                                                        shadow-sm border border-[rgb(230,210,205)]
                                                        hover:bg-[rgb(84,21,21)] hover:text-white
                                                        transition-all duration-200"
                                                >
                                                    {skill.skill_name}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(-20px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

/* ─── Main Component ───────────────────────────────────────────────── */
export default function ClassMembers() {
    const [search, setSearch] = useState("");
    const [activeRole, setActiveRole] = useState("全部");
    const [classMembers, setClassMembers] = useState([]);
    const [positionList, setPositionList] = useState([]);

    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedColorKey, setSelectedColorKey] = useState("blue");

    const [skillLists, setSkillLists] = useState([]);
    /* ─── Member Card ──────────────────────────────────────────────────── */
    
    const MemberCard = ({ member, index }) => {
        const colorKeys = Object.keys(colorMap);
        const colorKey = colorKeys[index % colorKeys.length];
        const c = colorMap[colorKey] || colorMap.blue;

        const handleClick = () => {
            setSelectedMember(member);
            setSelectedColorKey(colorKey);
        };

        return (
            <div
                onClick={handleClick}
                className="cursor-pointer bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            >
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full ${c.bg} ring-4 ${c.ring} flex items-center justify-center text-3xl mx-auto mb-3`}>
                    {member.avatar}
                </div>

                {/* Name */}
                <p className={`text-lg font-black ${c.text} leading-tight`}>{member.user_en_name || member.user_nick_name || "學員"}</p>

                {/* Role badge */}
                <span className={`text-xs mt-2 px-3 py-1 rounded-full font-semibold ${c.badge} mb-3 inline-block`}>
                    {member.position_name}
                </span>

                {/* Title / Seat */}
                <p className="text-xs text-gray-500 mb-4 leading-relaxed flex-1">
                    {member.user_title ? member.user_title : `座位${member.seat_number}號`}
                </p>

                {/* GitHub link */}
                <div
                    className={`flex items-center gap-1.5 text-xs font-semibold ${member.github ? "bg-rose-100 text-rose-500 hover:text-rose-900 hover:bg-rose-200" : "bg-gray-100 text-gray-400"} px-3 py-1.5 rounded-lg transition-all duration-150 w-full justify-center`}
                    onClick={e => {
                        e.stopPropagation(); // 避免觸發 modal
                        if (member.github) gotogithub(member.github);
                    }}
                >
                    <GitHubIcon />
                    GitHub 作品集
                </div>
            </div>
        );
    };

    /* ─── Stats Bar ────────────────────────────────────────────────────── */
    const StatsBar = ({ total, filtered }) => {
        const roleCount = {};
        classMembers.forEach(m => { roleCount[m.position_name] = (roleCount[m.position_name] || 0) + 1; });
        const topRole = Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0] || ["-", 0];

        return (
            <div className="flex w-full gap-3">
                {[
                    { label: "班級總人數", value: total, icon: "👥" },
                    { label: "顯示中", value: filtered, icon: "🔍" },
                    { label: "最多人", value: topRole[0], icon: "🏆" },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-center rounded-xl p-4 shadow-sm border border-gray-100">
                        <div>
                            <div className="flex">
                                <div className="text-md">{s.icon}</div>
                                <div className="text-md font-black text-red-900">{s.value}</div>
                            </div>
                            <div className="flex">
                                <div className="mx-auto text-xs text-gray-400">{s.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const filtered = classMembers.filter(m => {
        const matchRole = activeRole === "全部" || m.position_name === activeRole;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (m.user_name || "").toLowerCase().includes(q) ||
            (m.user_en_name || "").toLowerCase().includes(q) ||
            (m.user_nick_name || "").toLowerCase().includes(q) ||
            (m.user_title || "").toLowerCase().includes(q) ||
            (m.position_name || "").toLowerCase().includes(q);
        return matchRole && matchSearch;
    });

    const gotogithub = (githubUrl) => {
        if (githubUrl) {
            window.open(githubUrl, "_blank");
        } else {
            Swal.fire({
                title: "此會員沒有 GitHub 網址！",
                icon: "warning",
            });
        }
    }

    useEffect(() => {
        const fetchGetAllStudents = async () => {
            try {
                const res = await api.get("/api/GetAllStudents");
                if (res.status === 200) {
                    const allStudent = res.data || []
                    setClassMembers(allStudent);
                }
            } catch (error) {
                console.log("GetAllStudents:", error);
            }
        }
        fetchGetAllStudents();
        const fetchGetPositions = async () => {
            try {
                const res = await api.get("/api/GetPositions");
                if (res.status === 200) {
                    const positions = res.data.AllPositions
                    setPositionList(positions)
                }
            } catch (error) {
                console.log("getSkills error:", error);
            }
        }
        fetchGetPositions();
        const fetchGetSkills = async () => {
            try {
                const res = await api.get("/api/getAllSkills");
                if (res.status === 200) {
                    const allskills = res.data.AllSkills
                    setSkillLists(allskills)
                }
            } catch (error) {
                console.log("getSkills error:", error);
            }
        }
        fetchGetSkills();
    }, [])

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="block md:flex w-full mb-4">
                <div className="">
                    <PageHeader
                        title="班級成員"
                        subtitle={`共 ${classMembers.length} 位成員 · 認識你的同學，建立連結`}
                    />
                </div>
                <div className="ml-auto px-5 hidden md:flex">
                    <StatsBar total={classMembers.length} filtered={filtered.length} />
                </div>
            </div>
            {/* Search + Filter */}
            <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 mb-6 flex flex-col lg:flex-row gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="搜尋成員名字、技術方向…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all"
                    />
                    {search && (
                        <div
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs font-bold"
                        >✕</div>
                    )}
                </div>

                {/* Role filter — scrollable row */}
                <div className="flex flex-wrap gap-1.5 pb-1 sm:pb-0">
                    <div
                        onClick={() => setActiveRole("全部")}
                        className={`flex flex-shrink-0 items-center justify-center cursor-pointer text-xs px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-150 ${activeRole === "全部"
                            ? "bg-red-500 text-white shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                    >
                        全部
                    </div>
                    {positionList.map(position => (
                        <div
                            key={position.id}
                            onClick={() => setActiveRole(position.position_name)}
                            className={`flex flex-shrink-0 items-center justify-center cursor-pointer text-xs px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-150 ${activeRole === position.position_name
                                ? "bg-red-500 text-white shadow-sm"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                        >
                            {position.position_name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Member Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* {filtered.map((m, i) => <MemberCard key={m.user_id} member={m} index={i} />)} */}
                    {filtered.map((m, i) => (
                        <MemberCard key={m.user_id} member={m} index={i} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="font-bold text-gray-500">找不到符合的成員</p>
                    <p className="text-xs text-gray-400 mt-1">試試其他關鍵字或清除篩選條件</p>
                    <button
                        onClick={() => { setSearch(""); setActiveRole("全部"); }}
                        className="mt-4 text-xs px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                    >
                        清除所有篩選
                    </button>
                </div>
            )}

            {/* Result count */}
            {filtered.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-6">
                    顯示 {filtered.length} / {classMembers.length} 位成員
                </p>
            )}

            {/* Member Modal */}
            <MemberModal
                member={selectedMember}
                colorKey={selectedColorKey}
                skillLists={skillLists}
                onClose={() => setSelectedMember(null)}
                onGithub={gotogithub}
            />
        </div>
    );
}
