"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Search, 
  User, 
  CheckCircle, 
  Activity, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  AlertCircle,
  Play,
  CheckCircle2,
  Circle,
  Hourglass,
  Loader2
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface AdminTodo {
  id: number;
  title: string;
  completed: boolean;
  total_duration: number;
  created_at: string;
  updated_at: string;
}

interface ActiveTodo {
  id: number;
  title: string;
  started_at: string;
}

interface GuestActivity {
  ip_address: string;
  total_todos: number;
  completed_todos: number;
  total_worked_seconds: number;
  active_todo: ActiveTodo | null;
  last_activity: string | null;
  todos: AdminTodo[];
}

export default function AdminTodoPage() {
  const [activities, setActivities] = useState<GuestActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load activities
  const fetchActivities = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: GuestActivity[] }>("dashboard/todos");
      if (res.success) {
        setActivities(res.data);
        setError(null);
      } else {
        setError("Failed to load user activity data.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Could not fetch data from the server.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // Poll for active timer ticking every 15 seconds to keep the dashboard fresh
    const interval = setInterval(() => {
      fetchActivities(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds to HH:MM:SS
  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0")
    ].join(":");
  };

  // Toggle user card expansion
  const toggleExpand = (ip: string) => {
    setExpandedUsers(prev => ({
      ...prev,
      [ip]: !prev[ip]
    }));
  };

  // Delete a specific todo task as admin
  const handleDeleteTodo = async (id: number, userIp: string) => {
    if (!window.confirm("Are you sure you want to delete this guest task? This will also delete its time logging history.")) return;
    
    setDeletingId(id);
    try {
      const res = await apiFetch<{ success: boolean; message: string }>(`dashboard/todos/${id}`, {
        method: "DELETE"
      });
      if (res.success) {
        // Optimistically update local state
        setActivities(prev => prev.map(user => {
          if (user.ip_address === userIp) {
            const updatedTodos = user.todos.filter(t => t.id !== id);
            const completedCount = updatedTodos.filter(t => t.completed).length;
            return {
              ...user,
              todos: updatedTodos,
              total_todos: updatedTodos.length,
              completed_todos: completedCount,
            };
          }
          return user;
        }).filter(user => user.total_todos > 0)); // Remove user from list if they have no tasks left
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete the task.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter activities by search query
  const filteredActivities = useMemo(() => {
    return activities.filter(user => {
      const matchIp = user.ip_address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTask = user.todos.some(todo => 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchIp || matchTask;
    });
  }, [activities, searchQuery]);

  // Global counts for cards
  const stats = useMemo(() => {
    let totalGuests = activities.length;
    let totalTasks = 0;
    let totalCompletedTasks = 0;
    let totalTimeTracked = 0;
    let activeTimersCount = 0;

    activities.forEach(user => {
      totalTasks += user.total_todos;
      totalCompletedTasks += user.completed_todos;
      totalTimeTracked += user.total_worked_seconds;
      if (user.active_todo) {
        activeTimersCount++;
      }
    });

    return {
      totalGuests,
      totalTasks,
      totalCompletedTasks,
      totalTimeTracked,
      activeTimersCount
    };
  }, [activities]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-10 px-2 md:px-6">
      {/* ================= Header ================= */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Guest Task & <span className="text-yellow-500">Time Analytics</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            Monitor real-time task completion and focus hours logged by portfolio visitors.
          </p>
        </div>
        <button 
          onClick={() => fetchActivities()}
          disabled={loading}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin text-yellow-500" /> : <Activity size={14} className="text-yellow-500" />}
          Refresh Logs
        </button>
      </header>

      {/* ================= Stats Grid ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Visitors Card */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-[50px] pointer-events-none" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Total Tracked Visitors</span>
          <span className="text-3xl font-black text-white block">{stats.totalGuests}</span>
          <div className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-wide">Unique IPs/Tokens</div>
        </div>

        {/* Focus Hours Card */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 blur-[50px] pointer-events-none" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Total Focus Logged</span>
          <span className="text-3xl font-black text-yellow-500 block">{formatDuration(stats.totalTimeTracked)}</span>
          <div className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-wide">Cumulative Hours</div>
        </div>

        {/* Task Board Card */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 blur-[50px] pointer-events-none" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Task Completion</span>
          <span className="text-3xl font-black text-white block">{stats.totalCompletedTasks} / {stats.totalTasks}</span>
          <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full" 
              style={{ width: `${stats.totalTasks > 0 ? (stats.totalCompletedTasks / stats.totalTasks) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Active Timers Card */}
        <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-[50px] pointer-events-none" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Active Now</span>
          <span className="text-3xl font-black text-emerald-400 block flex items-center gap-2">
            {stats.activeTimersCount}
            {stats.activeTimersCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />}
          </span>
          <div className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-wide">Running Timers</div>
        </div>
      </section>

      {/* ================= Search Bar ================= */}
      <section className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
          <Search size={18} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Visitor Token, IP, or Task Title..."
          className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl pl-12 pr-5 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500/30 transition-colors"
        />
      </section>

      {/* ================= Content / List ================= */}
      {loading && activities.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
          <p className="text-zinc-500 text-sm font-semibold tracking-wider uppercase">Loading activity logs...</p>
        </div>
      ) : error ? (
        <div className="border border-rose-500/20 bg-rose-500/5 p-6 rounded-2xl flex items-center gap-3 text-rose-400">
          <AlertCircle size={20} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="border border-dashed border-zinc-800 p-16 rounded-[2rem] text-center text-zinc-600">
          <User size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-sm">No visitor tracking logs found.</p>
          <p className="text-xs text-zinc-600 mt-1">Try relaxing your search terms or verify guest widgets are active.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <AnimatePresence>
            {filteredActivities.map((user) => {
              const isExpanded = !!expandedUsers[user.ip_address];
              const progressPercent = user.total_todos > 0 ? Math.round((user.completed_todos / user.total_todos) * 100) : 0;
              
              return (
                <motion.div
                  key={user.ip_address}
                  variants={itemVariants}
                  layout
                  className={`border rounded-[2rem] overflow-hidden transition-all duration-300 ${
                    user.active_todo 
                      ? "bg-zinc-950/90 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.03)]" 
                      : "bg-zinc-950/40 border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  {/* Card Header Row */}
                  <div 
                    onClick={() => toggleExpand(user.ip_address)}
                    className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        user.active_todo ? "bg-yellow-500/10 text-yellow-500" : "bg-zinc-900 text-zinc-500"
                      }`}>
                        <User size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-[280px] md:max-w-none">
                            {user.ip_address}
                          </h3>
                          {user.active_todo && (
                            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active Timer
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                          <Calendar size={10} />
                          Last Active: {user.last_activity ? new Date(user.last_activity).toLocaleString() : "Never"}
                        </p>
                      </div>
                    </div>

                    {/* Stats pill container */}
                    <div className="flex items-center gap-6 md:gap-8 flex-wrap w-full md:w-auto justify-between border-t border-zinc-900 md:border-0 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Worked Time</span>
                        <span className={`text-base font-black tracking-tight ${user.active_todo ? "text-yellow-500" : "text-zinc-300"}`}>
                          {formatDuration(user.total_worked_seconds)}
                        </span>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Completion</span>
                        <span className="text-sm font-black text-zinc-300">
                          {user.completed_todos} / {user.total_todos} Done ({progressPercent}%)
                        </span>
                      </div>

                      <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Task Details */}
                  {isExpanded && (
                    <div className="border-t border-zinc-900 bg-zinc-950/80 px-6 py-6 md:px-8 space-y-4">
                      {/* Active running task details if any */}
                      {user.active_todo && (
                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-start gap-2.5">
                            <Clock size={16} className="text-yellow-500 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
                            <div>
                              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wider block">Currently Tracking:</span>
                              <span className="text-sm font-semibold text-white tracking-wide">{user.active_todo.title}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                            Started: {new Date(user.active_todo.started_at).toLocaleTimeString()}
                          </span>
                        </div>
                      )}

                      {/* Complete Task List table/stack */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Complete Task Board</span>
                        
                        {user.todos.map((todo) => {
                          const isTaskActive = user.active_todo && user.active_todo.id === todo.id;
                          return (
                            <div 
                              key={todo.id}
                              className={`flex justify-between items-center gap-4 p-3.5 border rounded-xl transition-all ${
                                isTaskActive 
                                  ? "bg-yellow-500/5 border-yellow-500/20" 
                                  : todo.completed 
                                  ? "bg-zinc-900/10 border-transparent opacity-50" 
                                  : "bg-zinc-900/30 border-zinc-900 hover:border-zinc-800"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex-shrink-0">
                                  {todo.completed ? (
                                    <CheckCircle2 size={16} className="text-yellow-500" />
                                  ) : isTaskActive ? (
                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin inline-block" />
                                  ) : (
                                    <Circle size={16} className="text-zinc-600" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-xs font-semibold tracking-wide truncate ${todo.completed ? "line-through text-zinc-600" : "text-zinc-300"}`}>
                                    {todo.title}
                                  </p>
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                    <Calendar size={10} />
                                    Created: {new Date(todo.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right flex-shrink-0">
                                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Duration</span>
                                  <span className="text-[11px] font-black tracking-tight tabular-nums text-zinc-400">
                                    {formatDuration(todo.total_duration)}
                                  </span>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTodo(todo.id, user.ip_address);
                                  }}
                                  disabled={deletingId === todo.id}
                                  className="p-2 bg-zinc-900 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 text-zinc-500 hover:text-rose-400 rounded-xl transition-all disabled:opacity-40"
                                >
                                  {deletingId === todo.id ? (
                                    <Loader2 size={14} className="animate-spin text-rose-500" />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
