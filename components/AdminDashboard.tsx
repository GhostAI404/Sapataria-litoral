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
                          <td className="px-8 py-6 text-right font-serif font-bold text-dark-900 text-sm">{i.price}</td>
                          <td className="px-8 py-6 text-center">
                            <button 
                              onClick={() => handleDeleteInventory(i.id)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              title="Excluir Item"
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

      case 'notas':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Cabeçalho Premium Integrado */}
             <div className="bg-dark-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-serif font-bold italic">Gestão de Documentos Fiscais</h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-brand-400 font-black mt-2">Repositório legal centralizado e seguro</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                   <button 
                     onClick={() => setModalType('Nova Nota Fiscal')}
                     className="bg-brand-600 text-white px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-dark-900 transition-all flex items-center gap-2 shadow-lg"
                   >
                      <Plus className="w-4 h-4" /> NOVA NOTA FISCAL
                   </button>
                   <div className="flex gap-2 flex-1 md:w-auto">
                      <div className="relative flex-1 md:w-64">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                         <input 
                           type="text" 
                           placeholder="Pesquisar notas..." 
                           value={adminSearchTerm}
                           onChange={(e) => setAdminSearchTerm(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-brand-600 focus:bg-white/10 transition-all text-white placeholder:text-slate-500" 
                         />
                      </div>
                      <select 
                        value={notasStatusFilter}
                        onChange={(e) => setNotasStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 px-4 py-3.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-600 text-white"
                      >
                        <option value="Todos" className="text-dark-900">Status: Todos</option>
                        <option value="Emitida" className="text-dark-900">Emitida</option>
                        <option value="Cancelada" className="text-dark-900">Cancelada</option>
                        <option value="Pendente" className="text-dark-900">Pendente</option>
                      </select>
                   </div>
                </div>
             </div>

             {/* Tabela de Notas com Design Refinado */}
             <div className="bg-white border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                        <th className="px-8 py-6">Identificador Fiscal</th>
                        <th className="px-8 py-6">Referência OS</th>
                        <th className="px-8 py-6">Titularidade</th>
                        <th className="px-8 py-6">Data de Emissão</th>
                        <th className="px-8 py-6 text-center">Status Legal</th>
                        <th className="px-8 py-6 text-right">Valor Consolidado</th>
                        <th className="px-8 py-6 text-center">Gestão de Arquivos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredInvoices.map(nf => (
                        <tr key={nf.id} className="hover:bg-brand-50/30 transition-all duration-300 group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-50 text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-mono font-bold text-sm text-dark-900">{nf.id}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-[9px] font-black text-brand-600 uppercase border border-brand-100 px-2.5 py-1 bg-white">
                                {nf.orderId}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <p className="font-bold text-sm text-dark-900 group-hover:text-brand-600 transition-colors">{nf.customer}</p>
                          </td>
                          <td className="px-8 py-6 text-xs text-slate-400 font-medium">
                             {nf.date.split('-').reverse().join('/')}
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className={`inline-flex items-center gap-2 text-[8px] font-black uppercase px-3 py-1.5 rounded-full ${nf.status === 'Emitida' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${nf.status === 'Emitida' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {nf.status}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right font-serif font-bold text-dark-900 text-base">
                             R$ {nf.value.toFixed(2)}
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="flex justify-center gap-3">
                                <button 
                                  title="Visualizar XML/PDF" 
                                  onClick={() => {
                                    setViewingInvoice(nf);
                                    setIsEditingInvoice(false);
                                  }}
                                  className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-dark-900 hover:text-white transition-all"
                                >
                                   <FileText className="w-4 h-4" />
                                </button>
                                <label title="Vincular Foto ou Arquivo da NF" className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-brand-600 hover:text-white transition-all cursor-pointer relative">
                                   <FileUp className="w-4 h-4" />
                                   {nf.fileName && <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-600 rounded-full animate-pulse"></span>}
                                   <input type="file" className="hidden" onChange={() => alert('Documento vinculado com sucesso!')} />
                                </label>
                                <button 
                                  onClick={() => handleDeleteInvoice(nf.id)}
                                  className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                  title="Excluir Nota Fiscal"
                                >
                                  <Trash2 className="w-4 h-4" />
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

      case 'settings':
        return (
          <div className="bg-white border border-slate-100 p-12 shadow-2xl animate-in fade-in duration-700">
             <div className="border-b border-slate-100 pb-8 mb-10">
                <h2 className="text-3xl font-serif font-bold italic text-dark-900">Configurações da Plataforma</h2>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-black mt-2">Gestão de horários e conteúdo visual da Landing Page</p>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-600 border-b border-brand-50 pb-2">Horários de Funcionamento</h3>
                   <div className="space-y-6">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Segunda a Sexta</label>
                         <input type="text" value={businessHours.monFri} onChange={(e) => setBusinessHours({...businessHours, monFri: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-600" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Sábado</label>
                         <input type="text" value={businessHours.sat} onChange={(e) => setBusinessHours({...businessHours, sat: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-600" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Domingo</label>
                         <input type="text" value={businessHours.sun} onChange={(e) => setBusinessHours({...businessHours, sun: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-600" />
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-600 border-b border-brand-50 pb-2">Conteúdo da Landing Page</h3>
                   <div className="space-y-6">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Título Hero</label>
                         <input type="text" value={landingPage.heroTitle} onChange={(e) => setLandingPage({...landingPage, heroTitle: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-600" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Subtítulo Hero</label>
                         <input type="text" value={landingPage.heroSubtitle} onChange={(e) => setLandingPage({...landingPage, heroSubtitle: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-600" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">URL Imagem Hero</label>
                         <input type="text" value={landingPage.heroImage} onChange={(e) => setLandingPage({...landingPage, heroImage: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-600" />
                      </div>
                   </div>
                </div>
             </div>

             <button 
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="mt-12 bg-dark-900 text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-brand-600 transition-all disabled:opacity-50"
             >
                {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSavingSettings ? 'Salvando...' : 'Salvar Todas as Configurações'}
             </button>
          </div>
        );

      default:
        return <div className="p-20 text-center text-slate-300 uppercase tracking-widest font-black text-xs">Selecione uma categoria no menu lateral</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans relative">
      <aside className={`fixed lg:sticky top-0 h-screen w-80 bg-dark-900 text-white z-[60] transition-transform duration-500 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-10 border-b border-white/5 flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-600 flex items-center justify-center shadow-lg"><Hammer className="w-6 h-6 text-white" /></div>
             <div>
               <span className="text-3xl font-serif font-bold tracking-widest uppercase block leading-none">Litoral</span>
               <p className="text-[9px] text-brand-400 tracking-[0.4em] uppercase font-black mt-1 italic">Mestre Admin</p>
             </div>
          </div>
          <nav className="flex-1 p-6 space-y-2 mt-8 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveSection(item.id as AdminSection); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-5 px-6 py-5 transition-all text-[11px] font-black uppercase tracking-widest group relative ${activeSection === item.id ? 'bg-brand-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/10 hover:translate-x-1'}`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${activeSection === item.id ? 'text-brand-200' : 'text-slate-600 group-hover:text-brand-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-8 border-t border-white/5">
             <button onClick={onBack} className="w-full flex items-center justify-center gap-4 py-5 bg-white/5 text-slate-400 hover:bg-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
                Sair do Painel
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-12 max-w-[1600px] mx-auto w-full flex flex-col min-h-screen overflow-x-hidden">
        <header className="flex justify-between items-center mb-12">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white border border-slate-100 text-dark-900 shadow-sm"><Menu className="w-6 h-6" /></button>
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-dark-900 italic font-bold leading-none">{menuItems.find(m => m.id === activeSection)?.label}</h1>
                <p className="text-[11px] text-brand-600 uppercase tracking-widest font-black mt-3">Sincronização Ativa v2.5.0</p>
              </div>
           </div>
           <div className="flex items-center gap-6 relative">
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center text-slate-400 relative hover:text-brand-600 transition-colors">
                 <Bell className="w-6 h-6" />
                 {notifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 border-2 border-white"></span>}
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white shadow-2xl border border-slate-100 z-[80] top-full animate-in fade-in slide-in-from-top-4 duration-300">
                   <div className="p-4 bg-dark-900 text-white text-[9px] font-black uppercase tracking-widest">Central de Notificações</div>
                   <div className="max-h-60 overflow-y-auto no-scrollbar">
                      {notifications.map(n => (<div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 flex gap-3"><div className="w-2 h-2 rounded-full bg-brand-600 mt-1"></div><div className="flex-1"><p className="text-[10px] font-black text-dark-900 uppercase">{n.title}</p><p className="text-[11px] text-slate-500 leading-tight mt-1">{n.message}</p></div></div>))}
                   </div>
                </div>
              )}
           </div>
        </header>

        <div className="flex-1">{renderContent()}</div>

        {modalType && (
          <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="p-8 bg-dark-900 text-white flex justify-between items-center">
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-brand-400 mb-1">Módulo Sincronizado</h4>
                    <h2 className="font-serif text-2xl italic">{modalType}</h2>
                  </div>
                  <button onClick={() => setModalType(null)} className="p-2 hover:bg-white/10 transition-colors"><X className="w-6 h-6" /></button>
               </div>
               <div className="p-10">
                  <form onSubmit={handleNewRegistration} className="space-y-6">
                    {modalType === 'Novo Pedido Presencial' && (
                      <div className="space-y-4">
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Nome do Cliente</label><input name="name" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Serviço</label><input name="service" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Valor (R$)</label><input name="value" type="number" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Data de Entrega</label><input name="deadline" type="date" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                      </div>
                    )}

                    {modalType === 'Novo Registro' && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                         <div className="p-4 bg-brand-50 border-l-4 border-brand-600 mb-6">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-900 flex items-center gap-2">
                               <FileText className="w-3.5 h-3.5" /> Entrada de Serviço & Cliente
                            </h5>
                            <p className="text-[9px] text-brand-600 mt-1">Geração automática de ordem e vínculo de perfil.</p>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Nome Completo</label><input name="name" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                            <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">WhatsApp/Tel</label><input name="phone" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" placeholder="(13) 99999-9999" /></div>
                         </div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Serviço Solicitado</label><input name="service" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Valor Acordado (R$)</label><input name="value" type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                            <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Data de Entrega</label><input name="deadline" type="date" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         </div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Email (Opcional)</label><input name="email" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                      </div>
                    )}

                    {modalType === 'Nova Nota Fiscal' && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                         <div className="p-4 bg-brand-50 border-l-4 border-brand-600 mb-6">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-900 flex items-center gap-2">
                               <Receipt className="w-3.5 h-3.5" /> Cadastro de Nota Fiscal
                            </h5>
                            <p className="text-[9px] text-brand-600 mt-1">Vincule documentos fiscais às ordens de serviço.</p>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Identificador Fiscal (Nº)</label>
                               <input name="nf_id" required placeholder="Ex: NF-1234" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Referência OS</label>
                               <input name="os_ref" required placeholder="Ex: #ORD-9928" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                            </div>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Titularidade (Cliente)</label>
                            <input name="customer" required placeholder="Nome do Cliente" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Data de Emissão</label>
                               <input name="date" type="date" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Status Legal</label>
                               <select name="status" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600">
                                  <option value="Emitida">Emitida</option>
                                  <option value="Cancelada">Cancelada</option>
                                  <option value="Pendente">Pendente</option>
                               </select>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Valor Consolidado (R$)</label>
                            <input name="value" type="number" step="0.01" required placeholder="0.00" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Gestão de Arquivos (Anexo)</label>
                            <div className="flex items-center gap-3">
                               <label className="flex-1 flex items-center justify-center gap-3 bg-slate-50 border border-dashed border-slate-200 py-6 text-slate-400 hover:text-brand-600 hover:border-brand-600 transition-all cursor-pointer">
                                  <FileUp className="w-5 h-5" />
                                  <span className="text-[10px] font-black uppercase">Adicionar ou Colar Arquivo/Foto</span>
                                  <input type="file" name="file" className="hidden" />
                               </label>
                            </div>
                         </div>
                      </div>
                    )}

                    {modalType === 'Nova Transação' && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                         <div className="p-4 bg-brand-50 border-l-4 border-brand-600 mb-6">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-900 flex items-center gap-2">
                               <Banknote className="w-3.5 h-3.5" /> Registro Financeiro Manual
                            </h5>
                            <p className="text-[9px] text-brand-600 mt-1">Lançamento imediato no fluxo de caixa.</p>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Tipo de Movimentação</label>
                            <select name="type" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600">
                               <option value="Entrada">Entrada (Receita)</option>
                               <option value="Saída">Saída (Despesa)</option>
                            </select>
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Descrição da Operação</label>
                            <input name="desc" required placeholder="Ex: Venda Direta ou Manutenção Reparos" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Valor Líquido (R$)</label>
                               <input name="value" type="number" step="0.01" required placeholder="0.00" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600" />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Método</label>
                               <select name="method" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none focus:ring-1 focus:ring-brand-600">
                                  <option value="Pix">Pix</option>
                                  <option value="Cartão Crédito">Cartão Crédito</option>
                                  <option value="Cartão Débito">Cartão Débito</option>
                                  <option value="Dinheiro">Dinheiro</option>
                                  <option value="Transferência">Transferência</option>
                               </select>
                            </div>
                         </div>
                      </div>
                    )}
                    
                    {modalType === 'Novo Cadastro' && (
                      <div className="space-y-4">
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Nome Completo</label><input name="name" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">E-mail Corporativo</label><input name="email" type="email" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Telefone/WhatsApp</label><input name="phone" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" placeholder="(13) 99999-9999" /></div>
                      </div>
                    )}

                    {modalType === 'Novo Insumo' && (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Nome do Insumo/Produto</label><input name="name" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">SKU/Ref</label><input name="sku" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                           <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Preço Un. (R$)</label><input name="price" type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Estoque Inicial</label><input name="stock" type="number" required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                           <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Tipo</label>
                             <select name="type" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold outline-none">
                               <option value="Serviço">Serviço</option>
                               <option value="Boutique">Boutique</option>
                             </select>
                           </div>
                         </div>
                         <div className="space-y-1"><label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Categoria</label><input name="category" required placeholder="Ex: Acessório, Insumo" className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" /></div>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isModalLoading}
                      className="w-full bg-brand-600 text-white py-5 font-black uppercase tracking-widest text-[11px] hover:bg-dark-900 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isModalLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Confirmar Registro'
                      )}
                    </button>
                  </form>
               </div>
            </div>
          </div>
        )}

        {/* Modal de Visualização/Edição de Nota Fiscal */}
        {viewingInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setViewingInvoice(null)}
              className="absolute inset-0 bg-dark-900/90 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl overflow-hidden"
            >
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="font-serif text-2xl italic text-dark-900">
                      {isEditingInvoice ? 'Editar Nota Fiscal' : 'Detalhes da Nota Fiscal'}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mt-1">
                      {viewingInvoice.id} • Ref: {viewingInvoice.orderId}
                    </p>
                  </div>
                  <button 
                    onClick={() => setViewingInvoice(null)}
                    className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-dark-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
               </div>

               <div className="p-8">
                  {isEditingInvoice ? (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setIsModalLoading(true);
                      const formData = new FormData(e.currentTarget);
                      try {
                        const updatedNF = {
                          ...viewingInvoice,
                          id: formData.get('nf_id') as string,
                          orderId: formData.get('os_ref') as string,
                          customer: formData.get('customer') as string,
                          date: formData.get('date') as string,
                          value: parseFloat(formData.get('value') as string) || 0,
                          status: formData.get('status') as string,
                        };

                        const { error } = await supabase
                          .from('invoices')
                          .update(updatedNF)
                          .eq('id', viewingInvoice.id);

                        if (error) throw error;

                        setInvoices(prev => prev.map(nf => nf.id === viewingInvoice.id ? updatedNF : nf));
                        setViewingInvoice(null);
                        setIsEditingInvoice(false);
                        alert('Nota Fiscal atualizada com sucesso!');
                      } catch (err) {
                        console.error(err);
                        alert('Erro ao atualizar nota fiscal');
                      } finally {
                        setIsModalLoading(false);
                      }
                    }} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">ID Fiscal</label>
                          <input name="nf_id" defaultValue={viewingInvoice.id} required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Ref OS</label>
                          <input name="os_ref" defaultValue={viewingInvoice.orderId} required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Titularidade</label>
                        <input name="customer" defaultValue={viewingInvoice.customer} required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Data</label>
                          <input name="date" type="date" defaultValue={viewingInvoice.date} required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Status</label>
                          <select name="status" defaultValue={viewingInvoice.status} className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold">
                            <option value="Emitida">Emitida</option>
                            <option value="Cancelada">Cancelada</option>
                            <option value="Pendente">Pendente</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Valor (R$)</label>
                        <input name="value" type="number" step="0.01" defaultValue={viewingInvoice.value} required className="w-full bg-slate-50 border border-slate-100 p-4 text-xs font-bold" />
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <button 
                          type="button" 
                          onClick={() => setIsEditingInvoice(false)}
                          className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
                        >
                          Cancelar
                        </button>
                        <button 
                          type="submit" 
                          disabled={isModalLoading}
                          className="flex-1 bg-brand-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-dark-900 transition-all disabled:opacity-50"
                        >
                          {isModalLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                          <div>
                             <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Titularidade</p>
                             <p className="font-bold text-dark-900">{viewingInvoice.customer}</p>
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Data de Emissão</p>
                             <p className="font-bold text-dark-900">{viewingInvoice.date.split('-').reverse().join('/')}</p>
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Valor Consolidado</p>
                             <p className="font-serif font-bold text-brand-600 text-xl">R$ {viewingInvoice.value.toFixed(2)}</p>
                          </div>
                       </div>

                       <div className="p-6 bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-white text-brand-600 shadow-sm">
                                <FileText className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase text-dark-900">Arquivo Anexo</p>
                                <p className="text-xs text-slate-400">{viewingInvoice.fileName || 'Sem arquivo anexado'}</p>
                             </div>
                          </div>
                          {viewingInvoice.fileUrl && (
                            <a 
                              href={viewingInvoice.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-dark-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center gap-2"
                            >
                              <Download className="w-3.5 h-3.5" /> Abrir Documento
                            </a>
                          )}
                       </div>

                       <div className="flex gap-4 pt-4">
                          <button 
                            onClick={() => setIsEditingInvoice(true)}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                          >
                            <Settings className="w-3.5 h-3.5" /> Editar Dados
                          </button>
                          <button 
                            onClick={() => setViewingInvoice(null)}
                            className="flex-1 bg-dark-900 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 transition-all"
                          >
                            Fechar
                          </button>
                       </div>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;