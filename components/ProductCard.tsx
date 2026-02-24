import React from 'react';
import { Tag, Hammer, Star, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  dark?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, dark }) => {
  const isSaleItem = product.mainCategory === 'Loja' || product.mainCategory === 'Cutelaria';
  const isElite = product.price > 500;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`group flex flex-col h-full relative overflow-hidden transition-all duration-300 border shadow-md ${
        dark 
          ? 'bg-dark-800 border-white/5 hover:border-luxury-gold/50' 
          : 'bg-white border-slate-100 hover:border-luxury-brown/50 hover:shadow-xl'
      }`}
    >
      {/* Badge Luxury - Compacto */}
      {isElite && (
        <div className="absolute top-0 right-0 z-20 bg-luxury-gold text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
          Elite
        </div>
      )}

      {/* Tipo Badge */}
      <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] ${
        dark ? 'bg-white text-dark-900' : 'bg-dark-900 text-white'
      }`}>
        {isSaleItem ? (
          <Tag className="w-2.5 h-2.5 text-luxury-brown" />
        ) : (
          <Hammer className="w-2.5 h-2.5 text-luxury-brown" />
        )}
        {isSaleItem ? 'Boutique' : 'Ateliê'}
      </div>

      {/* Imagem Compacta (Aspect Ratio Reduzido) */}
      <div className="relative aspect-[3/2] overflow-hidden bg-slate-50">
        <img 
          src={product.image || 'https://picsum.photos/400/300'} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          dark ? 'bg-dark-900/20' : 'bg-dark-900/5'
        } opacity-0 group-hover:opacity-100`} />

        {/* Overlay "Ver detalhes do serviço" */}
        {product.instagram_url && (
          <a 
            href={product.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-dark-900/40 backdrop-blur-[1px] group"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden px-4 py-2 border border-white/20">
              <span className="relative z-10 text-[9px] font-black uppercase tracking-[0.3em] text-white/90 group-hover:text-white transition-colors">
                Ver detalhes do serviço
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
          </a>
        )}
      </div>
      
      {/* Conteúdo - Fontes Mantidas / Paddings Ajustados */}
      <div className="flex flex-col flex-grow p-5 text-center">
        <div className={`text-[9px] font-black mb-1.5 uppercase tracking-[0.3em] ${
          dark ? 'text-luxury-gold' : 'text-luxury-brown'
        }`}>
          {product.category}
        </div>
        
        <h3 className={`font-serif text-lg mb-2 leading-tight uppercase font-bold tracking-tight transition-colors ${
          dark ? 'text-white' : 'text-dark-900'
        }`}>
          {product.name}
        </h3>
        
        <p className={`text-[11px] mb-5 line-clamp-2 font-light italic leading-relaxed px-1 opacity-60 ${
          dark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {product.description}
        </p>

        <div className={`mt-auto pt-4 border-t flex items-center justify-center gap-6 ${
          dark ? 'border-white/5' : 'border-slate-50'
        }`}>
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
            <span className={`text-[11px] font-bold ${dark ? 'text-slate-400' : 'text-dark-900'}`}>
              {product.rating.toFixed(1)}
            </span>
          </div>
          {product.instagram_url && (
            <a 
              href={product.instagram_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`hover:scale-110 transition-transform ${dark ? 'text-luxury-gold' : 'text-luxury-brown'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}
          <span className={`text-sm font-black tracking-widest ${
            dark ? 'text-luxury-gold' : 'text-dark-900'
          }`}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 h-0.5 bg-luxury-brown transition-all duration-300 w-0 group-hover:w-full`} />
    </motion.div>
  );
};

export default ProductCard;