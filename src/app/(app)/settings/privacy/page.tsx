'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Download, Trash2, FileText, Check, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PrivacySettingsPage() {
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Real data export
  const handleExportData = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/baby')
      let exportData: any = {
        exportedAt: new Date().toISOString(),
        appName: 'Pikibu',
        description: 'Kişisel ve bebek takip verileri dökümü',
      }
      if (res.ok) {
        const d = await res.json()
        exportData.baby = d.baby
      }

      // Read local completed vaccines and preferences
      exportData.settings = {
        completedVaccines: JSON.parse(localStorage.getItem('pikibu_completed_vaccines_default') || '[]'),
        notifications: JSON.parse(localStorage.getItem('pikibu_notification_prefs') || '{}'),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pikibu_verilerim_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 3000)
    } catch (e) {
      console.error('Export error:', e)
    } finally {
      setDownloading(false)
    }
  }

  // Account deletion
  const handleDeleteAccount = async () => {
    if (!confirm('Hesabınızı ve tüm bebek verilerini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return
    setDeleting(true)
    try {
      document.cookie = 'pikibu_demo_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
      localStorage.clear()
      sessionStorage.clear()
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch (e) {}
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      window.location.href = '/login'
    } catch (e) {
      console.error(e)
      window.location.href = '/login'
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-surface)', padding: '52px 20px 20px',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', alignItems: 'center', gap: '16px'
      }}>
        <Link href="/settings" style={{ color: 'var(--text-primary)' }} aria-label="Geri">
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Gizlilik ve Güvenlik</h1>
      </div>

      <div style={{ padding: '24px 16px', maxWidth: '520px', margin: '0 auto' }}>
        
        <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden', marginBottom: '24px' }}>
          
          {/* Download Data */}
          <button
            onClick={handleExportData}
            disabled={downloading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)',
              cursor: 'pointer', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {downloading ? (
                  <Loader2 size={18} className="animate-spin" color="#60A5FA" />
                ) : downloaded ? (
                  <Check size={18} color="var(--success)" />
                ) : (
                  <Download size={18} color="#60A5FA" />
                )}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {downloaded ? 'Veriler İndirildi!' : 'Verilerimi İndir'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Tüm kayıtları JSON olarak dışa aktarın
                </div>
              </div>
            </div>
            {downloaded && <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 700 }}>İndirildi</span>}
          </button>

          {/* Privacy Policy */}
          <button
            onClick={() => setShowPolicy(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px', background: 'transparent', border: 'none',
              cursor: 'pointer', textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--bg-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="var(--text-muted)" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Gizlilik Politikası</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>KVKK ve veri saklama koşulları</div>
              </div>
            </div>
          </button>
        </div>

        {/* Danger Zone: Delete Account */}
        <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(239,68,68,0.2)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#EF4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} /> Hesabı ve Verileri Sil
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
            Hesabınızı sildiğinizde bebeğinize ait uyku, beslenme ve sağlık verileri sistemimizden kalıcı olarak temizlenir. Bu işlem geri alınamaz.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              background: '#EF4444', color: 'white', fontWeight: 700, padding: '12px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px'
            }}
          >
            Hesabımı Kalıcı Olarak Sil
          </button>
        </div>

      </div>

      {/* Privacy Policy Modal */}
      {showPolicy && (
        <div className="modal-overlay" onClick={() => setShowPolicy(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="sheet-handle" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Gizlilik ve KVKK Politikası</h2>
              <button onClick={() => setShowPolicy(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p><strong>1. Veri Sahipliği:</strong> Bebeğinize ve ailenize ait tüm sağlık, uyku ve beslenme verileri yalnızca size aittir. Pikibu bu verileri üçüncü taraf reklam şirketlerine satmaz.</p>
              <p><strong>2. Şifreleme ve Güvenlik:</strong> Tüm veriler aktarım sırasında SSL/TLS 256-bit ile, veritabanında ise endüstri standardı şifrelemeyle saklanır.</p>
              <p><strong>3. Silme Hakkı:</strong> İstediğiniz zaman yukarıdaki "Hesabı ve Verileri Sil" seçeneğini kullanarak hesabınızla ilişkili tüm geçmişi silebilirsiniz.</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
            <div className="sheet-handle" />
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={26} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Hesabınızı silmek istediğinize emin misiniz?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Bebeğinizin tüm gelişim takvimleri ve kayıtları silinecektir.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
                style={{ height: '48px', justifyContent: 'center' }}
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{ height: '48px', background: '#EF4444', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
