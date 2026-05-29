"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Flame, 
  Loader2, 
  ArrowLeft,
  Info
} from "lucide-react";
import Link from "next/link";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_duration: number; // in seconds
}

interface HistoryDay {
  date: string;
  day_name: string;
  seconds: number;
  formatted: string;
}

interface Stats {
  total_todos: number;
  completed_todos: number;
  progress_percentage: number;
  total_worked_today_seconds: number;
  total_worked_yesterday_seconds: number;
  total_worked_all_time_seconds: number;
  active_todo_id: number | null;
  active_timer_started_at: string | null;
  history: HistoryDay[];
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_todos: 0,
    completed_todos: 0,
    progress_percentage: 0,
    total_worked_today_seconds: 0,
    total_worked_yesterday_seconds: 0,
    total_worked_all_time_seconds: 0,
    active_todo_id: null,
    active_timer_started_at: null,
    history: []
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Live ticking values for active timer
  const [liveSecondsToday, setLiveSecondsToday] = useState(0);
  const [liveSecondsAllTime, setLiveSecondsAllTime] = useState(0);
  const [liveTodos, setLiveTodos] = useState<Todo[]>([]);

  const lastLoadTimeRef = useRef<number>(Date.now());

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

  // Show dynamic message toast
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Load initial active timer state from localStorage on mount
  useEffect(() => {
    const savedActiveId = localStorage.getItem("active_todo_id");
    const savedStartedAt = localStorage.getItem("active_timer_started_at");
    const savedTodaySeconds = localStorage.getItem("active_today_seconds");
    const savedAllTimeSeconds = localStorage.getItem("active_all_time_seconds");
    
    if (savedActiveId && savedStartedAt) {
      const activeId = parseInt(savedActiveId);
      const startTime = new Date(savedStartedAt).getTime();
      const elapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

      setStats(prev => ({
        ...prev,
        active_todo_id: activeId,
        active_timer_started_at: savedStartedAt,
        total_worked_today_seconds: savedTodaySeconds ? parseInt(savedTodaySeconds) : 0,
        total_worked_all_time_seconds: savedAllTimeSeconds ? parseInt(savedAllTimeSeconds) : 0,
      }));
      
      const savedTitle = localStorage.getItem("active_todo_title") || "Active Task";
      const savedDuration = localStorage.getItem("active_todo_duration");
      const baseDuration = savedDuration ? parseInt(savedDuration) : 0;

      const tempTodo: Todo = {
        id: activeId,
        title: savedTitle,
        completed: false,
        is_active: true,
        created_at: savedStartedAt,
        updated_at: savedStartedAt,
        total_duration: baseDuration + elapsed
      };
      
      setTodos([tempTodo]);
      setLiveTodos([tempTodo]);
      lastLoadTimeRef.current = startTime;
    }
  }, []);

  // Fetch todos and stats from the backend
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}v1/public/todos`, {
        cache: "no-store",
        headers: {
          "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        },
      });
      if (!res.ok) {
        if (res.status === 429) {
          showToast("Rate limit exceeded. Please wait a bit.", "error");
        } else {
          throw new Error("Failed to load dashboard data");
        }
      }
      const data = await res.json();
      if (data.success) {
        setTodos(data.todos);
        setLiveTodos(data.todos);
        const normalizedStats = {
          ...data.stats,
          active_todo_id: data.stats.active_todo_id ? Number(data.stats.active_todo_id) : null
        };
        setStats(normalizedStats);
        setLiveSecondsToday(Math.max(0, data.stats.total_worked_today_seconds));
        setLiveSecondsAllTime(Math.max(0, data.stats.total_worked_all_time_seconds));
        lastLoadTimeRef.current = Date.now();

        // Sync localStorage with API state
        if (normalizedStats.active_todo_id && normalizedStats.active_timer_started_at) {
          const activeTodo = data.todos.find((t: Todo) => Number(t.id) === Number(normalizedStats.active_todo_id));
          localStorage.setItem("active_todo_id", data.stats.active_todo_id.toString());
          localStorage.setItem("active_timer_started_at", data.stats.active_timer_started_at);
          if (activeTodo) {
            localStorage.setItem("active_todo_title", activeTodo.title);
            const elapsed = Math.max(0, Math.floor((Date.now() - new Date(data.stats.active_timer_started_at).getTime()) / 1000));
            localStorage.setItem("active_todo_duration", Math.max(0, activeTodo.total_duration - elapsed).toString());
          }
          const elapsedToday = Math.max(0, Math.floor((Date.now() - new Date(data.stats.active_timer_started_at).getTime()) / 1000));
          localStorage.setItem("active_today_seconds", Math.max(0, data.stats.total_worked_today_seconds - elapsedToday).toString());
          localStorage.setItem("active_all_time_seconds", Math.max(0, data.stats.total_worked_all_time_seconds - elapsedToday).toString());
        } else {
          localStorage.removeItem("active_todo_id");
          localStorage.removeItem("active_timer_started_at");
          localStorage.removeItem("active_todo_title");
          localStorage.removeItem("active_todo_duration");
          localStorage.removeItem("active_today_seconds");
          localStorage.removeItem("active_all_time_seconds");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Could not connect to backend server.", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Timer ticking logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (stats.active_todo_id && stats.active_timer_started_at) {
      interval = setInterval(() => {
        const now = Date.now();
        const secondsSinceLoad = Math.max(0, Math.floor((now - lastLoadTimeRef.current) / 1000));

        // Update live stats safely capping at 0
        setLiveSecondsToday(Math.max(0, stats.total_worked_today_seconds + secondsSinceLoad));
        setLiveSecondsAllTime(Math.max(0, stats.total_worked_all_time_seconds + secondsSinceLoad));

        // Update specific todo duration dynamically in local view safely capping at 0
        setLiveTodos(() =>
          todos.map((todo) => {
            if (stats.active_todo_id && Number(todo.id) === Number(stats.active_todo_id)) {
              return {
                ...todo,
                total_duration: Math.max(0, todo.total_duration + secondsSinceLoad),
              };
            }
            return todo;
          })
        );
      }, 1000);
    } else {
      // Sync live displays with absolute stats when no active timer exists
      setLiveSecondsToday(stats.total_worked_today_seconds);
      setLiveSecondsAllTime(stats.total_worked_all_time_seconds);
      setLiveTodos(todos);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stats.active_todo_id, stats.active_timer_started_at, stats.total_worked_today_seconds, stats.total_worked_all_time_seconds, todos]);

  // Handle task submission
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}v1/public/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      const data = await res.json();
      if (res.status === 429) {
        showToast("Slow down! You are posting too fast.", "error");
      } else if (res.ok && data.success) {
        setNewTitle("");
        showToast("Task added successfully!");
        fetchData(true); // silent update
      } else {
        showToast(data.message || "Failed to create task", "error");
      }
    } catch (err) {
      showToast("Network error. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle todo completion
  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updatedValue = !todo.completed;
      // Optimistic update
      setTodos(prev => prev.map(t => Number(t.id) === Number(todo.id) ? { ...t, completed: updatedValue } : t));
      
      // If marking active task complete, remove localStorage tracking
      if (updatedValue && stats.active_todo_id && Number(stats.active_todo_id) === Number(todo.id)) {
        localStorage.removeItem("active_todo_id");
        localStorage.removeItem("active_timer_started_at");
        localStorage.removeItem("active_todo_title");
        localStorage.removeItem("active_todo_duration");
        localStorage.removeItem("active_today_seconds");
        localStorage.removeItem("active_all_time_seconds");
      }

      const res = await fetch(`${API_BASE}v1/public/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: updatedValue }),
      });

      const data = await res.json();
      if (res.status === 429) {
        showToast("Action rejected due to rate limits.", "error");
        fetchData(true); // roll back
      } else if (res.ok && data.success) {
        showToast(updatedValue ? "Task completed!" : "Task active again");
        fetchData(true);
      } else {
        showToast(data.message || "Failed to update status", "error");
        fetchData(true);
      }
    } catch (err) {
      showToast("Network error updating status", "error");
      fetchData(true);
    }
  };

  // Handle Edit Action
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingTitle.trim()) return;

    try {
      const res = await fetch(`${API_BASE}v1/public/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });

      const data = await res.json();
      if (res.status === 429) {
        showToast("Edit rejected due to rate limits.", "error");
      } else if (res.ok && data.success) {
        showToast("Task updated successfully!");
        setEditingId(null);
        fetchData(true);
      } else {
        showToast(data.message || "Failed to edit task", "error");
      }
    } catch (err) {
      showToast("Network error saving edits", "error");
    }
  };

  // Delete Todo task
  const handleDeleteTodo = async (id: number) => {
    try {
      // Optimistic delete
      setTodos(prev => prev.filter(t => Number(t.id) !== Number(id)));

      if (stats.active_todo_id && Number(stats.active_todo_id) === Number(id)) {
        localStorage.removeItem("active_todo_id");
        localStorage.removeItem("active_timer_started_at");
        localStorage.removeItem("active_todo_title");
        localStorage.removeItem("active_todo_duration");
        localStorage.removeItem("active_today_seconds");
        localStorage.removeItem("active_all_time_seconds");
      }

      const res = await fetch(`${API_BASE}v1/public/todos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.status === 429) {
        showToast("Delete rejected due to rate limits.", "error");
        fetchData(true);
      } else if (res.ok && data.success) {
        showToast("Task deleted.");
        fetchData(true);
      } else {
        showToast(data.message || "Failed to delete task", "error");
        fetchData(true);
      }
    } catch (err) {
      showToast("Network error deleting task", "error");
      fetchData(true);
    }
  };

  // Toggle Timer Play/Pause
  const handleToggleTimer = async (todo: Todo) => {
    const isCurrentlyRunning = stats.active_todo_id ? Number(stats.active_todo_id) === Number(todo.id) : false;
    const urlSuffix = isCurrentlyRunning ? "stop-track" : "start-track";
    try {

      if (!isCurrentlyRunning) {
        localStorage.setItem("active_todo_id", todo.id.toString());
        localStorage.setItem("active_timer_started_at", new Date().toISOString());
        localStorage.setItem("active_todo_title", todo.title);
        localStorage.setItem("active_todo_duration", todo.total_duration.toString());
        localStorage.setItem("active_today_seconds", stats.total_worked_today_seconds.toString());
        localStorage.setItem("active_all_time_seconds", stats.total_worked_all_time_seconds.toString());
      } else {
        localStorage.removeItem("active_todo_id");
        localStorage.removeItem("active_timer_started_at");
        localStorage.removeItem("active_todo_title");
        localStorage.removeItem("active_todo_duration");
        localStorage.removeItem("active_today_seconds");
        localStorage.removeItem("active_all_time_seconds");
      }

      const res = await fetch(`${API_BASE}v1/public/todos/${todo.id}/${urlSuffix}`, {
        method: "POST",
      });

      const data = await res.json();
      if (res.status === 429) {
        showToast("Action rate-limited. Please wait.", "error");
        if (!isCurrentlyRunning) {
          localStorage.removeItem("active_todo_id");
          localStorage.removeItem("active_timer_started_at");
          localStorage.removeItem("active_todo_title");
          localStorage.removeItem("active_todo_duration");
        }
      } else if (res.ok && data.success) {
        showToast(isCurrentlyRunning ? "Timer stopped." : "Timer started!");
        fetchData(true);
      } else {
        showToast(data.message || "Action failed.", "error");
        if (!isCurrentlyRunning) {
          localStorage.removeItem("active_todo_id");
          localStorage.removeItem("active_timer_started_at");
          localStorage.removeItem("active_todo_title");
          localStorage.removeItem("active_todo_duration");
        }
      }
    } catch (err) {
      showToast("Network error toggling timer", "error");
      if (!isCurrentlyRunning) {
        localStorage.removeItem("active_todo_id");
        localStorage.removeItem("active_timer_started_at");
        localStorage.removeItem("active_todo_title");
        localStorage.removeItem("active_todo_duration");
      }
    }
  };

  // Duration Formatter Helper (Seconds -> HH:MM:SS)
  const formatDuration = (totalSeconds: number) => {
    // Math.max guarantees negative offsets (from client/server clock drifts) are safely presented as 00:00:00
    const roundedSeconds = Math.max(0, Math.floor(totalSeconds));
    const hrs = Math.floor(roundedSeconds / 3600);
    const mins = Math.floor((roundedSeconds % 3600) / 60);
    const secs = roundedSeconds % 60;
    return [
      hrs.toString().padStart(2, "0"),
      mins.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0")
    ].join(":");
  };

  // Dynamic Intensity Helper for history bars
  const getBarHeightPercent = (seconds: number) => {
    const maxDaySeconds = Math.max(...stats.history.map(d => d.seconds), 3600); // minimum scale is 1 hour
    return Math.min(100, Math.max(10, Math.round((seconds / maxDaySeconds) * 100)));
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-yellow-500 selection:text-black py-12 px-4 sm:px-6 lg:px-20 relative overflow-hidden">
      
      {/* Floating background gradient accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Animated Toast Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border backdrop-blur-md ${
              notification.type === "success"
                ? "bg-zinc-900/90 border-emerald-500/30 text-emerald-400"
                : notification.type === "error"
                ? "bg-zinc-900/90 border-rose-500/30 text-rose-400"
                : "bg-zinc-900/90 border-yellow-500/30 text-yellow-400"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              notification.type === "success" 
                ? "bg-emerald-500 animate-pulse" 
                : notification.type === "error" 
                ? "bg-rose-500 animate-pulse" 
                : "bg-yellow-500 animate-pulse"
            }`} />
            <span className="text-sm font-semibold tracking-wide">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Navigation / Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-yellow-500 transition-colors text-sm font-bold uppercase tracking-wider mb-3 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Portfolio
            </Link>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Demo Tasks & Tracker
            </h1>
            <p className="text-zinc-500 text-sm mt-1 flex items-center gap-1.5">
              <Info size={14} className="text-yellow-500/70" />
              Demonstration utility. List and logs are mapped using your client IP address.
            </p>
          </div>

          {/* Active Timer Pill header */}
          {stats.active_todo_id && (
            <motion.div 
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-full flex items-center gap-2.5 text-xs font-black uppercase tracking-wider"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-ping" />
              Timer Ticking live
            </motion.div>
          )}
        </div>

        {loading ? (
          <div className="min-h-[50vh] flex flex-col justify-center items-center gap-3">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <p className="text-zinc-500 text-sm font-semibold tracking-widest uppercase animate-pulse">Syncing logs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Stat Widgets & Task List (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Progress Summary Card */}
              <div className="bg-zinc-950/80 border border-zinc-900 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 hover:border-zinc-800 transition-all duration-300">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Completion</span>
                    <h3 className="text-2xl font-black">{stats.completed_todos} / {stats.total_todos} Done</h3>
                  </div>
                  <span className="text-3xl font-black text-yellow-500">{stats.progress_percentage}%</span>
                </div>
                
                {/* Custom Gradient Progress Bar */}
                <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.progress_percentage}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                    className="h-full bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                  />
                </div>
              </div>

              {/* Todo Interactive Card */}
              <div className="bg-zinc-950/80 border border-zinc-900 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 hover:border-zinc-800 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-zinc-900 rounded-2xl text-yellow-500">
                    <Flame size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Your Task Board</h2>
                    <p className="text-zinc-500 text-xs">Add items and track active time logged.</p>
                  </div>
                </div>

                {/* Todo Form */}
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Enter a task to track..."
                    maxLength={100}
                    disabled={submitting}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newTitle.trim()}
                    className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-zinc-900 disabled:text-zinc-700 active:scale-95 transition-all text-black font-black px-6 rounded-2xl flex items-center justify-center gap-2 text-sm"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={3} />}
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </form>

                {/* Todo Listing */}
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {liveTodos.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center text-zinc-600 border border-dashed border-zinc-900 rounded-3xl"
                      >
                        <Clock size={36} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-semibold">Your board is empty.</p>
                        <p className="text-xs text-zinc-600 mt-0.5">Add a task above to start time logging!</p>
                      </motion.div>
                    ) : (
                      liveTodos.map((todo) => {
                        const isEditing = editingId === todo.id;
                        const isRunning = stats.active_todo_id ? Number(stats.active_todo_id) === Number(todo.id) : false;

                        return (
                          <motion.div
                            key={todo.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-2xl transition-all duration-300 ${
                              isRunning 
                                ? "bg-yellow-500/5 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]" 
                                : todo.completed 
                                ? "bg-zinc-950/40 border-zinc-950 opacity-60" 
                                : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex items-start gap-3.5 flex-1 w-full">
                              
                              {/* Complete Checkbox Button */}
                              <button
                                onClick={() => handleToggleComplete(todo)}
                                className={`mt-0.5 text-zinc-500 transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                                  todo.completed ? "text-emerald-500" : "hover:text-yellow-500"
                                }`}
                              >
                                {todo.completed ? (
                                  <CheckCircle2 size={20} fill="currentColor" className="text-emerald-500 fill-zinc-950" />
                                ) : (
                                  <Circle size={20} />
                                )}
                              </button>

                              {/* Title / Form wrapper */}
                              <div className="flex-1 min-w-0">
                                {isEditing ? (
                                  <div className="flex items-center gap-2 w-full">
                                    <input
                                      type="text"
                                      value={editingTitle}
                                      onChange={(e) => setEditingTitle(e.target.value)}
                                      maxLength={100}
                                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-yellow-500/50"
                                    />
                                    <button 
                                      onClick={() => handleSaveEdit(todo.id)}
                                      className="p-1.5 bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors"
                                    >
                                      <Check size={16} strokeWidth={2.5} />
                                    </button>
                                    <button 
                                      onClick={cancelEditing}
                                      className="p-1.5 bg-zinc-950 text-zinc-500 border border-zinc-800 rounded-lg hover:text-white transition-colors"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <p className={`text-sm font-semibold tracking-wide truncate ${todo.completed ? "line-through text-zinc-600" : "text-white"}`}>
                                      {todo.title}
                                    </p>
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                                      <Clock size={10} />
                                      Time Tracked: <span className={todo.total_duration > 0 ? "text-zinc-400" : "text-zinc-600"}>{formatDuration(todo.total_duration)}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-zinc-900 sm:border-0 pt-3 sm:pt-0">
                              
                              {/* PLAY / PAUSE timer button (Only available for active tasks) */}
                              {!todo.completed && (
                                <button
                                  onClick={() => handleToggleTimer(todo)}
                                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all duration-200 active:scale-95 ${
                                    isRunning
                                      ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                                      : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
                                  }`}
                                >
                                  {isRunning ? (
                                    <>
                                      <Pause size={12} fill="currentColor" strokeWidth={3} />
                                      <span>Tracking</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play size={12} fill="currentColor" strokeWidth={3} />
                                      <span>Track</span>
                                    </>
                                  )}
                                </button>
                              )}

                              {/* Edit Action */}
                              {!todo.completed && !isEditing && (
                                <button
                                  onClick={() => startEditing(todo)}
                                  className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                                  title="Edit Task"
                                >
                                  <Edit3 size={14} />
                                </button>
                              )}

                              {/* Delete Action */}
                              <button
                                onClick={() => handleDeleteTodo(todo.id)}
                                className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-rose-500/30 text-zinc-500 hover:text-rose-400 transition-colors focus:outline-none"
                                title="Delete Task"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Time Tracking Stats & Work History (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Worked Time Widgets */}
              <div className="bg-zinc-950/80 border border-zinc-900 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 hover:border-zinc-800 transition-all duration-300 space-y-6">
                
                {/* Active Indicator widget */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-zinc-900 rounded-xl text-yellow-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500">Time Logger</h3>
                    <p className="text-xs text-zinc-600">Dynamic tracking statistics.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Today's Stats Card */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 ${stats.active_todo_id ? "bg-yellow-500/5 border-yellow-500/20" : "bg-zinc-900/50 border-zinc-900"}`}>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Time Tracked Today</span>
                    <span className={`text-2xl font-black tracking-tight tabular-nums ${stats.active_todo_id ? "text-yellow-500" : "text-white"}`}>
                      {formatDuration(liveSecondsToday)}
                    </span>
                    {stats.active_todo_id && (
                      <span className="text-[9px] font-bold text-yellow-500 animate-pulse uppercase tracking-wider block mt-1">
                        ● Ticking Live...
                      </span>
                    )}
                  </div>

                  {/* Yesterday's Stats Card */}
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-900">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Time Yesterday</span>
                    <span className="text-xl font-black tracking-tight tabular-nums text-zinc-300">
                      {formatDuration(stats.total_worked_yesterday_seconds)}
                    </span>
                  </div>

                  {/* Total Stats Card */}
                  <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-900">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Cumulative Log</span>
                    <span className="text-xl font-black tracking-tight tabular-nums text-zinc-300">
                      {formatDuration(liveSecondsAllTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* History / 7-Day Chart Widget */}
              <div className="bg-zinc-950/80 border border-zinc-900 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 hover:border-zinc-800 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-zinc-900 rounded-xl text-yellow-500">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-500">7-Day History</h3>
                    <p className="text-xs text-zinc-600">Past activity metrics.</p>
                  </div>
                </div>

                {/* History Bar Chart */}
                <div className="space-y-4">
                  {stats.history.length === 0 ? (
                    <p className="text-xs text-zinc-600 text-center py-6">No previous tracking records.</p>
                  ) : (
                    stats.history.map((day, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3">
                        <div className="w-16">
                          <span className="text-[10px] font-black uppercase text-zinc-500 block truncate">{day.day_name.slice(0, 3)}</span>
                          <span className="text-[8px] font-semibold text-zinc-700 block mt-[-2px]">{day.date.slice(5)}</span>
                        </div>
                        
                        {/* Interactive Bar */}
                        <div className="flex-1 h-3 bg-zinc-900/60 rounded-full overflow-hidden relative">
                          <div 
                            style={{ width: `${getBarHeightPercent(day.seconds)}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              day.seconds > 0 
                                ? "bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.15)]" 
                                : "bg-zinc-900/10"
                            }`}
                          />
                        </div>
                        
                        <div className="w-14 text-right">
                          <span className={`text-[10px] font-black tracking-tight tabular-nums ${day.seconds > 0 ? "text-zinc-300" : "text-zinc-700"}`}>
                            {day.seconds > 0 ? day.formatted.slice(0, 5) : "00:00"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
