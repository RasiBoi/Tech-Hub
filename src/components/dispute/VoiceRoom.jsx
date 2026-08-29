/**
 * VoiceRoom — LiveKit realtime voice surface for Tech-Hub support.
 * Ported from AI-Agent/ui with Tech-Hub dark theme + Ms. Perera avatar.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client';
import { Mic, MicOff, PhoneOff, Phone } from 'lucide-react';
import VoiceBubble from './VoiceBubble';
import { fetchVoiceToken } from '../../services/aiService';

function attachAnalyser(ctx, track, onLevel) {
  const stream = new MediaStream([track]);
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  analyser.smoothingTimeConstant = 0.6;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);
  let raf = 0;
  let cancelled = false;
  const tick = () => {
    if (cancelled) return;
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i += 1) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    onLevel(Math.min(1, rms * 3.5));
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    try {
      source.disconnect();
    } catch {
      /* noop */
    }
  };
}

export default function VoiceRoom({ userId, onClose }) {
  const [bubbleState, setBubbleState] = useState('idle');
  const [amplitude, setAmplitude] = useState(0);
  const [muted, setMuted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Tap to start the call');
  const [latencyHud, setLatencyHud] = useState({});
  const [transcripts, setTranscripts] = useState([]);

  const roomRef = useRef(null);
  const audioCtxRef = useRef(null);
  const cleanupsRef = useRef([]);
  const scrollRef = useRef(null);
  const userLevelRef = useRef(0);
  const agentLevelRef = useRef(0);
  const lastUserSpeakAtRef = useRef(0);
  const connectedRef = useRef(false);

  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [transcripts]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setAmplitude((prev) => {
        const target =
          bubbleState === 'speaking'
            ? agentLevelRef.current
            : bubbleState === 'listening'
              ? userLevelRef.current
              : 0;
        return prev + (target - prev) * 0.35;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bubbleState]);

  const teardown = useCallback(() => {
    cleanupsRef.current.forEach((fn) => fn());
    cleanupsRef.current = [];
    roomRef.current?.disconnect().catch(() => {});
    roomRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setConnected(false);
    setBubbleState('idle');
    setStatus('Disconnected');
    setTranscripts([]);
  }, []);

  const start = useCallback(async () => {
    try {
      setStatus('Requesting access…');
      setBubbleState('thinking');

      const { url, token } = await fetchVoiceToken({ userId });

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      roomRef.current = room;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') await ctx.resume();

      room.on(RoomEvent.ConnectionStateChanged, (state) => {
        if (state === ConnectionState.Connected) {
          setConnected(true);
          setStatus('Connected — say hi to Ms. Perera');
          setBubbleState('listening');
        } else if (state === ConnectionState.Disconnected) {
          setConnected(false);
          setBubbleState('idle');
        }
      });

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        track.attach();
        const mediaTrack = track.mediaStreamTrack;
        if (mediaTrack && ctx) {
          const stop = attachAnalyser(ctx, mediaTrack, (lvl) => {
            agentLevelRef.current = lvl;
            if (lvl > 0.04 && Date.now() - lastUserSpeakAtRef.current > 600) {
              setBubbleState('speaking');
            }
          });
          cleanupsRef.current.push(stop);
        }
      });

      room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const local = room.localParticipant;
        const userSpeaking = speakers.some((s) => s.identity === local.identity);
        const agentSpeaking = speakers.some((s) => s.identity !== local.identity);
        if (userSpeaking) {
          lastUserSpeakAtRef.current = Date.now();
          setBubbleState('listening');
        } else if (agentSpeaking) {
          setBubbleState('speaking');
        } else if (connectedRef.current) {
          setBubbleState((s) => (s === 'thinking' ? s : 'listening'));
        }
      });

      room.on(RoomEvent.DataReceived, (payload) => {
        try {
          const text = new TextDecoder().decode(payload);
          const msg = JSON.parse(text);
          if (msg.type === 'latency') {
            setLatencyHud({ first: msg.first_token_ms, total: msg.total_ms });
          }
        } catch {
          /* ignore */
        }
      });

      room.on(RoomEvent.TranscriptionReceived, (segments, participant) => {
        setTranscripts((prev) => {
          const next = [...prev];
          for (const seg of segments) {
            const idx = next.findIndex((t) => t.id === seg.id);
            const isUser = participant?.identity === room.localParticipant.identity;
            const name = isUser ? 'You' : 'Ms. Perera';
            if (idx >= 0) {
              next[idx] = { ...next[idx], text: seg.text, isFinal: seg.isFinal };
            } else {
              next.push({
                id: seg.id,
                identity: participant?.identity || 'agent',
                name,
                text: seg.text,
                isFinal: seg.isFinal,
                timestamp: Date.now(),
              });
            }
          }
          return next;
        });
      });

      room.on(RoomEvent.Disconnected, teardown);

      setStatus('Connecting…');
      await room.connect(url, token);

      const attachLocalMic = (pub) => {
        if (pub.kind !== Track.Kind.Audio) return;
        const localMedia = pub.track?.mediaStreamTrack;
        if (localMedia && ctx) {
          const stop = attachAnalyser(ctx, localMedia, (lvl) => {
            userLevelRef.current = lvl;
            if (lvl > 0.06) lastUserSpeakAtRef.current = Date.now();
          });
          cleanupsRef.current.push(stop);
        }
      };

      room.on(RoomEvent.LocalTrackPublished, attachLocalMic);
      await room.localParticipant.setMicrophoneEnabled(true);
      room.localParticipant.trackPublications.forEach((pub) => {
        if (pub.kind === Track.Kind.Audio && pub.track) attachLocalMic(pub);
      });
    } catch (err) {
      console.error('[VoiceRoom] start failed:', err);
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
      await roomRef.current?.disconnect().catch(() => {});
      roomRef.current = null;
      await audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
      setConnected(false);
      setStatus(`Error: ${err?.message || String(err)}`);
      setBubbleState('error');
    }
  }, [userId, teardown]);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  }, [muted]);

  useEffect(() => () => teardown(), [teardown]);

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const label =
    bubbleState === 'listening'
      ? 'MS. PERERA IS LISTENING'
      : bubbleState === 'speaking'
        ? 'MS. PERERA IS SPEAKING'
        : bubbleState === 'thinking'
          ? 'MS. PERERA IS THINKING'
          : bubbleState === 'error'
            ? 'ERROR'
            : 'MS. PERERA';

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col h-full max-h-[90vh] px-2 sm:px-0">
      <div className="flex flex-col items-center pt-4 sm:pt-8 pb-4 shrink-0">
        <VoiceBubble state={bubbleState} amplitude={amplitude} size={140} label={label} />
        <p className="text-sm text-slate-300 font-medium mt-2">{status}</p>
        {latencyHud.first !== undefined && (
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">
            first tok {latencyHud.first}ms · total {latencyHud.total}ms
          </p>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col rounded-2xl bg-surface-card/80 border border-white/10 overflow-hidden mx-1 sm:mx-0 shadow-xl shadow-black/30">
        <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03] flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Live Transcript
          </span>
          <span className="ml-auto text-[10px] text-slate-500">
            {transcripts.length > 0 ? `${transcripts.length} messages` : ''}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3 scroll-smooth">
          {transcripts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
              <p className="text-sm font-medium text-slate-400">Transcript will appear here</p>
              <p className="text-xs text-slate-500 mt-1">Start speaking to see the conversation</p>
            </div>
          ) : (
            <>
              {transcripts.map((t) => {
                const isUser = t.name === 'You';
                return (
                  <div
                    key={t.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className="max-w-[82%] sm:max-w-[78%] flex flex-col gap-1">
                      <div
                        className={`flex items-center gap-2 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isUser ? 'text-blue-400' : 'text-emerald-400'
                          }`}
                        >
                          {isUser ? 'You' : 'Ms. Perera'}
                        </span>
                        <span className="text-[9px] text-slate-600">{formatTime(t.timestamp)}</span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                        } ${!t.isFinal ? 'opacity-80' : ''}`}
                      >
                        <span className={!t.isFinal ? 'animate-pulse' : ''}>{t.text}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} className="h-1" />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-4 sm:py-5 shrink-0">
        {!connected ? (
          <button
            type="button"
            onClick={start}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:scale-[1.02] active:scale-95"
          >
            <Phone size={18} />
            <span>Start Call</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleMute}
              className={`p-3.5 rounded-full transition-all duration-200 shadow-md active:scale-95 ${
                muted
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-white/10 text-slate-200 hover:bg-white/15'
              }`}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              type="button"
              onClick={() => {
                teardown();
                onClose?.();
              }}
              className="p-3.5 rounded-full bg-red-500 hover:bg-red-400 text-white transition-all duration-200 shadow-md shadow-red-500/30 active:scale-95"
              title="End call"
            >
              <PhoneOff size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
