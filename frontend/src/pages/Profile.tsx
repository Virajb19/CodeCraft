import ProfileHeader from "@/components/ProfileHeader";
import { useAuth } from "@/lib/useAuth"
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Clock, Code, ListVideo, Loader2, Star } from "lucide-react";
import axios, { Execution, Snippet } from "../lib/utils";
import { useEffect, useMemo } from "react";

async function fetchExecutions() {
   try {
     const { data: { executions, executionsInLast24hrs }} = await axios.get('/api/codeExecution/getExecutions', { withCredentials: true})
     return { executions, executionsInLast24hrs }
   } catch(err) {
      console.error(err)
      return { executions: [], executionsInLast24hrs: 0 };
   }
}

async function fetchStarredSnippets() {
    try {
      const {data: starredSnippets} = await axios.get('/api/snippet/getStarredSnippets', { withCredentials: true})
      return starredSnippets
    } catch(err) {
        console.error(err)
    }
}

export default function Profile() {

    const { user } = useAuth()

    const {data: executionsData} = useQuery<{executions: Execution[], executionsInLast24hrs: number}>({queryKey: ['getExecutions'], queryFn: fetchExecutions})
    const {data: starredSnippets} = useQuery<Snippet[]>({queryKey: ['getStarredSnippets'], queryFn: fetchStarredSnippets})

    // const executionsInLast24hrs = useMemo(() => {
    //     executionsData?.executions.filter(execution => execution.createdAt >= new Date(Date.now() - 24 * 60 * 60 * 1000)).length
    // }, [executionsData?.executions])

    //   const starredLanguages = [...new Set(starredSnippets?.map(sniippet => sniippet.language))]

    const totalExecutions = executionsData?.executions.length ?? 0
    const languagesCount = new Set(executionsData?.executions.map(execution => execution.language)).size ?? 0;

    const languageStats = executionsData?.executions.reduce(
        (acc, curr) => {
          acc[curr.language] = (acc[curr.language] || 0) + 1
          return acc;
        },
        {} as Record<string, number>
      ) ?? {}

      const languages = Object.keys(languageStats)

      const favoriteLanguage = languages.length ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b)) : "N/A"


    const starredLanguages = starredSnippets?.reduce((acc, snippet) => {
        const language = snippet.language
        acc[language] = (acc[language] || 0) + 1
        return acc
      }, {} as Record<string, number>) ?? {}

      const mostStarredLanguage = Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A"

      const userStats = {
        totalExecutions,
        languagesCount,
        last24Hours: executionsData?.executionsInLast24hrs ?? 0,
        languageStats,
        languages,
        favoriteLanguage,
        mostStarredLanguage,
        starredSnippets: starredSnippets?.length ?? 0,
    };
  return <div className="w-full flex flex-col items-center min-h-screen py-8 px-4">
         <ProfileHeader userStats={userStats}/> 
  </div>
}