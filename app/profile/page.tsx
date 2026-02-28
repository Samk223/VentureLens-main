'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Camera, User } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Analyst');
  const [photo, setPhoto] = useState('');

  const roles = ['Analyst', 'Investor', 'Partner', 'Associate', 'Founder', 'Operator', 'Advisor'];

  useEffect(() => {
    setMounted(true);
    const currentUserStr = localStorage.getItem('ps_currentUser');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      setUser(currentUser);
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setRole(currentUser.role || 'Analyst');
      setPhoto(currentUser.photo || '');
    } else {
      router.push('/');
    }
  }, [router]);

  if (!mounted || !user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, name, email, role, photo };
    localStorage.setItem('ps_currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const usersStr = localStorage.getItem('ps_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const index = users.findIndex((u: any) => u.email === user.email);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('ps_users', JSON.stringify(users));
      }
    }
    
    // Force a reload to update sidebar
    window.location.reload();
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 max-w-3xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-zinc-900">Profile</h1>
        <p className="text-zinc-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 mb-8 shadow-xl transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center gap-8">
          <div className="relative group">
            {photo ? (
              <img src={photo} alt="Profile" className="w-28 h-28 rounded-3xl object-cover border-2 border-white shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-white/50 backdrop-blur-md flex items-center justify-center text-4xl font-medium text-zinc-500 border-2 border-white shadow-md">
                {userInitial}
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer backdrop-blur-sm">
              <Camera className="w-8 h-8" />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">{name || 'User'}</h2>
            <p className="text-zinc-500 font-medium">{email}</p>
            <p className="text-sm text-zinc-500 mt-1 bg-white/50 inline-block px-3 py-1 rounded-full border border-white/40">{role}</p>
            
            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/60 text-zinc-700 rounded-xl text-sm font-medium hover:bg-white/80 transition-all duration-200 cursor-pointer border border-white/40 shadow-sm hover:shadow-md">
              <Camera className="w-4 h-4" /> Change photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 mb-8 shadow-xl transition-all duration-300 hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8">
        <h3 className="text-xl font-display font-semibold text-zinc-900 mb-8">Account Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
              <User className="w-4 h-4" /> Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-zinc-900 shadow-sm transition-all duration-200"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 bg-white/30 backdrop-blur-md border border-white/20 rounded-xl text-sm text-zinc-500 cursor-not-allowed shadow-inner"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 mb-3">
              Role
            </label>
            <div className="flex flex-wrap gap-3">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border shadow-sm ${
                    role === r 
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md scale-105' 
                      : 'bg-white/50 text-zinc-600 border-white/40 hover:bg-white/80 hover:shadow-md'
                  }`}
                >
                  {role === r && '✓ '} {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-12">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Save Changes
        </button>
        <button
          onClick={() => router.push('/companies')}
          className="flex items-center gap-2 px-8 py-3 bg-white/60 backdrop-blur-md text-zinc-900 border border-white/40 rounded-xl font-medium hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          Go to Companies <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
