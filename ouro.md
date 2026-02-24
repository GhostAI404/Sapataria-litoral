# Backup do Sistema - Sapataria Litoral

Este arquivo contém o código-fonte completo e os arquivos de configuração necessários para a reconstrução do sistema Sapataria Litoral.

## Estrutura de Arquivos
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `metadata.json`
- `.env.example`
- `index.html`
- `index.tsx`
- `App.tsx`
- `types.ts`
- `services/supabaseClient.ts`
- `services/mockData.ts`
- `components/AdminDashboard.tsx`
- `components/CatalogManager.tsx`
- `components/AuthModal.tsx`
- `components/CartSidebar.tsx`
- `components/ProductCard.tsx`

---

### package.json
```json
{
  "name": "sapataria-litoral",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^1.41.0",
    "@supabase/supabase-js": "^2.97.0",
    "framer-motion": "^12.34.0",
    "lucide-react": "^0.563.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### vite.config.ts
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node",
      "vite/client"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### metadata.json
```json
{
  "name": "Sapataria Litoral",
  "description": "Especialistas em manutenção, conserto e renovação de calçados no litoral. Seu sapato novo de novo.",
  "requestFramePermissions": []
}
```

### .env.example
```env
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sapataria Litoral | Renovação e Cuidado de Luxo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              serif: ['"Playfair Display"', 'serif'],
              sans: ['"Inter"', 'sans-serif'],
            },
            colors: {
              brand: {
                50: '#fdfbf7',
                100: '#f9f3e6',
                200: '#f1e6d0',
                300: '#e5d1b1',
                400: '#d5b68d',
                500: '#c59a6b',
                600: '#dcc4ac', /* Tom Bege mais claro e luminoso */
                700: '#b8977e',
                800: '#8c6b54',
                900: '#755846',
                950: '#3e2e25',
              },
              luxury: {
                brown: '#dcc4ac', /* Bege Nobre */
                gold: '#cca300',
                beige: '#fcfaf2',
              },
              dark: {
                900: '#1a1a1a',
                800: '#2d2d2d',
              }
            },
            animation: {
              'pulse-brown': 'pulse-brown 2s infinite',
            },
            keyframes: {
              'pulse-brown': {
                '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 196, 172, 0.4)' },
                '50%': { boxShadow: '0 0 0 15px rgba(220, 196, 172, 0)' },
              }
            }
          }
        }
      }
    </script>
    <style>
      body { font-family: 'Inter', sans-serif; background-color: #ffffff; color: #1a1a1a; margin: 0; padding: 0; }
      h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      
      .snake-border {
        position: relative;
        overflow: hidden;
      }
      .snake-border::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(transparent, transparent, transparent, #dcc4ac);
        animation: rotate 4s linear infinite;
      }
      .snake-border::after {
        content: '';
        position: absolute;
        inset: 2px;
        background: white;
        z-index: 1;
      }
      @keyframes rotate {
        100% { transform: rotate(360deg); }
      }
    </style>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.2.4",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "react/": "https://esm.sh/react@^19.2.4/",
    "framer-motion": "https://esm.sh/framer-motion@^12.34.0",
    "lucide-react": "https://esm.sh/lucide-react@^0.563.0",
    "@google/genai": "https://esm.sh/@google/genai@^1.41.0"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

### index.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### types.ts
```ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  mainCategory: string;
  rating: number;
  instagram_url?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export enum PageView {
  HOME = 'home',
  ADMIN = 'admin'
}
```

### App.tsx
```tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Phone as PhoneIcon, 
  Instagram as InstagramIcon, 
  MapPin as MapPinIcon, 
  Clock as ClockIcon, 
  MessageCircle as MessageCircleIcon, 
  LayoutDashboard as LayoutDashboardIcon, 
  ChevronDown,
  ChevronUp
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
        if (hours) setBusinessHours(hours);
        if (landing) setLandingPage(landing);
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

  const [businessHours, setBusinessHours] = useState({
    monFri: '09h às 19h',
    sat: '09h às 18h',
    sun: 'Fechado'
  });

  const [landingPage, setLandingPage] = useState({
    heroTitle: 'Restauração de Alta Classe',
    heroSubtitle: 'Maestria Sapataria Litoral',
    heroImage: 'https://images.unsplash.com/photo-1449241717754-993d087b32c1?auto=format&fit=crop&q=80&w=2000'
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
          <a href="tel:13999999999" className="flex items-center gap-2 hover:text-luxury-brown transition-colors"><PhoneIcon className="w-3 h-3 text-luxury-gold" /> (13) 99999-9999</a>
          <span className="flex items-center gap-2">
            <ClockIcon className="w-3 h-3 text-luxury-gold" /> {businessHours.monFri}
          </span>
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

              <div className="flex flex-col items-start cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
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
                    document.getElementById(id === 'inicio' ? 'hero' : id)?.scrollIntoView({behavior: 'smooth'});
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
          <motion.div 
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 z-0"
          >
             <img src={landingPage.heroImage || 'https://picsum.photos/1920/1080'} alt="Boutique" className="w-full h-full object-cover grayscale" />
          </motion.div>
          
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
              {landingPage.heroTitle.split(' ').slice(0, -2).join(' ')}<br/><span className="text-luxury-brown not-italic">{landingPage.heroTitle.split(' ').slice(-2).join(' ')}</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              <button 
                onClick={() => document.getElementById('servicos')?.scrollIntoView({behavior: 'smooth'})}
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
            <InstagramIcon className="w-5 h-5 hover:text-luxury-brown transition-all cursor-pointer hover:scale-125" />
            <PhoneIcon className="w-5 h-5 hover:text-luxury-brown transition-all cursor-pointer hover:scale-125" />
            <MapPinIcon className="w-5 h-5 hover:text-luxury-brown transition-all cursor-pointer hover:scale-125" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center border-t border-white/5 pt-12">
            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black md:text-left">
              São Vicente • SP
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
      
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/5513999999999" 
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
```


### services/supabaseClient.ts
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
```

### services/mockData.ts
```ts
import { Product } from '../types';

export const PRODUCTS: Product[] = [];
```

### components/AdminDashboard.tsx
```tsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Package, 
  DollarSign, 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Clock, 
  LayoutDashboard, 
  Wallet, 
  ShoppingBag, 
  Bell, 
  Menu, 
  X, 
  Settings, 
  Hammer, 
  Layers, 
  Save, 
  UserCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  UserPlus, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus,
  Trash2,
  Paperclip,
  FileUp,
  Image as ImageIcon,
  Mail,
  Phone,
  FileText,
  Download,
  ShieldCheck,
  Receipt,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  List,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  PieChart,
  Filter,
  Share2,
  Loader2
} from 'lucide-react';
import { Product, User as UserType } from '../types';
import { motion } from 'framer-motion';
import CatalogManager from './CatalogManager';
import { supabase } from '../services/supabaseClient';

interface AdminDashboardProps {
  onBack: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

type AdminSection = 'overview' | 'atendimento' | 'services' | 'financial' | 'inventory' | 'notas' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBack, 
  products,
  setProducts
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [modalType, setModalType] = useState<'Novo Pedido Presencial' | 'Novo Mestre' | 'Novo Produto' | 'Novo Cadastro' | 'Novo Insumo' | 'Novo Registro' | 'Nova Nota Fiscal' | 'Nova Transação' | null>(null);
  const [selectedCustomerInfo, setSelectedCustomerInfo] = useState<string | null>(null);
  
  // States for Atendimento Calendar
  const [isCalendarView, setIsCalendarView] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  // State for Financial Filter
  const [financeFilter, setFinanceFilter] = useState<'Todos' | 'Entrada' | 'Saída'>('Todos');

  // --- DATABASE MOCK STATE ---
  const [orders, setOrders] = useState<any[]>([]);

  const [businessHours, setBusinessHours] = useState({
    monFri: '09h às 19h',
    sat: '09h às 18h',
    sun: 'Fechado'
  });

  const [landingPage, setLandingPage] = useState({
    heroTitle: 'Restauração de Alta Classe',
    heroSubtitle: 'Maestria Sapataria Litoral',
    heroImage: 'https://images.unsplash.com/photo-1449241717754-993d087b32c1?auto=format&fit=crop&q=80&w=2000'
  });

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [atendimentoStatusFilter, setAtendimentoStatusFilter] = useState('Todos');
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState('Todos');
  const [notasStatusFilter, setNotasStatusFilter] = useState('Todos');

  useEffect(() => {
    setAdminSearchTerm('');
    setAtendimentoStatusFilter('Todos');
    setInventoryTypeFilter('Todos');
    setNotasStatusFilter('Todos');
  }, [activeSection]);

  useEffect(() => {
    const fetchAdminData = async () => {
      // Fetch orders
      const { data: ordersData } = await supabase.from('orders').select('*');
      if (ordersData) setOrders(ordersData);

      // Fetch inventory
      const { data: invData } = await supabase.from('inventory').select('*');
      if (invData) setInventory(invData);

      // Fetch customers
      const { data: custData } = await supabase.from('customers').select('*');
      if (custData) setCustomers(custData);

      // Fetch invoices
      const { data: invcData } = await supabase.from('invoices').select('*');
      if (invcData) setInvoices(invcData);

      // Fetch transactions
      const { data: transData } = await supabase.from('financial_transactions').select('*');
      if (transData) setFinancialTransactions(transData);

      // Fetch settings
      const { data: settingsData } = await supabase.from('settings').select('*');
      if (settingsData) {
        const hours = settingsData.find(s => s.key === 'business_hours')?.value;
        const landing = settingsData.find(s => s.key === 'landing_page')?.value;
        if (hours) setBusinessHours(hours);
        if (landing) setLandingPage(landing);
      }
    };

    fetchAdminData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const { error: hoursError } = await supabase
        .from('settings')
        .upsert({ key: 'business_hours', value: businessHours });

      const { error: landingError } = await supabase
        .from('settings')
        .upsert({ key: 'landing_page', value: landingPage });

      if (hoursError || landingError) throw new Error('Erro ao salvar configurações');
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar no Supabase.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const [inventory, setInventory] = useState<any[]>([]);

  const [customers, setCustomers] = useState<any[]>([]);

  const [invoices, setInvoices] = useState<any[]>([]);

  const [financialTransactions, setFinancialTransactions] = useState<any[]>([]);

  const notifications = useMemo(() => [], []);

  // --- CALCULATED METRICS ---
  const stats = useMemo(() => {
    const totalRevenue = financialTransactions
      .filter(t => t.type === 'Entrada')
      .reduce((acc, t) => acc + t.value, 0);

    const activeOrdersCount = orders
      .filter(o => o.status !== 'Pronto' && o.status !== 'Entregue')
      .length;

    const urgentOrdersCount = orders
      .filter(o => {
        const isUrgent = o.status === 'Pendente' || o.status === 'Em Restauração';
        // You could also add date logic here if needed
        return isUrgent;
      }).length;

    const totalCustomersCount = customers.length;

    const boutiqueSales = financialTransactions
      .filter(t => t.type === 'Entrada' && (t.desc.toLowerCase().includes('venda') || t.desc.toLowerCase().includes('boutique')))
      .reduce((acc, t) => acc + t.value, 0);

    return {
      totalRevenue,
      activeOrdersCount,
      urgentOrdersCount,
      totalCustomersCount,
      boutiqueSales
    };
  }, [financialTransactions, orders, customers]);

  const menuItems = [
    { id: 'overview', label: 'Painel geral', icon: LayoutDashboard },
    { id: 'atendimento', label: 'Atendimento e Ordens', icon: UserCircle },
    { id: 'notas', label: 'Notas Fiscais', icon: Receipt },
    { id: 'financial', label: 'Fluxo Financeiro', icon: DollarSign },
    { id: 'inventory', label: 'Estoque e Insumos', icon: Package },
    { id: 'services', label: 'Gestão de Catálogos', icon: Layers },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleUpdateOrder = (id: string, field: string, value: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  const handleUpdateStock = (id: number, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Excluir esta ordem de serviço permanentemente?')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      setOrders(prev => prev.filter(o => o.id !== id));
      alert('Ordem excluída com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao excluir ordem: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeleteInventory = async (id: number) => {
    if (!window.confirm('Excluir este item do estoque?')) return;
    try {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (error) throw error;
      setInventory(prev => prev.filter(i => i.id !== id));
      alert('Item excluído com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao excluir item do estoque: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Excluir este cliente?')) return;
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      setCustomers(prev => prev.filter(c => c.id !== id));
      alert('Cliente excluído com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao excluir cliente: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm('Excluir esta nota fiscal?')) return;
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      setInvoices(prev => prev.filter(i => i.id !== id));
      alert('Nota Fiscal excluída com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao excluir nota fiscal: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!window.confirm('Excluir esta transação financeira?')) return;
    try {
      const { error } = await supabase.from('financial_transactions').delete().eq('id', id);
      if (error) throw error;
      setFinancialTransactions(prev => prev.filter(t => t.id !== id));
      alert('Transação excluída com sucesso!');
    } catch (err: any) {
      console.error(err);
      alert(`Erro ao excluir transação: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleNewRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (modalType === 'Novo Cadastro') {
      const newCustomer = {
        id: `C${customers.length + 1}`,
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '(13) 99999-0000',
        visits: 0,
        loyalty: 'Silver'
      };
      setCustomers(prev => [...prev, newCustomer]);
      setModalType(null);
    } else if (modalType === 'Novo Insumo') {
      const newInsumo = {
        id: inventory.length + 1,
        name: formData.get('name') as string,
        sku: formData.get('sku') as string,
        stock: parseInt(formData.get('stock') as string) || 0,
        price: `R$ ${formData.get('price')}`,
        category: formData.get('category') as string,
        type: formData.get('type') as any
      };
      setInventory(prev => [...prev, newInsumo]);
      setModalType(null);
    } else if (modalType === 'Novo Registro') {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const service = formData.get('service') as string;
      const value = parseFloat(formData.get('value') as string) || 0;
      const deadline = formData.get('deadline') as string;

      // Add to orders
      const newOrder = {
        id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: name,
        service: service,
        status: 'Pendente',
        deadline: deadline || new Date().toISOString().split('T')[0],
        value: value
      };
      setOrders(prev => [newOrder, ...prev]);

      // Add/Update customer logic
      const existingCustomer = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (existingCustomer) {
        setCustomers(prev => prev.map(c => c.id === existingCustomer.id ? { ...c, visits: c.visits + 1 } : c));
      } else {
        const newCustomer = {
          id: `C${customers.length + 1}`,
          name: name,
          email: email || 'n/a',
          phone: phone || 'n/a',
          visits: 1,
          loyalty: 'Silver'
        };
        setCustomers(prev => [...prev, newCustomer]);
      }
      setModalType(null);
    } else if (modalType === 'Nova Nota Fiscal') {
      setIsModalLoading(true);
      try {
        const file = formData.get('file') as File;
        let fileUrl = null;

        if (file && file.size > 0) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('tax-invoices')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('tax-invoices')
            .getPublicUrl(filePath);
          fileUrl = publicUrl;
        }

        const newNF = {
          id: formData.get('nf_id') as string,
          orderId: formData.get('os_ref') as string,
          customer: formData.get('customer') as string,
          date: formData.get('date') as string,
          value: parseFloat(formData.get('value') as string) || 0,
          status: formData.get('status') as string,
          fileName: file?.name || null,
          fileUrl: fileUrl
        };

        const { error: dbError } = await supabase
          .from('invoices')
          .insert([newNF]);

        if (dbError) throw dbError;

        setInvoices(prev => [newNF, ...prev]);
        setModalType(null);
      } catch (err) {
        console.error(err);
        alert('Erro ao registrar nota fiscal');
      } finally {
        setIsModalLoading(false);
      }
    } else if (modalType === 'Nova Transação') {
      const newTransaction = {
        id: financialTransactions.length + 1,
        type: formData.get('type') as string,
        desc: formData.get('desc') as string,
        value: parseFloat(formData.get('value') as string) || 0,
        method: formData.get('method') as string,
        date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        status: 'Concluído'
      };
      setFinancialTransactions(prev => [newTransaction, ...prev]);
      setModalType(null);
    }
  };

  // Helper functions for calendar
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`pad-${i}`} className="h-16 md:h-20 bg-slate-50/20 border border-slate-100/30"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === dateStr;
      const ordersOnThisDay = orders.filter(o => o.deadline === dateStr);
      const isToday = new Date().toISOString().split('T')[0] === dateStr;

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(dateStr)}
          className={`h-16 md:h-20 border border-slate-100 p-2 cursor-pointer transition-all relative flex flex-col justify-between ${isSelected ? 'bg-brand-50 border-brand-300 z-10' : 'bg-white hover:bg-slate-50'}`}
        >
          <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${isToday ? 'bg-dark-900 text-white px-1.5 py-1 rounded-sm' : isSelected ? 'text-brand-600' : 'text-slate-400'}`}>
            {day}
          </span>
          
          {ordersOnThisDay.length > 0 && (
            <div className="flex justify-end">
               <span className="bg-brand-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-in zoom-in duration-300">
                {ordersOnThisDay.length} {ordersOnThisDay.length === 1 ? 'ENTREGA' : 'ENTREGAS'}
              </span>
            </div>
          )}
          {isSelected && <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-600"></div>}
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-500 max-w-4xl mx-auto">
        <div className="p-4 bg-dark-900 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentCalendarDate(new Date(year, month - 1, 1))}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-serif italic font-bold tracking-tight">
              {currentCalendarDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
            <button 
              onClick={() => setCurrentCalendarDate(new Date(year, month + 1, 1))}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => {
              const today = new Date();
              setCurrentCalendarDate(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(today.toISOString().split('T')[0]);
            }}
            className="text-[8px] font-black uppercase tracking-widest border border-white/20 px-3 py-1.5 hover:bg-white hover:text-dark-900 transition-all"
          >
            Ir para Hoje
          </button>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="py-2 text-center text-[8px] font-black uppercase tracking-widest text-slate-400">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const lowerSearch = adminSearchTerm.toLowerCase();

    const filteredOrders = orders.filter(o => {
      const matchesSearch = o.id.toLowerCase().includes(lowerSearch) || 
        o.customer.toLowerCase().includes(lowerSearch) ||
        o.service.toLowerCase().includes(lowerSearch);
      const matchesStatus = atendimentoStatusFilter === 'Todos' || o.status === atendimentoStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const filteredCustomers = customers.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) || 
      c.email.toLowerCase().includes(lowerSearch) ||
      c.phone.toLowerCase().includes(lowerSearch)
    );

    const filteredInvoices = invoices.filter(i => {
      const matchesSearch = i.id.toLowerCase().includes(lowerSearch) || 
        i.orderId.toLowerCase().includes(lowerSearch) ||
        i.customer.toLowerCase().includes(lowerSearch);
      const matchesStatus = notasStatusFilter === 'Todos' || i.status === notasStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const filteredTransactions = financialTransactions.filter(t => 
      t.desc.toLowerCase().includes(lowerSearch) || 
      t.method.toLowerCase().includes(lowerSearch)
    );

    const filteredInventory = inventory.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(lowerSearch) || 
        i.sku.toLowerCase().includes(lowerSearch) ||
        i.category.toLowerCase().includes(lowerSearch);
      const matchesType = inventoryTypeFilter === 'Todos' || i.type === inventoryTypeFilter;
      return matchesSearch && matchesType;
    });

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Search Bar for Overview */}
            <div className="bg-white border border-slate-100 p-4 flex items-center gap-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Pesquisar em todo o painel..." 
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-brand-600 transition-all"
                />
              </div>
              <select 
                value={atendimentoStatusFilter}
                onChange={(e) => setAtendimentoStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-100 px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-600"
              >
                <option value="Todos">Status: Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Em Restauração">Em Restauração</option>
                <option value="Pronto">Pronto</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  label: 'Receita Mensal', 
                  value: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
                  icon: Wallet, 
                  color: 'bg-emerald-600', 
                  trend: '+12%' 
                },
                { 
                  label: 'Ordens Ativas', 
                  value: stats.activeOrdersCount.toString(), 
                  icon: Clock, 
                  color: 'bg-blue-600', 
                  trend: `${stats.urgentOrdersCount} urgentes` 
                },
                { 
                  label: 'Clientes Fiéis', 
                  value: stats.totalCustomersCount.toLocaleString('pt-BR'), 
                  icon: Users, 
                  color: 'bg-brand-600', 
                  trend: '+4 hoje' 
                },
                { 
                  label: 'Vendas Boutique', 
                  value: `R$ ${stats.boutiqueSales.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
                  icon: ShoppingBag, 
                  color: 'bg-indigo-600', 
                  trend: '+5%' 
                },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} p-6 border-b-8 border-black/10 shadow-xl text-white transform hover:-translate-y-1 transition-all`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/20 rounded-lg"><stat.icon className="w-5 h-5" /></div>
                    <span className="text-[8px] font-black uppercase bg-black/20 px-2 py-1 rounded-full">{stat.trend}</span>
                  </div>
                  <h3 className="uppercase tracking-widest text-[9px] font-black mb-1 opacity-80">{stat.label}</h3>
                  <p className="text-3xl font-serif font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="bg-white border border-slate-100 shadow-sm rounded-none overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                   <h3 className="font-serif font-bold text-lg text-dark-900 italic">Atividade Recente</h3>
                   <button onClick={() => setActiveSection('atendimento')} className="text-[9px] font-bold uppercase tracking-widest text-brand-600 border-b border-brand-600 pb-0.5">Ver Tudo</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-400">ID</th>
                        <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-400">Cliente</th>
                        <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-400">Status</th>
                        <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-400">Valor</th>
                        <th className="px-6 py-4 text-[9px] uppercase tracking-widest font-black text-slate-400 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredOrders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-tighter">{order.id}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-dark-900 text-sm">{order.customer}</p>
                            <p className="text-[8px] uppercase text-slate-400 font-bold">{order.service}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[8px] uppercase font-black px-2 py-1 rounded-full ${order.status === 'Pronto' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>{order.status}</span>
                          </td>
                          <td className="px-6 py-4 font-serif font-bold text-dark-900 text-sm">R$ {order.value.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                              title="Excluir Ordem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <CatalogManager 
            products={products} 
            onUpdateProducts={setProducts} 
          />
        );

      case 'atendimento':
        const filteredOrdersByDate = isCalendarView && selectedDate 
          ? filteredOrders.filter(o => o.deadline === selectedDate)
          : filteredOrders;

        return (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold italic text-dark-900">Atendimento & Ordens</h2>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-1">
                    {isCalendarView 
                      ? 'Planejamento de Entregas por Data' 
                      : 'Gestão unificada de clientes e serviços ativos'}
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                   <div className="flex gap-2 flex-1 md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="Pesquisar ordens..." 
                          value={adminSearchTerm}
                          onChange={(e) => setAdminSearchTerm(e.target.value)}
                          className="w-full bg-white border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-600 transition-all shadow-sm"
                        />
                     </div>
                     <select 
                       value={atendimentoStatusFilter}
                       onChange={(e) => setAtendimentoStatusFilter(e.target.value)}
                       className="bg-white border border-slate-100 px-4 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-600 shadow-sm"
                     >
                       <option value="Todos">Status: Todos</option>
                       <option value="Pendente">Pendente</option>
                       <option value="Em Restauração">Em Restauração</option>
                       <option value="Pronto">Pronto</option>
                     </select>
                   </div>
                   <div className="flex gap-3">
                     <button 
                      onClick={() => setIsCalendarView(!isCalendarView)}
                      className={`flex-1 md:flex-initial px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 ${isCalendarView ? 'bg-dark-900 text-white' : 'bg-white text-dark-900 border border-slate-100 hover:bg-slate-50'}`}
                     >
                       {isCalendarView ? <List className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                       {isCalendarView ? 'Ver Lista Completa' : 'Ver Calendário'}
                     </button>
                     <button 
                      onClick={() => setModalType('Novo Registro')}
                      className="flex-1 md:flex-initial bg-brand-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-dark-900 transition-all shadow-xl flex items-center justify-center gap-2"
                     >
                       <Plus className="w-4 h-4" /> Novo Registro
                     </button>
                   </div>
                </div>
             </div>

             {isCalendarView ? (
               <div className="space-y-10 animate-in slide-in-from-top-4 duration-500">
                  {renderCalendar()}
                  
                  <div className="bg-white border border-slate-100 shadow-xl overflow-hidden max-w-4xl mx-auto">
                    <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-600 text-white">
                             <Clock className="w-4 h-4" />
                          </div>
                          <div>
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Previsão de Entrega para:</span>
                             <span className="text-sm font-serif font-bold text-dark-900 italic">
                                {selectedDate ? selectedDate.split('-').reverse().join('/') : 'Selecione um dia'}
                             </span>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase bg-dark-900 text-white px-3 py-1">
                             {filteredOrdersByDate.length} {filteredOrdersByDate.length === 1 ? 'Serviço' : 'Serviços'}
                          </span>
                       </div>
                    </div>
                    {filteredOrdersByDate.length > 0 ? (
                      <table className="w-full text-left">
                        <thead className="bg-white">
                          <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                            <th className="px-8 py-5">Cliente</th>
                            <th className="px-8 py-5">Serviço Especializado</th>
                            <th className="px-8 py-5">Estado Atual</th>
                            <th className="px-8 py-5 text-right">Valor Final</th>
                            <th className="px-8 py-5 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {filteredOrdersByDate.map(o => (
                            <tr key={o.id} className="hover:bg-brand-50/20 transition-colors group">
                              <td className="px-8 py-6">
                                 <p className="font-bold text-sm text-dark-900">{o.customer}</p>
                                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">ID: {o.id}</p>
                              </td>
                              <td className="px-8 py-6">
                                <p className="text-[10px] text-brand-600 font-black uppercase tracking-widest">{o.service}</p>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`text-[8px] uppercase font-black px-2 py-1 border ${o.status === 'Pronto' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-brand-50 text-brand-600'}`}>{o.status}</span>
                              </td>
                              <td className="px-8 py-6 text-right font-serif font-bold text-dark-900 text-base">
                                R$ {o.value.toFixed(2)}
                              </td>
                              <td className="px-8 py-6 text-center">
                                <button 
                                  onClick={() => handleDeleteOrder(o.id)}
                                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                  title="Excluir Ordem"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                           <CalendarIcon className="w-8 h-8 text-slate-200" />
                        </div>
                        <h4 className="text-sm font-serif font-bold italic text-dark-900 mb-1">Dia sem entregas programadas</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Clique em outra data no calendário para conferir o cronograma.</p>
                      </div>
                    )}
                  </div>
               </div>
             ) : (
               <div className="bg-white border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                        <th className="px-8 py-5">Cliente</th>
                        <th className="px-8 py-5">Item / Serviço</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Entrega Prevista</th>
                        <th className="px-8 py-5 text-right">Valor</th>
                        <th className="px-8 py-5 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredOrders.map(o => {
                        const customer = customers.find(c => c.name === o.customer);
                        const isInfoSelected = selectedCustomerInfo === o.id;

                        return (
                          <tr key={o.id} className="hover:bg-slate-50/50 transition-colors relative group">
                            <td className="px-8 py-6 relative">
                               <button 
                                  onClick={() => setSelectedCustomerInfo(isInfoSelected ? null : o.id)}
                                  className="font-bold text-sm text-dark-900 hover:text-brand-600 transition-colors flex items-center gap-2 text-left"
                               >
                                  {o.customer}
                                  <Info className="w-3 h-3 text-slate-300" />
                               </button>
                               {isInfoSelected && customer && (
                                 <div className="absolute left-8 top-full z-20 bg-white border border-slate-100 shadow-2xl p-4 min-w-[200px] animate-in slide-in-from-top-2 duration-200">
                                    <div className="flex justify-between items-center mb-2">
                                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Contato Direto</span>
                                       <button onClick={() => setSelectedCustomerInfo(null)}><X className="w-3 h-3 text-slate-300 hover:text-red-500" /></button>
                                    </div>
                                    <div className="space-y-2">
                                       <div className="flex items-center gap-2 text-[10px] text-dark-900 font-medium">
                                          <Mail className="w-3 h-3 text-brand-600" />
                                          {customer.email}
                                       </div>
                                       <div className="flex items-center gap-2 text-[10px] text-dark-900 font-medium">
                                          <Phone className="w-3 h-3 text-brand-600" />
                                          {customer.phone}
                                       </div>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-50">
                                       <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">
                                          {customer.loyalty} Member
                                       </span>
                                    </div>
                                 </div>
                               )}
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-[10px] text-brand-600 font-black uppercase tracking-tighter">{o.service}</p>
                            </td>
                            <td className="px-8 py-6">
                               <select 
                                  value={o.status} 
                                  onChange={(e) => handleUpdateOrder(o.id, 'status', e.target.value)} 
                                  className="bg-transparent border-0 text-[10px] font-black uppercase outline-none cursor-pointer focus:ring-0 p-0"
                               >
                                  <option>Pendente</option>
                                  <option>Em Restauração</option>
                                  <option>Pronto</option>
                               </select>
                            </td>
                            <td className="px-8 py-6 text-xs text-slate-500 font-medium">
                               {o.deadline.split('-').reverse().join('/')}
                            </td>
                            <td className="px-8 py-6 text-right font-serif font-bold text-dark-900">
                               R$ {o.value.toFixed(2)}
                            </td>
                            <td className="px-8 py-6 text-center">
                              <button 
                                onClick={() => handleDeleteOrder(o.id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                title="Excluir Ordem"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
             )}
          </div>
        );

      case 'financial':
        const totalIn = financialTransactions.filter(t => t.type === 'Entrada').reduce((acc, curr) => acc + curr.value, 0);
        const totalOut = financialTransactions.filter(t => t.type === 'Saída').reduce((acc, curr) => acc + curr.value, 0);

        const filteredByStatus = financeFilter === 'Todos' 
          ? filteredTransactions 
          : filteredTransactions.filter(t => t.type === financeFilter);

        return (
          <div className="space-y-10 animate-in fade-in duration-700">
             {/* Header de Fluxo de Luxo */}
             <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold italic text-dark-900">Módulo de Conciliação Financeira</h2>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-black mt-2">Visão consolidada do patrimônio e liquidez</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="Pesquisar transações..." 
                        value={adminSearchTerm}
                        onChange={(e) => setAdminSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-100 py-3.5 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-600 transition-all shadow-sm"
                      />
                   </div>
                   <div className="flex gap-3">
                     <button className="bg-white border border-slate-100 text-dark-900 px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Share2 className="w-4 h-4" /> Exportar Ledger
                     </button>
                     <button 
                      onClick={() => setModalType('Nova Transação')}
                      className="bg-brand-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-dark-900 transition-all shadow-xl flex items-center gap-2"
                     >
                        <Plus className="w-4 h-4" /> Registrar Movimentação
                     </button>
                   </div>
                </div>
             </div>

             {/* Cards Financeiros Refinados - Apenas Entradas e Saídas */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 border-l-[1px] border-t-[1px] border-slate-100 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-20 h-20 text-emerald-600" />
                   </div>
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Receita Bruta (Período)</p>
                   </div>
                   <p className="text-4xl font-serif font-bold text-dark-900 italic mb-2">R$ {totalIn.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                   <div className="flex items-center gap-2 text-emerald-600">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase">+14.2% em relação ao mês anterior</span>
                   </div>
                </div>

                <div className="bg-white p-8 border-l-[1px] border-t-[1px] border-slate-100 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingDown className="w-20 h-20 text-red-600" />
                   </div>
                   <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Custo Operacional</p>
                   </div>
                   <p className="text-4xl font-serif font-bold text-dark-900 italic mb-2">R$ {totalOut.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                   <p className="text-[10px] font-black uppercase text-slate-400 italic opacity-60">Insumos, Manutenção e Logística</p>
                </div>
             </div>

             {/* Tabela de Transações Concierge com Filtros Funcionais */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                      <List className="w-4 h-4" /> Histórico de Conciliação
                   </h3>
                   <div className="flex items-center gap-4">
                      <select 
                        value={financeFilter}
                        onChange={(e) => setFinanceFilter(e.target.value as any)}
                        className="bg-white border border-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-600 shadow-sm"
                      >
                        <option value="Todos">Fluxo: Todos</option>
                        <option value="Entrada">Entradas</option>
                        <option value="Saída">Saídas</option>
                      </select>
                   </div>
                </div>

                <div className="bg-white border border-slate-100 shadow-2xl overflow-hidden">
                   <table className="w-full text-left">
                     <thead className="bg-slate-50 border-b border-slate-100">
                       <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                         <th className="px-10 py-6">Natureza / Origem</th>
                         <th className="px-10 py-6">Canal de Recebimento</th>
                         <th className="px-10 py-6">Cronologia</th>
                         <th className="px-10 py-6 text-center">Status Ativo</th>
                         <th className="px-10 py-6 text-right">Valor Líquido</th>
                         <th className="px-10 py-6 text-center">Ações</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                       {filteredByStatus.map(t => (
                         <tr key={t.id} className="hover:bg-brand-50/20 transition-all duration-300 group animate-in fade-in slide-in-from-left-2">
                           <td className="px-10 py-7">
                              <div className="flex items-center gap-5">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${t.type === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {t.type === 'Entrada' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                 </div>
                                 <div>
                                    <p className="font-bold text-sm text-dark-900 leading-tight">{t.desc}</p>
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">ID Transação: {Math.floor(Math.random() * 1000000)}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-7">
                              <div className="flex items-center gap-3">
                                 <CreditCard className="w-3.5 h-3.5 text-brand-600" />
                                 <span className="text-[10px] text-dark-900 font-black uppercase tracking-widest">{t.method}</span>
                              </div>
                           </td>
                           <td className="px-10 py-7">
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-bold text-dark-800">{t.date.split(',')[0]}</span>
                                 <span className="text-[9px] text-slate-400 italic">{t.date.split(',')[1]}</span>
                              </div>
                           </td>
                           <td className="px-10 py-7 text-center">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full border border-emerald-100">
                                 <CheckCircle2 className="w-2.5 h-2.5" /> {t.status}
                              </span>
                           </td>
                           <td className={`px-10 py-7 text-right font-serif font-bold text-base ${t.type === 'Entrada' ? 'text-emerald-600' : 'text-dark-900'}`}>
                              {t.type === 'Entrada' ? '+' : '-'} R$ {t.value.toFixed(2)}
                           </td>
                           <td className="px-10 py-7 text-center">
                              <div className="flex justify-center gap-2">
                                 <label className="p-2.5 bg-slate-50 text-slate-400 hover:bg-dark-900 hover:text-white transition-all cursor-pointer shadow-sm rounded-sm">
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <input type="file" className="hidden" />
                                 </label>
                                 <button 
                                   onClick={() => handleDeleteTransaction(t.id)}
                                   className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm rounded-sm"
                                   title="Excluir Transação"
                                 >
                                    <Trash2 className="w-3.5 h-3.5" />
                                 </button>
                              </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        );

      case 'inventory':
        const invStats = {
          inStock: filteredInventory.filter(i => i.stock > 10).length,
          lowStock: filteredInventory.filter(i => i.stock > 0 && i.stock <= 10).length,
          outOfStock: filteredInventory.filter(i => i.stock === 0).length
        };

        return (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-serif font-bold italic text-dark-900">Estoque & Insumos</h2>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-1">Gestão de Materiais e Produtos Boutique</p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                   <div className="flex gap-2 flex-1 md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="Pesquisar estoque..." 
                          value={adminSearchTerm}
                          onChange={(e) => setAdminSearchTerm(e.target.value)}
                          className="w-full bg-white border border-slate-100 py-3.5 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-600 transition-all shadow-sm"
                        />
                     </div>
                     <select 
                       value={inventoryTypeFilter}
                       onChange={(e) => setInventoryTypeFilter(e.target.value)}
                       className="bg-white border border-slate-100 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-600 shadow-sm"
                     >
                       <option value="Todos">Tipo: Todos</option>
                       <option value="Serviço">Serviço</option>
                       <option value="Boutique">Boutique</option>
                     </select>
                   </div>
                   <button 
                    onClick={() => setModalType('Novo Insumo')}
                    className="bg-brand-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-dark-900 transition-all shadow-xl flex items-center gap-2"
                   >
                      <Package className="w-4 h-4" /> Novo Insumo
                   </button>
                </div>
             </div>

             {/* Resumo de Inventário Otimizado */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 border-l-4 border-emerald-500 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                   <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Itens Disponíveis</p>
                      <p className="text-3xl font-serif font-bold text-dark-900 italic">{invStats.inStock}</p>
                      <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5">Estoque OK</span>
                   </div>
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:rotate-12 transition-transform">
                      <CheckCircle2 className="w-7 h-7" />
                   </div>
                </div>
                <div className="bg-white p-6 border-l-4 border-amber-500 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                   <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Atenção Necessária</p>
                      <p className="text-3xl font-serif font-bold text-dark-900 italic">{invStats.lowStock}</p>
                      <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5">Esgotando</span>
                   </div>
                   <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:rotate-12 transition-transform">
                      <AlertTriangle className="w-7 h-7" />
                   </div>
                </div>
                <div className="bg-white p-6 border-l-4 border-red-500 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
                   <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Reposição Imediata</p>
                      <p className="text-3xl font-serif font-bold text-dark-900 italic">{invStats.outOfStock}</p>
                      <span className="text-[8px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5">Esgotado</span>
                   </div>
                   <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 group-hover:rotate-12 transition-transform">
                      <XCircle className="w-7 h-7" />
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-100">
                        <th className="px-8 py-5">Identificação</th>
                        <th className="px-8 py-5">Setor / Tipo</th>
                        <th className="px-8 py-5 text-center">Status Operacional</th>
                        <th className="px-8 py-5 text-center">Gestão de Qtd</th>
                        <th className="px-8 py-5 text-right">Preço Un.</th>
                        <th className="px-8 py-5 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredInventory.map(i => (
                        <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-bold text-sm text-dark-900">{i.name}</p>
                             <p className="text-[9px] text-slate-400 font-mono tracking-tighter uppercase">Ref: {i.sku}</p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex flex-col gap-1">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-sm w-fit ${i.type === 'Boutique' ? 'bg-indigo-50 text-indigo-600' : 'bg-brand-50 text-brand-600'}`}>
                                  {i.type}
                                </span>
                                <span className="text-[8px] text-slate-400 font-bold ml-1 uppercase">{i.category}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             {i.stock === 0 ? (
                               <div className="flex flex-col items-center gap-1">
                                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                                     <XCircle className="w-3 h-3" /> Esgotado
                                  </span>
                               </div>
                             ) : i.stock <= 10 ? (
                               <div className="flex flex-col items-center gap-1">
                                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                                     <AlertTriangle className="w-3 h-3" /> Esgotando
                                  </span>
                               </div>
                             ) : (
                               <div className="flex flex-col items-center gap-1">
                                  <span className="inline-flex items-center gap-1.5 text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                     <CheckCircle2 className="w-3 h-3" /> Em Estoque
                                  </span>
                               </div>
                             )}
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="inline-flex items-center gap-1 bg-white border border-slate-100 p-1 rounded-lg shadow-sm">
                                <button 
                                  onClick={() => handleUpdateStock(i.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-red-500 transition-colors rounded"
                                >
                                   <Minus className="w-3.5 h-3.5" />
                                </button>
                                <div className="min-w-[40px] text-center font-mono font-black text-xs text-dark-900">
                                  {i.stock}
                                </div>
                                <button 
                                  onClick={() => handleUpdateStock(i.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-brand-600 transition-colors rounded"
                                >
                                   <Plus className="w-3.5 h-3.5" />
                                </button>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right font-serif font-bold text-dark-900">{i.price}</td>
                          <td className="px-8 py-6 text-center">
                             <button 
                               onClick={() => handleDeleteInventory(i.id)}
                               className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                               title="Excluir do Estoque"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        );

<!-- ADMIN_DASHBOARD_PART_3 -->


### components/CatalogManager.tsx
```tsx
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Tag, 
  Hammer, 
  X,
  Save,
  Search,
  Loader2,
  Instagram as InstagramIcon
} from 'lucide-react';
import { Product } from '../types';
import { supabase } from '../services/supabaseClient';

interface CatalogManagerProps {
  products: Product[];
  onUpdateProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const CatalogManager: React.FC<CatalogManagerProps> = ({ products, onUpdateProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    mainCategory: 'Calçados',
    category: '',
    instagram_url: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mainCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModalForAdd = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      image: '', 
      mainCategory: 'Calçados', 
      category: '',
      instagram_url: ''
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      mainCategory: product.mainCategory,
      category: product.category,
      instagram_url: product.instagram_url || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400',
      mainCategory: formData.mainCategory,
      category: formData.category,
      instagram_url: formData.instagram_url,
      rating: 5.0
    };

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)
          .select();

        if (error) throw error;
        if (data) {
          onUpdateProducts(prev => prev.map(p => p.id === editingId ? data[0] : p));
        }
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) throw error;
        if (data) {
          onUpdateProducts(prev => [data[0], ...prev]);
        }
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', image: '', mainCategory: 'Calçados', category: '', instagram_url: '' });
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Erro ao salvar produto no Supabase. Verifique se a tabela "products" existe.');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: number) => {
    if (window.confirm('Excluir este item do catálogo? Esta ação é irreversível e o item deixará de aparecer no site para os clientes.')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        onUpdateProducts(prev => prev.filter(p => p.id !== id));
        alert('Produto excluído com sucesso!');
        
        if (editingId === id) {
          setEditingId(null);
          setIsModalOpen(false);
        }
      } catch (err: any) {
        console.error('Error deleting product:', err);
        alert(`Erro ao excluir produto: ${err.message || 'Erro desconhecido'}`);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header do Gerenciador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold italic text-dark-900">Gestão de Inventário & Serviços</h2>
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Sincronização em tempo real com o site principal</p>
        </div>
        <button 
          onClick={openModalForAdd}
          className="bg-brand-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-dark-900 transition-all shadow-xl"
        >
          <Plus className="w-4 h-4" /> Adicionar Novo Item
        </button>
      </div>

      {/* Barra de Pesquisa Local */}
      <div className="bg-white border border-slate-100 p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, categoria ou setor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-brand-600 transition-all"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-100 text-[9px] font-black text-slate-400 uppercase">
          Total: {products.length} itens ativos
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                <th className="px-8 py-5">Visual</th>
                <th className="px-8 py-5">Item / Descrição</th>
                <th className="px-8 py-5">Categoria Site</th>
                <th className="px-8 py-5">Preço</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="w-12 h-12 bg-slate-100 overflow-hidden border border-slate-200">
                  <img src={product.image || 'https://picsum.photos/200'} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-dark-900">{product.name}</p>
                      {product.instagram_url && <InstagramIcon className="w-3 h-3 text-brand-600" />}
                    </div>
                    <p className="text-[9px] text-slate-400 line-clamp-1 italic">{product.description}</p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase tracking-widest bg-brand-50 text-brand-600 px-2 py-0.5 w-fit flex items-center gap-1.5">
                        {product.mainCategory === 'Cutelaria' ? <Tag className="w-2.5 h-2.5" /> : product.mainCategory === 'Loja' ? <Tag className="w-2.5 h-2.5 text-brand-400" /> : <Hammer className="w-2.5 h-2.5" />}
                        {product.mainCategory}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold ml-1 uppercase">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 font-serif font-bold text-dark-900 whitespace-nowrap">R$ {product.price.toFixed(2)}</td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button 
                        onClick={() => openModalForEdit(product)}
                        className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm rounded-sm"
                        title="Editar Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeProduct(product.id)}
                        className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm rounded-sm"
                        title="Excluir Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <p className="text-sm font-serif italic text-slate-400">Nenhum item encontrado com os critérios de busca.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 bg-dark-900 text-white flex justify-between items-center">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-400 mb-1">Módulo Administrativo</h4>
                <h2 className="font-serif text-2xl italic">{editingId ? 'Editar Item do Catálogo' : 'Cadastrar Novo Item'}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Nome do Item</label>
                <input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Setor Principal</label>
                  <select 
                    required 
                    value={formData.mainCategory}
                    onChange={(e) => setFormData({...formData, mainCategory: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Calçados">Calçados (Serviço)</option>
                    <option value="Bolsas">Bolsas (Serviço)</option>
                    <option value="Loja">Boutique (Venda)</option>
                    <option value="Cutelaria">Cutelaria (Venda)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Categoria Técnica</label>
                <input 
                  required 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-brand-600" 
                  placeholder="Ex: Pintura, Reparos, Acessórios" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Descrição Informativa</label>
                <textarea 
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none h-24 resize-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Link do Instagram</label>
                <div className="relative">
                  <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({...formData, instagram_url: e.target.value})}
                    placeholder="https://www.instagram.com/p/..."
                    className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Imagem do Produto</label>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-200" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload"
                        className="flex items-center justify-center gap-2 w-full bg-slate-50 border border-dashed border-slate-200 py-4 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-slate-100 transition-all"
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {uploading ? 'Enviando...' : 'Upload de Arquivo'}
                      </label>
                    </div>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input 
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="Ou cole a URL da imagem aqui"
                        className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-600 text-white py-6 font-black uppercase tracking-widest text-[11px] hover:bg-dark-900 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {editingId ? 'Salvar Alterações' : 'Confirmar e Gravar no Catálogo'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogManager;
```


### components/AuthModal.tsx
```tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        if (data.user) {
          onLogin({
            id: data.user.id,
            name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
          });
          onClose();
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (authError) throw authError;

        if (data.user) {
          alert('Conta criada com sucesso! Você já pode fazer login.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro durante a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark-900/80 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-dark-900 text-white flex justify-between items-center">
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-400 mb-1">Acesso Restrito</h4>
            <h2 className="font-serif text-2xl italic">{isLogin ? 'Entrar no Painel' : 'Criar Nova Conta'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-100 p-4 text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Nome Completo</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  required 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none transition-all" 
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 py-4 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-brand-600 outline-none transition-all" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 text-white py-6 font-black uppercase tracking-widest text-[11px] hover:bg-dark-900 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Autenticar Agora' : 'Finalizar Cadastro')}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors"
            >
              {isLogin ? 'Não possui conta? Cadastre-se' : 'Já possui uma conta? Entre'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthModal;
```


### components/CartSidebar.tsx
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const message = `Olá! Gostaria de solicitar um orçamento para os seguintes itens:\n\n${items.map(item => `- ${item.name} (${item.quantity}x)`).join('\n')}\n\nTotal estimado: R$ ${total.toFixed(2)}`;
    window.open(`https://wa.me/5513999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
      >
        <div className="p-8 bg-dark-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShoppingBag className="w-6 h-6 text-brand-400" />
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-400 mb-1">Seu Pedido</h4>
              <h2 className="font-serif text-2xl italic">Sacola de Itens</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-slate-200" />
              </div>
              <div>
                <p className="font-serif italic text-slate-400 text-lg">Sua sacola está vazia</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-300 mt-2">Explore nosso catálogo</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-6 group">
                <div className="w-24 h-24 bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-dark-900 text-sm">{item.name}</h3>
                      <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 italic mt-1">{item.category}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-slate-100 bg-slate-50">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-2 hover:text-brand-600 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-4 text-xs font-black text-dark-900">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-2 hover:text-brand-600 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-serif font-bold text-dark-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Estimado</span>
              <span className="text-3xl font-serif font-bold text-dark-900 italic">R$ {total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-brand-600 text-white py-6 font-black uppercase tracking-widest text-[11px] hover:bg-dark-900 transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
              <MessageCircle className="w-4 h-4" /> Finalizar via WhatsApp
            </button>
            <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-bold">
              Atendimento personalizado e orçamentos sob medida
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartSidebar;
```


### components/ProductCard.tsx
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram as InstagramIcon, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  dark?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, dark }) => {
  const handleWhatsApp = () => {
    const message = `Olá! Vi o item "${product.name}" no site e gostaria de mais informações.`;
    window.open(`https://wa.me/5513999999999?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 mb-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${dark ? 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale group-hover:grayscale-0'}`}
        />
        
        {/* Overlay de Ação */}
        <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          <button 
            onClick={handleWhatsApp}
            className="bg-white text-dark-900 px-6 py-3 text-[9px] font-black uppercase tracking-widest hover:bg-luxury-brown hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
          >
            Solicitar Orçamento
          </button>
          {product.instagram_url && (
            <a 
              href={product.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dark-900 text-white p-3 hover:bg-luxury-brown transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Badge de Categoria */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest ${dark ? 'bg-white/10 text-white backdrop-blur-md' : 'bg-dark-900 text-white'}`}>
          {product.category}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-serif text-xl italic font-medium transition-colors ${dark ? 'text-white group-hover:text-luxury-gold' : 'text-dark-900 group-hover:text-luxury-brown'}`}>
            {product.name}
          </h3>
          <span className={`font-serif font-bold text-lg ${dark ? 'text-luxury-gold' : 'text-dark-900'}`}>
            R$ {product.price.toFixed(2)}
          </span>
        </div>
        <p className={`text-[11px] leading-relaxed line-clamp-2 mb-6 flex-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {product.description}
        </p>
        
        <button 
          onClick={handleWhatsApp}
          className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all group/btn ${dark ? 'text-luxury-gold hover:text-white' : 'text-dark-900 hover:text-luxury-brown'}`}
        >
          Ver Detalhes <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
```

