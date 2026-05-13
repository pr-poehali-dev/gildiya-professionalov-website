import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const API = func2url.admin;

// ── ТИПЫ ──────────────────────────────────────────────────────────────────────
type Employee = { id: number; name: string; email: string; role: string; status: "active" | "inactive"; };
type Proposal = { id: number; client: string; service: string; amount: string; status: "draft"|"sent"|"accepted"|"rejected"; author: string; comment: string; items: string[]; created_at?: string; };
type Contract = { id: number; number: string; client: string; service: string; amount: string; signed_at: string; expires_at: string; };
type Service = { id: number; title: string; description: string; price: string; hours: string; category: string; is_active: boolean; sort_order: number; };
type Price = { id: number; name: string; price: string; period: string; features: string[]; is_highlighted: boolean; cta: string; is_active: boolean; };

const statusLabels: Record<string, { label: string; color: string }> = {
  draft:    { label: "Черновик",   color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  sent:     { label: "Отправлено", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  accepted: { label: "Принято",    color: "bg-green-500/15 text-green-600 border-green-500/30" },
  rejected: { label: "Отклонено",  color: "bg-red-500/15 text-red-500 border-red-500/30" },
  active:   { label: "Активен",    color: "bg-green-500/15 text-green-600 border-green-500/30" },
  inactive: { label: "Неактивен",  color: "bg-gray-500/15 text-gray-500 border-gray-500/30" },
};

const CATEGORIES = ["Аккредитация","Повышение квалификации","Переподготовка","НМО","Фармация","Корпоративное","Другое"];

function EmptyState({ icon, text, sub }: { icon: string; text: string; sub: string }) {
  return (
    <div className="bg-card border border-border p-14 text-center">
      <Icon name={icon} size={36} className="text-muted-foreground/25 mx-auto mb-3" />
      <p className="text-muted-foreground font-golos text-sm">{text}</p>
      <p className="text-muted-foreground/45 font-golos text-xs mt-1">{sub}</p>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-cormorant text-xl text-foreground font-light">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard"|"employees"|"proposals"|"catalog"|"prices"|"contracts">("dashboard");
  const inputCls = "w-full border border-border bg-background px-3 py-2 text-sm font-golos focus:outline-none focus:border-gold transition-colors";
  const textareaCls = `${inputCls} resize-none`;

  // ── DATA ──────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [services, setServices]   = useState<Service[]>([]);
  const [prices, setPrices]       = useState<Price[]>([]);
  const [loading, setLoading]     = useState(false);

  // ── EMPLOYEES FORM ────────────────────────────────────────────
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [newEmp, setNewEmp] = useState({ name:"", email:"", role:"Менеджер" });

  // ── PROPOSALS FORM ────────────────────────────────────────────
  const [showPropForm, setShowPropForm] = useState(false);
  const [propFilter, setPropFilter] = useState("all");
  const [newProp, setNewProp] = useState({ client:"", author:"", comment:"" });
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  // ── SERVICE FORM ──────────────────────────────────────────────
  const [showSvcForm, setShowSvcForm] = useState(false);
  const [editSvc, setEditSvc] = useState<Service | null>(null);
  const [svcDraft, setSvcDraft] = useState({ title:"", description:"", price:"", hours:"", category:"Повышение квалификации" });

  // ── PRICE FORM ────────────────────────────────────────────────
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editPrice, setEditPrice] = useState<Price | null>(null);
  const [priceDraft, setPriceDraft] = useState({ name:"", price:"", period:"", features:"", is_highlighted:false, cta:"Записаться" });

  // ── CONTRACT FORM ─────────────────────────────────────────────
  const [showConForm, setShowConForm] = useState(false);
  const [newCon, setNewCon] = useState({ number:"", client:"", service:"", amount:"", signed_at:"", expires_at:"" });

  // ── LOAD ──────────────────────────────────────────────────────
  async function load(resource: string, setter: (d: unknown[]) => void) {
    setLoading(true);
    const r = await fetch(`${API}?resource=${resource}`);
    setter(await r.json());
    setLoading(false);
  }

  useEffect(() => {
    if (tab === "dashboard")  { load("employees", setEmployees as (d:unknown[])=>void); load("proposals", setProposals as (d:unknown[])=>void); load("contracts", setContracts as (d:unknown[])=>void); }
    if (tab === "employees")   load("employees", setEmployees as (d:unknown[])=>void);
    if (tab === "proposals")  { load("proposals", setProposals as (d:unknown[])=>void); load("services", setServices as (d:unknown[])=>void); }
    if (tab === "catalog")     load("services", setServices as (d:unknown[])=>void);
    if (tab === "prices")      load("prices", setPrices as (d:unknown[])=>void);
    if (tab === "contracts")   load("contracts", setContracts as (d:unknown[])=>void);
  }, [tab]);

  // ── EMPLOYEES ─────────────────────────────────────────────────
  async function addEmployee() {
    if (!newEmp.name.trim() || !newEmp.email.trim()) return;
    const r = await fetch(`${API}?resource=employees`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(newEmp) });
    setEmployees(p => [...p, await r.json()]);
    setNewEmp({ name:"", email:"", role:"Менеджер" }); setShowEmpForm(false);
  }
  async function toggleEmployee(emp: Employee) {
    const s = emp.status === "active" ? "inactive" : "active";
    await fetch(`${API}?resource=employees&id=${emp.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ status:s }) });
    setEmployees(p => p.map(e => e.id===emp.id ? {...e, status:s} : e));
  }
  async function delEmployee(id: number) {
    if (!confirm("Удалить сотрудника?")) return;
    await fetch(`${API}?resource=employees&id=${id}`, { method:"DELETE" });
    setEmployees(p => p.filter(e => e.id!==id));
  }

  // ── PROPOSALS ─────────────────────────────────────────────────
  async function addProposal() {
    if (!newProp.client.trim() || !newProp.author.trim() || selectedServices.length===0) return;
    const amount  = selectedServices.map(s=>s.price).join(", ");
    const service = selectedServices.map(s=>s.title).join("; ");
    const items   = selectedServices.map(s=>s.title);
    const r = await fetch(`${API}?resource=proposals`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...newProp, amount, service, items}) });
    setProposals(p => [await r.json(), ...p]);
    setNewProp({ client:"", author:"", comment:"" }); setSelectedServices([]); setShowPropForm(false);
  }
  async function changePropStatus(id: number, status: string) {
    await fetch(`${API}?resource=proposals&id=${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ status }) });
    setProposals(p => p.map(x => x.id===id ? {...x, status:status as Proposal["status"]} : x));
  }
  async function delProposal(id: number) {
    if (!confirm("Удалить КП?")) return;
    await fetch(`${API}?resource=proposals&id=${id}`, { method:"DELETE" });
    setProposals(p => p.filter(x => x.id!==id));
  }

  // ── SERVICES ──────────────────────────────────────────────────
  function openAddSvc() { setSvcDraft({ title:"", description:"", price:"", hours:"", category:"Повышение квалификации" }); setEditSvc(null); setShowSvcForm(true); }
  function openEditSvc(s: Service) { setSvcDraft({ title:s.title, description:s.description, price:s.price, hours:s.hours, category:s.category }); setEditSvc(s); setShowSvcForm(true); }
  async function saveSvc() {
    if (!svcDraft.title.trim()) return;
    if (editSvc) {
      const r = await fetch(`${API}?resource=services&id=${editSvc.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(svcDraft) });
      const updated = await r.json();
      setServices(p => p.map(s => s.id===editSvc.id ? updated : s));
    } else {
      const r = await fetch(`${API}?resource=services`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(svcDraft) });
      setServices(p => [...p, await r.json()]);
    }
    setShowSvcForm(false);
  }
  async function toggleSvc(s: Service) {
    await fetch(`${API}?resource=services&id=${s.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ is_active:!s.is_active }) });
    setServices(p => p.map(x => x.id===s.id ? {...x, is_active:!x.is_active} : x));
  }
  async function delSvc(id: number) {
    if (!confirm("Удалить услугу?")) return;
    await fetch(`${API}?resource=services&id=${id}`, { method:"DELETE" });
    setServices(p => p.filter(s => s.id!==id));
  }

  // ── PRICES ────────────────────────────────────────────────────
  function openAddPrice() { setPriceDraft({ name:"", price:"", period:"", features:"", is_highlighted:false, cta:"Записаться" }); setEditPrice(null); setShowPriceForm(true); }
  function openEditPrice(p: Price) { setPriceDraft({ name:p.name, price:p.price, period:p.period, features:p.features.join("\n"), is_highlighted:p.is_highlighted, cta:p.cta }); setEditPrice(p); setShowPriceForm(true); }
  async function savePrice() {
    if (!priceDraft.name.trim() || !priceDraft.price.trim()) return;
    const payload = { ...priceDraft, features: priceDraft.features.split("\n").filter(f=>f.trim()) };
    if (editPrice) {
      const r = await fetch(`${API}?resource=prices&id=${editPrice.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const updated = await r.json();
      setPrices(p => p.map(x => x.id===editPrice.id ? updated : x));
    } else {
      const r = await fetch(`${API}?resource=prices`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      setPrices(p => [...p, await r.json()]);
    }
    setShowPriceForm(false);
  }
  async function delPrice(id: number) {
    if (!confirm("Удалить тариф?")) return;
    await fetch(`${API}?resource=prices&id=${id}`, { method:"DELETE" });
    setPrices(p => p.filter(x => x.id!==id));
  }

  // ── CONTRACTS ─────────────────────────────────────────────────
  async function addContract() {
    if (!newCon.number||!newCon.client||!newCon.service||!newCon.amount||!newCon.signed_at||!newCon.expires_at) return;
    const r = await fetch(`${API}?resource=contracts`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(newCon) });
    setContracts(p => [await r.json(), ...p]);
    setNewCon({ number:"", client:"", service:"", amount:"", signed_at:"", expires_at:"" }); setShowConForm(false);
  }
  async function delContract(id: number) {
    if (!confirm("Удалить договор?")) return;
    await fetch(`${API}?resource=contracts&id=${id}`, { method:"DELETE" });
    setContracts(p => p.filter(c => c.id!==id));
  }

  const filteredProposals = propFilter==="all" ? proposals : proposals.filter(p=>p.status===propFilter);

  const tabs = [
    { id:"dashboard", label:"Дашборд",    icon:"LayoutDashboard" },
    { id:"employees", label:"Сотрудники", icon:"Users" },
    { id:"proposals", label:"КП",         icon:"FileText" },
    { id:"catalog",   label:"Каталог",    icon:"BookOpen" },
    { id:"prices",    label:"Цены",       icon:"Tag" },
    { id:"contracts", label:"Договоры",   icon:"ScrollText" },
  ];

  return (
    <div className="min-h-screen bg-background font-golos flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-60 bg-dark min-h-screen flex flex-col border-r border-white/10 fixed left-0 top-0 bottom-0">
        <div className="p-5 border-b border-white/10">
          <div className="font-cormorant text-white text-base font-semibold leading-tight">Гильдия Профессионалов</div>
          <div className="text-gold text-[10px] font-golos mt-0.5 tracking-widest uppercase">Панель управления</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-golos transition-all text-left rounded-sm ${tab===t.id ? 'bg-gold text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <Icon name={t.icon} size={15} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-golos transition-colors">
            <Icon name="ArrowLeft" size={14} />На сайт
          </a>
        </div>
      </aside>

      <main className="flex-1 ml-60 p-8">

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div>
            <div className="mb-8">
              <h1 className="font-cormorant text-3xl text-foreground font-light">Добро пожаловать</h1>
              <p className="text-muted-foreground text-sm font-golos mt-1">Обзор деятельности</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label:"Сотрудников",  value:employees.length,                               icon:"Users",       color:"text-blue-500" },
                { label:"Активных КП",  value:proposals.filter(p=>p.status==="sent").length,  icon:"FileText",    color:"text-gold" },
                { label:"Принято КП",   value:proposals.filter(p=>p.status==="accepted").length, icon:"CheckCircle", color:"text-green-500" },
                { label:"Договоров",    value:contracts.length,                               icon:"ScrollText",  color:"text-purple-500" },
              ].map((s,i) => (
                <div key={i} className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-xs font-golos">{s.label}</span>
                    <Icon name={s.icon} size={16} className={s.color} />
                  </div>
                  <div className="font-cormorant text-4xl font-semibold text-foreground">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Последние КП</h3>
                {proposals.length===0 ? <p className="text-muted-foreground text-sm font-golos">Нет КП</p> :
                  proposals.slice(0,4).map(p => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <div className="text-sm font-golos text-foreground">{p.client}</div>
                        <div className="text-xs text-muted-foreground">{p.author} · {p.amount}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 border font-golos ${statusLabels[p.status].color}`}>{statusLabels[p.status].label}</span>
                    </div>
                  ))
                }
              </div>
              <div className="bg-card border border-border p-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Сотрудники</h3>
                {employees.length===0 ? <p className="text-muted-foreground text-sm font-golos">Нет сотрудников</p> :
                  employees.filter(e=>e.status==="active").slice(0,4).map(e => (
                    <div key={e.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-cormorant font-semibold flex-shrink-0">
                        {e.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-golos text-foreground truncate">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{e.role}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* ── СОТРУДНИКИ ── */}
        {tab==="employees" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="font-cormorant text-3xl text-foreground font-light">Сотрудники</h1><p className="text-muted-foreground text-sm font-golos mt-1">Управление кабинетами</p></div>
              <button onClick={()=>setShowEmpForm(true)} className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16}/>Добавить
              </button>
            </div>
            {showEmpForm && (
              <div className="bg-card border border-gold/30 p-6 mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Новый сотрудник</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Имя *</label><input value={newEmp.name} onChange={e=>setNewEmp(p=>({...p,name:e.target.value}))} placeholder="Иван Иванов" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">E-mail *</label><input value={newEmp.email} onChange={e=>setNewEmp(p=>({...p,email:e.target.value}))} placeholder="ivan@gildiya.ru" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Должность</label>
                    <select value={newEmp.role} onChange={e=>setNewEmp(p=>({...p,role:e.target.value}))} className={inputCls}>
                      <option>Менеджер</option><option>Старший менеджер</option><option>Руководитель отдела</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addEmployee} className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors">Создать кабинет</button>
                  <button onClick={()=>setShowEmpForm(false)} className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos">Отмена</button>
                </div>
              </div>
            )}
            {loading ? <div className="text-center py-12 text-muted-foreground text-sm">Загрузка...</div>
              : employees.length===0 ? <EmptyState icon="Users" text="Сотрудников пока нет" sub="Нажмите «Добавить»"/>
              : <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-muted/40">
                    {["Сотрудник","E-mail","Должность","Статус",""].map((h,i)=><th key={i} className="text-left px-5 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">{h}</th>)}
                  </tr></thead>
                  <tbody>{employees.map((emp,i)=>(
                    <tr key={emp.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i%2!==0?'bg-muted/10':''}`}>
                      <td className="px-5 py-4"><div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-cormorant font-semibold flex-shrink-0">{emp.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                        <span className="text-sm font-golos text-foreground">{emp.name}</span>
                      </div></td>
                      <td className="px-5 py-4 text-sm text-muted-foreground font-golos">{emp.email}</td>
                      <td className="px-5 py-4 text-sm text-foreground/70 font-golos">{emp.role}</td>
                      <td className="px-5 py-4"><button onClick={()=>toggleEmployee(emp)} className={`text-xs px-2 py-0.5 border font-golos ${statusLabels[emp.status].color}`}>{statusLabels[emp.status].label}</button></td>
                      <td className="px-5 py-4"><button onClick={()=>delEmployee(emp.id)} className="text-muted-foreground hover:text-red-500 transition-colors"><Icon name="Trash2" size={14}/></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            }
          </div>
        )}

        {/* ── КП ── */}
        {tab==="proposals" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="font-cormorant text-3xl text-foreground font-light">Коммерческие предложения</h1><p className="text-muted-foreground text-sm font-golos mt-1">Все КП</p></div>
              <button onClick={()=>setShowPropForm(true)} className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16}/>Создать КП
              </button>
            </div>

            {showPropForm && (
              <div className="bg-card border border-gold/30 p-6 mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-5">Новое коммерческое предложение</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Клиент *</label><input value={newProp.client} onChange={e=>setNewProp(p=>({...p,client:e.target.value}))} placeholder="ООО «Название»" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Менеджер *</label><input value={newProp.author} onChange={e=>setNewProp(p=>({...p,author:e.target.value}))} placeholder="Иван Иванов" className={inputCls}/></div>
                </div>
                <div className="mb-5">
                  <label className="text-muted-foreground text-xs font-golos block mb-2">
                    Услуги * <span className="text-gold">(выберите одну или несколько)</span>
                  </label>
                  <div className="grid md:grid-cols-2 gap-2 mb-3">
                    {services.filter(s=>s.is_active).map(s => {
                      const sel = selectedServices.some(x=>x.id===s.id);
                      return (
                        <button key={s.id} type="button"
                          onClick={()=>setSelectedServices(p=>sel ? p.filter(x=>x.id!==s.id) : [...p, s])}
                          className={`text-left p-3 border text-sm font-golos transition-all ${sel ? 'border-gold bg-gold/8 text-foreground' : 'border-border text-foreground/60 hover:border-gold/50'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-medium text-sm">{s.title}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{s.hours && `${s.hours} · `}{s.price}</div>
                            </div>
                            {sel && <Icon name="CheckCircle" size={16} className="text-gold flex-shrink-0 mt-0.5"/>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="bg-gold/8 border border-gold/20 p-3 text-xs font-golos text-foreground/70 rounded-sm">
                      <span className="text-gold font-medium">Выбрано:</span> {selectedServices.map(s=>s.title).join(", ")}
                    </div>
                  )}
                </div>
                <div className="mb-4"><label className="text-muted-foreground text-xs font-golos block mb-1">Комментарий</label><input value={newProp.comment} onChange={e=>setNewProp(p=>({...p,comment:e.target.value}))} placeholder="Дополнительные условия..." className={inputCls}/></div>
                <div className="flex gap-3">
                  <button onClick={addProposal} disabled={!newProp.client||!newProp.author||selectedServices.length===0}
                    className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors disabled:opacity-40">
                    Создать КП
                  </button>
                  <button onClick={()=>{setShowPropForm(false);setSelectedServices([]);}} className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos">Отмена</button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-5 flex-wrap">
              {[["all","Все"],["draft","Черновики"],["sent","Отправленные"],["accepted","Принятые"],["rejected","Отклонённые"]].map(([v,l])=>(
                <button key={v} onClick={()=>setPropFilter(v)} className={`px-4 py-1.5 text-xs font-golos border transition-colors ${propFilter===v?'bg-gold text-white border-gold':'border-border text-foreground/60 hover:border-gold hover:text-gold'}`}>{l}</button>
              ))}
            </div>

            {loading ? <div className="text-center py-12 text-muted-foreground text-sm">Загрузка...</div>
              : filteredProposals.length===0 ? <EmptyState icon="FileText" text="КП пока нет" sub="Нажмите «Создать КП»"/>
              : <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-muted/40">
                    {["Клиент","Услуги","Сумма","Менеджер","Статус",""].map((h,i)=><th key={i} className="text-left px-5 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">{h}</th>)}
                  </tr></thead>
                  <tbody>{filteredProposals.map((p,i)=>(
                    <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i%2!==0?'bg-muted/10':''}`}>
                      <td className="px-5 py-4 text-sm font-golos text-foreground font-medium">{p.client}</td>
                      <td className="px-5 py-4 max-w-[200px]">
                        {(p.items && p.items.length>0)
                          ? <div className="flex flex-wrap gap-1">{p.items.map((item,j)=><span key={j} className="text-[10px] bg-muted px-1.5 py-0.5 border border-border font-golos">{item}</span>)}</div>
                          : <span className="text-sm text-muted-foreground font-golos">{p.service}</span>
                        }
                      </td>
                      <td className="px-5 py-4 text-sm font-golos text-gold font-semibold whitespace-nowrap">{p.amount}</td>
                      <td className="px-5 py-4 text-sm text-foreground/70 font-golos">{p.author}</td>
                      <td className="px-5 py-4">
                        <select value={p.status} onChange={e=>changePropStatus(p.id,e.target.value)} className={`text-xs px-2 py-0.5 border font-golos bg-transparent cursor-pointer ${statusLabels[p.status].color}`}>
                          <option value="draft">Черновик</option><option value="sent">Отправлено</option><option value="accepted">Принято</option><option value="rejected">Отклонено</option>
                        </select>
                      </td>
                      <td className="px-5 py-4"><button onClick={()=>delProposal(p.id)} className="text-muted-foreground hover:text-red-500 transition-colors"><Icon name="Trash2" size={14}/></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            }
          </div>
        )}

        {/* ── КАТАЛОГ ── */}
        {tab==="catalog" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="font-cormorant text-3xl text-foreground font-light">Каталог услуг</h1><p className="text-muted-foreground text-sm font-golos mt-1">Управление услугами сайта и КП</p></div>
              <button onClick={openAddSvc} className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16}/>Добавить услугу
              </button>
            </div>
            {loading ? <div className="text-center py-12 text-muted-foreground text-sm">Загрузка...</div>
              : services.length===0 ? <EmptyState icon="BookOpen" text="Услуг пока нет" sub="Нажмите «Добавить услугу»"/>
              : <div className="grid md:grid-cols-2 gap-4">
                {services.map(s=>(
                  <div key={s.id} className={`bg-card border p-5 transition-colors ${s.is_active?'border-border':'border-border/40 opacity-55'}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 font-golos">{s.category}</span>
                          {!s.is_active && <span className="text-[10px] text-muted-foreground font-golos border border-border px-1.5 py-0.5">скрыто</span>}
                        </div>
                        <h3 className="font-golos font-medium text-foreground text-sm">{s.title}</h3>
                        {s.description && <p className="text-xs text-muted-foreground mt-1 font-golos line-clamp-2">{s.description}</p>}
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        <button onClick={()=>openEditSvc(s)} className="text-muted-foreground hover:text-gold transition-colors p-1.5" title="Редактировать"><Icon name="Pencil" size={14}/></button>
                        <button onClick={()=>toggleSvc(s)} className="text-muted-foreground hover:text-gold transition-colors p-1.5" title={s.is_active?"Скрыть":"Показать"}><Icon name={s.is_active?"EyeOff":"Eye"} size={14}/></button>
                        <button onClick={()=>delSvc(s.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1.5" title="Удалить"><Icon name="Trash2" size={14}/></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <span className="text-gold font-golos font-semibold text-sm">{s.price}</span>
                      {s.hours && <span className="text-xs text-muted-foreground font-golos">{s.hours}</span>}
                    </div>
                  </div>
                ))}
              </div>
            }
            {showSvcForm && (
              <Modal title={editSvc?"Редактировать услугу":"Новая услуга"} onClose={()=>setShowSvcForm(false)}>
                <div className="space-y-4">
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Название *</label><input value={svcDraft.title} onChange={e=>setSvcDraft(p=>({...p,title:e.target.value}))} placeholder="Повышение квалификации" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Описание</label><textarea rows={3} value={svcDraft.description} onChange={e=>setSvcDraft(p=>({...p,description:e.target.value}))} placeholder="Краткое описание..." className={textareaCls}/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-muted-foreground text-xs font-golos block mb-1">Цена</label><input value={svcDraft.price} onChange={e=>setSvcDraft(p=>({...p,price:e.target.value}))} placeholder="от 3 500 ₽" className={inputCls}/></div>
                    <div><label className="text-muted-foreground text-xs font-golos block mb-1">Объём (часы)</label><input value={svcDraft.hours} onChange={e=>setSvcDraft(p=>({...p,hours:e.target.value}))} placeholder="36–72 ч." className={inputCls}/></div>
                  </div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Категория</label>
                    <select value={svcDraft.category} onChange={e=>setSvcDraft(p=>({...p,category:e.target.value}))} className={inputCls}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveSvc} className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors">Сохранить</button>
                    <button onClick={()=>setShowSvcForm(false)} className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos">Отмена</button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        )}

        {/* ── ЦЕНЫ ── */}
        {tab==="prices" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="font-cormorant text-3xl text-foreground font-light">Тарифы и цены</h1><p className="text-muted-foreground text-sm font-golos mt-1">Управление тарифными планами на сайте</p></div>
              <button onClick={openAddPrice} className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16}/>Добавить тариф
              </button>
            </div>
            {loading ? <div className="text-center py-12 text-muted-foreground text-sm">Загрузка...</div>
              : prices.length===0 ? <EmptyState icon="Tag" text="Тарифов пока нет" sub="Нажмите «Добавить тариф»"/>
              : <div className="grid md:grid-cols-3 gap-5">
                {prices.map(p=>(
                  <div key={p.id} className={`bg-card border-2 p-6 relative ${p.is_highlighted?'border-gold':'border-border'} ${!p.is_active?'opacity-55':''}`}>
                    {p.is_highlighted && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] px-3 py-0.5 font-golos uppercase tracking-wider">Популярно</span>}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-golos uppercase tracking-wider mb-1">{p.name}</div>
                        <div className="font-cormorant text-3xl font-semibold text-foreground">{p.price}</div>
                        <div className="text-xs text-muted-foreground font-golos">{p.period}</div>
                      </div>
                      <div className="flex gap-0.5">
                        <button onClick={()=>openEditPrice(p)} className="text-muted-foreground hover:text-gold transition-colors p-1.5"><Icon name="Pencil" size={14}/></button>
                        <button onClick={()=>delPrice(p.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1.5"><Icon name="Trash2" size={14}/></button>
                      </div>
                    </div>
                    <div className="space-y-1.5 my-4 border-t border-border pt-3">
                      {p.features.map((f,j)=>(
                        <div key={j} className="flex items-start gap-2">
                          <Icon name="Check" size={12} className="text-gold flex-shrink-0 mt-0.5"/>
                          <span className="text-xs font-golos text-foreground/65">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-border text-xs font-golos text-muted-foreground">Кнопка: «{p.cta}»</div>
                  </div>
                ))}
              </div>
            }
            {showPriceForm && (
              <Modal title={editPrice?"Редактировать тариф":"Новый тариф"} onClose={()=>setShowPriceForm(false)}>
                <div className="space-y-4">
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Название тарифа *</label><input value={priceDraft.name} onChange={e=>setPriceDraft(p=>({...p,name:e.target.value}))} placeholder="Повышение квалификации" className={inputCls}/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-muted-foreground text-xs font-golos block mb-1">Цена *</label><input value={priceDraft.price} onChange={e=>setPriceDraft(p=>({...p,price:e.target.value}))} placeholder="от 3 500 ₽" className={inputCls}/></div>
                    <div><label className="text-muted-foreground text-xs font-golos block mb-1">Подпись к цене</label><input value={priceDraft.period} onChange={e=>setPriceDraft(p=>({...p,period:e.target.value}))} placeholder="36 или 72 часа" className={inputCls}/></div>
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Условия (каждое с новой строки)</label>
                    <textarea rows={5} value={priceDraft.features} onChange={e=>setPriceDraft(p=>({...p,features:e.target.value}))} placeholder={"Удостоверение о ПК\nДистанционный формат\nВносится в ФИС ФРДО"} className={textareaCls}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-end">
                    <div><label className="text-muted-foreground text-xs font-golos block mb-1">Текст кнопки</label><input value={priceDraft.cta} onChange={e=>setPriceDraft(p=>({...p,cta:e.target.value}))} placeholder="Записаться" className={inputCls}/></div>
                    <div className="flex items-center gap-3 pb-0.5">
                      <input type="checkbox" id="hl" checked={priceDraft.is_highlighted} onChange={e=>setPriceDraft(p=>({...p,is_highlighted:e.target.checked}))} className="w-4 h-4"/>
                      <label htmlFor="hl" className="text-sm font-golos text-foreground/70 cursor-pointer">Пометить «Популярное»</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={savePrice} className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors">Сохранить</button>
                    <button onClick={()=>setShowPriceForm(false)} className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos">Отмена</button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        )}

        {/* ── ДОГОВОРЫ ── */}
        {tab==="contracts" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div><h1 className="font-cormorant text-3xl text-foreground font-light">Договоры</h1><p className="text-muted-foreground text-sm font-golos mt-1">Договоры с клиентами</p></div>
              <button onClick={()=>setShowConForm(true)} className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16}/>Создать договор
              </button>
            </div>
            {showConForm && (
              <div className="bg-card border border-gold/30 p-6 mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Новый договор</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Номер *</label><input value={newCon.number} onChange={e=>setNewCon(p=>({...p,number:e.target.value}))} placeholder="Д-2024/001" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Клиент *</label><input value={newCon.client} onChange={e=>setNewCon(p=>({...p,client:e.target.value}))} placeholder="ООО «Название»" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Услуга *</label><input value={newCon.service} onChange={e=>setNewCon(p=>({...p,service:e.target.value}))} placeholder="Повышение квалификации" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Сумма *</label><input value={newCon.amount} onChange={e=>setNewCon(p=>({...p,amount:e.target.value}))} placeholder="100 000 ₽" className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Дата подписания *</label><input type="date" value={newCon.signed_at} onChange={e=>setNewCon(p=>({...p,signed_at:e.target.value}))} className={inputCls}/></div>
                  <div><label className="text-muted-foreground text-xs font-golos block mb-1">Действует до *</label><input type="date" value={newCon.expires_at} onChange={e=>setNewCon(p=>({...p,expires_at:e.target.value}))} className={inputCls}/></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={addContract} className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors">Создать договор</button>
                  <button onClick={()=>setShowConForm(false)} className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos">Отмена</button>
                </div>
              </div>
            )}
            {loading ? <div className="text-center py-12 text-muted-foreground text-sm">Загрузка...</div>
              : contracts.length===0 ? <EmptyState icon="ScrollText" text="Договоров пока нет" sub="Нажмите «Создать договор»"/>
              : <div className="grid gap-4">
                {contracts.map(c=>(
                  <div key={c.id} className="bg-card border border-border p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-gold/30 transition-colors">
                    <div className="w-11 h-11 bg-gold/10 flex items-center justify-center flex-shrink-0"><Icon name="ScrollText" size={18} className="text-gold"/></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-golos text-gold font-semibold">{c.number}</span>
                        <span className="text-xs text-muted-foreground font-golos">{c.signed_at}</span>
                      </div>
                      <div className="font-golos text-sm font-medium text-foreground">{c.client}</div>
                      <div className="text-xs text-muted-foreground font-golos mt-0.5">{c.service}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-cormorant text-2xl text-gold font-semibold">{c.amount}</div>
                      <div className="text-xs text-muted-foreground font-golos">до {c.expires_at}</div>
                    </div>
                    <button onClick={()=>delContract(c.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-2 ml-2"><Icon name="Trash2" size={16}/></button>
                  </div>
                ))}
              </div>
            }
          </div>
        )}

      </main>
    </div>
  );
}
