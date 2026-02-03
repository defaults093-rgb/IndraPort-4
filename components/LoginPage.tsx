
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
  onCancel: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a secure API call
    if (username === 'admin' && password === 'indra123') {
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md glass p-10 rounded-[40px] relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto mb-6">
            I
          </div>
          <h1 className="syncopate text-2xl font-bold mb-2 tracking-tighter">ADMIN ACCESS</h1>
          <p className="text-zinc-500 text-sm">Welcome back, Indra. Please authenticate.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none transition-all"
              placeholder="Username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500 rounded-2xl px-6 py-4 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors uppercase tracking-widest text-sm"
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={onCancel}
              className="w-full py-4 glass text-zinc-400 font-bold rounded-2xl hover:text-white transition-colors uppercase tracking-widest text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
