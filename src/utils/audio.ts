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

  private currentTheme: 'menu' | 'sf2_guile' | 'sf2_ryu' | 'sf2_ken' | 'sf2_balrog' = 'menu';

  public startBGM(theme: 'menu' | 'sf2_guile' | 'sf2_ryu' | 'sf2_ken' | 'sf2_balrog' = 'menu') {
    // If already playing correct theme, keep going
    if (this.bgmPlaying && this.currentTheme === theme) return;

    // Stop any active BGM timer first
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }

    this.initContext();
    this.bgmPlaying = true;
    this.currentTheme = theme;

    let bassline: number[] = [];
    let melody: number[] = [];
    let intervalMs = 130;

    if (theme === 'sf2_guile') {
      // Guile's Theme (SF2) - High driving speed, key of A minor chiptune
      bassline = [
        110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, // A2 (Bars 1-2)
        87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31,         // F2 (Bars 3-4)
        130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, // C3 (Bars 5-6)
        98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00          // G2 (Bars 7-8)
      ];

      melody = [
        659.25, 659.25, 587.33, 659.25, 0, 523.25, 587.33, 523.25,      // E5 E5 D5 E5 . C5 D5 C5
        440.00, 440.00, 0, 523.25, 587.33, 659.25, 783.99, 880.00,      // A4 A4 . C5 D5 E5 G5 A5
        659.25, 659.25, 587.33, 659.25, 0, 523.25, 587.33, 523.25,      // E5 E5 D5 E5 . C5 D5 C5
        392.00, 392.00, 0, 493.88, 523.25, 587.33, 698.46, 783.99       // G4 G4 . B4 C5 D5 F5 G5
      ];
      intervalMs = 125;
    } else if (theme === 'sf2_ryu') {
      // Ryu's Theme (SF2) - Bold and epic, key of A minor chiptune
      bassline = [
        110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, // A2 (Bars 1-2)
        130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, 130.81, // C3 (Bars 3-4)
        98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00,         // G2 (Bars 5-6)
        87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31          // F2 (Bars 7-8)
      ];

      melody = [
        440.00, 0, 440.00, 493.88, 523.25, 0, 523.25, 587.33,           // A4 . A4 B4 C5 . C5 D5
        659.25, 0, 659.25, 587.33, 523.25, 493.88, 523.25, 440.00,      // E5 . E5 D5 C5 B4 C5 A4
        659.25, 0, 659.25, 587.33, 523.25, 0, 523.25, 493.88,           // E5 . E5 D5 C5 . C5 B4
        440.00, 0, 440.00, 523.25, 493.88, 0, 440.00, 392.00            // A4 . A4 C5 B4 . A4 G4
      ];
      intervalMs = 135;
    } else if (theme === 'sf2_ken') {
      // Ken's Theme (SF2) - High-energy rock style, key of A minor chiptune
      bassline = [
        87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31, 87.31,         // F2 (Bars 1-2)
        98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00,         // G2 (Bars 3-4)
        110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, 110.00, // A2 (Bars 5-6)
        82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41          // E2 (Bars 7-8)
      ];

      melody = [
        440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 587.33, 659.25, // A4 C5 E5 A5 G5 E5 D5 E5
        440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 783.99, 880.00, // A4 C5 E5 A5 G5 E5 G5 A5
        523.25, 493.88, 440.00, 493.88, 523.25, 587.33, 659.25, 523.25, // C5 B4 A4 B4 C5 D5 E5 C5
        587.33, 523.25, 493.88, 523.25, 440.00, 392.00, 440.00, 0       // D5 C5 B4 C5 A4 G4 A4 .
      ];
      intervalMs = 120; // Driving tempo
    } else if (theme === 'sf2_balrog') {
      // Balrog's Theme (SF2 Las Vegas stage) - Bouncy casino beat
      bassline = [
        123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47, // B2
        82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41, 82.41,         // E2
        123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47, 123.47, // B2
        98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00, 98.00          // G2
      ];

      melody = [
        659.25, 0, 622.25, 659.25, 739.99, 0, 659.25, 587.33,           // E5 . D#5 E5 F#5 . E5 D5
        493.88, 0, 493.88, 523.25, 587.33, 0, 523.25, 493.88,           // B4 . B4 C5 D5 . C5 B4
        659.25, 0, 622.25, 659.25, 739.99, 0, 659.25, 587.33,           // E5 . D#5 E5 F#5 . E5 D5
        783.99, 783.99, 0, 739.99, 659.25, 0, 587.33, 493.88            // G5 G5 . F#5 E5 . D5 B4
      ];
      intervalMs = 130;
    } else {
      // Default Menu Theme (16-step bassline & lead groove)
      bassline = [110, 110, 130.81, 110, 146.83, 130.81, 110, 98, 110, 110, 164.81, 146.83, 130.81, 110, 123.47, 98];
      melody = [220, 0, 261.63, 0, 293.66, 329.63, 261.63, 0, 329.63, 0, 392, 349.23, 293.66, 0, 261.63, 220];
      intervalMs = 130;
    }

    let step = 0;

    const playStep = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGainNode || this.isMuted) return;

      const now = this.ctx.currentTime;
      const bassFreq = bassline[step % bassline.length];
      const leadFreq = melody[step % melody.length];

      const isSF2 = theme.startsWith('sf2_');

      // Bass note
      if (bassFreq > 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(isSF2 ? 0.14 : 0.18, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.11);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGainNode);
        bassOsc.start(now);
        bassOsc.stop(now + 0.12);
      }

      // Lead note
      if (leadFreq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(leadFreq, now);

        leadGain.gain.setValueAtTime(isSF2 ? 0.08 : 0.12, now);
        leadGain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

        leadOsc.connect(leadGain);
        leadGain.connect(this.bgmGainNode);
        leadOsc.start(now);
        leadOsc.stop(now + 0.14);
      }

      // Hi-hat / drum hit on quarter steps
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
      }

      step++;
    };

    this.bgmIntervalId = window.setInterval(playStep, intervalMs);
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
      this.startBGM(this.currentTheme);
      return true;
    }
  }
}

export const audio = new AudioManager();
