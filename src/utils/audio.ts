/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let isMuted = false;

export function setMuted(muted: boolean) {
  isMuted = muted;
  localStorage.setItem('math_quiz_muted', muted ? 'true' : 'false');
}

export function getMuted(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('math_quiz_muted') === 'true';
  }
  return false;
}

// Initial state load
isMuted = getMuted();

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  return new AudioContextClass();
}

/**
 * Play a beautiful retro synth beep/chime
 */
export function playSound(type: 'success' | 'error' | 'click' | 'badge' | 'victory') {
  if (isMuted) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser security)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  switch (type) {
    case 'click': {
      // Short friendly organic click or pop sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.start(now);
      osc.stop(now + 0.15);
      break;
    }

    case 'success': {
      // High-pitched bright happy double ding (e.g., C5 -> G5)
      const playDing = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.start(start);
        osc.stop(start + duration);
      };

      playDing(523.25, now, 0.18); // C5
      playDing(783.99, now + 0.08, 0.25); // G5
      break;
    }

    case 'error': {
      // Short vibrating low buzzer sound (C3 descending with low-pass filter)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.22);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
      break;
    }

    case 'badge': {
      // Triumphant climbing shiny arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.4);
      });
      break;
    }

    case 'victory': {
      // Triumphant continuous sequence (Chord progression + fanfare)
      const dings = [
        { freq: 523.25, time: 0 }, // C5
        { freq: 659.25, time: 0.1 }, // E5
        { freq: 783.99, time: 0.2 }, // G5
        { freq: 1046.50, time: 0.3 }, // C6
        { freq: 880.00, time: 0.45 }, // A5
        { freq: 1046.50, time: 0.6 }, // C6
      ];

      dings.forEach((d) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(d.freq, now + d.time);

        gain.gain.setValueAtTime(0.001, now + d.time);
        gain.gain.linearRampToValueAtTime(0.12, now + d.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + d.time + 0.45);

        osc.start(now + d.time);
        osc.stop(now + d.time + 0.5);
      });
      break;
    }
  }
}
