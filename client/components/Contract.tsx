"use client";

import { useState, useCallback, useEffect } from "react";
import {
  uploadSong,
  getSongs,
  CONTRACT_ADDRESS,
  type Song,
} from "@/hooks/contract";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Icons ────────────────────────────────────────────────────

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function DiscIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ── Styled Input ─────────────────────────────────────────────

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-medium uppercase tracking-wider text-white/30">
        {label}
      </label>
      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-px transition-all focus-within:border-[#7c6cf0]/30 focus-within:shadow-[0_0_20px_rgba(124,108,240,0.08)]">
        <input
          {...props}
          className="w-full rounded-[11px] bg-transparent px-4 py-3 font-mono text-sm text-white/90 placeholder:text-white/15 outline-none"
        />
      </div>
    </div>
  );
}

// ── Method Signature ─────────────────────────────────────────

function MethodSignature({
  name,
  params,
  returns,
  color,
}: {
  name: string;
  params: string;
  returns?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-mono text-sm">
      <span style={{ color }} className="font-semibold">fn</span>
      <span className="text-white/70">{name}</span>
      <span className="text-white/20 text-xs">{params}</span>
      {returns && (
        <span className="ml-auto text-white/15 text-[10px]">{returns}</span>
      )}
    </div>
  );
}

// ── Song Card ────────────────────────────────────────────────

function SongCard({ song, index }: { song: Song; index: number }) {
  const colors = ["#7c6cf0", "#4fc3f7", "#fbbf24", "#34d399", "#f87171"];
  const color = colors[index % colors.length];

  return (
    <div className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="flex items-start gap-4">
        {/* Album art placeholder */}
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border"
          style={{ borderColor: `${color}20`, backgroundColor: `${color}08` }}
        >
          <DiscIcon />
          <span style={{ color }} className="ml-0.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white/90">{song.title}</p>
          <p className="truncate text-xs text-white/40 mt-0.5">{song.artist}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="info" className="text-[9px]">
              <span className="font-mono">IPFS</span>
            </Badge>
            <span className="font-mono text-[10px] text-white/20 truncate">{song.ipfs}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

type Tab = "library" | "upload";

interface ContractUIProps {
  walletAddress: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function ContractUI({ walletAddress, onConnect, isConnecting }: ContractUIProps) {
  const [activeTab, setActiveTab] = useState<Tab>("library");
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const truncate = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getSongs(walletAddress || undefined);
      setSongs(result ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load songs");
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  // Fetch songs on mount and when switching to library
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleUploadSong = useCallback(async () => {
    if (!walletAddress) return setError("Connect wallet first");
    if (!artist.trim() || !title.trim() || !ipfsHash.trim())
      return setError("Fill in all fields");
    setError(null);
    setIsUploading(true);
    setTxStatus("Awaiting signature...");
    try {
      await uploadSong(walletAddress, artist.trim(), title.trim(), ipfsHash.trim());
      setTxStatus("Song uploaded on-chain!");
      setArtist("");
      setTitle("");
      setIpfsHash("");
      // Refresh library
      await fetchSongs();
      setTimeout(() => setTxStatus(null), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
      setTxStatus(null);
    } finally {
      setIsUploading(false);
    }
  }, [walletAddress, artist, title, ipfsHash, fetchSongs]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "library", label: "Library", icon: <MusicIcon />, color: "#4fc3f7" },
    { key: "upload", label: "Upload", icon: <UploadIcon />, color: "#7c6cf0" },
  ];

  return (
    <div className="w-full max-w-2xl animate-fade-in-up-delayed">
      {/* Toasts */}
      {error && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#f87171]/15 bg-[#f87171]/[0.05] px-4 py-3 backdrop-blur-sm animate-slide-down">
          <span className="mt-0.5 text-[#f87171]"><AlertIcon /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#f87171]/90">Error</p>
            <p className="text-xs text-[#f87171]/50 mt-0.5 break-all">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="shrink-0 text-[#f87171]/30 hover:text-[#f87171]/70 text-lg leading-none">&times;</button>
        </div>
      )}

      {txStatus && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#34d399]/15 bg-[#34d399]/[0.05] px-4 py-3 backdrop-blur-sm shadow-[0_0_30px_rgba(52,211,153,0.05)] animate-slide-down">
          <span className="text-[#34d399]">
            {txStatus.includes("on-chain") ? <CheckIcon /> : <SpinnerIcon />}
          </span>
          <span className="text-sm text-[#34d399]/90">{txStatus}</span>
        </div>
      )}

      {/* Main Card */}
      <Spotlight className="rounded-2xl">
        <AnimatedCard className="p-0" containerClassName="rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf0]/20 to-[#4fc3f7]/20 border border-white/[0.06]">
                <MusicIcon className="text-[#7c6cf0]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white/90">Decentralized Music</h3>
                <p className="text-[10px] text-white/25 font-mono mt-0.5">{truncate(CONTRACT_ADDRESS)}</p>
              </div>
            </div>
            <Badge variant="info" className="text-[10px]">Soroban</Badge>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setError(null); }}
                className={cn(
                  "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-all",
                  activeTab === t.key ? "text-white/90" : "text-white/35 hover:text-white/55"
                )}
              >
                <span style={activeTab === t.key ? { color: t.color } : undefined}>{t.icon}</span>
                {t.label}
                {activeTab === t.key && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full transition-all"
                    style={{ background: `linear-gradient(to right, ${t.color}, ${t.color}66)` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Library */}
            {activeTab === "library" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <MethodSignature name="get_songs" params="()" returns="-> Vec<Map<Symbol, String>>" color="#4fc3f7" />
                  <button
                    onClick={fetchSongs}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/40 hover:text-white/60 hover:border-white/[0.12] transition-all disabled:opacity-50"
                  >
                    {isLoading ? <SpinnerIcon /> : <RefreshIcon />}
                    Refresh
                  </button>
                </div>

                {songs.length > 0 ? (
                  <div className="grid gap-3">
                    {songs.map((song, i) => (
                      <SongCard key={`${song.ipfs}-${i}`} song={song} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] py-12">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06]">
                      <MusicIcon className="text-white/20" />
                    </div>
                    <p className="text-sm text-white/30">No songs uploaded yet</p>
                    <p className="text-xs text-white/15 mt-1">Be the first to upload a track</p>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-3">
                  <span className="text-xs text-white/25">Total tracks</span>
                  <span className="font-mono text-sm font-semibold text-white/70">{songs.length}</span>
                </div>
              </div>
            )}

            {/* Upload */}
            {activeTab === "upload" && (
              <div className="space-y-5">
                <MethodSignature name="upload_song" params="(artist: String, title: String, ipfs_hash: String)" color="#7c6cf0" />
                <Input label="Artist" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="e.g. Cosmic Beats" />
                <Input label="Song Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Midnight Orbit" />
                <Input label="IPFS Hash" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} placeholder="e.g. QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" />
                {walletAddress ? (
                  <ShimmerButton onClick={handleUploadSong} disabled={isUploading} shimmerColor="#7c6cf0" className="w-full">
                    {isUploading ? <><SpinnerIcon /> Uploading...</> : <><UploadIcon /> Upload Song</>}
                  </ShimmerButton>
                ) : (
                  <button
                    onClick={onConnect}
                    disabled={isConnecting}
                    className="w-full rounded-xl border border-dashed border-[#7c6cf0]/20 bg-[#7c6cf0]/[0.03] py-4 text-sm text-[#7c6cf0]/60 hover:border-[#7c6cf0]/30 hover:text-[#7c6cf0]/80 active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    Connect wallet to upload songs
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.04] px-6 py-3 flex items-center justify-between">
            <p className="text-[10px] text-white/15">Decentralized Music &middot; Soroban</p>
            <div className="flex items-center gap-3 text-[10px] text-white/15">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#7c6cf0]" />
                <span className="font-mono">Upload</span>
              </span>
              <span className="text-white/10">&bull;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#4fc3f7]" />
                <span className="font-mono">Stream</span>
              </span>
              <span className="text-white/10">&bull;</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#34d399]" />
                <span className="font-mono">Own</span>
              </span>
            </div>
          </div>
        </AnimatedCard>
      </Spotlight>
    </div>
  );
}
