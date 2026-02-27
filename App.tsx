import React, { useState, useMemo, useEffect } from 'react';
import {
  Phone as PhoneIcon,
  Instagram as InstagramIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  MessageCircle as MessageCircleIcon,
  LayoutDashboard as LayoutDashboardIcon,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS as initialProducts } from './services/mockData';
import { User, Product } from './types';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './services/supabaseClient';

function App() {
  const [view, setView] = useState<'home' | 'admin'>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isHoursDropdownOpen, setIsHoursDropdownOpen] = useState(false);

  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products from Supabase:', error);
      } else if (data && data.length > 0) {
        setAllProducts(data);
      }
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url
        });
      }
    };

    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*');
      if (data) {
        const hours = data.find(s => s.key === 'business_hours')?.value;
        const landing = data.find(s => s.key === 'landing_page')?.value;
        const phone = data.find(s => s.key === 'contact_phone')?.value;
        if (hours) setBusinessHours(hours);
        if (landing) setLandingPage(landing);
        if (phone) setContactPhone(phone);
      }
    };

    fetchProducts();
    checkUser();
    fetchSettings();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: session.user.user_metadata.avatar_url
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Estados para controle de exibição (Ver Mais/Menos)
  const [visibleAtelie, setVisibleAtelie] = useState(4);
  const [visibleBoutique, setVisibleBoutique] = useState(4);
  const [visibleCutelaria, setVisibleCutelaria] = useState(3);

  const [businessHours, setBusinessHours] = useState<Record<string, string>>({
    seg: '09h às 19h',
    ter: '09h às 19h',
    qua: '09h às 19h',
    qui: '09h às 19h',
    sex: '09h às 19h',
    sab: '09h às 18h',
    dom: 'Fechado'
  });

  const [contactPhone, setContactPhone] = useState('(13) 99999-9999');

  const [landingPage, setLandingPage] = useState({
    heroTitle: 'Restauração de Alta Classe',
    heroSubtitle: 'Maestria Sapataria Litoral',
    heroImage: '/hero-atelier.jpg'
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('Todos');

  const mainServiceCategories = useMemo(() => {
    return Array.from(new Set(allProducts.filter(p => p.mainCategory !== 'Loja' && p.mainCategory !== 'Cutelaria').map(p => p.mainCategory)));
  }, [allProducts]);

  const serviceProducts = useMemo(() => {
    return allProducts.filter(product => {
      const isService = product.mainCategory !== 'Loja' && product.mainCategory !== 'Cutelaria';
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMain = selectedMainCategory === 'Todos' || product.mainCategory === selectedMainCategory;
      return isService && matchesSearch && matchesMain;
    });
  }, [searchTerm, selectedMainCategory, allProducts]);

  const shopProducts = useMemo(() => allProducts.filter(p => p.mainCategory === 'Loja'), [allProducts]);
  const cutleryProducts = useMemo(() => allProducts.filter(p => p.mainCategory === 'Cutelaria'), [allProducts]);

  if (view === 'admin') {
    return (
      <AdminDashboard
        onBack={() => setView('home')}
        products={allProducts}
        setProducts={setAllProducts}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-luxury-brown selection:text-white overflow-x-hidden">

      {/* Top Bar */}
      <div className="bg-dark-900 text-brand-100 py-3 px-6 text-[10px] tracking-[0.4em] text-center md:flex md:justify-between md:px-12 uppercase font-bold border-b border-white/5">
        <span className="hidden md:block italic opacity-80">Excelência em Couros • Sapataria Litoral</span>
        <div className="flex justify-center gap-8">
          <a href={`tel:${contactPhone.replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-luxury-brown transition-colors"><PhoneIcon className="w-3 h-3 text-luxury-gold" /> {contactPhone}</a>
          <div
            className="relative"
            onMouseEnter={() => setIsHoursDropdownOpen(true)}
            onMouseLeave={() => setIsHoursDropdownOpen(false)}
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-300 flex items-center gap-2 cursor-pointer hover:text-white transition-colors py-2">
              <ClockIcon className="w-3 h-3 text-luxury-gold" /> Confira nossos Horários
            </span>

            <AnimatePresence>
              {isHoursDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-dark-900 border border-slate-800 shadow-2xl z-[150] overflow-hidden"
                >
                  <div className="bg-brand-900/50 p-3 border-b border-white/5 text-center">
                    <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-black">Horários de Loja</h4>
                  </div>
                  <ul className="divide-y divide-white/5 p-2">
                    {[
                      { key: 'seg', label: 'Segunda-feira' },
                      { key: 'ter', label: 'Terça-feira' },
                      { key: 'qua', label: 'Quarta-feira' },
                      { key: 'qui', label: 'Quinta-feira' },
                      { key: 'sex', label: 'Sexta-feira' },
                      { key: 'sab', label: 'Sábado' },
                      { key: 'dom', label: 'Domingo' }
                    ].map((day) => (
                      <li key={day.key} className="flex justify-between items-center py-2 px-3 hover:bg-white/5 transition-colors">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{day.label}</span>
                        <span className={`text-[10px] font-black tracking-widest ${businessHours[day.key] === 'Fechado' ? 'text-red-400/80' : 'text-white'}`}>
                          {businessHours[day.key] || 'Não definido'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[50] bg-white/95 backdrop-blur-md border-b border-slate-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            <div className="flex items-center gap-6">
              <button
                onClick={() => user ? setView('admin') : setIsAuthOpen(true)}
                className={`p-2 transition-all border rounded-full flex items-center justify-center group ${user ? 'bg-luxury-gold text-white border-luxury-gold shadow-md' : 'text-slate-300 hover:text-luxury-brown hover:border-luxury-brown border-slate-100'}`}
              >
                <LayoutDashboardIcon className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-start cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="text-2xl md:text-3xl font-serif font-bold text-dark-900 tracking-tight group-hover:text-luxury-brown transition-colors uppercase italic leading-none">
                  Litoral
                </div>
                <div className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-luxury-gold font-sans font-black mt-0.5">
                  Sapataria & Ateliê
                </div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-12">
              {['Início', 'Ateliê', 'Boutique', 'Cutelaria'].map(label => (
                <button
                  key={label}
                  onClick={() => {
                    const id = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace('atelie', 'servicos');
                    document.getElementById(id === 'inicio' ? 'hero' : id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[10px] font-black text-dark-900/40 hover:text-dark-900 uppercase tracking-[0.3em] transition-all relative group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-brown transition-all group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-6">
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="hero" className="relative h-[75vh] flex items-center justify-center bg-dark-900 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <img src="/hero-atelier.jpg" alt="Ateliê Sapataria Litoral" className="w-full h-full object-cover grayscale" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-transparent to-dark-900" />

          <div className="relative z-10 text-center max-w-4xl px-8">
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-px bg-luxury-gold/30 w-32 mx-auto mb-8"
            />
            <motion.span
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-luxury-gold uppercase tracking-[0.8em] text-[10px] font-black mb-6 block"
            >
              {landingPage.heroSubtitle}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-5xl md:text-8xl font-serif text-white mb-10 leading-none italic tracking-tighter"
            >
              {landingPage.heroTitle.split(' ').slice(0, -2).join(' ')}<br /><span className="text-luxury-brown not-italic">{landingPage.heroTitle.split(' ').slice(-2).join(' ')}</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <button
                onClick={() => document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative border border-white/20 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:text-dark-900 transition-all overflow-hidden"
              >
                <span className="relative z-10">Conhecer Ateliê</span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ATELIÊ - BRANCO */}
        <section id="servicos" className="bg-white py-24 scroll-mt-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <span className="text-luxury-brown text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Especialidades</span>
            <h2 className="text-4xl md:text-6xl font-serif text-dark-900 italic font-medium mb-16 tracking-tight">Serviços de Ateliê</h2>

            <div className="flex flex-wrap justify-center gap-8 mb-16 border-b border-slate-50 pb-8">
              <button
                onClick={() => setSelectedMainCategory('Todos')}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 border-b-2 ${selectedMainCategory === 'Todos' ? 'border-luxury-brown text-dark-900' : 'border-transparent text-slate-300 hover:text-dark-900'}`}
              >
                Todos
              </button>
              {mainServiceCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedMainCategory(cat)}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all pb-2 border-b-2 ${selectedMainCategory === cat ? 'border-luxury-brown text-dark-900' : 'border-transparent text-slate-300 hover:text-dark-900'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {serviceProducts.slice(0, visibleAtelie).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>

            {/* Ver Mais/Menos Ateliê */}
            <div className="mt-20">
              {serviceProducts.length > visibleAtelie ? (
                <button
                  onClick={() => setVisibleAtelie(prev => prev + 4)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-dark-900 hover:text-luxury-brown transition-all group"
                >
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  Ver Mais Especialidades
                </button>
              ) : serviceProducts.length > 4 && (
                <button
                  onClick={() => setVisibleAtelie(4)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-dark-900 hover:text-luxury-brown transition-all group"
                >
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  Recolher Catálogo
                </button>
              )}
            </div>
          </div>
        </section>

        {/* DIVISOR NOBRE */}
        <div className="bg-dark-900 py-12 flex justify-center overflow-hidden">
          <div className="h-px bg-luxury-gold/20 w-full max-w-7xl relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-900 px-8 text-luxury-gold/40 text-[8px] font-black uppercase tracking-[1em]">Litoral Heritage</div>
          </div>
        </div>

        {/* BOUTIQUE - PRETO */}
        <section id="boutique" className="bg-dark-900 py-24 relative">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
              <div>
                <span className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Curadoria</span>
                <h2 className="text-4xl md:text-6xl font-serif text-white italic font-medium leading-none tracking-tight">Boutique</h2>
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.3em] max-w-xs leading-relaxed italic opacity-50">
                Obras em couro nobre destinadas àqueles que valorizam a eternidade.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {shopProducts.slice(0, visibleBoutique).map(product => (
                  <ProductCard key={product.id} product={product} dark />
                ))}
              </AnimatePresence>
            </div>

            {/* Ver Mais/Menos Boutique */}
            <div className="mt-20 text-center">
              {shopProducts.length > visibleBoutique ? (
                <button
                  onClick={() => setVisibleBoutique(prev => prev + 4)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-luxury-gold transition-all group"
                >
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  Expandir Boutique
                </button>
              ) : shopProducts.length > 4 && (
                <button
                  onClick={() => setVisibleBoutique(4)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white hover:text-luxury-gold transition-all group"
                >
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  Minimizar Vitrine
                </button>
              )}
            </div>
          </div>
        </section>

        {/* CUTELARIA - BRANCO */}
        <section id="cutelaria" className="bg-white py-24 border-t border-slate-50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-20 text-center md:text-left gap-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-serif italic text-dark-900 leading-none tracking-tight">Cutelaria</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-luxury-brown mt-4 block">Peças de Autor</span>
              </div>
              <div className="h-20 w-px bg-slate-100 hidden md:block" />
              <p className="text-slate-400 text-[11px] tracking-[0.2em] font-light max-w-sm leading-loose italic uppercase">
                Aço forjado em fogo sagrado. Precisão absoluta para o mestre de cozinha.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {cutleryProducts.slice(0, visibleCutelaria).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </div>

            {/* Ver Mais/Menos Cutelaria */}
            <div className="mt-20 text-center">
              {cutleryProducts.length > visibleCutelaria ? (
                <button
                  onClick={() => setVisibleCutelaria(prev => prev + 3)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-dark-900 hover:text-luxury-brown transition-all group"
                >
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                  Descobrir Mais Lâminas
                </button>
              ) : cutleryProducts.length > 3 && (
                <button
                  onClick={() => setVisibleCutelaria(3)}
                  className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-dark-900 hover:text-luxury-brown transition-all group"
                >
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  Ocultar Lâminas
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-900 text-white pt-24 pb-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tighter mb-12 italic opacity-5 select-none uppercase">Litoral</div>

          <div className="flex justify-center gap-16 mb-20 text-slate-500">
            <a href="https://www.instagram.com/sapatarialitoral20?igsh=MXYzZTR5M2xkMWNzZg==" target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="w-5 h-5 hover:text-luxury-brown transition-all cursor-pointer hover:scale-125 md:w-6 md:h-6" />
            </a>
            <a href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
              <PhoneIcon className="w-5 h-5 hover:text-luxury-brown transition-all cursor-pointer hover:scale-125 md:w-6 md:h-6" />
            </a>
            <button onClick={() => setIsMapModalOpen(true)}>
              <MapPinIcon className="w-5 h-5 hover:text-luxury-brown transition-all cursor-pointer hover:scale-125 md:w-6 md:h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center border-t border-white/5 pt-12">
            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black md:text-left leading-relaxed">
              São Sebastião • SP<br />
              <span className="font-medium opacity-70">
                R. Três Bandeirantes, 185 - Centro<br />
                CEP 11608-587
              </span>
            </div>
            <div className="text-[10px] text-luxury-gold font-black uppercase tracking-[0.6em] italic">
              Artesãos da Renovação
            </div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black md:text-right">
              &copy; 2024 Litoral Design Studio
            </div>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <AnimatePresence>
        {isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={(u) => setUser(u)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isMapModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl h-[70vh] flex flex-col overflow-hidden shadow-2xl rounded-sm"
            >
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div />
                <h2 className="text-sm font-serif font-bold text-dark-900 tracking-widest uppercase">Nossa Localização</h2>
                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 bg-slate-100 flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.3000785667539!2d-45.40031786560762!3d-23.80434880719762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94d29a445fb3349f%3A0x808763b44f5cccc5!2sR.%20Tr%C3%AAs%20Bandeirantes%2C%20185%20-%20Centro%2C%20S%C3%A3o%20Sebasti%C3%A3o%20-%20SP%2C%2011608-587!5e0!3m2!1spt-BR!2sbr!4v1772230471923!5m2!1spt-BR!2sbr"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/5512991507074"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-luxury-brown text-white p-4 rounded-full shadow-[0_15px_40px_rgba(220,196,172,0.3)] animate-pulse-brown hover:scale-110 transition-transform group"
      >
        <MessageCircleIcon className="w-6 h-6" />
        <span className="absolute right-full mr-6 bg-white text-dark-900 px-5 py-3 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none whitespace-nowrap border border-slate-50">
          Atendimento Humano
        </span>
      </a>

    </div>
  );
}

export default App;