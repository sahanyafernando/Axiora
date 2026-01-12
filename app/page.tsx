'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAppStore } from '@/store/useAppStore'
import Dashboard from '@/components/Dashboard'
import GoalsPage from '@/components/GoalsPage'
import TasksPage from '@/components/TasksPage'
import ExpensesPage from '@/components/ExpensesPage'
import Navbar from '@/components/Navbar'
import AIAssistant from '@/components/AIAssistant'
import ProfileSettings from '@/components/ProfileSettings'

type Tab = 'dashboard' | 'goals' | 'tasks' | 'expenses'

export default function Home() {
  const router = useRouter()
  const { user, setUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error('Error in getSession:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onProfileClick={() => setShowProfile(true)} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'goals' && <GoalsPage />}
        {activeTab === 'tasks' && <TasksPage />}
        {activeTab === 'expenses' && <ExpensesPage />}
      </main>
      <AIAssistant />
      {showProfile && <ProfileSettings onClose={() => setShowProfile(false)} />}
    </div>
  )
}
