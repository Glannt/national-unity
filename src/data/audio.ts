// Ethnic group audio mappings
// Using placeholder URLs - replace with actual audio files
export interface EthnicAudio {
  id: string;
  name: string;
  instrument: string;
  audioUrl: string;
}

// Audio data for each ethnic group
// These are placeholder frequencies - will use Web Audio API to generate sounds
export const ethnicAudioData: Record<string, EthnicAudio> = {
  thai: {
    id: "thai",
    name: "Thái",
    instrument: "Khèn bè (Khèn môi)",
    audioUrl: "/audio/thai.mp3"
  },
  tay: {
    id: "tay",
    name: "Tày",
    instrument: "Đàn tính",
    audioUrl: "/audio/tay.mp3"
  },
  muong: {
    id: "muong",
    name: "Mường",
    instrument: "Cồng chiêng",
    audioUrl: "/audio/muong.mp3"
  },
  hmong: {
    id: "hmong",
    name: "H'Mông",
    instrument: "Khèn H'Mông",
    audioUrl: "/audio/hmong.mp3"
  },
  khmer: {
    id: "khmer",
    name: "Khmer",
    instrument: "Đàn Chha-pây",
    audioUrl: "/audio/khmer.mp3"
  },
  nung: {
    id: "nung",
    name: "Nùng",
    instrument: "Đàn tính",
    audioUrl: "/audio/nung.mp3"
  },
  ede: {
    id: "ede",
    name: "Ê-đê",
    instrument: "Đàn đá",
    audioUrl: "/audio/ede.mp3"
  },
  giarai: {
    id: "giarai",
    name: "Gia Rai",
    instrument: "Cồng chiêng Tây Nguyên",
    audioUrl: "/audio/giarai.mp3"
  },
  bana: {
    id: "bana",
    name: "Ba Na",
    instrument: "Trống đôi",
    audioUrl: "/audio/bana.mp3"
  },
  dao: {
    id: "dao",
    name: "Dao",
    instrument: "Sáo Dao",
    audioUrl: "/audio/dao.mp3"
  }
};

// Musical frequencies for generating tones (when no audio file exists)
const ethnicFrequencies: Record<string, number[]> = {
  thai: [440, 494, 523, 587, 659],      // Pentatonic scale A
  tay: [392, 440, 494, 587, 659],       // Pentatonic scale G
  muong: [262, 294, 330, 392, 440],     // Pentatonic scale C (gong-like)
  hmong: [349, 392, 440, 523, 587],     // Pentatonic scale F
  khmer: [330, 370, 415, 494, 554],     // Khmer scale approximation
  nung: [392, 440, 494, 587, 659],      // Similar to Tay
  ede: [523, 587, 659, 784, 880],       // Higher register (stone instrument)
  giarai: [196, 220, 247, 294, 330],    // Low gong tones
  bana: [175, 196, 220, 262, 294],      // Deep drum-like
  dao: [587, 659, 740, 880, 988],       // High flute-like
};

// Create audio context for generating sounds
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Play a simple ethnic-inspired sound using Web Audio API
export function playEthnicSound(ethnicId: string): void {
  try {
    const ctx = getAudioContext();
    const frequencies = ethnicFrequencies[ethnicId] || ethnicFrequencies.thai;
    
    // Create a short melody
    frequencies.slice(0, 3).forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Different wave types for different instruments
      if (["muong", "giarai", "bana"].includes(ethnicId)) {
        oscillator.type = "triangle"; // Gong-like
      } else if (["dao", "hmong", "thai"].includes(ethnicId)) {
        oscillator.type = "sine"; // Flute-like
      } else {
        oscillator.type = "sawtooth"; // String-like
      }
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
      
      // Envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + index * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.4);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime + index * 0.15);
      oscillator.stop(ctx.currentTime + index * 0.15 + 0.5);
    });
  } catch (error) {
    console.log("Audio not supported:", error);
  }
}

// Try to play audio file, fallback to generated sound
export async function playEthnicAudio(ethnicId: string): Promise<void> {
  const audioData = ethnicAudioData[ethnicId];
  
  if (audioData) {
    try {
      const audio = new Audio(audioData.audioUrl);
      audio.volume = 0.5;
      await audio.play();
    } catch {
      // Fallback to generated sound
      playEthnicSound(ethnicId);
    }
  } else {
    playEthnicSound(ethnicId);
  }
}
