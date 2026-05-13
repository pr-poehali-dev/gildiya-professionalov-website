import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/4f5281a3-b777-4e02-8c7a-090c78e3adc7.jpg";
const CERT_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/377948e8-849f-49f1-912e-daa725f284e9.jpg";
const TEAM_IMAGE = "https://cdn.poehali.dev/projects/258a709f-23c7-42b6-8352-6f3b2496d570/files/d67125a7-0ddc-4d51-afb3-3999ee1a5330.jpg";

const services = [
  { icon: "GraduationCap", title: "Профессиональная переподготовка", desc: "Диплом о переподготовке установленного образца. Даёт право вести деятельность в новой сфере. Срок обучения от 250 часов.", price: "от 12 000 ₽", tag: "Популярно" },
  { icon: "TrendingUp", title: "Повышение квалификации", desc: "Удостоверение о повышении квалификации. Обновление знаний и компетенций по профилю. Срок от 16 часов.", price: "от 4 500 ₽", tag: "Быстро" },
  { icon: "BookOpen", title: "Профессиональное обучение", desc: "Свидетельство о профессии рабочего или должности служащего. Для получения первичных навыков.", price: "от 6 000 ₽", tag: null },
  { icon: "Building2", title: "Корпоративное ДПО", desc: "Обучение сотрудников компании по индивидуальной программе. Выезд преподавателя, дистанционный формат.", price: "от 35 000 ₽", tag: null },
  { icon: "Award", title: "Независимая оценка квалификации", desc: "Свидетельство о квалификации НОК. Официальное подтверждение соответствия профессиональному стандарту.", price: "от 8 000 ₽", tag: null },
  { icon: "Monitor", title: "Дистанционное обучение", desc: "Все программы доступны онлайн. Учитесь в удобное время, сдавайте итоговый тест и получайте документ.", price: "от 3 500 ₽", tag: "Онлайн" },
];

const stats = [
  { value: "12+", label: "лет на рынке ДПО" },
  { value: "15 000+", label: "выданных документов об образовании" },
  { value: "500+", label: "программ обучения" },
  { value: "98%", label: "слушателей рекомендуют нас" },
];

const catalog = [
  {
    category: "Переподготовка (от 250 ч.)",
    items: [
      "Управление персоналом и HR",
      "Бухгалтерский учёт и налогообложение",
      "Педагогика и образование",
      "Охрана труда и промышленная безопасность",
      "Государственное и муниципальное управление",
      "Менеджмент в здравоохранении",
      "Психология и консультирование",
      "Строительство и экспертиза",
    ]
  },
  {
    category: "Повышение квалификации (от 16 ч.)",
    items: [
      "Охрана труда (40 / 72 часа)",
      "Пожарно-технический минимум",
      "Первая помощь пострадавшим",
      "Закупки по 44-ФЗ и 223-ФЗ",
      "Педагог дополнительного образования",
      "Использование ИИ в профессии",
      "Цифровая грамотность руководителя",
      "Управление проектами (PMBOK / Agile)",
    ]
  },
  {
    category: "Профессиональное обучение",
    items: [
      "Оператор котельной",
      "Водитель погрузчика / автокрана",
      "Сварщик",
      "Стропальщик",
      "Специалист по работе с персоналом",
      "Кассир торгового зала",
      "Делопроизводитель",
      "Оператор ПК и офисных программ",
    ]
  },
  {
    category: "Охрана труда и безопасность",
    items: [
      "Руководители и специалисты (обяз. 40 ч.)",
      "Члены комиссий по проверке знаний",
      "Работа на высоте (гр. 1, 2, 3)",
      "Электробезопасность (гр. II–V)",
      "Промышленная безопасность (А1–Е1)",
      "Пожарная безопасность",
      "Оказание первой помощи",
      "Экологическая безопасность",
    ]
  },
  {
    category: "Государственное управление",
    items: [
      "Государственные и муниципальные закупки",
      "Антикоррупционное законодательство",
      "Документооборот и делопроизводство",
      "Бюджетный учёт и отчётность",
      "Цифровое государственное управление",
      "Работа с обращениями граждан",
      "Правовое обеспечение деятельности",
      "Контрольно-надзорная деятельность",
    ]
  },
  {
    category: "Педагогика и образование",
    items: [
      "Педагог дополнительного образования",
      "Тьютор в системе образования",
      "Инклюзивное образование",
      "Логопед-дефектолог",
      "Педагог-психолог",
      "Методист образовательной организации",
      "Воспитатель детского сада",
      "Преподаватель высшей школы",
    ]
  },
];

const prices = [
  {
    name: "Повышение квалификации",
    price: "от 4 500 ₽",
    period: "от 16 до 144 часов",
    highlight: false,
    features: [
      "Удостоверение о повышении квалификации",
      "Онлайн-обучение в удобное время",
      "Доступ к материалам 6 месяцев",
      "Итоговое тестирование",
      "Документ в течение 5 рабочих дней",
    ],
    cta: "Записаться",
  },
  {
    name: "Профпереподготовка",
    price: "от 12 000 ₽",
    period: "от 250 часов",
    highlight: true,
    features: [
      "Диплом о профессиональной переподготовке",
      "Право на новый вид деятельности",
      "Очный, заочный или онлайн-формат",
      "Персональный куратор на весь курс",
      "Рассрочка без переплат",
      "Документ вносится в ФИС ФРДО",
    ],
    cta: "Получить программу",
  },
  {
    name: "Корпоративное обучение",
    price: "Индивидуально",
    period: "от 10 сотрудников",
    highlight: false,
    features: [
      "Обучение всей команды под ключ",
      "Разработка программы под компанию",
      "Выезд преподавателя в офис",
      "Закрывающие документы для бухгалтерии",
      "Корпоративный личный кабинет",
      "Рассрочка и счёт для юрлиц",
    ],
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
              Лицензированное дополнительное профессиональное образование
            </p>
            <h1 className="font-cormorant text-5xl md:text-7xl text-white font-light leading-[1.1] mb-6">
              Учитесь. Растите.<br />
              <em className="gold-gradient-text not-italic font-medium">Подтверждайте.</em>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10 font-golos font-light">
              Профессиональная переподготовка, повышение квалификации и профессиональное обучение с выдачей документов государственного образца
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalog" className="inline-flex items-center justify-center gap-2 bg-gold text-white px-8 py-4 font-golos font-medium text-sm tracking-wide hover:bg-gold-light transition-all duration-300 hover:shadow-lg hover:shadow-gold/30">
                Выбрать программу
                <Icon name="ArrowRight" size={16} />
              </a>
              <a href="#contacts" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 font-golos font-medium text-sm tracking-wide hover:border-gold hover:text-gold transition-all duration-300">
                Бесплатная консультация
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
                Более 12 лет<br />в сфере<br />
                <em className="not-italic font-medium text-gold">дополнительного образования</em>
              </h2>
              <div className="gold-line mb-8" />
              <p className="text-muted-foreground leading-relaxed mb-6 font-golos">
                Гильдия Профессионалов — лицензированный образовательный центр ДПО. Реализуем программы профессиональной переподготовки, повышения квалификации и профессионального обучения в соответствии с Федеральным законом № 273-ФЗ «Об образовании в РФ».
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10 font-golos">
                Все документы об образовании вносятся в ФИС ФРДО и имеют юридическую силу. Обучение доступно очно, заочно и дистанционно — выбирайте удобный формат.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "Shield", text: "Лицензия Министерства образования РФ" },
                  { icon: "Award", text: "Документы вносятся в реестр ФИС ФРДО" },
                  { icon: "Clock", text: "Документ об образовании от 5 рабочих дней" },
                  { icon: "HeartHandshake", text: "Рассрочка без переплат для физлиц и юрлиц" },
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
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Форматы обучения</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light">Программы ДПО</h2>
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
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Выберите направление</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light">Каталог программ ДПО</h2>
            <div className="gold-line mx-auto mt-6" />
            <p className="text-muted-foreground mt-6 max-w-lg mx-auto font-golos">Более 500 программ в 6 направлениях — переподготовка, повышение квалификации и профобучение</p>
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
              Посмотреть все программы
            </button>
          </div>

          {/* MODAL: все специальности */}
          {showAllSpecialties && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm" onClick={() => setShowAllSpecialties(false)}>
              <div className="bg-background border border-border w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-8 py-6 border-b border-border sticky top-0 bg-background z-10">
                  <div>
                    <h3 className="font-cormorant text-2xl text-foreground font-light">Все программы ДПО</h3>
                    <p className="text-muted-foreground text-xs font-golos mt-0.5">6 направлений · более 500 программ</p>
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
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Почему выбирают нас</p>
          <h2 className="font-cormorant text-4xl md:text-5xl text-white font-light mb-16">Наши преимущества</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "BadgeCheck", title: "Лицензия Минобрнауки", desc: "Документы об образовании имеют юридическую силу и вносятся в ФИС ФРДО" },
              { icon: "Zap", title: "Документ от 5 дней", desc: "Быстрое оформление — от обращения до получения удостоверения" },
              { icon: "Globe", title: "Онлайн и офлайн", desc: "Очный, заочный и дистанционный формат — выбирайте удобный" },
              { icon: "Wallet", title: "Рассрочка без процентов", desc: "Оплата частями для физлиц. Выставление счёта для организаций" },
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
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4 font-golos">Стоимость обучения</p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-foreground font-light">Программы и цены</h2>
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
                Подберём программу<br />под ваши задачи
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
              <h3 className="font-cormorant text-2xl text-white mb-6">Записаться на обучение</h3>
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
                  <label className="text-white/50 text-xs font-golos tracking-wide block mb-2">Программа обучения</label>
                  <select className="w-full bg-dark border border-white/15 text-white/70 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors">
                    <option>Профессиональная переподготовка</option>
                    <option>Повышение квалификации</option>
                    <option>Профессиональное обучение</option>
                    <option>Корпоративное ДПО (для организации)</option>
                    <option>Независимая оценка квалификации (НОК)</option>
                    <option>Не знаю — нужна консультация</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-golos tracking-wide block mb-2">Нужная специальность / направление</label>
                  <textarea rows={2} placeholder="Например: охрана труда, бухгалтерский учёт, педагогика..." className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 text-sm font-golos focus:outline-none focus:border-gold transition-colors resize-none" />
                </div>
                <button className="w-full bg-gold text-white py-4 font-golos font-medium text-sm tracking-wide hover:bg-gold-light transition-colors">
                  Записаться на обучение
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