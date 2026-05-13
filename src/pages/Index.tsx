import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/8304651f-41a1-44a4-8419-b964c1e900bf.jpg";
const CERT_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/f1ed86de-1161-445e-9835-661eed50e3f7.jpg";
const TEAM_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/d67125a7-0ddc-4d51-afb3-3999ee1a5330.jpg";

// ─── УСЛУГИ ────────────────────────────────────────────────────────────────
const services = [
  {
    icon: "RefreshCw",
    title: "Периодическая аккредитация",
    desc: "Подготовка и прохождение периодической аккредитации медработников согласно Приказу Минздрава № 709н. Сопровождение от А до Я.",
    price: "от 4 900 ₽",
    tag: "Популярно",
    badge: "Для врачей и медсестёр",
  },
  {
    icon: "TrendingUp",
    title: "Повышение квалификации",
    desc: "Удостоверение о ПК (36 или 72 часа). Идут в зачёт НМО / НФО. Все медицинские и фармацевтические специальности.",
    price: "от 3 500 ₽",
    tag: "Быстро",
    badge: "36 и 72 часа",
  },
  {
    icon: "GraduationCap",
    title: "Профессиональная переподготовка",
    desc: "Диплом о переподготовке (504+ часов). Право вести медицинскую деятельность по новой специальности.",
    price: "от 18 000 ₽",
    tag: null,
    badge: "504+ часов",
  },
  {
    icon: "Star",
    title: "НМО — Непрерывное медицинское образование",
    desc: "Накопление баллов НМО для аккредитации. Вебинары, симпозиумы, образовательные модули. Всё в реестре НМФО.",
    price: "от 1 500 ₽",
    tag: null,
    badge: "Баллы НМО",
  },
  {
    icon: "Pill",
    title: "Фармацевтическое образование",
    desc: "Курсы для провизоров и фармацевтов: ПК, переподготовка, подготовка к аккредитации НФО. Дистанционно.",
    price: "от 3 900 ₽",
    tag: null,
    badge: "Для фармацевтов",
  },
  {
    icon: "Building2",
    title: "Корпоративное обучение",
    desc: "Обучение всего персонала клиники или больницы. Договор с юрлицом, закрывающие документы, скидки от 10 чел.",
    price: "от 35 000 ₽",
    tag: null,
    badge: "Для организаций",
  },
];

// ─── СТАТИСТИКА ─────────────────────────────────────────────────────────────
const stats = [
  { value: "8+", label: "лет работы в медобразовании" },
  { value: "25 000+", label: "обученных медработников" },
  { value: "600+", label: "программ обучения" },
  { value: "99%", label: "успешно проходят аккредитацию" },
];

// ─── КАТАЛОГ ПРОГРАММ ───────────────────────────────────────────────────────
const catalog = [
  {
    category: "Врачи — ПК и переподготовка",
    icon: "Stethoscope",
    items: [
      { name: "Терапия", hours: "72 ч.", type: "ПК" },
      { name: "Хирургия", hours: "504 ч.", type: "Переподготовка" },
      { name: "Педиатрия", hours: "72 ч.", type: "ПК" },
      { name: "Неврология", hours: "144 ч.", type: "ПК" },
      { name: "Кардиология", hours: "144 ч.", type: "ПК" },
      { name: "Онкология", hours: "504 ч.", type: "Переподготовка" },
      { name: "Акушерство и гинекология", hours: "72 ч.", type: "ПК" },
      { name: "Анестезиология-реаниматология", hours: "504 ч.", type: "Переподготовка" },
    ],
  },
  {
    category: "Средний медперсонал",
    icon: "HeartPulse",
    items: [
      { name: "Сестринское дело", hours: "72 ч.", type: "ПК" },
      { name: "Операционное дело", hours: "504 ч.", type: "Переподготовка" },
      { name: "Лечебное дело (фельдшер)", hours: "72 ч.", type: "ПК" },
      { name: "Акушерское дело", hours: "504 ч.", type: "Переподготовка" },
      { name: "Лабораторная диагностика", hours: "72 ч.", type: "ПК" },
      { name: "Скорая и неотложная помощь", hours: "72 ч.", type: "ПК" },
      { name: "Функциональная диагностика", hours: "504 ч.", type: "Переподготовка" },
      { name: "Анестезиология и реаниматология", hours: "72 ч.", type: "ПК" },
    ],
  },
  {
    category: "Фармацевты и провизоры",
    icon: "Pill",
    items: [
      { name: "Фармация", hours: "504 ч.", type: "Переподготовка" },
      { name: "Управление и экономика фармации", hours: "144 ч.", type: "ПК" },
      { name: "Фармацевтическая технология", hours: "72 ч.", type: "ПК" },
      { name: "Клиническая фармакология", hours: "144 ч.", type: "ПК" },
      { name: "Фармацевтический анализ", hours: "72 ч.", type: "ПК" },
      { name: "Медицинское и фармацевтическое товароведение", hours: "72 ч.", type: "ПК" },
      { name: "Подготовка к НФО аккредитации", hours: "36 ч.", type: "ПК" },
      { name: "Провизор-технолог", hours: "504 ч.", type: "Переподготовка" },
    ],
  },
  {
    category: "Периодическая аккредитация (НМО/НФО)",
    icon: "RefreshCw",
    items: [
      { name: "Подготовка к аккредитации врача", hours: "36 ч.", type: "Аккр." },
      { name: "Подготовка к аккредитации медсестры", hours: "36 ч.", type: "Аккр." },
      { name: "Портфолио под ключ", hours: "—", type: "Услуга" },
      { name: "Баллы НМО — онлайн-вебинары", hours: "1–36 ч.", type: "НМО" },
      { name: "Баллы НФО — фармацевтам", hours: "1–36 ч.", type: "НФО" },
      { name: "Симуляционный тренинг", hours: "8 ч.", type: "НМО" },
      { name: "Экстренная медицинская помощь", hours: "36 ч.", type: "НМО" },
      { name: "Паллиативная помощь", hours: "36 ч.", type: "НМО" },
    ],
  },
  {
    category: "Организаторы здравоохранения",
    icon: "ClipboardList",
    items: [
      { name: "Организация здравоохранения и общественное здоровье", hours: "504 ч.", type: "Переподготовка" },
      { name: "Главная медицинская сестра", hours: "504 ч.", type: "Переподготовка" },
      { name: "Управление медицинской организацией", hours: "144 ч.", type: "ПК" },
      { name: "Экономика здравоохранения", hours: "72 ч.", type: "ПК" },
      { name: "Медицинская статистика", hours: "72 ч.", type: "ПК" },
      { name: "Качество медицинской помощи", hours: "72 ч.", type: "ПК" },
      { name: "Охрана труда в медорганизации", hours: "40 ч.", type: "ПК" },
      { name: "Правовые основы медицинской деятельности", hours: "72 ч.", type: "ПК" },
    ],
  },
  {
    category: "Диагностика и лабораторное дело",
    icon: "Microscope",
    items: [
      { name: "Клиническая лабораторная диагностика", hours: "504 ч.", type: "Переподготовка" },
      { name: "Рентгенология", hours: "504 ч.", type: "Переподготовка" },
      { name: "УЗИ-диагностика", hours: "504 ч.", type: "Переподготовка" },
      { name: "Патологическая анатомия", hours: "504 ч.", type: "Переподготовка" },
      { name: "Лучевая диагностика", hours: "144 ч.", type: "ПК" },
      { name: "Эндоскопия", hours: "504 ч.", type: "Переподготовка" },
      { name: "Функциональная диагностика", hours: "144 ч.", type: "ПК" },
      { name: "Судебно-медицинская экспертиза", hours: "504 ч.", type: "Переподготовка" },
    ],
  },
];

// ─── ЦЕНЫ ───────────────────────────────────────────────────────────────────
const prices = [
  {
    name: "Повышение квалификации",
    price: "от 3 500 ₽",
    period: "36 или 72 часа",
    highlight: false,
    features: [
      "Удостоверение о повышении квалификации",
      "Идёт в зачёт баллов НМО / НФО",
      "Дистанционный формат, без отрыва от работы",
      "Документ в течение 5 рабочих дней",
      "Вносится в ФИС ФРДО",
    ],
    cta: "Записаться",
  },
  {
    name: "Периодическая аккредитация",
    price: "от 4 900 ₽",
    period: "36 ч. + портфолио",
    highlight: true,
    features: [
      "Курс подготовки к аккредитации 36 часов",
      "Помощь в формировании портфолио",
      "Набор 50 баллов НМО / НФО",
      "Сопровождение при подаче документов",
      "Гарантия прохождения или возврат средств",
      "Сертификат специалиста нового образца",
    ],
    cta: "Пройти аккредитацию",
  },
  {
    name: "Профпереподготовка",
    price: "от 18 000 ₽",
    period: "504+ часов",
    highlight: false,
    features: [
      "Диплом о профессиональной переподготовке",
      "Право вести деятельность по новой специальности",
      "Очно, заочно или дистанционно",
      "Рассрочка на весь срок обучения",
      "Персональный куратор",
      "Вносится в ФИС ФРДО",
    ],
    cta: "Получить программу",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const faq = [
  {
    q: "Что такое периодическая аккредитация и когда её нужно проходить?",
    a: "Периодическая аккредитация — обязательная процедура для всех медработников каждые 5 лет. Для прохождения необходимо набрать 50 баллов НМО (для врачей) или НФО (для фармацевтов) за пятилетний цикл и подать портфолио.",
  },
  {
    q: "Документы вносятся в ФИС ФРДО?",
    a: "Да. Все выдаваемые нами удостоверения и дипломы вносятся в федеральную информационную систему ФИС ФРДО, что подтверждает их юридическую силу.",
  },
  {
    q: "Можно ли учиться без отрыва от работы?",
    a: "Все программы доступны в дистанционном формате. Вы учитесь в удобное время: вечером, в выходные — в своём темпе.",
  },
  {
    q: "Как быстро я получу документ об образовании?",
    a: "Удостоверение о ПК выдаётся в течение 5 рабочих дней после итогового тестирования. Диплом о переподготовке — в течение 10 рабочих дней.",
  },
  {
    q: "Есть ли рассрочка?",
    a: "Да, для физических лиц действует беспроцентная рассрочка. Для организаций — выставление счёта и договор.",
  },
];

function useInView(threshold = 0.1) {
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
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroSection = useInView(0.05);
  const aboutSection = useInView(0.1);
  const servicesSection = useInView(0.05);
  const catalogSection = useInView(0.05);
  const pricesSection = useInView(0.05);
  const faqSection = useInView(0.05);
  const contactSection = useInView(0.1);

  const navLinks = [
    { href: "#about", label: "О нас" },
    { href: "#services", label: "Услуги" },
    { href: "#catalog", label: "Программы" },
    { href: "#prices", label: "Цены" },
    { href: "#faq", label: "FAQ" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-background font-golos">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/96 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-white font-cormorant font-bold text-sm">ГП</span>
            </div>
            <div className="leading-tight">
              <div className="font-cormorant text-white font-semibold text-base tracking-wide leading-none">Гильдия Профессионалов</div>
              <div className="text-gold text-[10px] font-golos tracking-widest uppercase mt-0.5">Медицинское образование</div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="nav-link text-white/65 hover:text-gold text-sm font-golos tracking-wide transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+78001234567" className="text-white/65 hover:text-gold text-sm transition-colors font-golos">
              8 800 123-45-67
            </a>
            <a href="#contacts" className="bg-gold text-white px-5 py-2 text-sm font-medium hover:bg-gold-light transition-colors">
              Записаться
            </a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-dark border-t border-white/10 px-4 pb-4">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}
                className="block py-3 text-white/70 hover:text-gold text-sm border-b border-white/5 font-golos"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#contacts" className="block mt-4 w-full bg-gold text-white text-center py-3 text-sm font-medium">
              Записаться на обучение
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Медицинское образование" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div ref={heroSection.ref} className={`relative z-10 container mx-auto px-4 pt-16 transition-all duration-1000 ${heroSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 px-4 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-gold font-golos text-xs tracking-[0.25em] uppercase">Лицензированное ДПО для медработников</span>
            </div>
            <h1 className="font-cormorant text-5xl md:text-7xl text-white font-light leading-[1.05] mb-6">
              Аккредитация.<br />Обучение.<br />
              <em className="gold-gradient-text not-italic font-medium">Карьерный рост.</em>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl mb-4 font-golos font-light">
              Периодическая аккредитация, повышение квалификации и профессиональная переподготовка для врачей, медсестёр и фармацевтов
            </p>
            <p className="text-white/45 text-sm font-golos mb-10">
              Документы вносятся в ФИС ФРДО · Баллы НМО/НФО · Без отрыва от работы
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 font-golos font-medium text-sm tracking-wide hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/30">
                Выбрать программу
                <Icon name="ArrowRight" size={16} />
              </a>
              <a href="#services" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 font-golos font-medium text-sm tracking-wide hover:border-gold hover:text-gold transition-all duration-300">
                Пройти аккредитацию
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-dark/85 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-cormorant text-3xl md:text-4xl text-gold font-semibold">{stat.value}</div>
                <div className="text-white/45 text-xs mt-0.5 font-golos">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── О НАС ── */}
      <section id="about" className="py-24 bg-background texture-bg">
        <div ref={aboutSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${aboutSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">О центре</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light leading-tight mb-6">
                Центр ДПО<br />для медицинских<br />
                <em className="not-italic font-medium text-gold">работников России</em>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-muted-foreground leading-relaxed mb-5 font-golos">
                Гильдия Профессионалов — лицензированный центр дополнительного профессионального образования, специализирующийся на обучении медицинских и фармацевтических работников. Работаем в соответствии с Федеральным законом № 273-ФЗ и Приказом Минздрава № 709н.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10 font-golos">
                Помогаем врачам, медсёстрам, фельдшерам и фармацевтам пройти периодическую аккредитацию, повысить квалификацию и освоить новую специальность — дистанционно, без отрыва от работы.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Shield", text: "Лицензия Министерства образования" },
                  { icon: "FileCheck", text: "Документы в ФИС ФРДО" },
                  { icon: "Wifi", text: "Дистанционное обучение 24/7" },
                  { icon: "Wallet", text: "Рассрочка без процентов" },
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
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/20" />
              <img src={CERT_IMAGE} alt="Документы об образовании" className="relative z-10 w-full object-cover shadow-2xl" style={{ height: '460px' }} />
              <div className="absolute bottom-8 -right-6 z-20 bg-dark text-white p-5 shadow-xl border-l-2 border-gold">
                <div className="font-cormorant text-4xl font-semibold text-gold">25K+</div>
                <div className="text-xs text-white/55 mt-1 font-golos">обученных<br />медработников</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── УСЛУГИ ── */}
      <section id="services" className="py-24 section-dark">
        <div ref={servicesSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${servicesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Форматы обучения</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">Наши услуги</h2>
            <div className="gold-line mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div key={i} className="card-hover relative bg-white/5 border border-white/10 p-7 group cursor-pointer">
                {service.tag && (
                  <span className="absolute top-4 right-4 bg-gold text-white text-[10px] px-2 py-0.5 font-golos uppercase tracking-wide">{service.tag}</span>
                )}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/25 transition-colors">
                    <Icon name={service.icon} size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-cormorant text-lg text-white font-medium leading-snug">{service.title}</h3>
                    <span className="text-gold/70 text-[10px] font-golos tracking-wide">{service.badge}</span>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-5 font-golos">{service.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-gold font-golos font-semibold text-sm">{service.price}</span>
                  <a href="#contacts" className="text-white/30 hover:text-gold transition-colors group-hover:text-gold text-xs font-golos flex items-center gap-1">
                    Записаться <Icon name="ArrowRight" size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── КАТАЛОГ ПРОГРАММ ── */}
      <section id="catalog" className="py-24 bg-background">
        <div ref={catalogSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${catalogSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Более 600 программ</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light">Каталог программ ДПО</h2>
            <div className="gold-line mx-auto mt-6" />
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto font-golos text-sm">
              Выберите специальность — подберём программу повышения квалификации или переподготовки
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {catalog.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-golos border transition-all duration-200 ${activeCategory === i
                  ? 'bg-gold text-white border-gold'
                  : 'border-border text-foreground/55 hover:border-gold hover:text-gold'}`}>
                <Icon name={cat.icon} size={14} />
                <span className="hidden sm:inline">{cat.category}</span>
                <span className="sm:hidden">{cat.category.split("—")[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {catalog[activeCategory].items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border border-border hover:border-gold/40 transition-colors group card-hover bg-card">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                <span className="font-golos text-sm text-foreground/80 group-hover:text-foreground transition-colors flex-1">{item.name}</span>
                <span className={`text-[10px] px-2 py-0.5 border font-golos flex-shrink-0 ${
                  item.type === "Переподготовка"
                    ? "border-blue-400/40 text-blue-500 bg-blue-500/8"
                    : item.type === "Аккр." || item.type === "НМО" || item.type === "НФО"
                    ? "border-green-400/40 text-green-600 bg-green-500/8"
                    : "border-gold/40 text-gold bg-gold/8"
                }`}>{item.type}</span>
                <span className="text-muted-foreground text-xs font-golos flex-shrink-0">{item.hours}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllPrograms(true)}
              className="border border-gold text-gold px-8 py-3 font-golos text-sm hover:bg-gold hover:text-white transition-all duration-300">
              Все программы обучения
            </button>
          </div>

          {/* MODAL */}
          {showAllPrograms && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/85 backdrop-blur-sm" onClick={() => setShowAllPrograms(false)}>
              <div className="bg-background border border-border w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-8 py-5 border-b border-border sticky top-0 bg-background z-10">
                  <div>
                    <h3 className="font-cormorant text-2xl text-foreground font-light">Все программы ДПО</h3>
                    <p className="text-muted-foreground text-xs font-golos mt-0.5">6 направлений · более 600 программ · для врачей, медсестёр, фармацевтов</p>
                  </div>
                  <button onClick={() => setShowAllPrograms(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="p-8 grid md:grid-cols-2 gap-8">
                  {catalog.map((cat, ci) => (
                    <div key={ci}>
                      <div className="flex items-center gap-3 mb-4">
                        <Icon name={cat.icon} size={16} className="text-gold" />
                        <h4 className="font-cormorant text-lg text-foreground font-medium">{cat.category}</h4>
                      </div>
                      <div className="space-y-1.5">
                        {cat.items.map((item, ii) => (
                          <div key={ii} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0 group cursor-pointer hover:pl-1 transition-all duration-150">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold flex-shrink-0 transition-colors" />
                            <span className="font-golos text-sm text-foreground/70 group-hover:text-foreground transition-colors flex-1">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground font-golos">{item.hours}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 border font-golos ${
                              item.type === "Переподготовка"
                                ? "border-blue-400/40 text-blue-500"
                                : "border-gold/40 text-gold"
                            }`}>{item.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-8 py-5 border-t border-border bg-muted/20 flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-golos">Не нашли нужную специальность?</p>
                  <a href="#contacts" onClick={() => setShowAllPrograms(false)}
                    className="bg-gold text-white px-6 py-2.5 text-sm font-golos hover:bg-gold-light transition-colors">
                    Запросить программу
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── КАК ЭТО РАБОТАЕТ ── */}
      <section className="py-20 section-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src={TEAM_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark/85" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Просто и удобно</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">Как проходит обучение</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: "01", icon: "MousePointerClick", title: "Выбираете программу", desc: "Подбираем программу под вашу специальность и цель обучения" },
              { step: "02", icon: "CreditCard", title: "Оформляете заявку", desc: "Заполняете анкету, вносите оплату или оформляете рассрочку" },
              { step: "03", icon: "Monitor", title: "Проходите обучение", desc: "Учитесь онлайн в удобное время — видеолекции, тесты, материалы" },
              { step: "04", icon: "Award", title: "Получаете документ", desc: "Удостоверение или диплом с внесением в ФИС ФРДО" },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-5">
                  <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center mx-auto group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                    <Icon name={item.icon} size={22} className="text-gold" />
                  </div>
                  <span className="absolute -top-2 -right-1 font-cormorant text-gold/25 text-3xl font-semibold leading-none" style={{ left: "calc(50% + 14px)" }}>{item.step}</span>
                </div>
                <h3 className="font-cormorant text-lg text-white font-medium mb-2">{item.title}</h3>
                <p className="text-white/45 text-xs font-golos leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЦЕНЫ ── */}
      <section id="prices" className="py-24 bg-background">
        <div ref={pricesSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${pricesSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Стоимость обучения</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light">Программы и цены</h2>
            <div className="gold-line mx-auto mt-6" />
            <p className="text-muted-foreground mt-4 text-sm font-golos">Рассрочка без процентов · Счёт для юрлиц · Налоговый вычет 13%</p>
          </div>
          <div className="grid md:grid-cols-3 gap-7 max-w-5xl mx-auto">
            {prices.map((plan, i) => (
              <div key={i} className={`card-hover relative p-8 border-2 ${plan.highlight ? 'border-gold bg-dark text-white shadow-2xl shadow-gold/15' : 'border-border bg-card'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-white text-[10px] px-4 py-1 font-golos font-medium uppercase tracking-wider">Популярно</span>
                  </div>
                )}
                <div className={`text-[10px] tracking-[0.25em] uppercase mb-2 font-golos ${plan.highlight ? 'text-gold' : 'text-muted-foreground'}`}>{plan.name}</div>
                <div className={`font-cormorant text-4xl font-semibold mb-1 ${plan.highlight ? 'text-white' : 'text-foreground'}`}>{plan.price}</div>
                <div className={`text-xs mb-8 font-golos ${plan.highlight ? 'text-white/45' : 'text-muted-foreground'}`}>{plan.period}</div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Icon name="Check" size={13} className="text-gold flex-shrink-0 mt-0.5" />
                      <span className={`text-sm font-golos leading-snug ${plan.highlight ? 'text-white/75' : 'text-foreground/65'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#contacts"
                  className={`block w-full py-3 text-sm font-golos font-medium text-center transition-all duration-300 ${plan.highlight
                    ? 'bg-gold text-white hover:bg-gold-light'
                    : 'border border-gold text-gold hover:bg-gold hover:text-white'}`}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 section-dark">
        <div ref={faqSection.ref} className={`container mx-auto px-4 max-w-3xl transition-all duration-700 ${faqSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Вопросы и ответы</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">Часто спрашивают</h2>
            <div className="gold-line mx-auto mt-6" />
          </div>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div key={i} className="border border-white/10 bg-white/3 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left group">
                  <span className="font-golos text-white/85 text-sm group-hover:text-white transition-colors pr-4">{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-gold flex-shrink-0" />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-white/10">
                    <p className="text-white/55 text-sm font-golos leading-relaxed pt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── КОНТАКТЫ ── */}
      <section id="contacts" className="py-24 bg-background">
        <div ref={contactSection.ref} className={`container mx-auto px-4 transition-all duration-700 ${contactSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Записаться на обучение</p>
              <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light mb-6">
                Подберём программу<br />и ответим на вопросы
              </h2>
              <div className="gold-line mb-8" />
              <div className="space-y-5 mb-8">
                {[
                  { icon: "Phone", label: "Телефон", value: "8 800 123-45-67", sub: "Бесплатно по России, Пн–Пт 8:00–20:00" },
                  { icon: "Mail", label: "E-mail", value: "info@gildiya-prof.ru", sub: "Ответим в течение 2 часов" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Тверская, 1", sub: "Документы также отправляем по почте" },
                ].map((contact, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={contact.icon} size={15} className="text-gold" />
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs font-golos mb-0.5">{contact.label}</div>
                      <div className="text-foreground font-golos font-medium text-sm">{contact.value}</div>
                      <div className="text-muted-foreground text-xs font-golos mt-0.5">{contact.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "FileCheck", text: "Документы в ФИС ФРДО" },
                  { icon: "BadgeCheck", text: "Лицензия Минобрнауки" },
                  { icon: "Clock", text: "Документ от 5 дней" },
                  { icon: "Wallet", text: "Рассрочка 0%" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 border border-border bg-card">
                    <Icon name={b.icon} size={14} className="text-gold flex-shrink-0" />
                    <span className="text-xs font-golos text-foreground/65">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark border border-white/10 p-8">
              <h3 className="font-cormorant text-2xl text-white mb-2">Оставить заявку</h3>
              <p className="text-white/40 text-xs font-golos mb-6">Перезвоним в течение 15 минут и подберём программу</p>
              <div className="space-y-4">
                <div>
                  <label className="text-white/45 text-xs font-golos tracking-wide block mb-2">Ваше имя</label>
                  <input type="text" placeholder="Иван Иванов" className="w-full bg-white/5 border border-white/15 text-white placeholder-white/20 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-white/45 text-xs font-golos tracking-wide block mb-2">Телефон</label>
                  <input type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-white/5 border border-white/15 text-white placeholder-white/20 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-white/45 text-xs font-golos tracking-wide block mb-2">Специальность</label>
                  <input type="text" placeholder="Терапия, педиатрия, хирургия..." className="w-full bg-white/5 border border-white/15 text-white placeholder-white/20 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-white/45 text-xs font-golos tracking-wide block mb-2">Цель обучения</label>
                  <select className="w-full bg-dark/80 border border-white/15 text-white/70 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors">
                    <option>Периодическая аккредитация (НМО/НФО)</option>
                    <option>Повышение квалификации (удостоверение)</option>
                    <option>Профессиональная переподготовка (диплом)</option>
                    <option>Набор баллов НМО</option>
                    <option>Корпоративное обучение для организации</option>
                    <option>Не знаю — нужна консультация</option>
                  </select>
                </div>
                <button className="w-full bg-gold text-white py-4 font-golos font-medium text-sm tracking-wide hover:bg-gold-light transition-colors">
                  Записаться на обучение
                </button>
                <p className="text-white/20 text-xs font-golos text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-dark border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center">
                <span className="text-white font-cormorant font-bold text-xs">ГП</span>
              </div>
              <div>
                <span className="font-cormorant text-white text-base">Гильдия Профессионалов</span>
                <span className="text-gold/60 text-[10px] font-golos ml-2">Медицинское ДПО</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
              {navLinks.map(link => (
                <a key={link.href} href={link.href} className="text-white/35 hover:text-gold text-xs font-golos tracking-wide transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-white/20 text-xs font-golos">© 2024 · Лицензия Минобрнауки РФ</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
