'use client'

import { useState } from 'react'
import { Search, ChevronRight, AlertTriangle, Info, Apple, X, Check, Clock, Sparkles } from 'lucide-react'
import { COMPLETE_FOODS } from '@/lib/foodsData'


// Emoji map for common baby foods
const foodEmojis: Record<string, string> = {
  'havuç': '🥕',
  'carrot': '🥕',
  'elma': '🍎',
  'apple': '🍎',
  'tatlı patates': '🍠',
  'sweet potato': '🍠',
  'patates': '🥔',
  'avokado': '🥑',
  'avocado': '🥑',
  'yumurta': '🥚',
  'egg': '🥚',
  'somonbalığı': '🐟',
  'somon': '🐟',
  'salmon': '🐟',
  'muz': '🍌',
  'banana': '🍌',
  'brokoli': '🥦',
  'broccoli': '🥦',
  'yulaf ezmesi': '🌾',
  'yulaf': '🌾',
  'oatmeal': '🌾',
  'ev yoğurdu': '🥣',
  'yoğurt': '🥣',
  'yogurt': '🥣',
  'kırmızı mercimek': '🫘',
  'mercimek': '🫘',
  'lentil': '🫘',
  'tavuk göğsü': '🍗',
  'tavuk': '🍗',
  'chicken': '🍗',
  'kabak': '🥒',
  'zucchini': '🥒',
  'armut': '🍐',
  'pear': '🍐',
  'şeftali': '🍑',
  'peach': '🍑',
  'balkabağı': '🎃',
  'pumpkin': '🎃',
}

function getFoodEmoji(name: string = ''): string {
  const lower = name.toLowerCase().trim()
  for (const [key, emoji] of Object.entries(foodEmojis)) {
    if (lower.includes(key)) return emoji
  }
  return '🥗'
}

// Built-in recipes if DB has none
const defaultRecipes = [
  {
    id: 'rec-1',
    title: 'Tatlı Patates & Havuç Püresi',
    emoji: '🍠',
    minMonth: 6,
    type: 'Püre',
    time: '15 dk',
    ingredients: [
      '1 küçük tatlı patates',
      '1 küçük havuç',
      '1 tatlı kaşığı sızma zeytinyağı',
      '2 yemek kaşığı anne sütü veya formül mama'
    ],
    steps: [
      'Tatlı patates ve havucu soyup küçük küpler halinde doğrayın.',
      'Buharda yumuşayana kadar yaklaşık 12-15 dakika pişirin.',
      'Çatalla iyice ezin, zeytinyağı ve sütü ekleyerek pürüzsüz kıvam elde edin.',
      'Ilık olarak servis yapın.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Avokadolu Yumurta Sarısı BLW',
    emoji: '🥑',
    minMonth: 7,
    type: 'BLW',
    time: '10 dk',
    ingredients: [
      '1 adet haşlanmış yumurta sarısı',
      'Yarım olgun avokado',
      'Birkaç damla zeytinyağı'
    ],
    steps: [
      'Yumurtayı katı haşlayıp sadece sarısını ayırın.',
      'Avokadoyu çatalla ezin ve yumurta sarısı ile homojen karıştırın.',
      'Bebeğin parmaklarıyla kavrayabileceği küçük toplar halinde sunun.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Yulaflı Bebek Pankeki',
    emoji: '🥞',
    minMonth: 7,
    type: 'BLW',
    time: '15 dk',
    ingredients: [
      '1 adet olgun muz',
      '1 yemek kaşığı öğütülmüş yulaf ezmesi',
      '1 yumurta sarısı'
    ],
    steps: [
      'Muzu çatalla pürüzsüz olana kadar ezin.',
      'Yumurta sarısı ve yulaf ezmesini ekleyip çırpın.',
      'Yapışmaz tavayı hafifçe yağlayıp kısık ateşte önlü arkalı pişirin.',
      'Şeritler halinde keserek servis yapın.'
    ]
  },
  {
    id: 'rec-4',
    title: 'İlk Sebze Çorbası',
    emoji: '🍲',
    minMonth: 6,
    type: 'Çorba',
    time: '20 dk',
    ingredients: [
      'Yarım kabak',
      'Yarım havuç',
      '1 tatlı kaşığı pirinç veya irmik',
      '1 su bardağı su',
      '1 tatlı kaşığı zeytinyağı'
    ],
    steps: [
      'Sebzeleri yıkayıp küçük parçalara bölün.',
      'Su ve pirinç ile birlikte yumuşayana kadar haşlayın.',
      'Zeytinyağını ekleyip çatalla ezin veya tel süzgeçten geçirin.'
    ]
  }
]

const allergenColors: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: 'rgba(48, 177, 92, 0.12)', color: 'var(--sage-dark)', label: 'Düşük Risk' },
  2: { bg: 'rgba(255, 159, 10, 0.14)', color: 'var(--butter-dark)', label: 'Orta Risk' },
  3: { bg: 'rgba(255, 69, 58, 0.14)', color: '#FF453A', label: 'Yüksek Risk' },
}

const categories = ['Hepsi', 'Sebze', 'Meyve', 'Protein', 'Tahıl', 'Süt']

interface FeedingClientProps {
  dbFoods: any[]
  dbRecipes: any[]
  initialBabyMonths?: number
  initialBabyName?: string
}

export default function FeedingClient({
  dbFoods,
  dbRecipes,
  initialBabyMonths = 4,
  initialBabyName = 'Bebeğiniz'
}: FeedingClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Hepsi')
  const [activeTab, setActiveTab] = useState<'library' | 'tracker' | 'recipes'>('library')
  
  // Interactive expanded row & modal state
  const [expandedFoodId, setExpandedFoodId] = useState<string | null>(null)
  const [detailFood, setDetailFood] = useState<any | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null)

  // 3-day rule tracker state
  const [activeTracker, setActiveTracker] = useState<{
    foodName: string
    emoji: string
    day: number
    status: 'testing' | 'completed'
  }>({
    foodName: 'Yumurta Sarısı',
    emoji: '🥚',
    day: 2,
    status: 'testing',
  })

  const [completedTrackers, setCompletedTrackers] = useState<string[]>([
    '🥕 Havuç',
    '🍎 Elma',
    '🥑 Avokado'
  ])

  const babyMonths = initialBabyMonths
  const babyName = initialBabyName

  // Normalize foods with safe emoji and category
  const rawFoods = Array.isArray(dbFoods) && dbFoods.length > 0 ? dbFoods : COMPLETE_FOODS
  const foods = rawFoods.map((f, idx) => {
    const id = String(f.id || `food-${idx}`)
    const name = f.nameTr || f.name || 'Besin'
    const emoji = getFoodEmoji(name)
    const category = (f.category || 'sebze').toLowerCase()
    const allergenLevel = Number(f.allergenLevel) || 1
    const servingGuide = f.servingGuide || 'Buharda yumuşayana kadar haşlayarak püre veya parmak gıda (BLW) olarak sunabilirsiniz.'
    return {
      ...f,
      id,
      name,
      emoji,
      category,
      allergenLevel,
      servingGuide,
      minMonth: f.minMonth || 6,
    }
  })

  // Filter foods by search & category
  const filteredFoods = foods.filter(f => {
    const q = search.toLowerCase().trim()
    const matchSearch = !q || f.name.toLowerCase().includes(q)
    const cat = f.category.toLowerCase()
    const active = activeCategory.toLowerCase()
    const matchCat =
      activeCategory === 'Hepsi' ||
      cat === active ||
      cat.includes(active) ||
      (active === 'sebze' && (cat.includes('sebze') || cat.includes('vegetable'))) ||
      (active === 'meyve' && (cat.includes('meyve') || cat.includes('fruit'))) ||
      (active === 'protein' && (cat.includes('protein') || cat.includes('meat') || cat.includes('fish') || cat.includes('egg') || cat.includes('bakliyat'))) ||
      (active === 'tahıl' && (cat.includes('tahıl') || cat.includes('tahil') || cat.includes('grain'))) ||
      (active === 'süt' && (cat.includes('süt') || cat.includes('sut') || cat.includes('dairy')))
    return matchSearch && matchCat
  })

  // Normalize recipes
  const rawRecipes = Array.isArray(dbRecipes) && dbRecipes.length > 0 ? dbRecipes : defaultRecipes
  const recipes = rawRecipes.map((r, idx) => {
    const title = r.title || r.name || `Tarif ${idx + 1}`
    const emoji = r.emoji || getFoodEmoji(title)
    const time = r.time || (r.prepMins ? `${r.prepMins} dk` : '15 dk')
    const type = r.type || (title.includes('BLW') ? 'BLW' : title.includes('Çorba') ? 'Çorba' : 'Püre')
    let steps: string[] = []
    if (Array.isArray(r.steps)) {
      steps = r.steps
    } else if (typeof r.instructions === 'string') {
      steps = r.instructions.split('\n').map((s: string) => s.trim().replace(/^\d+\.\s*/, '')).filter(Boolean)
    } else {
      steps = ['Malzemeleri hazırlayın.', 'Buharda yumuşayana kadar pişirin.', 'Ezerek ılık servis edin.']
    }
    const ingredients: string[] = Array.isArray(r.ingredients) && r.ingredients.length > 0
      ? r.ingredients
      : ['Taze organik sebze veya meyve', '1 tatlı kaşığı sızma zeytinyağı']

    return {
      ...r,
      id: String(r.id || `recipe-${idx}`),
      title,
      emoji,
      time,
      type,
      steps,
      ingredients,
      minMonth: r.minMonth || 6,
    }
  })

  const handleStartTracking = (food: any) => {
    setActiveTracker({
      foodName: food.name,
      emoji: food.emoji,
      day: 1,
      status: 'testing'
    })
    setDetailFood(null)
    setExpandedFoodId(null)
    setActiveTab('tracker')
  }

  const handleAdvanceDay = () => {
    if (activeTracker.day < 3) {
      setActiveTracker(prev => ({ ...prev, day: prev.day + 1 }))
    } else {
      // Completed 3-day rule
      setCompletedTrackers(prev => [...prev, `${activeTracker.emoji} ${activeTracker.foodName}`])
      setActiveTracker(prev => ({ ...prev, status: 'completed' }))
    }
  }

  const handleToggleFood = (foodId: string) => {
    setExpandedFoodId(prev => (prev === foodId ? null : foodId))
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)' }}>
      {/* Header */}
      <header style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 28px) 20px 8px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="eyebrow">{babyName} · {babyMonths} aylık</span>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>Beslenme</h1>
        <p style={{ marginTop: '6px', fontSize: '16px', color: 'var(--text-muted)', letterSpacing: '-0.015em' }}>
          Ek gıdaya geçiş rehberi, 3 gün alerji takibi ve bebek tarifleri
        </p>

        {/* Apple Style Segmented Tab Control */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--bg-raised)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            marginTop: '20px',
            border: '0.5px solid var(--border-light)'
          }}
        >
          {(['library', 'tracker', 'recipes'] as const).map((tab) => {
            const labels = { library: 'Kütüphane', tracker: 'Alerji Takibi', recipes: 'Tarifler' }
            const active = activeTab === tab
            return (
              <button
                type="button"
                role="tab"
                key={tab}
                id={`tab-${tab}`}
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  background: active ? 'var(--bg-surface)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: active ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'background var(--transition-fast), color var(--transition-fast)',
                  touchAction: 'manipulation',
                  pointerEvents: 'auto',
                }}
              >
                {labels[tab]}
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ padding: '16px 16px 120px', maxWidth: '520px', margin: '0 auto' }}>

        {/* TAB 1: Kütüphane (Food Library) */}
        {activeTab === 'library' && (
          <div>
            {/* Age guidance banner */}
            {babyMonths < 6 && (
              <div style={{
                background: 'rgba(255, 159, 10, 0.10)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(255, 159, 10, 0.25)',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}>
                <AlertTriangle size={20} color="var(--butter-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                    Ek Gıda Dönemi Yaklaşıyor
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '3px' }}>
                    {babyName} henüz <strong>{babyMonths} aylık</strong>. Dünya Sağlık Örgütü ilk 6 ay sadece anne sütü veya formül mama önerir. Besinleri şimdi inceleyebilir, başlangıç için doktorunuza danışabilirsiniz.
                  </p>
                </div>
              </div>
            )}

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                id="food-search-input"
                type="text"
                className="input"
                placeholder="Besin ara (kabak, havuç, avokado...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '46px', height: '48px', borderRadius: 'var(--radius-xl)' }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
              marginBottom: '18px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}>
              {categories.map(cat => {
                const isCatActive = activeCategory === cat
                return (
                  <button
                    type="button"
                    key={cat}
                    id={`cat-filter-${cat.toLowerCase()}`}
                    onClick={() => setActiveCategory(cat)}
                    className="pressable"
                    style={{
                      border: isCatActive ? '1px solid var(--ink)' : '1px solid var(--border-light)',
                      background: isCatActive ? 'var(--ink)' : 'var(--bg-surface)',
                      color: isCatActive ? 'var(--ink-contrast)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      padding: '8px 16px',
                      fontSize: '13px',
                      borderRadius: '100px',
                      fontWeight: 600,
                      touchAction: 'manipulation',
                      pointerEvents: 'auto',
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>

            {/* Food Grid / Interactive Expandable List */}
            <div className="list-group">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, idx) => {
                  const isExpanded = expandedFoodId === food.id
                  const allergenInfo = allergenColors[food.allergenLevel] || allergenColors[1]

                  return (
                    <div key={food.id} style={{ borderTop: idx === 0 ? 'none' : '0.5px solid var(--border-light)' }}>
                      <button
                        type="button"
                        id={`food-row-${food.id}`}
                        onClick={() => handleToggleFood(food.id)}
                        aria-expanded={isExpanded}
                        className="pressable"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          width: '100%',
                          padding: '16px',
                          background: isExpanded ? 'var(--bg-raised)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          color: 'var(--text-primary)',
                          touchAction: 'manipulation',
                          pointerEvents: 'auto',
                          WebkitTapHighlightColor: 'transparent',
                          transition: 'background var(--transition-fast)',
                        }}
                      >
                        <span style={{ fontSize: '32px', flexShrink: 0, lineHeight: 1, pointerEvents: 'none' }}>
                          {food.emoji}
                        </span>
                        <div style={{ flex: 1, minWidth: 0, pointerEvents: 'none' }}>
                          <div style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '-0.015em' }}>
                            {food.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-subtle)' }}>
                              +{food.minMonth}. ay
                            </span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '100px',
                              background: allergenInfo.bg,
                              color: allergenInfo.color,
                            }}>
                              {allergenInfo.label}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          color="var(--text-subtle)"
                          style={{
                            flexShrink: 0,
                            transform: isExpanded ? 'rotate(90deg)' : 'none',
                            transition: 'transform var(--transition-base)',
                            pointerEvents: 'none',
                          }}
                        />
                      </button>

                      {/* INLINE EXPANSION CONTENT */}
                      {isExpanded && (
                        <div className="animate-slide-down" style={{ padding: '0 16px 18px 62px', background: 'var(--bg-raised)' }}>
                          <div style={{ paddingTop: '8px', marginBottom: '14px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                              Nasıl Sunulmalı?
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                              {food.servingGuide}
                            </p>
                          </div>

                          <div style={{
                            background: allergenInfo.bg,
                            borderRadius: 'var(--radius-md)',
                            padding: '10px 12px',
                            marginBottom: '14px',
                            fontSize: '12px',
                            color: allergenInfo.color,
                            lineHeight: 1.45,
                          }}>
                            <strong>{allergenInfo.label}:</strong>{' '}
                            {food.allergenLevel === 1
                              ? 'Alerji riski düşüktür, güvenle başlanabilir.'
                              : food.allergenLevel === 2
                              ? 'Orta risklidir, ilk kez verirken az miktarla başlayın.'
                              : 'Yaygın alerjendir, sabah saatlerinde az miktarla test edin.'}
                          </div>

                          {/* Quick action buttons inside expanded row */}
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              id={`food-track-btn-${food.id}`}
                              className="btn btn-primary pressable"
                              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartTracking(food)
                              }}
                            >
                              3 Gün Takibine Ekle
                            </button>
                            <button
                              type="button"
                              id={`food-modal-btn-${food.id}`}
                              className="btn btn-secondary pressable"
                              style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', touchAction: 'manipulation' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setDetailFood(food)
                              }}
                            >
                              Tam Rehber
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Aramanıza uygun besin bulunamadı.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Alerji Takibi (3-Day Rule Tracker) */}
        {activeTab === 'tracker' && (
          <div>
            {/* 3 Day Rule explanation card */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              padding: '18px',
              marginBottom: '20px',
              display: 'flex',
              gap: '12px',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(94, 92, 230, 0.12)', color: 'var(--lavender-dark)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Info size={19} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
                  3 Gün Kuralı Nedir?
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>
                  Her yeni besini ilk kez verirken ardışık 3 gün boyunca az miktarda deneyin. Bu süreçte başka yeni gıda vermeyin; olası alerji ve sindirim tepkilerini rahatça gözlemleyin.
                </p>
              </div>
            </div>

            {/* Currently Testing Card */}
            <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '28px' }}>{activeTracker.emoji}</span>
                  <div>
                    <span className="eyebrow" style={{ fontSize: '11px' }}>Şu an test ediliyor</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{activeTracker.foodName}</h3>
                  </div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
                  background: activeTracker.status === 'completed' ? 'rgba(48, 177, 92, 0.12)' : 'rgba(255, 159, 10, 0.14)',
                  color: activeTracker.status === 'completed' ? 'var(--sage-dark)' : 'var(--butter-dark)',
                }}>
                  {activeTracker.status === 'completed' ? '✓ Başarıyla Tamamlandı' : `${activeTracker.day}. Gün Sürüyor`}
                </span>
              </div>

              {/* 3 Days Interactive Progress Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                {[1, 2, 3].map(day => {
                  const isDone = day < activeTracker.day || activeTracker.status === 'completed'
                  const isCurrent = day === activeTracker.day && activeTracker.status !== 'completed'
                  return (
                    <div
                      key={day}
                      style={{
                        padding: '12px 8px',
                        textAlign: 'center',
                        borderRadius: 'var(--radius-md)',
                        background: isDone ? 'var(--sage)' : isCurrent ? 'var(--bg-raised)' : 'var(--bg-surface)',
                        color: isDone ? '#FFFFFF' : 'var(--text-primary)',
                        border: isCurrent ? '1.5px solid var(--ink)' : '1px solid var(--border-light)',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.02em' }}>
                        {day}. GÜN
                      </div>
                      <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>
                        {isDone ? 'Tamamlandı ✓' : isCurrent ? 'Bugün' : 'Bekliyor'}
                      </div>
                    </div>
                  )
                })}
              </div>

              {activeTracker.status !== 'completed' ? (
                <button
                  type="button"
                  id="advance-tracker-btn"
                  onClick={handleAdvanceDay}
                  className="btn btn-primary btn-block pressable"
                  style={{ height: '48px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', touchAction: 'manipulation' }}
                >
                  {activeTracker.day < 3 ? `${activeTracker.day}. Günü Tamamla & İlerle` : '3. Günü Tamamla (Alerji Yok)'}
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('library')}
                    className="btn btn-primary btn-block pressable"
                    style={{ height: '48px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                  >
                    Yeni Besin Seç
                  </button>
                </div>
              )}
            </div>

            {/* Completed Foods History */}
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <span className="section-title">Güvenle Tamamlananlar</span>
            </div>
            <div className="list-group">
              {completedTrackers.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderTop: idx === 0 ? 'none' : '0.5px solid var(--border-light)',
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '15px' }}>{item}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--sage-dark)', fontSize: '13px', fontWeight: 600 }}>
                    <Check size={16} strokeWidth={2.5} />
                    <span>Alerji Görülmedi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Tarifler (Recipes) */}
        {activeTab === 'recipes' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {recipes.map((recipe) => (
                <button
                  type="button"
                  key={recipe.id}
                  id={`recipe-card-${recipe.id}`}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="card pressable"
                  style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-xl)',
                    touchAction: 'manipulation',
                    pointerEvents: 'auto',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px', lineHeight: 1, pointerEvents: 'none' }}>
                    {recipe.emoji}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '15px', lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: '8px', pointerEvents: 'none' }}>
                    {recipe.title}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 'auto', paddingTop: '8px', pointerEvents: 'none' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                      +{recipe.minMonth}. ay
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '100px',
                      background: 'var(--bg-raised)',
                      color: 'var(--text-primary)'
                    }}>
                      {recipe.type}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none' }}>
                    <Clock size={12} /> {recipe.time}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOD DETAIL FULL BOTTOM-SHEET MODAL */}
      {detailFood && (
        <div
          className="modal-overlay"
          style={{ justifyContent: 'center', zIndex: 9999, pointerEvents: 'auto' }}
          onClick={() => setDetailFood(null)}
          role="dialog"
          aria-modal="true"
          aria-label={detailFood.name}
        >
          <div
            className="bottom-sheet"
            style={{ maxWidth: '560px', background: 'var(--bg-base)', pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '44px', lineHeight: 1 }}>{detailFood.emoji}</span>
                <div>
                  <span className="eyebrow">+{detailFood.minMonth}. Ay · {detailFood.category}</span>
                  <h2 style={{ fontSize: '26px', marginTop: '2px', letterSpacing: '-0.025em' }}>{detailFood.name}</h2>
                </div>
              </div>
              <button
                type="button"
                id="food-detail-close"
                onClick={() => setDetailFood(null)}
                aria-label="Kapat"
                style={{
                  width: '36px', height: '36px', border: 'none', borderRadius: '50%',
                  background: 'var(--bg-raised)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                  touchAction: 'manipulation', pointerEvents: 'auto',
                }}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* Allergen Card */}
            <div className="card" style={{ marginBottom: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Alerji Riski</span>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px',
                  background: (allergenColors[detailFood.allergenLevel] || allergenColors[1]).bg,
                  color: (allergenColors[detailFood.allergenLevel] || allergenColors[1]).color,
                }}>
                  {(allergenColors[detailFood.allergenLevel] || allergenColors[1]).label}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.55 }}>
                {detailFood.allergenLevel === 1 && 'Bu besin genellikle alerji riski düşük, sindirimi kolay ve güvenli bir ilk başlangıç besinidir.'}
                {detailFood.allergenLevel === 2 && 'Orta derece alerji potansiyeline sahiptir. İlk verirken az miktarda başlayıp 3 gün kuralını uygulayın.'}
                {detailFood.allergenLevel === 3 && 'Yaygın bir alerjendir (Yumurta, Balık vb.). İlk kez denerken sabah saatlerinde az miktarda verip bebeği izleyin.'}
              </p>
            </div>

            {/* Serving Guide Card */}
            <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
              <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '12px' }}>
                Nasıl Sunulmalı?
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.55, margin: 0 }}>
                {detailFood.servingGuide}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                id="food-start-track-btn"
                className="btn btn-primary btn-block pressable"
                style={{ height: '52px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', touchAction: 'manipulation' }}
                onClick={() => handleStartTracking(detailFood)}
              >
                3 Gün Kuralı Takibine Ekle
              </button>
              <button
                type="button"
                id="food-detail-dismiss"
                className="btn btn-secondary btn-block pressable"
                style={{ height: '48px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', touchAction: 'manipulation' }}
                onClick={() => setDetailFood(null)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div
          className="modal-overlay"
          style={{ justifyContent: 'center', zIndex: 9999, pointerEvents: 'auto' }}
          onClick={() => setSelectedRecipe(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedRecipe.title}
        >
          <div
            className="bottom-sheet"
            style={{ maxWidth: '560px', background: 'var(--bg-base)', pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sheet-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '44px', lineHeight: 1 }}>{selectedRecipe.emoji}</span>
                <div>
                  <span className="eyebrow">+{selectedRecipe.minMonth}. Ay · {selectedRecipe.type} · ⏱ {selectedRecipe.time}</span>
                  <h2 style={{ fontSize: '24px', marginTop: '2px', letterSpacing: '-0.025em' }}>{selectedRecipe.title}</h2>
                </div>
              </div>
              <button
                type="button"
                id="recipe-detail-close"
                onClick={() => setSelectedRecipe(null)}
                aria-label="Kapat"
                style={{
                  width: '36px', height: '36px', border: 'none', borderRadius: '50%',
                  background: 'var(--bg-raised)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                  touchAction: 'manipulation', pointerEvents: 'auto',
                }}
              >
                <X size={18} strokeWidth={2.4} />
              </button>
            </div>

            {/* Ingredients Card */}
            <div className="card" style={{ marginBottom: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Apple size={17} color="var(--sage-dark)" />
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Malzemeler</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedRecipe.ingredients.map((ing: string, i: number) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps Card */}
            <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={17} color="var(--butter-dark)" />
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Hazırlanışı</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedRecipe.steps.map((step: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'var(--bg-raised)', color: 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: '2px'
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.55 }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              id="recipe-detail-dismiss"
              className="btn btn-primary btn-block pressable"
              style={{ height: '52px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', touchAction: 'manipulation' }}
              onClick={() => setSelectedRecipe(null)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
