import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/4f5281a3-b777-4e02-8c7a-090c78e3adc7.jpg";
const CERT_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/377948e8-849f-49f1-912e-daa725f284e9.jpg";
const TEAM_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/d67125a7-0ddc-4d51-afb3-3999ee1a5330.jpg";

const services = [
  { icon: "Award", title: "Сертификация специалистов", desc: "Официальное подтверждение квалификации в соответствии с профессиональными стандартами", price: "от 8 000 ₽", tag: "Популярно" },
  { icon: "GraduationCap", title: "Корпоративное обучение", desc: "Разработка и проведение обучающих программ для сотрудников вашей компании", price: "от 45 000 ₽", tag: null },
  { icon: "BookOpen", title: "Профессиональная переподготовка", desc: "Получение новой квалификации с выдачей диплома установленного образца", price: "от 25 000 ₽", tag: "Новинка" },
  { icon: "ClipboardCheck", title: "Независимая оценка квалификации", desc: "Экспертная оценка профессиональных компетенций специалиста", price: "от 12 000 ₽", tag: null },
  { icon: "FileText", title: "Разработка профстандартов", desc: "Создание и актуализация профессиональных стандартов для отраслей", price: "от 120 000 ₽", tag: null },
  { icon: "Users", title: "Консалтинг в области HR", desc: "Консультирование по вопросам управления персоналом и квалификационным требованиям", price: "от 15 000 ₽", tag: null },
];

const stats = [
  { value: "12+", label: "лет на рынке" },
  { value: "8 400+", label: "сертифицированных специалистов" },
  { value: "340+", label: "партнёрских компаний" },
  { value: "98%", label: "клиентов рекомендуют нас" },
];

const catalog = [
  { category: "Строительство и ЖКХ", items: ["Инженер-проектировщик", "Специалист по охране труда", "Энергоаудитор", "Сметчик"] },
  { category: "IT и цифровые технологии", items: ["Системный аналитик", "Менеджер проекта", "Специалист по ИБ", "DevOps-инженер"] },
  { category: "Финансы и право", items: ["Бухгалтер", "Аудитор", "Специалист по комплаенс", "Налоговый консультант"] },
  { category: "Управление и менеджмент", items: ["Руководитель проекта", "HR-менеджер", "Операционный директор", "Бизнес-аналитик"] },
  { category: "Медицина и фармация", items: ["Медицинский представитель", "Провизор", "Специалист по качеству", "Клинический исследователь"] },
  { category: "Образование", items: ["Педагог дополнительного образования", "Тренер-методист", "Тьютор", "Куратор образовательных программ"] },
];

const prices = [
  {
    name: "Базовый", price: "8 000 ₽", period: "за специалиста", highlight: false,
    features: ["Сертификация 1 специалиста", "Онлайн-тестирование", "Электронный сертификат", "Срок действия 3 года", "Техподдержка по e-mail"],
    cta: "Оформить",
  },
  {
    name: "Профессиональный", price: "45 000 ₽", period: "до 10 специалистов", highlight: true,
    features: ["Сертификация до 10 специалистов", "Очное или онлайн-обучение", "Именные сертификаты", "Срок действия 3 года", "Персональный менеджер", "Выезд в офис компании"],
    cta: "Выбрать тариф",
  },
  {
    name: "Корпоративный", price: "Индивидуально", period: "от 11 специалистов", highlight: false,
    features: ["Неограниченное число специалистов", "Разработка программы под компанию", "Корпоративный аккаунт", "Поддержка 24/7", "Отчётность и аналитика", "Юридическое сопровождение"],
    cta: "Запросить КП",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const heroSection = useInView(0.1);
  const aboutSection = useInView(0.15);
  const servicesSection = useInView(0.1);
  const catalogSection = useInView(0.1);
  const pricesSection = useInView(0.1);
  const contactSection = useInView(0.15);

  const navLinks = [
    { href: "#about", label: "О компании" },
    { href: "#services", label: "Услуги" },
    { href: "#catalog", label: "Каталог" },
    { href: "#prices", label: "Цены" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-background font-golos">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <span className="text-white font-cormorant font-bold text-sm">ГП</span>
            </div>
            <div>
              <span className="font-cormorant text-white font-semibold text-lg tracking-wide">Гильдия</span>
              <span className="font-cormorant text-gold font-semibold text-lg tracking-wide ml-1">Профессионалов</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="nav-link text-white/70 hover:text-gold text-sm font-golos tracking-wide transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+78001234567" className="text-white/70 hover:text-gold text-sm transition-colors">
              8 800 123-45-67
            </a>
            <a href="#contacts" className="bg-gold text-white px-5 py-2 text-sm font-medium hover:bg-gold-light transition-colors">
              Связаться
            </a>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-dark border-t border-white/10 px-4 pb-4">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="block py-3 text-white/70 hover:text-gold text-sm border-b border-white/5"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#contacts" className="block mt-4 w-full bg-gold text-white text-center py-3 text-sm font-medium">
              Связаться с нами
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Гильдия профессионалов" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div ref={heroSection.ref} className={`relative z-10 container mx-auto px-4 pt-16 transition-all duration-1000 ${heroSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-3xl">
            <p className="text-gold font-golos text-sm tracking-[0.3em] uppercase mb-6 opacity-90">
              Официальная сертификация специалистов
            </p>
            <h1 className="font-cormorant text-5xl md:text-7xl text-white font-light leading-[1.1] mb-6">
              Ваша квалификация —<br />
              <em className="gold-gradient-text not-italic font-medium">ваш капитал</em>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10 font-golos font-light">
              Профессиональная сертификация, корпоративное обучение и оценка квалификации специалистов в соответствии с государственными стандартами
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#services" className="inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 font-golos font-medium text-sm tracking-wide hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/30">
                Наши услуги
                <Icon name="ArrowRight" size={16} />
              </a>
              <a href="#contacts" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 font-golos font-medium text-sm tracking-wide hover:border-gold hover:text-gold transition-all duration-300">
                Получить консультацию
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-dark/80 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-cormorant text-3xl md:text-4xl text-gold font-semibold">{stat.value}</div>
                <div className="text-white/50 text-xs mt-1 font-golos tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-background texture-bg">
        <div ref={aboutSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${aboutSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">О компании</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light leading-tight mb-6">
                Более 12 лет<br />в области<br />
                <em className="not-italic font-medium text-gold">профессионального развития</em>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-muted-foreground leading-relaxed mb-6 font-golos">
                Гильдия Профессионалов — ведущий центр сертификации и обучения специалистов в России. Мы работаем в полном соответствии с требованиями профессиональных стандартов и Федерального закона № 238-ФЗ.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10 font-golos">
                Наши эксперты — практикующие специалисты с глубокими знаниями отраслевых стандартов. Мы помогаем людям подтвердить свою квалификацию и открыть новые карьерные горизонты.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "Shield", text: "Аккредитованный центр оценки квалификации" },
                  { icon: "Award", text: "Государственное признание сертификатов" },
                  { icon: "Clock", text: "Оперативное оформление в срок от 5 дней" },
                  { icon: "HeartHandshake", text: "Персональный подход к каждому клиенту" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={item.icon} size={14} className="text-gold" />
                    </div>
                    <p className="text-sm text-foreground/70 font-golos leading-snug">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/20 rounded-sm" />
              <img src={CERT_IMAGE} alt="Сертификация специалистов" className="relative z-10 w-full object-cover rounded-sm shadow-2xl" style={{ height: '480px' }} />
              <div className="absolute bottom-8 -right-6 z-20 bg-dark text-white p-6 shadow-xl border-l-2 border-gold">
                <div className="font-cormorant text-4xl font-semibold text-gold">12</div>
                <div className="text-xs text-white/60 mt-1 font-golos">лет безупречной<br />репутации</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 section-dark">
        <div ref={servicesSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${servicesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Что мы делаем</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">Наши услуги</h2>
            <div className="gold-line mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={i} className="card-hover relative bg-white/5 border border-white/10 p-8 group cursor-pointer">
                {service.tag && (
                  <span className="absolute top-4 right-4 bg-gold text-white text-xs px-2 py-1 font-golos">{service.tag}</span>
                )}
                <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-6 group-hover:bg-gold/25 transition-colors">
                  <Icon name={service.icon} size={20} className="text-gold" />
                </div>
                <h3 className="font-cormorant text-xl text-white font-medium mb-3">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 font-golos">{service.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-gold font-golos font-semibold text-sm">{service.price}</span>
                  <Icon name="ArrowRight" size={16} className="text-white/40 group-hover:text-gold transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 bg-background">
        <div ref={catalogSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${catalogSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Направления</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light">Каталог специальностей</h2>
            <div className="gold-line mx-auto mt-6" />
            <p className="text-muted-foreground mt-6 max-w-lg mx-auto font-golos">Более 200 специальностей в 6 отраслевых направлениях</p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {catalog.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 text-sm font-golos border transition-all duration-200 ${activeCategory === i
                  ? 'bg-gold text-white border-gold'
                  : 'border-border text-foreground/60 hover:border-gold hover:text-gold'}`}>
                {cat.category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {catalog[activeCategory].items.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-border hover:border-gold/40 transition-colors group card-hover bg-card">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                <span className="font-golos text-sm text-foreground/80 group-hover:text-foreground transition-colors">{item}</span>
                <Icon name="ArrowRight" size={14} className="ml-auto text-foreground/20 group-hover:text-gold transition-colors" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllSpecialties(true)}
              className="border border-gold text-gold px-8 py-3 font-golos text-sm hover:bg-gold hover:text-white transition-all duration-300">
              Посмотреть все специальности
            </button>
          </div>

          {/* MODAL: все специальности */}
          {showAllSpecialties && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm" onClick={() => setShowAllSpecialties(false)}>
              <div className="bg-background border border-border w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-8 py-6 border-b border-border sticky top-0 bg-background z-10">
                  <div>
                    <h3 className="font-cormorant text-2xl text-foreground font-light">Все специальности</h3>
                    <p className="text-muted-foreground text-xs font-golos mt-0.5">6 направлений · более 200 специальностей</p>
                  </div>
                  <button onClick={() => setShowAllSpecialties(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-8">
                  {catalog.map((cat, ci) => (
                    <div key={ci}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-1.5 h-5 bg-gold flex-shrink-0" />
                        <h4 className="font-cormorant text-lg text-foreground font-medium">{cat.category}</h4>
                      </div>
                      <div className="space-y-2">
                        {cat.items.map((item, ii) => (
                          <div key={ii} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0 group cursor-pointer hover:pl-1 transition-all duration-200">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold flex-shrink-0 transition-colors" />
                            <span className="font-golos text-sm text-foreground/70 group-hover:text-foreground transition-colors">{item}</span>
                            <Icon name="ArrowRight" size={12} className="ml-auto text-foreground/20 group-hover:text-gold transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-8 py-6 border-t border-border bg-muted/30 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-golos">Не нашли нужную специальность?</p>
                  <a href="#contacts" onClick={() => setShowAllSpecialties(false)}
                    className="bg-gold text-white px-6 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                    Задать вопрос
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 section-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={TEAM_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Почему мы</p>
          <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light mb-16">Наши преимущества</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "BadgeCheck", title: "Государственная аккредитация", desc: "Все сертификаты имеют юридическую силу" },
              { icon: "Zap", title: "Быстрое оформление", desc: "Сертификат готов от 5 рабочих дней" },
              { icon: "Globe", title: "Онлайн и офлайн", desc: "Форматы обучения на ваш выбор" },
              { icon: "TrendingUp", title: "Карьерный рост", desc: "Подтверждённая квалификация — ваше конкурентное преимущество" },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center mx-auto mb-5 group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                  <Icon name={item.icon} size={24} className="text-gold" />
                </div>
                <h3 className="font-cormorant text-xl text-white font-medium mb-3">{item.title}</h3>
                <p className="text-white/50 text-sm font-golos leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="py-24 bg-background">
        <div ref={pricesSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${pricesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Стоимость</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light">Тарифные планы</h2>
            <div className="gold-line mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {prices.map((plan, i) => (
              <div key={i} className={`card-hover relative p-8 border-2 ${plan.highlight ? 'border-gold bg-dark text-white shadow-2xl shadow-gold/20' : 'border-border bg-card'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-white text-xs px-4 py-1 font-golos font-medium">Рекомендуем</span>
                  </div>
                )}
                <div className={`text-xs tracking-[0.2em] uppercase mb-2 font-golos ${plan.highlight ? 'text-gold' : 'text-muted-foreground'}`}>{plan.name}</div>
                <div className={`font-cormorant text-4xl font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.price}</div>
                <div className={`text-xs mb-8 font-golos ${plan.highlight ? 'text-white/50' : 'text-muted-foreground'}`}>{plan.period}</div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Icon name="Check" size={14} className="text-gold flex-shrink-0" />
                      <span className={`text-sm font-golos ${plan.highlight ? 'text-white/80' : 'text-foreground/70'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-3 text-sm font-golos font-medium transition-all duration-300 ${plan.highlight ? 'bg-gold text-white hover:bg-gold-light' : 'border border-gold text-gold hover:bg-gold hover:text-white'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 section-dark">
        <div ref={contactSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${contactSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Свяжитесь с нами</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light mb-6">
                Готовы ответить<br />на ваши вопросы
              </h2>
              <div className="gold-line mb-8" />
              <div className="space-y-6">
                {[
                  { icon: "Phone", label: "Телефон", value: "8 800 123-45-67", sub: "Бесплатно по России" },
                  { icon: "Mail", label: "E-mail", value: "info@gildiya-prof.ru", sub: "Ответим в течение 2 часов" },
                  { icon: "MapPin", label: "Офис", value: "Москва, ул. Тверская, 1", sub: "Пн–Пт, 9:00–18:00" },
                ].map((contact, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={contact.icon} size={16} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs font-golos tracking-wide mb-1">{contact.label}</div>
                      <div className="text-white font-golos font-medium">{contact.value}</div>
                      <div className="text-white/40 text-xs font-golos mt-0.5">{contact.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-8">
              <h3 className="font-cormorant text-2xl text-white mb-6">Оставить заявку</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs font-golos tracking-wide block mb-2">Ваше имя</label>
                  <input type="text" placeholder="Иван Иванов" className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-golos tracking-wide block mb-2">Телефон</label>
                  <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-golos tracking-wide block mb-2">Что вас интересует?</label>
                  <select className="w-full bg-dark border border-white/15 text-white/70 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors">
                    <option>Сертификация специалистов</option>
                    <option>Корпоративное обучение</option>
                    <option>Профессиональная переподготовка</option>
                    <option>Консалтинг</option>
                    <option>Другое</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-golos tracking-wide block mb-2">Комментарий</label>
                  <textarea rows={3} placeholder="Опишите вашу задачу..." className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors resize-none" />
                </div>
                <button className="w-full bg-gold text-white py-4 font-golos font-medium text-sm tracking-wide hover:bg-gold-light transition-colors">
                  Отправить заявку
                </button>
                <p className="text-white/25 text-xs font-golos text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark border-t border-white/10 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center">
                <span className="text-white font-cormorant font-bold text-xs">ГП</span>
              </div>
              <span className="font-cormorant text-white text-lg">Гильдия Профессионалов</span>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-white/40 hover:text-gold text-xs font-golos tracking-wide transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-white/25 text-xs font-golos">© 2024 Гильдия Профессионалов</p>
          </div>
        </div>
      </footer>
    </div>
  );
}