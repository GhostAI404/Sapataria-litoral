import React from 'react';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    const phone = "5513999999999"; // Número da Sapataria Litoral
    let message = `Olá Sapataria Litoral! Gostaria de um orçamento para os seguintes serviços:\n\n`;
    
    items.forEach(item => {
      message += `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\nTotal Estimado: R$ ${total.toFixed(2)}\n\nComo posso proceder para enviar meus itens?`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-500 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-brand-50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-serif font-bold text-dark-900 uppercase tracking-widest">Orçamento</h2>
              <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </div>
            <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform duration-300 text-slate-400 hover:text-dark-900">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 opacity-20" />
                </div>
                <div>
                  <p className="font-serif text-lg text-dark-900">Seu ateliê está vazio</p>
                  <p className="text-xs mt-1 uppercase tracking-widest">Adicione serviços para restaurar seus itens</p>
                </div>
                <button onClick={onClose} className="text-brand-600 text-xs font-bold uppercase tracking-widest hover:letter-spacing-widest transition-all">
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="w-20 h-20 bg-slate-50 overflow-hidden flex-shrink-0 border border-brand-50 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif font-bold text-dark-900 text-sm leading-tight uppercase tracking-wide">{item.name}</h3>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-brand-600 text-[9px] uppercase font-bold tracking-widest mt-1">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-dark-900 text-sm">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        <div className="flex items-center border border-slate-100 bg-white">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 text-slate-400"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-[10px] font-bold text-dark-900">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-slate-50 text-slate-400"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 bg-dark-900 text-white">
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  <span>Subtotal Estimado</span>
                  <span className="text-white">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  <span>Avaliação Técnica</span>
                  <span className="text-brand-300">Inclusa</span>
                </div>
                <div className="flex justify-between font-serif text-2xl text-brand-300 pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <button 
                className="w-full bg-brand-600 text-white py-5 font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-dark-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl group"
                onClick={handleCheckout}
              >
                Solicitar via WhatsApp
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              <p className="text-center text-[9px] text-slate-500 mt-4 uppercase tracking-widest">
                A avaliação final será feita pessoalmente por nossos mestres.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;