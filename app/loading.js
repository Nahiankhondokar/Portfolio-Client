"use client";

import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      {/* Background subtle glow */}
      <div className="absolute w-64 h-64 bg-yellow-500/5 rounded-full blur-[120px] animate-pulse" />

      <div className="relative flex flex-col items-center">
        {/* The Animated Logo/Icon Container */}
        <div className="relative w-24 h-24 mb-8">
          {/* Rotating Outer Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-zinc-800 rounded-[2rem]"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />

          {/* Pulsing Inner Core */}
          <motion.div
            className="absolute inset-4 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Minimal Lettering or Icon */}
            <span className="text-black font-black text-xl italic">S</span>
          </motion.div>
        </div>

        {/* Professional Progress Indicator */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-1">
            <motion.span
              className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading
            </motion.span>
            {/* Animated Dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-yellow-500 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Slim Progress Bar */}
          <div className="w-48 h-[2px] bg-zinc-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>

      {/* Philosophy Quote (Optional - matches your motto) */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[2px] text-zinc-600"
      >
        Slow is better than stop
      </motion.p>
    </div>
  );
};

export default Loading;