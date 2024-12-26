import { useAuth } from "@/lib/useAuth"
import { Activity, Code2, Star, Timer, TrendingUp, Trophy, User, Zap } from "lucide-react";
import { motion } from 'framer-motion'

type Props = {
    userStats: {
        totalExecutions: number;
        languagesCount: number;
        languages: string[];
        last24Hours: number;
        favoriteLanguage: string;
        languageStats: Record<string, number>;
        mostStarredLanguage: string;
        starredSnippets: number
      }
}

export default function ProfileHeader({userStats}: Props) {

    const { user } = useAuth()

    const STATS = [
        {
          label: "Code Executions",
          value: userStats?.totalExecutions ?? 0,
          icon: Activity,
          description: "Total code runs",
          metric: {
            label: "Last 24h",
            value: userStats?.last24Hours ?? 0,
            icon: Timer,
          },
        },
        {
          label: "Starred Snippets",
          value: userStats.starredSnippets ?? 0,
          icon: Star,
          description: "Saved for later",
          metric: {
            label: "Most starred",
            value: userStats?.mostStarredLanguage ?? "N/A",
            icon: Trophy,
        },
    },
    {
      label: "Languages Used",
      value: userStats?.languagesCount ?? 0,
      icon: Code2,
      description: "Different languages",
      metric: {
        label: "Most used",
        value: userStats?.favoriteLanguage ?? "N/A",
        icon: TrendingUp,
      },
    },
    ]

  return <div className="flex flex-col gap-3 w-4/5 bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-2xl border border-gray-800/50 overflow-hidden p-6">
             <div className="flex items-center gap-8">
                <div className="relative group flex-center p-2">
                  <div className="absolute inset-0 bg-gradient-to-r size-36 from-blue-500 to-purple-600 rounded-full blur-xl opacity-100 group-hover:opacity-100 transition-opacity"/>
                  <img src={user?.image || ''} className="object-contain rounded-full size-32 border-4 hover:border z-10 border-gray-800/50 group-hover:scale-105 transition-transform"/>
                  <span className="absolute top-3 right-2 z-20 rounded-full shadow-lg shadow-white animate-pulse p-2 bg-gradient-to-r from-purple-500 to-purple-600"><Zap className="size-5"/></span>
                </div>

                <div className="flex flex-col gap-1">
                   <h1 className="text-3xl font-bold">{user?.name}</h1>
                   <span className="flex items-center gap-2 text-sm"><User className="size-5"/>{'virajb853@gmail.com'}</span>
                </div>
             </div>

             <div className="flex items-center gap-3">
                {STATS.map((stat,i) => {
                    return <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}
                     className="bg-gradient-to-br from-black/40 to-black/20 rounded-2xl overflow-hidden group relative">

                    </motion.div>
                })}
             </div>
  </div>
}