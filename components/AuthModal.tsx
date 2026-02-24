import React, { useState } from 'react';
import { X, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (data.user) {
        const user: UserType = {
          id: data.user.id,
          name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || ''
        };
        onLogin(user);
        onClose();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-brand-100">
        <div className="h-2 bg-dark-900 w-full" />
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-dark-900 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-dark-900 mb-2 uppercase tracking-widest">Acesso Restrito</h2>
            <p className="text-slate-500 text-[9px] uppercase tracking-[0.3em] font-bold">Identificação Administrativa • Litoral</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-tight text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@litoral.com"
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-brand-600 focus:bg-white transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Credencial</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="password" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-brand-600 focus:bg-white transition-all outline-none" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-dark-900 text-white py-5 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-600 transition-all flex items-center justify-center gap-2 group shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Entrar no Painel
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 pt-6 border-t border-slate-50 text-center">
            <p className="text-[8px] text-slate-400 uppercase tracking-widest leading-relaxed">
              Sistema exclusivo para colaboradores Litoral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;