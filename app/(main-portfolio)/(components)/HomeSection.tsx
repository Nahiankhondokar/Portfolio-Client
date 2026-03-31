"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import {User} from "lucide-react";
import Me from "@/public/assets/me/me.jpg";
import {Home, Section} from "../type/type";


const HomeSection =  (
    { onNavigate, data }:
    { onNavigate: (s: Section) => void,
        data: Home
    }) => {

    return (
        <motion.section
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            className="flex flex-col lg:flex-row items-center min-h-screen py-10"
        >
            <div className="w-full lg:w-1/3 flex justify-center lg:justify-start">
                <div className="w-72 h-72 lg:w-[450px] lg:h-[550px] rounded-3xl border-4 border-[#252525] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    {/* Replace with your image */}
                    <div className="bg-[#252525] w-full h-full flex items-center justify-center text-gray-500">
                        <Image src={data.image ?? Me} alt="image"/>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-2/3 mt-10 lg:mt-0 lg:pl-10 text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-extrabold uppercase leading-tight">
                    <span className="text-yellow-500 block">I am {data.name || "Your Name"}.</span>
                    {data.subtitle || "Software Engineer"}
                </h1>
                <p className="mt-6 text-gray-300 max-w-xl text-lg leading-relaxed mx-auto lg:mx-0">
                    {data.bio ||
                        "I am a professional Full Stack Software Engineer based in Dhaka, Bangladesh.\n" +
                        "I specialize in building robust backend systems with Laravel and modern\n" +
                        "frontends with React and Vue."
                    }

                </p>
                <button
                    onClick={() => onNavigate("about")}
                    className="mt-8 group flex items-center gap-4 border-2 border-yellow-500 rounded-full pl-8 pr-2 py-2 font-bold uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition-all mx-auto lg:mx-0"
                >
                    More About Me
                    <span className="bg-yellow-500 text-white p-3 rounded-full group-hover:bg-black transition-colors">
            <User size={20} />
          </span>
                </button>
            </div>
        </motion.section>
    );
}

export default HomeSection;