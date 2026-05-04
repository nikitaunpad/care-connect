'use client';

import { PublicHeader } from '@/components/public-header';
import { authClient } from '@/lib/auth/auth-client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Loader2, MessageSquare, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// --- TYPES ---
interface ForumRoom {
  id: number;
  title: string;
  description: string;
  category?: string;
  _count?: {
    members: number;
  };
}

const SupportForumsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<ForumRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);

  // 1. Ambil session untuk cek Role Admin
  const { data: session } = authClient.useSession();
  const currentUserRole = (session?.user as { role?: string })?.role || 'USER';
  const isAdmin = currentUserRole === 'ADMIN';

  // 2. Query untuk mengambil daftar grup yang SUDAH di-join (untuk filter tombol)
  const { data: joinedChannels = [] } = useQuery({
    queryKey: ['community-channels'],
    queryFn: async () => {
      const res = await fetch('/api/community-chat'); // Tanpa ?all=true
      if (!res.ok) return [];
      return res.json();
    },
  });

  // 3. Fetch SEMUA room yang tersedia (Discovery)
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        // Tambahkan ?all=true agar backend mengirimkan seluruh daftar forum
        const response = await fetch('/api/community-chat?all=true');
        if (response.ok) {
          const data = await response.json();
          const finalData = Array.isArray(data) ? data : data.data || [];
          setRooms(finalData);
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Fungsi cek apakah sudah join
  const isAlreadyJoined = (roomId: number) => {
    return joinedChannels.some(
      (channel: { id: number }) => channel.id === roomId,
    );
  };

  const handleJoinRoom = async (roomId: number) => {
    try {
      setJoiningId(roomId);
      const response = await fetch(`/api/community-chat/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok || response.status === 400) {
        // Jika berhasil atau sudah member (400), langsung masuk ke room
        router.push(`/community-chat/${roomId}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3ED]">
      <PublicHeader />

      <main className="max-w-7xl mx-auto p-6 md:p-12 text-left">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-[#193C1F] leading-none mb-4 tracking-tight">
            Support Forums
          </h1>
          <p className="text-[#8EA087] text-lg font-medium">
            Connect with community members and certified professionals.
          </p>
        </div>

        <div className="mb-12 relative w-full max-w-3xl mx-auto">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 opacity-70">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8EA087"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search forums..."
            className="w-full h-[56px] bg-[#EBE6DE] border border-[#D0D5CB] focus:border-[#8EA087] focus:bg-white rounded-2xl pl-14 pr-6 outline-none text-[15px] text-[#193C1F] shadow-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2 className="inline-block animate-spin h-8 w-8 text-[#193C1F] mb-4" />
              <p className="text-[#8EA087] font-bold">Fetching Forums...</p>
            </div>
          ) : (
            rooms
              .filter((room) =>
                (room.title || (room as { name?: string }).name || '')
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
              )
              .map((room) => (
                <div key={room.id} className="group">
                  <div className="bg-white rounded-[40px] border border-[#D0D5CB] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <div className="h-44 bg-[#F7F3ED] flex items-center justify-center relative overflow-hidden transition-colors group-hover:bg-[#EBE6DE]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F3ED] via-[#E6DED3] to-[#D0D5CB]" />
                      <MessageSquare
                        size={48}
                        className="relative z-10 text-[#8EA087] opacity-40 group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute bottom-6 left-8 z-10 text-[10px] font-black uppercase tracking-[0.2em] text-[#8EA087] bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-[#D0D5CB]/50">
                        ROOM #{room.id}
                      </span>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <span className="text-[9px] font-black text-[#D1B698] uppercase tracking-[0.2em] mb-4 inline-block">
                        TOPIC: {room.category || 'GENERAL'}
                      </span>
                      <h3 className="font-black text-xl text-[#193C1F] mb-3 group-hover:text-[#8EA087] transition-colors italic tracking-tight line-clamp-2 leading-tight">
                        {room.title ||
                          (room as { name?: string }).name ||
                          'Untitled Room'}
                      </h3>
                      <p className="text-sm text-[#193C1F]/60 font-medium leading-relaxed mb-8 flex-1 line-clamp-3">
                        {room.description ||
                          'No description available for this room.'}
                      </p>

                      <div className="flex justify-between items-center pt-6 border-t border-[#F7F3ED]">
                        <span className="text-[10px] font-black text-[#8EA087] uppercase flex items-center gap-2 tracking-widest">
                          <Users size={14} strokeWidth={3} />{' '}
                          {room._count?.members || 0} Members
                        </span>

                        {isAlreadyJoined(room.id) ? (
                          <button
                            onClick={() =>
                              router.push(`/community-chat/${room.id}`)
                            }
                            className="text-[11px] font-black uppercase flex items-center gap-2 text-[#8EA087] tracking-[0.1em]"
                          >
                            Joined{' '}
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinRoom(room.id)}
                            disabled={joiningId === room.id}
                            className="text-[11px] font-black uppercase flex items-center gap-1 text-[#193C1F] group-hover:gap-3 transition-all tracking-[0.1em] disabled:opacity-50"
                          >
                            {joiningId === room.id ? 'Joining...' : 'Join Room'}{' '}
                            <ArrowRight size={16} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}

          {isAdmin && (
            <div className="border-2 border-dashed border-[#D0D5CB] rounded-[40px] flex flex-col items-center justify-center p-12 text-center space-y-6 group cursor-pointer hover:bg-white/50 transition-all duration-500 h-full min-h-[400px]">
              <div className="w-16 h-16 bg-[#EBE6DE] rounded-full flex items-center justify-center text-[#8EA087] group-hover:bg-[#193C1F] group-hover:text-white transition-all duration-500 shadow-sm">
                <Plus size={32} strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-black text-xl text-[#193C1F] italic tracking-tight">
                  Create a Room
                </h3>
                <p className="text-sm text-[#8EA087] font-medium mt-2">
                  Admin only: Add a new topic.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SupportForumsPage;
