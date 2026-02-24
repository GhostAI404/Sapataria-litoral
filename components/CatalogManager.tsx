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