import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import Image from "next/image";
import { createServerClient } from "@/supabase/server";

// Translations for Features UI strings by language code
const translations: Record<string, {
  features: Array<{
    title: string;
    description: string;
    altText: string;
  }>;
}> = {
  en: {
    features: [
      {
        title: "Instant Game Creation",
        description: "Zerlo harnesses AI to generate fully functional games in seconds, turning your ideas into playable experiences with unmatched speed.",
        altText: "Instant Game Creation",
      },
      {
        title: "Customizable Game Templates",
        description: "Choose from a variety of pre-designed templates to kickstart your game development, tailoring every detail to match your vision.",
        altText: "Customizable Game Templates",
      },
      {
        title: "AI-Driven Design Assistance",
        description: "Our intelligent AI suggests assets, mechanics, and visuals, streamlining the creative process for developers of all skill levels.",
        altText: "AI-Driven Design Assistance",
      },
      {
        title: "Cross-Platform Compatibility",
        description: "Build games that run seamlessly on web, mobile, and desktop, ensuring your creations reach players on any device.",
        altText: "Cross-Platform Compatibility",
      },
      {
        title: "Real-Time Collaboration",
        description: "Work with your team in real-time to refine game elements, share ideas, and iterate quickly within Zerlo’s collaborative environment.",
        altText: "Real-Time Collaboration",
      },
      {
        title: "Instant Prototyping",
        description: "Test your game concepts instantly with Zerlo’s prototyping tools, allowing you to iterate and refine without delays.",
        altText: "Instant Prototyping",
      },
      {
        title: "Dynamic Asset Generation",
        description: "Zerlo’s AI creates custom sprites, backgrounds, and sound effects on-demand, tailored to your game’s unique style and theme.",
        altText: "Dynamic Asset Generation",
      },
      {
        title: "Intuitive Visual Editor",
        description: "Drag-and-drop interface lets you design levels and mechanics effortlessly, no coding experience required.",
        altText: "Intuitive Visual Editor",
      },
      {
        title: "Automated Bug Testing",
        description: "Zerlo’s AI scans your game for bugs and performance issues, ensuring a polished experience before launch.",
        altText: "Automated Bug Testing",
      },
      {
        title: "One-Click Publishing",
        description: "Share your finished games instantly to the Zerlo platform or export them for distribution with a single click.",
        altText: "One-Click Publishing",
      },
      {
        title: "Community Feedback Integration",
        description: "Gather player feedback directly through Zerlo’s platform to iterate and improve your games based on real user insights.",
        altText: "Community Feedback Integration",
      },
      {
        title: "Scalable Game Logic",
        description: "Zerlo’s AI adapts game logic to support simple prototypes or complex systems, scaling with your project’s ambition.",
        altText: "Scalable Game Logic",
      },
      {
        title: "Multiplayer Support",
        description: "Easily integrate multiplayer features, enabling competitive or cooperative gameplay with minimal setup.",
        altText: "Multiplayer Support",
      },
      {
        title: "Analytics Dashboard",
        description: "Track player engagement and performance metrics through Zerlo’s built-in analytics to optimize your game’s success.",
        altText: "Analytics Dashboard",
      },
    ],
  },
  fr: {
    features: [
      {
        title: "Création instantanée de jeux",
        description: "Zerlo utilise l'IA pour générer des jeux entièrement fonctionnels en quelques secondes, transformant vos idées en expériences jouables avec une rapidité inégalée.",
        altText: "Création instantanée de jeux",
      },
      {
        title: "Modèles de jeux personnalisables",
        description: "Choisissez parmi une variété de modèles prédéfinis pour démarrer votre développement de jeu, en personnalisant chaque détail selon votre vision.",
        altText: "Modèles de jeux personnalisables",
      },
      {
        title: "Assistance à la conception par IA",
        description: "Notre IA intelligente suggère des actifs, des mécaniques et des visuels, simplifiant le processus créatif pour les développeurs de tous niveaux.",
        altText: "Assistance à la conception par IA",
      },
      {
        title: "Compatibilité multiplateforme",
        description: "Créez des jeux qui fonctionnent parfaitement sur le web, mobile et ordinateur, garantissant que vos créations atteignent les joueurs sur n'importe quel appareil.",
        altText: "Compatibilité multiplateforme",
      },
      {
        title: "Collaboration en temps réel",
        description: "Travaillez avec votre équipe en temps réel pour affiner les éléments du jeu, partager des idées et itérer rapidement dans l'environnement collaboratif de Zerlo.",
        altText: "Collaboration en temps réel",
      },
      {
        title: "Prototypage instantané",
        description: "Testez vos concepts de jeu instantanément avec les outils de prototypage de Zerlo, permettant d'itérer et d'affiner sans délais.",
        altText: "Prototypage instantané",
      },
      {
        title: "Génération dynamique d'actifs",
        description: "L'IA de Zerlo crée des sprites, des arrière-plans et des effets sonores personnalisés à la demande, adaptés au style et au thème uniques de votre jeu.",
        altText: "Génération dynamique d'actifs",
      },
      {
        title: "Éditeur visuel intuitif",
        description: "L'interface par glisser-déposer vous permet de concevoir des niveaux et des mécaniques sans effort, sans expérience de codage requise.",
        altText: "Éditeur visuel intuitif",
      },
      {
        title: "Test de bugs automatisé",
        description: "L'IA de Zerlo analyse votre jeu pour détecter les bugs et les problèmes de performance, garantissant une expérience soignée avant le lancement.",
        altText: "Test de bugs automatisé",
      },
      {
        title: "Publication en un clic",
        description: "Partagez vos jeux terminés instantanément sur la plateforme Zerlo ou exportez-les pour distribution en un seul clic.",
        altText: "Publication en un clic",
      },
      {
        title: "Intégration des retours communautaires",
        description: "Collectez les retours des joueurs directement via la plateforme Zerlo pour itérer et améliorer vos jeux en fonction des insights réels des utilisateurs.",
        altText: "Intégration des retours communautaires",
      },
      {
        title: "Logique de jeu évolutive",
        description: "L'IA de Zerlo adapte la logique de jeu pour prendre en charge des prototypes simples ou des systèmes complexes, évoluant avec l'ambition de votre projet.",
        altText: "Logique de jeu évolutive",
      },
      {
        title: "Support multijoueur",
        description: "Intégrez facilement des fonctionnalités multijoueurs, permettant un gameplay compétitif ou coopératif avec un minimum de configuration.",
        altText: "Support multijoueur",
      },
      {
        title: "Tableau de bord analytique",
        description: "Suivez l'engagement des joueurs et les métriques de performance grâce aux analyses intégrées de Zerlo pour optimiser le succès de votre jeu.",
        altText: "Tableau de bord analytique",
      },
    ],
  },
  he: {
    features: [
      {
        title: "יצירת משחקים מיידית",
        description: "זרלו מנצלת AI כדי ליצור משחקים פונקציונליים לחלוטין תוך שניות, והופכת את הרעיונות שלך לחוויות משחקיות במהירות ללא תחרות.",
        altText: "יצירת משחקים מיידית",
      },
      {
        title: "תבניות משחקים הניתנות להתאמה אישית",
        description: "בחר מתוך מגוון תבניות מעוצבות מראש כדי להתחיל את פיתוח המשחק שלך, תוך התאמה של כל פרט לוויז'ן שלך.",
        altText: "תבניות משחקים הניתנות להתאמה אישית",
      },
      {
        title: "סיוע בעיצוב מונחה AI",
        description: "ה-AI החכם שלנו מציע נכסים, מכניקות וויזואליות, ומפשט את תהליך היצירה למפתחים בכל רמות המיומנות.",
        altText: "סיוע בעיצוב מונחה AI",
      },
      {
        title: "תאימות בין-פלטפורמית",
        description: "בנה משחקים שפועלים בצורה חלקה באינטרנט, במובייל ובשולחן עבודה, ומבטיחים שהיצירות שלך יגיעו לשחקנים בכל מכשיר.",
        altText: "תאימות בין-פלטפורמית",
      },
      {
        title: "שיתוף פעולה בזמן אמת",
        description: "עבוד עם הצוות שלך בזמן אמת כדי לחדד אלמנטים של המשחק, לשתף רעיונות ולבצע איטרציות מהירות בסביבה השיתופית של זרלו.",
        altText: "שיתוף פעולה בזמן אמת",
      },
      {
        title: "יצירת אבטיפוס מיידית",
        description: "בדוק את קונספטים של משחקים באופן מיידי עם כלי יצירת האבטיפוס של זרלו, המאפשרים איטרציה וחידוד ללא עיכובים.",
        altText: "יצירת אבטיפוס מיידית",
      },
      {
        title: "יצירת נכסים דינמית",
        description: "ה-AI של זרלו יוצר ספרייטים, רקעים ואפקטים קוליים מותאמים אישית לפי דרישה, המותאמים לסגנון ולנושא הייחודיים של המשחק שלך.",
        altText: "יצירת נכסים דינמית",
      },
      {
        title: "עורך ויזואלי אינטואיטיבי",
        description: "ממשק גרירה ושחרור מאפשר לך לעצב רמות ומכניקות בקלות, ללא צורך בניסיון בקידוד.",
        altText: "עורך ויזואלי אינטואיטיבי",
      },
      {
        title: "בדיקת באגים אוטומטית",
        description: "ה-AI של זרלו סורק את המשחק שלך לאיתור באגים ובעיות ביצועים, ומבטיח חוויה מלוטשת לפני ההשקה.",
        altText: "בדיקת באגים אוטומטית",
      },
      {
        title: "פרסום בלחיצה אחת",
        description: "שתף את המשחקים המוגמרים שלך באופן מיידי לפלטפורמת זרלו או ייצא אותם להפצה בלחיצה אחת.",
        altText: "פרסום בלחיצה אחת",
      },
      {
        title: "שילוב משוב קהילתי",
        description: "אסוף משוב משחקנים ישירות דרך הפלטפורמה של זרלו כדי לשפר ולחדד את המשחקים שלך על בסיס תובנות ממשיות של משתמשים.",
        altText: "שילוב משוב קהילתי",
      },
      {
        title: "לוגיקת משחק ניתנת להרחבה",
        description: "ה-AI של זרלו מתאים את לוגיקת המשחק לתמיכה באבטיפוסים פשוטים או במערכות מורכבות, תוך התאמה לשאיפות הפרויקט שלך.",
        altText: "לוגיקת משחק ניתנת להרחבה",
      },
      {
        title: "תמיכה בריבוי משתתפים",
        description: "שלב בקלות תכונות ריבוי משתתפים, המאפשרות משחק תחרותי או שיתופי עם הגדרה מינימלית.",
        altText: "תמיכה בריבוי משתתפים",
      },
      {
        title: "לוח ניתוח נתונים",
        description: "עקוב אחר מעורבות השחקנים ומדדי ביצועים דרך הניתוחים המובנים של זרלו כדי לייעל את הצלחת המשחק שלך.",
        altText: "לוח ניתוח נתונים",
      },
    ],
  },
  zh: {
    features: [
      {
        title: "即时游戏创建",
        description: "Zerlo 利用 AI 在几秒钟内生成完全功能的游戏，将您的创意转变为可玩的体验，速度无与伦比。",
        altText: "即时游戏创建",
      },
      {
        title: "可定制游戏模板",
        description: "从多种预设计模板中选择，以启动您的游戏开发，定制每一个细节以匹配您的愿景。",
        altText: "可定制游戏模板",
      },
      {
        title: "AI驱动的设计辅助",
        description: "我们的智能 AI 建议资产、机制和视觉效果，简化了所有技能水平开发者的创作过程。",
        altText: "AI驱动的设计辅助",
      },
      {
        title: "跨平台兼容性",
        description: "构建在网络、移动设备和桌面设备上无缝运行的游戏，确保您的创作能在任何设备上触达玩家。",
        altText: "跨平台兼容性",
      },
      {
        title: "实时协作",
        description: "与您的团队实时协作，完善游戏元素，分享创意，并在 Zerlo 的协作环境中快速迭代。",
        altText: "实时协作",
      },
      {
        title: "即时原型设计",
        description: "使用 Zerlo 的原型工具即时测试您的游戏概念，允许您在无延迟的情况下迭代和优化。",
        altText: "即时原型设计",
      },
      {
        title: "动态资产生成",
        description: "Zerlo 的 AI 根据需求创建定制的精灵、背景和音效，适应您游戏的独特风格和主题。",
        altText: "动态资产生成",
      },
      {
        title: "直观视觉编辑器",
        description: "拖放界面让您轻松设计关卡和机制，无需编码经验。",
        altText: "直观视觉编辑器",
      },
      {
        title: "自动化错误测试",
        description: "Zerlo 的 AI 扫描您的游戏以发现错误和性能问题，确保在发布前获得精致的体验。",
        altText: "自动化错误测试",
      },
      {
        title: "一键发布",
        description: "即时将完成的游戏分享到 Zerlo 平台，或通过一键导出进行分发。",
        altText: "一键发布",
      },
      {
        title: "社区反馈整合",
        description: "通过 Zerlo 的平台直接收集玩家反馈，根据真实用户洞察迭代和改进您的游戏。",
        altText: "社区反馈整合",
      },
      {
        title: "可扩展的游戏逻辑",
        description: "Zerlo 的 AI 调整游戏逻辑以支持简单原型或复杂系统，随您的项目目标扩展。",
        altText: "可扩展的游戏逻辑",
      },
      {
        title: "多人游戏支持",
        description: "轻松集成多人功能，支持竞争或合作游戏，最小化设置。",
        altText: "多人游戏支持",
      },
      {
        title: "分析仪表板",
        description: "通过 Zerlo 的内置分析跟踪玩家参与度和性能指标，以优化您的游戏成功。",
        altText: "分析仪表板",
      },
    ],
  },
  ar: {
    features: [
      {
        title: "إنشاء ألعاب فوري",
        description: "تستخدم زيرلو الذكاء الاصطناعي لإنشاء ألعاب كاملة الوظائف في ثوانٍ, محولة أفكارك إلى تجارب قابلة للعب بسرعة لا مثيل لها.",
        altText: "إنشاء ألعاب فوري",
      },
      {
        title: "قوالب ألعاب قابلة للتخصيص",
        description: "اختر من بين مجموعة متنوعة من القوالب المصممة مسبقًا لبدء تطوير لعبتك, مع تخصيص كل التفاصيل لتتناسب مع رؤيتك.",
        altText: "قوالب ألعاب قابلة للتخصيص",
      },
      {
        title: "مساعدة التصميم بمساعدة الذكاء الاصطناعي",
        description: "يقترح الذكاء الاصطناعي الذكي لدينا الأصول والميكانيكيات والصور البصرية, مما يبسط عملية الإبداع للمطورين من جميع مستويات المهارة.",
        altText: "مساعدة التصميم بمساعدة الذكاء الاصطناعي",
      },
      {
        title: "التوافق عبر المنصات",
        description: "ابنِ ألعابًا تعمل بسلاسة على الويب, الهاتف المحمول, وسطح المكتب, مما يضمن وصول إبداعاتك إلى اللاعبين على أي جهاز.",
        altText: "التوافق عبر المنصات",
      },
      {
        title: "التعاون في الوقت الحقيقي",
        description: "اعمل مع فريقك في الوقت الحقيقي لتحسين عناصر اللعبة, ومشاركة الأفكار, والتكرار بسرعة ضمن بيئة زيرلو التعاونية.",
        altText: "التعاون في الوقت الحقيقي",
      },
      {
        title: "النمذجة الفورية",
        description: "اختبر مفاهيم لعبتك على الفور باستخدام أدوات النمذجة في زيرلو, مما يتيح لك التكرار والتحسين دون تأخير.",
        altText: "النمذجة الفورية",
      },
      {
        title: "توليد الأصول الديناميكية",
        description: "يخلق الذكاء الاصطناعي في زيرلو سبرايتات وخلفيات ومؤثرات صوتية مخصصة عند الطلب, مصممة حسب أسلوب وموضوع لعبتك الفريد.",
        altText: "توليد الأصول الديناميكية",
      },
      {
        title: "محرر بصري بديهي",
        description: "واجهة السحب والإفلات تتيح لك تصميم المستويات والميكانيكيات بسهولة, دون الحاجة إلى خبرة في البرمجة.",
        altText: "محرر بصري بديهي",
      },
      {
        title: "اختبار الأخطاء الآلي",
        description: "يفحص الذكاء الاصطناعي في زيرلو لعبتك بحثًا عن الأخطاء ومشكلات الأداء, مما يضمن تجربة مصقولة قبل الإطلاق.",
        altText: "اختبار الأخطاء الآلي",
      },
      {
        title: "النشر بنقرة واحدة",
        description: "شارك ألعابك المكتملة على الفور إلى منصة زيرلو أو قم بتصديرها للتوزيع بنقرة واحدة.",
        altText: "النشر بنقرة واحدة",
      },
      {
        title: "تكامل تعليقات المجتمع",
        description: "اجمع تعليقات اللاعبين مباشرة عبر منصة زيرلو لتكرار وتحسين ألعابك بناءً على رؤى المستخدمين الحقيقية.",
        altText: "تكامل تعليقات المجتمع",
      },
      {
        title: "منطق لعبة قابل للتوسع",
        description: "يعدل الذكاء الاصطناعي في زيرلو منطق اللعبة لدعم النماذج الأولية البسيطة أو الأنظمة المعقدة, متوسعًا مع طموح مشروعك.",
        altText: "منطق لعبة قابل للتوسع",
      },
      {
        title: "دعم متعدد اللاعبين",
        description: "قم بدمج ميزات متعددة اللاعبين بسهولة, مما يتيح اللعب التنافسي أو التعاوني بأقل قدر من الإعداد.",
        altText: "دعم متعدد اللاعبين",
      },
      {
        title: "لوحة تحليلات",
        description: "تتبع تفاعل اللاعبين ومقاييس الأداء من خلال التحليلات المدمجة في زيرلو لتحسين نجاح لعبتك.",
        altText: "لوحة تحليلات",
      },
    ],
  },
  ru: {
    features: [
      {
        title: "Мгновенное создание игр",
        description: "Zerlo использует ИИ для создания полностью функциональных игр за секунды, превращая ваши идеи в игровые впечатления с непревзойденной скоростью.",
        altText: "Мгновенное создание игр",
      },
      {
        title: "Настраиваемые шаблоны игр",
        description: "Выбирайте из множества готовых шаблонов для старта разработки игры, настраивая каждую деталь под ваше видение.",
        altText: "Настраиваемые шаблоны игр",
      },
      {
        title: "Помощь в дизайне на базе ИИ",
        description: "Наш интеллектуальный ИИ предлагает активы, механики и визуальные элементы, упрощая творческий процесс для разработчиков всех уровней.",
        altText: "Помощь в дизайне на базе ИИ",
      },
      {
        title: "Кроссплатформенная совместимость",
        description: "Создавайте игры, которые безупречно работают в Интернете, на мобильных устройствах и компьютерах, обеспечивая доступность ваших творений на любом устройстве.",
        altText: "Кроссплатформенная совместимость",
      },
      {
        title: "Совместная работа в реальном времени",
        description: "Работайте с вашей командой в реальном времени, чтобы уточнять элементы игры, делиться идеями и быстро итерировать в коллаборативной среде Zerlo.",
        altText: "Совместная работа в реальном времени",
      },
      {
        title: "Мгновенное прототипирование",
        description: "Тестируйте концепции игр мгновенно с помощью инструментов прототипирования Zerlo, позволяя итерировать и уточнять без задержек.",
        altText: "Мгновенное прототипирование",
      },
      {
        title: "Динамическая генерация активов",
        description: "ИИ Zerlo создает пользовательские спрайты, фоны и звуковые эффекты по запросу, адаптированные под уникальный стиль и тему вашей игры.",
        altText: "Динамическая генерация активов",
      },
      {
        title: "Интуитивно понятный визуальный редактор",
        description: "Интерфейс перетаскивания позволяет легко проектировать уровни и механики без необходимости в опыте программирования.",
        altText: "Интуитивно понятный визуальный редактор",
      },
      {
        title: "Автоматизированное тестирование ошибок",
        description: "ИИ Zerlo сканирует вашу игру на наличие ошибок и проблем производительности, обеспечивая отточенный опыт перед запуском.",
        altText: "Автоматизированное тестирование ошибок",
      },
      {
        title: "Публикация в один клик",
        description: "Делитесь готовыми играми мгновенно на платформе Zerlo или экспортируйте их для распространения одним кликом.",
        altText: "Публикация в один клик",
      },
      {
        title: "Интеграция отзывов сообщества",
        description: "Собирайте отзывы игроков напрямую через платформу Zerlo, чтобы итерировать и улучшать ваши игры на основе реальных пользовательских данных.",
        altText: "Интеграция отзывов сообщества",
      },
      {
        title: "Масштабируемая игровая логика",
        description: "ИИ Zerlo адаптирует игровую логику для поддержки простых прототипов или сложных систем, масштабируясь в зависимости от амбиций вашего проекта.",
        altText: "Масштабируемая игровая логика",
      },
      {
        title: "Поддержка многопользовательских игр",
        description: "Легко интегрируйте многопользовательские функции, позволяя проводить соревновательные или кооперативные игры с минимальной настройкой.",
        altText: "Поддержка многопользовательских игр",
      },
      {
        title: "Аналитическая панель",
        description: "Отслеживайте вовлеченность игроков и показатели производительности через встроенную аналитику Zerlo для оптимизации успеха вашей игры.",
        altText: "Аналитическая панель",
      },
    ],
  },
  hi: {
    features: [
      {
        title: "तत्काल गेम निर्माण",
        description: "ज़रलो AI का उपयोग करके सेकंडों में पूरी तरह कार्यात्मक गेम बनाता है, आपके विचारों को अद्वितीय गति के साथ खेलने योग्य अनुभवों में बदलता है।",
        altText: "तत्काल गेम निर्माण",
      },
      {
        title: "अनुकूलन योग्य गेम टेम्पलेट्स",
        description: "अपने गेम डेवलपमेंट को शुरू करने के लिए विभिन्न पूर्व-डिज़ाइन किए गए टेम्पलेट्स में से चुनें, प्रत्येक विवरण को अपनी दृष्टि के अनुरूप बनाएं।",
        altText: "अनुकूलन योग्य गेम टेम्पलेट्स",
      },
      {
        title: "AI-संचालित डिज़ाइन सहायता",
        description: "हमारा बुद्धिमान AI संपत्तियों, मैकेनिक्स और विज़ुअल्स का सुझाव देता है, जो सभी कौशल स्तरों के डेवलपर्स के लिए रचनात्मक प्रक्रिया को सरल बनाता है।",
        altText: "AI-संचालित डिज़ाइन सहायता",
      },
      {
        title: "क्रॉस-प्लेटफॉर्म संगतता",
        description: "ऐसे गेम बनाएं जो वेब, मोबाइल और डेस्कटॉप पर सहजता से चलें, यह सुनिश्चित करते हुए कि आपकी रचनाएँ किसी भी डिवाइस पर खिलाड़ियों तक पहुँचें।",
        altText: "क्रॉस-प्लेटफॉर्म संगतता",
      },
      {
        title: "वास्तविक समय सहयोग",
        description: "ज़रलो के सहयोगी वातावरण में अपनी टीम के साथ वास्तविक समय में काम करें ताकि गेम तत्वों को परिष्कृत करें, विचार साझा करें और तेजी से पुनरावृत्ति करें।",
        altText: "वास्तविक समय सहयोग",
      },
      {
        title: "तत्काल प्रोटोटाइपिंग",
        description: "ज़रलो के प्रोटोटाइपिंग टूल्स के साथ अपने गेम कॉन्सेप्ट्स को तुरंत टेस्ट करें, जिससे आप बिना देरी के पुनरावृत्ति और परिष्कृत कर सकें।",
        altText: "तत्काल प्रोटोटाइपिंग",
      },
      {
        title: "गतिशील संपत्ति निर्माण",
        description: "ज़रलो का AI आपके गेम के अद्वितीय शैली और थीम के अनुरूप मांग पर कस्टम स्प्राइट्स, बैकग्राउंड और ध्वनि प्रभाव बनाता है।",
        altText: "गतिशील संपत्ति निर्माण",
      },
      {
        title: "सहज दृश्य संपादक",
        description: "ड्रैग-एंड-ड्रॉप इंटरफेस आपको बिना कोडिंग अनुभव के स्तर और मैकेनिक्स डिज़ाइन करने की सुविधा देता है।",
        altText: "सहज दृश्य संपादक",
      },
      {
        title: "स्वचालित बग टेस्टिंग",
        description: "ज़रलो का AI आपके गेम को बग्स और प्रदर्शन समस्याओं के लिए स्कैन करता है, जिससे लॉन्च से पहले एक परिष्कृत अनुभव सुनिश्चित होता है।",
        altText: "स्वचालित बग टेस्टिंग",
      },
      {
        title: "एक-क्लिक प्रकाशन",
        description: "अपने पूर्ण गेम्स को ज़रलो प्लेटफॉर्म पर तुरंत साझा करें या एक क्लिक के साथ वितरण के लिए निर्यात करें।",
        altText: "एक-क्लिक प्रकाशन",
      },
      {
        title: "समुदाय प्रतिक्रिया एकीकरण",
        description: "ज़रलो के प्लेटफॉर्म के माध्यम से सीधे खिलाड़ियों की प्रतिक्रिया एकत्र करें ताकि वास्तविक उपयोगकर्ता अंतर्दृष्टि के आधार पर अपने गेम्स को बेहतर और पुनरावृत्ति करें।",
        altText: "समुदाय प्रतिक्रिया एकीकरण",
      },
      {
        title: "स्केलेबल गेम लॉजिक",
        description: "ज़रलो का AI गेम लॉजिक को सरल प्रोटोटाइप्स या जटिल सिस्टम्स का समर्थन करने के लिए अनुकूलित करता है, जो आपके प्रोजेक्ट की महत्वाकांक्षा के साथ स्केल करता है।",
        altText: "स्केलेबल गेम लॉजिक",
      },
      {
        title: "मल्टीप्लेयर समर्थन",
        description: "न्यूनतम सेटअप के साथ प्रतिस्पर्धी या सहकारी गेमप्ले को सक्षम करते हुए, मल्टीप्लेयर सुविधाओं को आसानी से एकीकृत करें।",
        altText: "मल्टीप्लेयर समर्थन",
      },
      {
        title: "विश्लेषण डैशबोर्ड",
        description: "ज़रलो के अंतर्निहित विश्लेषण के माध्यम से खिलाड़ी की व्यस्तता और प्रदर्शन मेट्रिक्स को ट्रैक करें ताकि आपके गेम की सफलता को अनुकूलित किया जा सके।",
        altText: "विश्लेषण डैशबोर्ड",
      },
    ],
  },
};

export default async function Features() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const language = user?.user_metadata?.language || "en"; // Fallback to English if no user or language
  const currentTexts = translations[language] || translations.en;

  return (
    <div 
      style={{
        backgroundImage: 'url("/Z_bg.png")',
        backgroundSize: "cover",        // cover both width & height
        backgroundPosition: "center",   // center the image
        backgroundRepeat: "no-repeat",  // no repeat
        backgroundAttachment: "fixed",  // keeps it fixed when scrolling
        height: "100vh",                // full screen height
        width: "100%"                   // full width
      }}
    >
      <Navbar />
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/instant-game-creation.png"
                  alt={currentTexts.features[0].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[0].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[0].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/customizable-game-templates.png"
                  alt={currentTexts.features[1].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[1].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[1].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/ai-driven-design.png"
                  alt={currentTexts.features[2].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[2].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[2].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/cross-platform.png"
                  alt={currentTexts.features[3].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[3].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[3].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/real-time-collaboration.png"
                  alt={currentTexts.features[4].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[4].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[4].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/instant-prototyping.png"
                  alt={currentTexts.features[5].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[5].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[5].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/dynamic-asset-generation.png"
                  alt={currentTexts.features[6].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[6].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[6].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/intuitive-visual-editor.png"
                  alt={currentTexts.features[7].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[7].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[7].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/automated-bug-testing.png"
                  alt={currentTexts.features[8].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[8].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[8].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/one-click-publishing.png"
                  alt={currentTexts.features[9].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[9].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[9].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/community-feedback.png"
                  alt={currentTexts.features[10].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[10].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[10].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/scalable-game-logic.png"
                  alt={currentTexts.features[11].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[11].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[11].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/multiplayer-support.png"
                  alt={currentTexts.features[12].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[12].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[12].description}
              </p>
            </div>
          </div>
          <div className="p-8 bg-[#ffffff] rounded-2xl">
            <div className="max-w-md text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full sm:w-16 sm:h-16">
                <Image
                  className="w-8 h-8 sm:w-12 sm:h-12"
                  src="/assets/images/features/analytics-dashboard.png"
                  alt={currentTexts.features[13].altText}
                  width={48}
                  height={48}
                />
              </div>
              <h6 className="mb-2 font-semibold leading-5">{currentTexts.features[13].title}</h6>
              <p className="mb-3 text-sm text-gray-900">
                {currentTexts.features[13].description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer user={user} />
    </div>
  );
}