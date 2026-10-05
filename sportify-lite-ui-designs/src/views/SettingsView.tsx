import React, { useState } from 'react';
import { Sliders, Volume2, Shield, Code, Server, Keyboard, Sparkles, CheckCircle2 } from 'lucide-react';
import { PenguinLogo } from '../components/brand/PenguinLogo';

export const SettingsView: React.FC = () => {
  const [audioQuality, setAudioQuality] = useState<'normal' | 'high' | 'lossless'>('lossless');
  const [crossfade, setCrossfade] = useState<number>(3);
  const [normalizeVolume, setNormalizeVolume] = useState<boolean>(true);
  const [hardwareAcceleration, setHardwareAcceleration] = useState<boolean>(true);

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
          Settings & Preferences
        </h1>
        <p className="text-xs md:text-sm text-slate-400">
          Audio performance, interface customization, and developer integration specs.
        </p>
      </div>

      {/* Audio Quality Section */}
      <section className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-5">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Streaming Audio Quality</h3>
            <p className="text-xs text-slate-400">Configure playback bitrate and fidelity presets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'normal', title: 'Normal (160 kbps)', desc: 'Optimized for mobile data savings' },
            { id: 'high', title: 'High (320 kbps)', desc: 'Clear studio sound with punchy bass' },
            { id: 'lossless', title: 'Hi-Fi Master (Lossless)', desc: '24-bit / 96kHz FLAC audio clarity' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAudioQuality(item.id as any)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                audioQuality === item.id
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-md'
                  : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{item.title}</span>
                {audioQuality === item.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Playback Controls & Crossfade */}
      <section className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-5">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Playback Transitions</h3>
            <p className="text-xs text-slate-400">Smooth transition between upcoming tracks</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300">Crossfade Songs</span>
              <span className="font-mono text-emerald-400">{crossfade} seconds</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              value={crossfade}
              onChange={(e) => setCrossfade(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <div className="text-xs font-semibold text-slate-200">Volume Normalization</div>
              <div className="text-[11px] text-slate-400">Set the same volume level for all tracks</div>
            </div>
            <button
              onClick={() => setNormalizeVolume(!normalizeVolume)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                normalizeVolume ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  normalizeVolume ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Developer & Backend Integration Point Guide */}
      <section className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white">Backend Integration Architecture</h3>
            <p className="text-xs text-slate-400">
              Clean separation of UI prototype from future Node.js / Python API
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 font-mono text-[11px] text-slate-300 border border-white/10 space-y-2 overflow-x-auto">
          <div className="text-emerald-400 font-semibold">// Future REST / WebSocket API Endpoints:</div>
          <div>GET  /api/v1/tracks/trending      → Returns Track[]</div>
          <div>GET  /api/v1/search?q=:query      → Returns &#123; tracks, artists, albums &#125;</div>
          <div>GET  /api/v1/stream?trackId=:id   → yt-dlp / audio stream proxy</div>
          <div>POST /api/v1/library/likes/:id    → Persists to user database</div>
        </div>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="p-6 rounded-3xl bg-slate-900/50 border border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <Keyboard className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">Keyboard Navigation</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { key: 'Space', action: 'Play / Pause' },
            { key: 'M', action: 'Mute / Unmute' },
            { key: '← / →', action: 'Seek 5 seconds' },
            { key: 'Shift + N', action: 'Next Track' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-emerald-400 font-bold border border-white/10">
                {item.key}
              </span>
              <div className="text-slate-300 mt-2 font-medium">{item.action}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
