import { useState } from "react";
import Icon from "@/components/ui/icon";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  proposals: number;
};

type Proposal = {
  id: number;
  client: string;
  service: string;
  amount: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  date: string;
  author: string;
};

const mockEmployees: Employee[] = [];

const mockProposals: Proposal[] = [];

const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: "Черновик", color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30" },
  sent: { label: "Отправлено", color: "bg-blue-500/15 text-blue-600 border-blue-500/30" },
  accepted: { label: "Принято", color: "bg-green-500/15 text-green-600 border-green-500/30" },
  rejected: { label: "Отклонено", color: "bg-red-500/15 text-red-500 border-red-500/30" },
  active: { label: "Активен", color: "bg-green-500/15 text-green-600 border-green-500/30" },
  inactive: { label: "Неактивен", color: "bg-gray-500/15 text-gray-500 border-gray-500/30" },
};

export default function AdminPanel() {
  const [tab, setTab] = useState<"dashboard" | "employees" | "proposals" | "contracts">("dashboard");
  const [showNewEmployee, setShowNewEmployee] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [proposals] = useState<Proposal[]>(mockProposals);
  const [newEmp, setNewEmp] = useState({ name: "", email: "", role: "Менеджер" });

  const handleAddEmployee = () => {
    if (!newEmp.name || !newEmp.email) return;
    setEmployees(prev => [...prev, {
      id: prev.length + 1,
      name: newEmp.name,
      email: newEmp.email,
      role: newEmp.role,
      status: "active",
      proposals: 0,
    }]);
    setNewEmp({ name: "", email: "", role: "Менеджер" });
    setShowNewEmployee(false);
  };

  const tabs = [
    { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
    { id: "employees", label: "Сотрудники", icon: "Users" },
    { id: "proposals", label: "КП", icon: "FileText" },
    { id: "contracts", label: "Договоры", icon: "ScrollText" },
  ];

  return (
    <div className="min-h-screen bg-background font-golos flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-dark min-h-screen flex flex-col border-r border-white/10 fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-sm">ГП</span>
            </div>
            <div>
              <div className="font-cormorant text-white text-base font-semibold leading-tight">Гильдия</div>
              <div className="text-gold text-xs font-golos">Профессионалов</div>
            </div>
          </div>
          <div className="mt-4 px-3 py-2 bg-white/5 rounded text-xs text-white/40 font-golos">
            Панель управления
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-golos transition-all duration-200 text-left ${tab === t.id
                ? 'bg-gold text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
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

        {/* DASHBOARD */}
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
                { label: "Договоров", value: 3, icon: "ScrollText", color: "text-purple-500" },
              ].map((stat, i) => (
                <div key={i} className="bg-card border border-border p-6 rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-xs font-golos">{stat.label}</span>
                    <Icon name={stat.icon} size={16} className={stat.color} />
                  </div>
                  <div className="font-cormorant text-4xl font-semibold text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-sm">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Последние КП</h3>
                <div className="space-y-3">
                  {proposals.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <div className="text-sm font-golos text-foreground">{p.client}</div>
                        <div className="text-xs text-muted-foreground">{p.date} · {p.author}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 border font-golos ${statusLabels[p.status].color}`}>
                        {statusLabels[p.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-sm">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Активные сотрудники</h3>
                <div className="space-y-3">
                  {employees.filter(e => e.status === "active").map(e => (
                    <div key={e.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-cormorant font-semibold">
                        {e.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-golos text-foreground truncate">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{e.role}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{e.proposals} КП</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYEES */}
        {tab === "employees" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-cormorant text-3xl text-foreground font-light">Сотрудники</h1>
                <p className="text-muted-foreground text-sm font-golos mt-1">Управление кабинетами сотрудников</p>
              </div>
              <button
                onClick={() => setShowNewEmployee(true)}
                className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16} />
                Добавить сотрудника
              </button>
            </div>

            {showNewEmployee && (
              <div className="bg-card border border-gold/30 p-6 rounded-sm mb-6">
                <h3 className="font-cormorant text-xl text-foreground mb-4">Новый сотрудник</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Имя</label>
                    <input value={newEmp.name} onChange={e => setNewEmp(p => ({ ...p, name: e.target.value }))}
                      placeholder="Иван Иванов"
                      className="w-full border border-border bg-background px-3 py-2 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">E-mail</label>
                    <input value={newEmp.email} onChange={e => setNewEmp(p => ({ ...p, email: e.target.value }))}
                      placeholder="ivan@gildiya.ru"
                      className="w-full border border-border bg-background px-3 py-2 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="text-muted-foreground text-xs font-golos block mb-1">Должность</label>
                    <select value={newEmp.role} onChange={e => setNewEmp(p => ({ ...p, role: e.target.value }))}
                      className="w-full border border-border bg-background px-3 py-2 text-sm font-golos focus:outline-none focus:border-gold transition-colors">
                      <option>Менеджер</option>
                      <option>Старший менеджер</option>
                      <option>Руководитель отдела</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleAddEmployee} className="bg-gold text-white px-5 py-2 text-sm font-golos hover:bg-gold-light transition-colors">
                    Создать кабинет
                  </button>
                  <button onClick={() => setShowNewEmployee(false)} className="border border-border text-foreground/60 px-5 py-2 text-sm font-golos hover:text-foreground transition-colors">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Сотрудник</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">E-mail</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Должность</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">КП</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={emp.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-cormorant font-semibold flex-shrink-0">
                            {emp.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-sm font-golos text-foreground">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-golos">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70 font-golos">{emp.role}</td>
                      <td className="px-6 py-4 text-sm font-golos text-foreground">{emp.proposals}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 border font-golos ${statusLabels[emp.status].color}`}>
                          {statusLabels[emp.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-muted-foreground hover:text-gold transition-colors">
                          <Icon name="MoreHorizontal" size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROPOSALS */}
        {tab === "proposals" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-cormorant text-3xl text-foreground font-light">Коммерческие предложения</h1>
                <p className="text-muted-foreground text-sm font-golos mt-1">Все КП сотрудников</p>
              </div>
              <button className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16} />
                Создать КП
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              {["Все", "Черновики", "Отправленные", "Принятые", "Отклонённые"].map(f => (
                <button key={f} className="px-4 py-1.5 text-xs font-golos border border-border text-foreground/60 hover:border-gold hover:text-gold transition-colors">
                  {f}
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Клиент</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Услуга</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Сумма</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Менеджер</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Дата</th>
                    <th className="text-left px-6 py-3 text-xs font-golos text-muted-foreground uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((p, i) => (
                    <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-6 py-4 text-sm font-golos text-foreground font-medium">{p.client}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-golos">{p.service}</td>
                      <td className="px-6 py-4 text-sm font-golos text-gold font-semibold">{p.amount}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70 font-golos">{p.author}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-golos">{p.date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 border font-golos ${statusLabels[p.status].color}`}>
                          {statusLabels[p.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-muted-foreground hover:text-gold transition-colors" title="Редактировать">
                            <Icon name="Pencil" size={14} />
                          </button>
                          <button className="text-muted-foreground hover:text-gold transition-colors" title="Отправить">
                            <Icon name="Send" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTRACTS */}
        {tab === "contracts" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-cormorant text-3xl text-foreground font-light">Договоры</h1>
                <p className="text-muted-foreground text-sm font-golos mt-1">Управление договорами с клиентами</p>
              </div>
              <button className="flex items-center gap-2 bg-gold text-white px-5 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                <Icon name="Plus" size={16} />
                Создать договор
              </button>
            </div>

            <div className="bg-card border border-border p-12 text-center">
              <Icon name="ScrollText" size={36} className="text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-golos text-sm">Договоров пока нет</p>
              <p className="text-muted-foreground/50 font-golos text-xs mt-1">Нажмите «Создать договор», чтобы добавить первый</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}