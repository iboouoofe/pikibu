// Pikibu Sound Engine — Authentic Studio Audio Engine with Web Audio API

export interface SoundPreset {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  bg: string
  category: 'womb' | 'noise' | 'nature' | 'home' | 'lullaby'
  premium?: boolean
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'shush',
    name: 'Pış Pış Sesi',
    emoji: '🤫',
    description: 'Gerçek anne/baba pışpışlaması, ritmik ve sakinleştirici',
    color: '#F472B6',
    bg: 'rgba(244,114,182,0.12)',
    category: 'womb',
  },
  {
    id: 'womb',
    name: 'Anne Karnı',
    emoji: '🫶',
    description: 'Gerçek plasenta, kan akışı ve anne karnı uğultusu',
    color: '#A5A6F6',
    bg: 'rgba(165,166,246,0.12)',
    category: 'womb',
  },
  {
    id: 'heartbeat',
    name: 'Kalp Atışı',
    emoji: '💓',
    description: 'Gerçek 72 BPM ritmik anne kalp atışı (Lub-Dub)',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
    category: 'womb',
  },
  {
    id: 'dryer',
    name: 'Fön Makinesi',
    emoji: '💨',
    description: 'Gerçek fön makinesi sıcak ve kesintisiz hava uğultusu',
    color: '#0071E3',
    bg: 'rgba(0,113,227,0.12)',
    category: 'home',
  },
  {
    id: 'vacuum',
    name: 'Elektrikli Süpürge',
    emoji: '🌀',
    description: 'Gerçek elektrikli süpürge motor sesi ve beyaz gürültü',
    color: '#8EBA9A',
    bg: 'rgba(142,186,154,0.12)',
    category: 'home',
  },
  {
    id: 'fan',
    name: 'Vantilatör',
    emoji: '🪭',
    description: 'Gerçek vantilatör pervanesi ritmik hava esintisi',
    color: '#38BDF8',
    bg: 'rgba(56,189,248,0.12)',
    category: 'home',
  },
  {
    id: 'rain',
    name: 'Yağmur Sesi',
    emoji: '🌧️',
    description: 'Gerçek pencereye ve doğaya vuran sakinleştirici yağmur',
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.12)',
    category: 'nature',
  },
  {
    id: 'ocean',
    name: 'Okyanus Dalgaları',
    emoji: '🌊',
    description: 'Gerçek sahil kumsalına vuran derin huzurlu dalgalar',
    color: '#2DD4BF',
    bg: 'rgba(45,212,191,0.12)',
    category: 'nature',
  },
  {
    id: 'purr',
    name: 'Kedi Mırıltısı',
    emoji: '🐱',
    description: 'Gerçek kedi mırıltısı derin titreşimli gevşetici ses',
    color: '#FB923C',
    bg: 'rgba(251,146,60,0.12)',
    category: 'noise',
  },
  {
    id: 'whitenoise',
    name: 'Beyaz Gürültü',
    emoji: '📻',
    description: 'Dış sesleri bütünüyle izole eden saf gürültü perdesi',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.12)',
    category: 'noise',
  },
  {
    id: 'lullaby1',
    name: 'Klasik Ninni',
    emoji: '🎵',
    description: 'Brahms Lullaby — Gerçek sakinleştirici müzik kutusu',
    color: '#FBBF24',
    bg: 'rgba(251,191,36,0.12)',
    category: 'lullaby',
  },
  {
    id: 'lullaby2',
    name: 'Dandini Dandini',
    emoji: '🌙',
    description: 'Geleneksel Türk ninnisi Dandini Dandini Dastana',
    color: '#C084FC',
    bg: 'rgba(192,132,252,0.12)',
    category: 'lullaby',
  },
]

type ActiveSound = {
  source: AudioBufferSourceNode
  gainNode: GainNode
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private bufferCache: Map<string, AudioBuffer> = new Map()
  private activeSounds: Map<string, ActiveSound> = new Map()
  private pendingIds: Set<string> = new Set()
  private masterVolume: number = 0.85
  private listeners: Set<() => void> = new Set()
  private iosUnlocked: boolean = false

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch((err) => console.warn('AudioContext resume notice:', err))
    }

    // Unlock iOS Audio Session (ensures audio plays through silent switch)
    if (!this.iosUnlocked) {
      try {
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFRm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA')
        silentAudio.volume = 0.01
        silentAudio.play().catch(() => {})
        this.iosUnlocked = true
      } catch {}
    }

    return this.ctx
  }

  private async loadAudioBuffer(id: string, ctx: AudioContext): Promise<AudioBuffer> {
    if (this.bufferCache.has(id)) {
      return this.bufferCache.get(id)!
    }

    try {
      const response = await fetch(`/sounds/${id}.mp3`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching /sounds/${id}.mp3`)
      }
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      this.bufferCache.set(id, audioBuffer)
      return audioBuffer
    } catch (err) {
      console.warn(`Falling back to .wav for ${id}:`, err)
      const resWav = await fetch(`/sounds/${id}.wav`)
      const arrayBuffer = await resWav.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      this.bufferCache.set(id, audioBuffer)
      return audioBuffer
    }
  }

  public getPlayingSounds(): string[] {
    const ids = new Set([...this.activeSounds.keys(), ...this.pendingIds])
    return Array.from(ids)
  }

  public isPlaying(id: string): boolean {
    return this.activeSounds.has(id) || this.pendingIds.has(id)
  }

  public getVolume(): number {
    return Math.round(this.masterVolume * 100)
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol / 100))
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime)
    }
    this.notify()
  }

  public toggle(id: string) {
    if (this.isPlaying(id)) {
      this.stop(id)
    } else {
      this.play(id)
    }
  }

  public async play(id: string, exclusive: boolean = false) {
    const ctx = this.initContext()
    if (!ctx || !this.masterGain) return

    if (ctx.state === 'suspended') {
      await ctx.resume().catch((e) => console.warn('AudioContext resume error:', e))
    }

    if (exclusive) {
      this.stopAll()
    }

    if (this.activeSounds.has(id)) return

    // Immediately mark as playing so UI is snappy
    this.pendingIds.add(id)
    this.notify()

    try {
      const buffer = await this.loadAudioBuffer(id, ctx)

      // Verify the user didn't stop it while it was loading
      if (!this.pendingIds.has(id) && !exclusive) return

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      const gainNode = ctx.createGain()
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime)
      gainNode.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.15)

      source.connect(gainNode)
      gainNode.connect(this.masterGain)

      source.start(0)

      this.activeSounds.set(id, { source, gainNode })
    } catch (err) {
      console.error(`Audio playback error for ${id}:`, err)
    } finally {
      this.pendingIds.delete(id)
      this.notify()
    }
  }

  public stop(id: string) {
    this.pendingIds.delete(id)
    const active = this.activeSounds.get(id)
    if (active && this.ctx) {
      try {
        active.gainNode.gain.setValueAtTime(active.gainNode.gain.value, this.ctx.currentTime)
        active.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1)
        setTimeout(() => {
          try {
            active.source.stop()
            active.source.disconnect()
            active.gainNode.disconnect()
          } catch {}
        }, 120)
      } catch (e) {
        console.error(e)
      }
      this.activeSounds.delete(id)
    }
    this.notify()
  }

  public stopAll() {
    this.pendingIds.clear()
    this.activeSounds.forEach((active) => {
      try {
        if (this.ctx) {
          active.gainNode.gain.setValueAtTime(active.gainNode.gain.value, this.ctx.currentTime)
          active.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1)
        }
        setTimeout(() => {
          try {
            active.source.stop()
            active.source.disconnect()
            active.gainNode.disconnect()
          } catch {}
        }, 120)
      } catch (e) {
        console.error(e)
      }
    })
    this.activeSounds.clear()
    this.notify()
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((l) => l())
  }
}

// Global Singleton
export const soundEngine = new SoundEngine()
