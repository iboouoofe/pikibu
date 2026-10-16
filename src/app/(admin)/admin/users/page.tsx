'use client'

import { useState, useEffect } from 'react'
import { Search, Crown, Edit2, Trash2, Check, Loader2 } from 'lucide-react'

const initialUsers = [
  { id: '1', name: 'Ayşe Kaya', email: 'ayse@gmail.com', baby: 'Ece', babyAge: '3 ay', plan: 'PREMIUM', joined: '15 Eyl 2024', lastActive: '2 saat önce', status: 'active' },
  { id: '2', name: 'Fatma Demir', email: 'fatma@gmail.com', baby: 'Ahmet', babyAge: '7 ay', plan: 'FREE', joined: '02 Eki 2024', lastActive: '4 saat önce', status: 'active' },
  { id: '3', name: 'Zeynep Arslan', email: 'zeynep@icloud.com', baby: 'Leyla', babyAge: '1 ay', plan: 'PREMIUM', joined: '28 Eyl 2024', lastActive: '6 saat önce', status: 'active' },
  { id: '4', name: 'Merve Çelik', email: 'merve@gmail.com', baby: 'Yusuf', babyAge: '5 ay', plan: 'FREE', joined: '10 Eyl 2024', lastActive: '1 gün önce', status: 'inactive' },
  { id: '5', name: 'Seda Yıldız', email: 'seda@outlook.com', baby: 'Zehra', babyAge: '9 ay', plan: 'PREMIUM', joined: '05 Ağu 2024', lastActive: '3 saat önce', status: 'active' },
  { id: '6', name: 'Büşra Güner', email: 'busra@gmail.com', baby: 'Ali', babyAge: '6 ay', plan: 'FREE', joined: '20 Tem 2024', lastActive: '2 gün önce', status: 'inactive' },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<'ALL' | 'PREMIUM' | 'FREE'>('ALL')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/admin/users')
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data.data) && data.data.length > 0) {
            setUsers(data.data)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadUsers()
  }, [])

  const handleTogglePlan = async (userId: string, currentPlan: string) => {
    const nextPlan = currentPlan === 'PREMIUM' ? 'FREE' : 'PREMIUM'
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: nextPlan } : u))

    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, tier: nextPlan })
      })
      setSuccessToast(`Kullanıcı planı ${nextPlan} olarak güncellendi.`)
      setTimeout(() => setSuccessToast(null), 3000)
    } catch (e) {
      console.error(e)
    }
  }

  const handleManualGrantPremium = () => {
    if (!selectedUser) {
      alert('Lütfen listeden bir kullanıcı seçin.')
      return
    }
    handleTogglePlan(selectedUser, 'FREE')
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`${userName} adlı kullanıcıyı silmek istediğinize emin misiniz?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId))
      setSuccessToast('Kullanıcı başarıyla silindi.')
      setTimeout(() => setSuccessToast(null), 3000)
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === 'ALL' || u.plan === planFilter
    return matchSearch && matchPlan
  })

  return (
    <div style={{ padding: '32px', background: 'var(--bg-base)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ marginBottom: '4px', fontSize: '26px', fontWeight: 800 }}>Kullanıcı Yönetimi</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            {filtered.length} kullanıcı gösteriliyor · Toplam: {users.length}
          </p>
        </div>
        <button
          onClick={handleManualGrantPremium}
          className="btn btn-primary"
          style={{ gap: '8px' }}
        >
          <Crown size={16} /> Manuel Premium Ver
        </button>
      </div>

      {successToast && (
        <div style={{ padding: '12px 18px', borderRadius: '12px', background: 'rgba(74,222,128,0.15)', color: 'var(--sage-dark)', fontWeight: 700, fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} strokeWidth={3} /> {successToast}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text" className="input" placeholder="İsim veya e-posta ara..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['ALL', 'PREMIUM', 'FREE'] as const).map(plan => (
            <button
              key={plan}
              onClick={() => setPlanFilter(plan)}
              className={`badge ${planFilter === plan ? (plan === 'PREMIUM' ? 'badge-premium' : plan === 'FREE' ? 'badge-sage' : 'badge-coral') : ''}`}
              style={{
                cursor: 'pointer', fontFamily: 'inherit',
                border: planFilter === plan ? 'none' : '1.5px solid var(--border-light)',
                background: planFilter === plan ? undefined : 'var(--bg-surface)',
                color: planFilter === plan ? undefined : 'var(--text-muted)',
                padding: '10px 16px',
              }}
            >
              {plan === 'ALL' ? 'Tümü' : plan === 'PREMIUM' ? '⭐ Premium' : 'Basic'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-raised)' }}>
              {['Kullanıcı', 'Bebek', 'Plan', 'Katılım', 'Son Aktif', 'Durum', 'İşlemler'].map(col => (
                <th key={col} style={{
                  padding: '14px 20px', textAlign: 'left', fontSize: '12px',
                  fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderTop: '1px solid var(--border-light)',
                  background: selectedUser === user.id ? 'rgba(0,113,227,0.06)' : 'transparent',
                  transition: 'background var(--transition-fast)',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedUser(user.id === selectedUser ? null : user.id)}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: 'var(--ink)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 700, color: 'var(--ink-contrast)', flexShrink: 0,
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.baby}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.babyAge}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span className={`badge ${user.plan === 'PREMIUM' ? 'badge-premium' : 'badge-sage'}`}>
                    {user.plan === 'PREMIUM' ? '⭐ Premium' : 'Basic'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  {user.joined}
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  {user.lastActive}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: user.status === 'active' ? 'var(--success)' : 'var(--border-medium)',
                    display: 'inline-block', marginRight: '6px',
                  }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {user.status === 'active' ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      title="Planı Değiştir (Premium / Basic)"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePlan(user.id, user.plan)
                      }}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'var(--bg-raised)', border: '1px solid var(--border-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      }}
                    >
                      <Crown size={14} color={user.plan === 'PREMIUM' ? '#D97706' : 'var(--text-muted)'} />
                    </button>
                    <button
                      title="Kullanıcıyı Sil"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteUser(user.id, user.name)
                      }}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.20)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} color="#F87171" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            1-{filtered.length} / {users.length} kullanıcı
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>← Önceki</button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>Sonraki →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
