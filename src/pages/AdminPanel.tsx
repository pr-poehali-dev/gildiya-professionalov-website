import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const API = func2url.admin;

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  created_at?: string;
};

type Proposal = {
  id: number;
  client: string;
  service: string;
  amount: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  author: string;
  comment: string;
  created_at?: string;
};

type Contract = {
  id: number;
  number: string;
  client: string;
  service: string;
  amount: string;
  signed_at: string;
  expires_at: string;
};

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "Черновик", color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  sent: { label: "Отправлено", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  accepted: { label: "Принято", color: "bg-green-500/15 text-green-600 border-green-500/30" },
  rejected: { label: "Отклонено", color: "bg-red-500/15 text-red-500 border-red-500/30" },
  active: { label: "Активен", color: "bg-green-500/15 text-green-600 border-green-500/30" },
  inactive: { label: "Неактивен", color: "bg-gray-500/15 text-gray-500 border-gray-500/30" },
};

function EmptyState({ icon, text, sub }: { icon: string; text: string; sub: string }) {
  return (
    <div className="bg-card border border-border p-14 text-center">
      <Icon name={icon} size={36} className="text-muted-foreground/25 mx-auto mb-3" />
      <p className="text-muted-foreground font-golos text-sm">{text}</p>
      <p className="text-muted-foreground/45 font-golos text-xs mt-1">{sub}</p>
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard" | "employees" | "proposals" | "contracts">("dashboard");

  // Employees
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [showNewEmployee, setShowNewEmployee] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: "", email: "", role: "Менеджер" });
  const [empSaving, setEmpSaving] = useState(false);

  // Proposals
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [propLoading, setPropLoading] = useState(false);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [newProp, setNewProp] = useState({ client: "", service: "", amount: "", author: "", comment: "" });
  const [propSaving, setPropSaving] = useState(false);
  const [propFilter, setPropFilter] = useState("all");

  // Contracts
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [conLoading, setConLoading] = useState(false);
  const [showNewContract, setShowNewContract] = useState(false);
  const [newCon, setNewCon] = useState({ number: "", client: "", service: "", amount: "", signed_at: "", expires_at: "" });
  const [conSaving, setConSaving] = useState(false);

  // Load data on tab change
  useEffect(() => {
    if (tab === "employees" || tab === "dashboard") loadEmployees();
    if (tab === "proposals" || tab === "dashboard") loadProposals();
    if (tab === "contracts") loadContracts();
  }, [tab]);

  async function loadEmployees() {
    setEmpLoading(true);
    const r = await fetch(`${API}?resource=employees`);
    setEmployees(await r.json());
    setEmpLoading(false);
  }

  async function loadProposals() {
    setPropLoading(true);
    const r = await fetch(`${API}?resource=proposals`);
    setProposals(await r.json());
    setPropLoading(false);
  }

  async function loadContracts() {
    setConLoading(true);
    const r = await fetch(`${API}?resource=contracts`);
    setContracts(await r.json());
    setConLoading(false);
  }

  async function handleAddEmployee() {
    if (!newEmp.name.trim() || !newEmp.email.trim()) return;
    setEmpSaving(true);
    const r = await fetch(`${API}?resource=employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmp),
    });
    const created = await r.json();
    setEmployees(prev => [...prev, created]);
    setNewEmp({ name: "", email: "", role: "Менеджер" });
    setShowNewEmployee(false);
    setEmpSaving(false);
  }

  async function handleToggleEmployeeStatus(emp: Employee) {
    const newStatus = emp.status === "active" ? "inactive" : "active";
    await fetch(`${API}?resource=employees&id=${emp.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: newStatus } : e));
  }

  async function handleDeleteEmployee(id: number) {
    if (!confirm("Удалить сотрудника?")) return;
    await fetch(`${API}?resource=employees&id=${id}`, { method: "DELETE" });
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  async function handleAddProposal() {
    if (!newProp.client.trim() || !newProp.service.trim() || !newProp.amount.trim() || !newProp.author.trim()) return;
    setPropSaving(true);
    const r = await fetch(`${API}?resource=proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProp),
    });
    const created = await r.json();
    setProposals(prev => [created, ...prev]);
    setNewProp({ client: "", service: "", amount: "", author: "", comment: "" });
    setShowNewProposal(false);
    setPropSaving(false);
  }

  async function handleChangeProposalStatus(id: number, status: string) {
    await fetch(`${API}?resource=proposals&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: status as Proposal["status"] } : p));
  }

  async function handleDeleteProposal(id: number) {
    if (!confirm("Удалить КП?")) return;
    await fetch(`${API}?resource=proposals&id=${id}`, { method: "DELETE" });
    setProposals(prev => prev.filter(p => p.id !== id));
  }

  async function handleAddContract() {
    if (!newCon.number || !newCon.client || !newCon.service || !newCon.amount || !newCon.signed_at || !newCon.expires_at) return;
    setConSaving(true);
    const r = await fetch(`${API}?resource=contracts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCon),
    });
    const created = await r.json();
    setContracts(prev => [created, ...prev]);
    setNewCon({ number: "", client: "", service: "", amount: "", signed_at: "", expires_at: "" });
    setShowNewContract(false);
    setConSaving(false);
  }

  async function handleDeleteContract(id: number) {
    if (!confirm("Удалить договор?")) return;
    await fetch(`${API}?resource=contracts&id=${id}`, { method: "DELETE" });
    setContracts(prev => prev.filter(c => c.id !== id));
  }

  const filteredProposals = propFilter === "all" ? proposals : proposals.filter(p => p.status === propFilter);

  const tabs = [
    { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { id: "employees", label: "Сотрудники", icon: "Users" },
    { id: "proposals", label: "КП", icon: "FileText" },
    { id: "contracts", label: "Договоры", icon: "ScrollText" },
  ];

  const inputCls = "w-full border border-border bg-background px-3 py-2 text-sm font-golos focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="min-h-screen bg-background font-golos flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-dark min-h-screen flex flex-col border-r border-white/10 fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-white/10">
          <div className="font-cormorant text-white text-base font-semibold">Гильдия Профессионалов</div>
          <div className="text-gold text-xs font-golos mt-0.5">Панель управления</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-golos transition-all duration-200 text-left ${tab === t.id ? 'bg-gold text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs font-golos transition-colors">
            <Icon name="ArrowLeft" size={14} />
            На сайт
          </a>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-64 p-8">

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <div className="mb-8">
              <h1 className="font-cormorant text-3xl text-foreground font-light">Добро пожаловать</h1>
              <p className="text-muted-foreground text-sm font-golos mt-1">Обзор деятельности компании</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Сотрудников", value: employees.length, icon: "Users", color: "text-blue-500" },
                { label: "Активных КП", value: proposals.filter(p => p.status === "sent").length, icon: "FileText", color: "text-gold" },
                { label: "Принято КП", value: proposals.filter(p => p.status === "accepted").length, icon: "CheckCircle", color: "text-green-500" },
                { label: "Договоров", value: contracts.length, icon: "ScrollText", color: "text-purple-500" },
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-xs font-golos">{stat.label}</span>
                    <Icon name={stat.icon} size={16} className={stat.color} />
                  </div>
                  <div className="font-cormorant text-4xl font-semibold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Последние КП</h3>
                {proposals.length === 0
                  ? <p className="text-muted-foreground text-sm font-golos">Нет коммерческих предложений</p>
                  : <div className="space-y-3">
                    {proposals.slice(0, 4).map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <div className="text-sm font-golos text-foreground">{p.client}</div>
                          <div className="text-xs text-muted-foreground">{p.author} · {p.amount}</div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 border font-golos ${statusLabels[p.status].color}`}>
                          {statusLabels[p.status].label}
                        </span>
                      </div>
                    ))}
                  </div>
                }
              </div>
              <div className="bg-card border border-border p-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Сотрудники</h3>
                {employees.length === 0
                  ? <p className="text-muted-foreground text-sm font-golos">Нет сотрудников</p>
                  : <div className="space-y-3">
                    {employees.filter(e => e.status === "active").slice(0, 4).map(e => (
                      <div key={e.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-cormorant font-semibold flex-shrink-0">
                          {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-golos text-foreground truncate">{e.name}</div>
                          <div className="text-xs text-muted-foreground">{e.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ── СОТРУДНИКИ ── */}
        {tab === "employees" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-cormorant text-3xl text-foreground font-light">Сотрудники</h1>
                <p className="text-muted-foreground text-sm font-golos mt-1">Управление кабинетами сотрудников</p>
              </div>
              <button onClick={() => setShowNewEmployee(true)}
                className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16} />
                Добавить сотрудника
              </button>
            </div>

            {showNewEmployee && (
              <div className="bg-card border border-gold/30 p-6 mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Новый сотрудник</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Имя *</label>
                    <input value={newEmp.name} onChange={e => setNewEmp(p => ({ ...p, name: e.target.value }))} placeholder="Иван Иванов" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">E-mail *</label>
                    <input value={newEmp.email} onChange={e => setNewEmp(p => ({ ...p, email: e.target.value }))} placeholder="ivan@gildiya.ru" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Должность</label>
                    <select value={newEmp.role} onChange={e => setNewEmp(p => ({ ...p, role: e.target.value }))} className={inputCls}>
                      <option>Менеджер</option>
                      <option>Старший менеджер</option>
                      <option>Руководитель отдела</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddEmployee} disabled={empSaving}
                    className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors disabled:opacity-50">
                    {empSaving ? "Сохраняем..." : "Создать кабинет"}
                  </button>
                  <button onClick={() => setShowNewEmployee(false)}
                    className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos hover:text-foreground transition-colors">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {empLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm font-golos">Загрузка...</div>
            ) : employees.length === 0 ? (
              <EmptyState icon="Users" text="Сотрудников пока нет" sub="Нажмите «Добавить сотрудника», чтобы создать первый кабинет" />
            ) : (
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Сотрудник</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">E-mail</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Должность</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp, i) => (
                      <tr key={emp.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-cormorant font-semibold flex-shrink-0">
                              {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <span className="text-sm font-golos text-foreground">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-golos">{emp.email}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70 font-golos">{emp.role}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleToggleEmployeeStatus(emp)}
                            className={`text-xs px-2 py-0.5 border font-golos hover:opacity-70 transition-opacity ${statusLabels[emp.status].color}`}>
                            {statusLabels[emp.status].label}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <Icon name="Trash2" size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── КП ── */}
        {tab === "proposals" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-cormorant text-3xl text-foreground font-light">Коммерческие предложения</h1>
                <p className="text-muted-foreground text-sm font-golos mt-1">Все КП сотрудников</p>
              </div>
              <button onClick={() => setShowNewProposal(true)}
                className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16} />
                Создать КП
              </button>
            </div>

            {showNewProposal && (
              <div className="bg-card border border-gold/30 p-6 mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Новое коммерческое предложение</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Клиент *</label>
                    <input value={newProp.client} onChange={e => setNewProp(p => ({ ...p, client: e.target.value }))} placeholder="ООО «Название»" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Услуга *</label>
                    <input value={newProp.service} onChange={e => setNewProp(p => ({ ...p, service: e.target.value }))} placeholder="Повышение квалификации" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Сумма *</label>
                    <input value={newProp.amount} onChange={e => setNewProp(p => ({ ...p, amount: e.target.value }))} placeholder="50 000 ₽" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Менеджер *</label>
                    <input value={newProp.author} onChange={e => setNewProp(p => ({ ...p, author: e.target.value }))} placeholder="Иван Иванов" className={inputCls} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Комментарий</label>
                    <input value={newProp.comment} onChange={e => setNewProp(p => ({ ...p, comment: e.target.value }))} placeholder="Дополнительная информация..." className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddProposal} disabled={propSaving}
                    className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors disabled:opacity-50">
                    {propSaving ? "Сохраняем..." : "Создать КП"}
                  </button>
                  <button onClick={() => setShowNewProposal(false)}
                    className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos hover:text-foreground transition-colors">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-5 flex-wrap">
              {[["all","Все"],["draft","Черновики"],["sent","Отправленные"],["accepted","Принятые"],["rejected","Отклонённые"]].map(([val, label]) => (
                <button key={val} onClick={() => setPropFilter(val)}
                  className={`px-4 py-1.5 text-xs font-golos border transition-colors ${propFilter === val ? 'bg-gold text-white border-gold' : 'border-border text-foreground/60 hover:border-gold hover:text-gold'}`}>
                  {label}
                </button>
              ))}
            </div>

            {propLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm font-golos">Загрузка...</div>
            ) : filteredProposals.length === 0 ? (
              <EmptyState icon="FileText" text="КП пока нет" sub="Нажмите «Создать КП», чтобы добавить первое" />
            ) : (
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Клиент</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Услуга</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Сумма</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Менеджер</th>
                      <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProposals.map((p, i) => (
                      <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                        <td className="px-6 py-4 text-sm font-golos text-foreground font-medium">{p.client}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground font-golos">{p.service}</td>
                        <td className="px-6 py-4 text-sm font-golos text-gold font-semibold">{p.amount}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70 font-golos">{p.author}</td>
                        <td className="px-6 py-4">
                          <select value={p.status}
                            onChange={e => handleChangeProposalStatus(p.id, e.target.value)}
                            className={`text-xs px-2 py-0.5 border font-golos bg-transparent cursor-pointer ${statusLabels[p.status].color}`}>
                            <option value="draft">Черновик</option>
                            <option value="sent">Отправлено</option>
                            <option value="accepted">Принято</option>
                            <option value="rejected">Отклонено</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteProposal(p.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                            <Icon name="Trash2" size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ДОГОВОРЫ ── */}
        {tab === "contracts" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-cormorant text-3xl text-foreground font-light">Договоры</h1>
                <p className="text-muted-foreground text-sm font-golos mt-1">Управление договорами с клиентами</p>
              </div>
              <button onClick={() => setShowNewContract(true)}
                className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16} />
                Создать договор
              </button>
            </div>

            {showNewContract && (
              <div className="bg-card border border-gold/30 p-6 mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Новый договор</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Номер договора *</label>
                    <input value={newCon.number} onChange={e => setNewCon(p => ({ ...p, number: e.target.value }))} placeholder="Д-2024/001" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Клиент *</label>
                    <input value={newCon.client} onChange={e => setNewCon(p => ({ ...p, client: e.target.value }))} placeholder="ООО «Название»" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Услуга *</label>
                    <input value={newCon.service} onChange={e => setNewCon(p => ({ ...p, service: e.target.value }))} placeholder="Повышение квалификации" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Сумма *</label>
                    <input value={newCon.amount} onChange={e => setNewCon(p => ({ ...p, amount: e.target.value }))} placeholder="100 000 ₽" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Дата подписания *</label>
                    <input type="date" value={newCon.signed_at} onChange={e => setNewCon(p => ({ ...p, signed_at: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Действует до *</label>
                    <input type="date" value={newCon.expires_at} onChange={e => setNewCon(p => ({ ...p, expires_at: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddContract} disabled={conSaving}
                    className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors disabled:opacity-50">
                    {conSaving ? "Сохраняем..." : "Создать договор"}
                  </button>
                  <button onClick={() => setShowNewContract(false)}
                    className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos hover:text-foreground transition-colors">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {conLoading ? (
              <div className="text-center py-12 text-muted-foreground text-sm font-golos">Загрузка...</div>
            ) : contracts.length === 0 ? (
              <EmptyState icon="ScrollText" text="Договоров пока нет" sub="Нажмите «Создать договор», чтобы добавить первый" />
            ) : (
              <div className="grid gap-4">
                {contracts.map(c => (
                  <div key={c.id} className="bg-card border border-border p-6 flex flex-col md:flex-row md:items-center gap-4 hover:border-gold/30 transition-colors">
                    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="ScrollText" size={20} className="text-gold" />
                    </div>
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
                    <button onClick={() => handleDeleteContract(c.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-2 ml-2">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
