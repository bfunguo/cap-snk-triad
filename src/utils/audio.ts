/**
 * Arcade Web Audio Synthesizer for Street Fighter Triad
 * Generates responsive sound effects and background music without external assets.
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = true;
  private bgmGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private masterGainNode: GainNode | null = null;
  private volume: number = 0.5;

  constructor() {
    // Recover settings from localStorage if available
    try {
      const storedMute = localStorage.getItem('sf_triad_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
      const storedVol = localStorage.getItem('sf_triad_volume');
      if (storedVol !== null) {
        this.volume = parseFloat(storedVol);
      }
    } catch {
      // localStorage may fail in restricted environments
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGainNode = this.ctx.createGain();
      this.sfxGainNode = this.ctx.createGain();
      this.bgmGainNode = this.ctx.createGain();

      this.masterGainNode.gain.value = this.isMuted ? 0 : this.volume;
      this.sfxGainNode.gain.value = 0.8;
      this.bgmGainNode.gain.value = 0.35;

      this.sfxGainNode.connect(this.masterGainNode);
      this.bgmGainNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('sf_triad_muted', String(muted));
    } catch {}

    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('sf_triad_volume', String(this.volume));
    } catch {}

    if (this.masterGainNode && this.ctx && !this.isMuted) {
      this.masterGainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  public playCardSelect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playCardPlace() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Weighty impact sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  public playCapture() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // High energy clash/capture
    const now = this.ctx.currentTime;
    
    // Low punch
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(320, now);
    osc1.frequency.exponentialRampToValueAtTime(110, now + 0.18);
    gain1.gain.setValueAtTime(0.6, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(this.sfxGainNode);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // High energetic chime
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.05); // E5
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.4, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(this.sfxGainNode);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.28);
  }

  public playTurnChange() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.setValueAtTime(554.37, this.ctx.currentTime + 0.07);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playCoinToss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.06;
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(startTime);
      osc.stop(startTime + 0.08);
    });
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Victory fanfare arpeggio (C - E - G - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.12;
      const duration = i === notes.length - 1 ? 0.6 : 0.18;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  public playDefeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Defeat descending sequence
    const notes = [392.0, 369.99, 329.63, 277.18];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.16;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  public playDraw() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const notes = [440, 440, 440];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.12;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(startTime);
      osc.stop(startTime + 0.15);
    });
  }

  public playTradeSuccess() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const notes = [349.23, 440, 523.25, 698.46, 880];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  public playCardFusion() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.9);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.7);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.95);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(now);
    osc.stop(now + 0.95);
  }

  public playCardReveal() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    // Glorious high-energy celebratory arpeggio (C5, E5, G5, B5, C6, E6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.07;
      const duration = i === notes.length - 1 ? 0.7 : 0.25;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.38, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // --- BACKGROUND ARCADE CHIPTUNE MUSIC ---

  private currentTheme: BGMThemeId = 'menu';
  private rotationQueue: BGMThemeId[] = [];
  private lastPlayedTheme: BGMThemeId | null = null;
  private trackChangeListeners: Set<(track: BGMTrackMeta) => void> = new Set();

  public getCurrentTrack(): BGMTrackMeta {
    return BGM_TRACKS[this.currentTheme] || BGM_TRACKS['menu'];
  }

  public getAllTracks(): BGMTrackMeta[] {
    return ALL_BGM_THEMES.map(id => BGM_TRACKS[id]);
  }

  public getRemainingInRotationCount(): number {
    return this.rotationQueue.length;
  }

  public onTrackChange(listener: (track: BGMTrackMeta) => void): () => void {
    this.trackChangeListeners.add(listener);
    return () => {
      this.trackChangeListeners.delete(listener);
    };
  }

  private notifyTrackChange(track: BGMTrackMeta) {
    this.trackChangeListeners.forEach(listener => {
      try {
        listener(track);
      } catch (err) {
        console.error('Error in track change listener', err);
      }
    });
  }

  /**
   * Generates a freshly shuffled rotation queue containing all 10 tracks.
   * Guarantees no track will repeat until all 10 tracks have been played.
   * Also ensures the first track in a new rotation does not immediately duplicate the last played track.
   */
  private generateRotationQueue(excludeFirst?: BGMThemeId | null): BGMThemeId[] {
    const list = [...ALL_BGM_THEMES];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    if (excludeFirst && list.length > 1 && list[0] === excludeFirst) {
      const swapIdx = 1 + Math.floor(Math.random() * (list.length - 1));
      [list[0], list[swapIdx]] = [list[swapIdx], list[0]];
    }
    return list;
  }

  /**
   * Plays the next song in the non-repeating rotation.
   */
  public playNextSongInRotation(): BGMTrackMeta {
    if (this.rotationQueue.length === 0) {
      this.rotationQueue = this.generateRotationQueue(this.lastPlayedTheme);
    }
    const nextThemeId = this.rotationQueue.shift()!;
    this.lastPlayedTheme = nextThemeId;
    this.startBGM(nextThemeId, false);
    return BGM_TRACKS[nextThemeId];
  }

  public nextTrack(): BGMTrackMeta {
    return this.playNextSongInRotation();
  }

  public startBGM(theme?: BGMThemeId, isManualSelect: boolean = true) {
    // If no specific theme requested, pick next in the non-repeating rotation
    if (!theme) {
      this.playNextSongInRotation();
      return;
    }

    if (isManualSelect) {
      // Consume from rotation queue so it won't repeat before the cycle completes
      this.rotationQueue = this.rotationQueue.filter(id => id !== theme);
      this.lastPlayedTheme = theme;
    }

    // If already playing this theme actively, don't restart it
    if (this.bgmPlaying && this.currentTheme === theme && this.bgmIntervalId !== null) {
      return;
    }

    // Stop active BGM timer
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }

    this.initContext();
    this.bgmPlaying = true;
    this.currentTheme = theme;

    const track = BGM_TRACKS[theme] || BGM_TRACKS['menu'];
    this.notifyTrackChange(track);

    let step = 0;
    const maxSteps = (track.melody.length || 32) * (track.totalCycles || 8);

    const playStep = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGainNode || this.isMuted) return;

      // When this song reaches the end of its duration, seamlessly play the next song in rotation
      if (step >= maxSteps) {
        this.playNextSongInRotation();
        return;
      }

      const now = this.ctx.currentTime;
      const bassFreq = track.bassline[step % track.bassline.length];
      const leadFreq = track.melody[step % track.melody.length];

      // Bass note
      if (bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.14, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGainNode);
        bassOsc.start(now);
        bassOsc.stop(now + 0.12);
      }

      // Lead melody note
      if (leadFreq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = theme === 'sf3_jazzy_nyc' ? 'sine' : 'triangle';
        leadOsc.frequency.setValueAtTime(leadFreq, now);

        leadGain.gain.setValueAtTime(0.10, now);
        leadGain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

        leadOsc.connect(leadGain);
        leadGain.connect(this.bgmGainNode);
        leadOsc.start(now);
        leadOsc.stop(now + 0.14);
      }

      // Kick drum on quarter beat (steps 0, 4, 8, 12, etc.)
      if (step % 4 === 0) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(140, now);
        kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

        kickGain.gain.setValueAtTime(0.18, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGainNode);
        kickOsc.start(now);
        kickOsc.stop(now + 0.09);
      } else if (step % 4 === 2) {
        // Snare / high accent on backbeat
        const snareOsc = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(320, now);
        snareOsc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

        snareGain.gain.setValueAtTime(0.07, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        snareOsc.connect(snareGain);
        snareGain.connect(this.bgmGainNode);
        snareOsc.start(now);
        snareOsc.stop(now + 0.05);
      }

      step++;
    };

    this.bgmIntervalId = window.setInterval(playStep, track.intervalMs);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public isBGMPlaying(): boolean {
    return this.bgmPlaying;
  }

  public toggleBGM(): boolean {
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM(this.currentTheme, false);
      return true;
    }
  }
}

export type BGMThemeId =
  | 'menu'
  | 'sf2_guile'
  | 'sf2_ryu'
  | 'sf2_ken'
  | 'sf2_balrog'
  | 'sf2_chunli'
  | 'sf2_cammy'
  | 'sf2_vega'
  | 'sf2_sagat'
  | 'sf3_jazzy_nyc';

export interface BGMTrackMeta {
  id: BGMThemeId;
  title: string;
  game: string;
  stage: string;
  intervalMs: number;
  totalCycles: number;
  bassline: number[];
  melody: number[];
}

export const ALL_BGM_THEMES: BGMThemeId[] = [
  'menu',
  'sf2_guile',
  'sf2_ryu',
  'sf2_ken',
  'sf2_balrog',
  'sf2_chunli',
  'sf2_cammy',
  'sf2_vega',
  'sf2_sagat',
  'sf3_jazzy_nyc',
];

export const BGM_TRACKS: Record<BGMThemeId, BGMTrackMeta> = {
  // 1. Classic Arcade Menu Theme
  menu: {
    id: 'menu',
    title: 'Arcade Menu Theme',
    game: 'Card Fighter Clash',
    stage: 'Title & System Menu',
    intervalMs: 130,
    totalCycles: 16,
    bassline: [110, 110, 130.81, 110, 146.83, 130.81, 110, 98, 110, 110, 164.81, 146.83, 130.81, 110, 123.47, 98],
    melody: [220, 0, 261.63, 0, 293.66, 329.63, 261.63, 0, 329.63, 0, 392, 349.23, 293.66, 0, 261.63, 220],
  },

  // 2. Guile's Theme (SF2)
  sf2_guile: {
    id: 'sf2_guile',
    title: "Guile's Theme",
    game: 'Street Fighter II',
    stage: 'USAF Air Base',
    intervalMs: 125,
    totalCycles: 8,
    bassline: [
      110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00,
      87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31,
      130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81,
      98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00,
    ],
    melody: [
      659.25, 659.25, 587.33, 659.25, 0, 523.25, 587.33, 523.25,
      440.00, 440.00, 0, 523.25, 587.33, 659.25, 783.99, 880.00,
      659.25, 659.25, 587.33, 659.25, 0, 523.25, 587.33, 523.25,
      392.00, 392.00, 0, 493.88, 523.25, 587.33, 698.46, 783.99,
    ],
  },

  // 3. Ryu's Theme (SF2)
  sf2_ryu: {
    id: 'sf2_ryu',
    title: "Ryu's Theme",
    game: 'Street Fighter II',
    stage: 'Suzaku Castle, Japan',
    intervalMs: 135,
    totalCycles: 8,
    bassline: [
      110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00,
      130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81,
      98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00,
      87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31,
    ],
    melody: [
      440.00, 0, 440.00, 493.88, 523.25, 0, 523.25, 587.33,
      659.25, 0, 659.25, 587.33, 523.25, 493.88, 523.25, 440.00,
      659.25, 0, 659.25, 587.33, 523.25, 0, 523.25, 493.88,
      440.00, 0, 440.00, 523.25, 493.88, 0, 440.00, 392.00,
    ],
  },

  // 4. Ken's Theme (SF2)
  sf2_ken: {
    id: 'sf2_ken',
    title: "Ken's Theme",
    game: 'Street Fighter II',
    stage: 'Battle Harbor, USA',
    intervalMs: 120,
    totalCycles: 8,
    bassline: [
      87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31,
      98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00,
      110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00,
      82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41,
    ],
    melody: [
      440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 587.33, 659.25,
      440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 783.99, 880.00,
      523.25, 493.88, 440.00, 493.88, 523.25, 587.33, 659.25, 523.25,
      587.33, 523.25, 493.88, 523.25, 440.00, 392.00, 440.00, 0,
    ],
  },

  // 5. Balrog's Theme (SF2)
  sf2_balrog: {
    id: 'sf2_balrog',
    title: "Balrog's Theme",
    game: 'Street Fighter II',
    stage: 'Las Vegas Strip, USA',
    intervalMs: 130,
    totalCycles: 8,
    bassline: [
      123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47,
      82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41,
      123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47,
      98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00,
    ],
    melody: [
      659.25, 0, 622.25, 659.25, 739.99, 0, 659.25, 587.33,
      493.88, 0, 493.88, 523.25, 587.33, 0, 523.25, 493.88,
      659.25, 0, 622.25, 659.25, 739.99, 0, 659.25, 587.33,
      783.99, 783.99, 0, 739.99, 659.25, 0, 587.33, 493.88,
    ],
  },

  // 6. NEW: Chun-Li's Theme (SF2)
  sf2_chunli: {
    id: 'sf2_chunli',
    title: "Chun-Li's Theme",
    game: 'Street Fighter II',
    stage: 'Peace Road, China',
    intervalMs: 120,
    totalCycles: 8,
    bassline: [
      87.31, 87.31, 130.81, 87.31, 103.83, 87.31, 130.81, 77.78,
      87.31, 87.31, 130.81, 87.31, 103.83, 116.54, 130.81, 155.56,
      138.59, 138.59, 103.83, 138.59, 155.56, 155.56, 116.54, 155.56,
      87.31, 87.31, 130.81, 87.31, 87.31, 130.81, 174.61, 0,
    ],
    melody: [
      523.25, 0, 698.46, 783.99, 830.61, 783.99, 698.46, 622.25,
      698.46, 0, 523.25, 622.25, 698.46, 783.99, 830.61, 932.33,
      1046.50, 0, 932.33, 830.61, 783.99, 698.46, 622.25, 523.25,
      622.25, 698.46, 0, 783.99, 830.61, 783.99, 698.46, 0,
    ],
  },

  // 7. NEW: Cammy's Theme (Super Street Fighter II)
  sf2_cammy: {
    id: 'sf2_cammy',
    title: "Cammy's Theme",
    game: 'Super Street Fighter II',
    stage: 'Old Temple, England',
    intervalMs: 115,
    totalCycles: 8,
    bassline: [
      73.42, 73.42, 73.42, 73.42, 87.31, 87.31, 98.00, 98.00,
      110.00, 110.00, 98.00, 98.00, 87.31, 87.31, 73.42, 73.42,
      73.42, 73.42, 73.42, 73.42, 87.31, 87.31, 98.00, 98.00,
      110.00, 110.00, 110.00, 110.00, 130.81, 130.81, 146.83, 146.83,
    ],
    melody: [
      587.33, 0, 587.33, 659.25, 698.46, 0, 880.00, 783.99,
      698.46, 659.25, 587.33, 659.25, 698.46, 0, 587.33, 0,
      587.33, 0, 587.33, 659.25, 698.46, 0, 880.00, 1046.50,
      880.00, 0, 783.99, 698.46, 659.25, 0, 587.33, 0,
    ],
  },

  // 8. NEW: Vega's Theme (SF2)
  sf2_vega: {
    id: 'sf2_vega',
    title: "Vega's Theme",
    game: 'Street Fighter II',
    stage: 'Mesón de la Taberna, Spain',
    intervalMs: 125,
    totalCycles: 8,
    bassline: [
      82.41, 82.41, 82.41, 82.41, 87.31, 87.31, 87.31, 87.31,
      98.00, 98.00, 98.00, 98.00, 87.31, 87.31, 82.41, 82.41,
      82.41, 82.41, 82.41, 82.41, 87.31, 87.31, 87.31, 87.31,
      123.47, 123.47, 123.47, 123.47, 82.41, 82.41, 82.41, 82.41,
    ],
    melody: [
      659.25, 0, 698.46, 659.25, 622.25, 659.25, 783.99, 698.46,
      659.25, 0, 587.33, 523.25, 493.88, 0, 523.25, 493.88,
      440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00,
      783.99, 698.46, 659.25, 587.33, 493.88, 0, 659.25, 0,
    ],
  },

  // 9. NEW: Sagat's Theme (SF2)
  sf2_sagat: {
    id: 'sf2_sagat',
    title: "Sagat's Theme",
    game: 'Street Fighter II',
    stage: 'Ayutthaya Ruins, Thailand',
    intervalMs: 130,
    totalCycles: 8,
    bassline: [
      65.41, 65.41, 65.41, 65.41, 65.41, 65.41, 77.78, 87.31,
      98.00, 98.00, 98.00, 98.00, 87.31, 87.31, 77.78, 65.41,
      65.41, 65.41, 65.41, 65.41, 65.41, 65.41, 77.78, 87.31,
      98.00, 98.00, 116.54, 98.00, 87.31, 77.78, 65.41, 65.41,
    ],
    melody: [
      523.25, 0, 523.25, 622.25, 783.99, 0, 783.99, 698.46,
      622.25, 0, 523.25, 0, 587.33, 622.25, 587.33, 0,
      523.25, 0, 523.25, 622.25, 783.99, 0, 932.33, 783.99,
      698.46, 783.99, 622.25, 0, 587.33, 0, 523.25, 0,
    ],
  },

  // 10. NEW: Jazzy NYC '99 (SF3: 3rd Strike)
  sf3_jazzy_nyc: {
    id: 'sf3_jazzy_nyc',
    title: "Jazzy NYC '99",
    game: 'Street Fighter III: 3rd Strike',
    stage: 'Underground Subway / Rooftop',
    intervalMs: 125,
    totalCycles: 8,
    bassline: [
      77.78, 0, 77.78, 92.50, 103.83, 0, 116.54, 103.83,
      77.78, 77.78, 0, 69.30, 77.78, 0, 92.50, 103.83,
      116.54, 0, 116.54, 103.83, 92.50, 77.78, 0, 69.30,
      77.78, 0, 77.78, 92.50, 103.83, 0, 116.54, 0,
    ],
    melody: [
      311.13, 0, 369.99, 415.30, 466.16, 0, 466.16, 415.30,
      369.99, 0, 311.13, 0, 277.18, 311.13, 0, 0,
      466.16, 0, 554.37, 466.16, 415.30, 0, 369.99, 415.30,
      466.16, 0, 415.30, 369.99, 311.13, 0, 311.13, 0,
    ],
  },
};

export const audio = new AudioManager();
