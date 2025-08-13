import { createClient } from "@/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Code, Gamepad2, Server, Rocket, Users, Globe } from "lucide-react"
import Footer from "@/components/sections/footer";
import Navbar from "@/components/navbar";

// Translations for all supported languages
const translations: Record<
  string,
  {
    hero: {
      subtitle: string
      title: string
      description: string
      badges: {
        fast: string
        aiPowered: string
        gamesAndSites: string
      }
    }
    mission: {
      title: string
      description: string
      cards: {
        globalImpact: {
          title: string
          description: string
        }
        innovationFirst: {
          title: string
          description: string
        }
        communityDriven: {
          title: string
          description: string
        }
      }
    }
    team: {
      title: string
      subtitle: string
      ural: {
        role: string
        description: string
        skills: string[]
      }
      gabi: {
        role: string
        description: string
        skills: string[]
      }
    }
    technology: {
      title: string
      subtitle: string
      features: {
        aiGeneration: {
          title: string
          description: string
        }
        smartCoding: {
          title: string
          description: string
        }
        cloudInfrastructure: {
          title: string
          description: string
        }
        gameEngine: {
          title: string
          description: string
        }
      }
    }
    cta: {
      title: string
      description: string
      primaryButton: string
      secondaryButton: string
    }
    footer: {
      tagline: string
      copyright: string
    }
  }
> = {
  en: {
    hero: {
      subtitle: "AI-Powered Development Platform",
      title: "Zerlo",
      description:
        "Building the future of web development and gaming with AI. Create stunning websites and engaging games in seconds, not hours.",
      badges: {
        fast: "Lightning Fast",
        aiPowered: "AI-Powered",
        gamesAndSites: "Games & Sites",
      },
    },
    mission: {
      title: "Our Mission",
      description:
        "At Zerlo, we believe that everyone should have the power to create. Our cutting-edge AI technology democratizes web development and game creation, making it possible for anyone to bring their ideas to life in mere seconds.",
      cards: {
        globalImpact: {
          title: "Global Impact",
          description: "Empowering creators worldwide with accessible AI technology",
        },
        innovationFirst: {
          title: "Innovation First",
          description: "Pushing the boundaries of what's possible with AI",
        },
        communityDriven: {
          title: "Community Driven",
          description: "Building together with our amazing community of creators",
        },
      },
    },
    team: {
      title: "Meet the Visionaries",
      subtitle: "Two passionate developers on a mission to revolutionize digital creation",
      ural: {
        role: "Co-Founder & Lead Developer",
        description:
          "At 22, Ural brings exceptional expertise in AI integration and full-stack development. He architects our core AI systems and ensures seamless user experiences.",
        skills: ["AI Systems", "Full-Stack", "Architecture"],
      },
      gabi: {
        role: "Co-Founder & Infrastructure Lead",
        description:
          "Also 22, Gabi is our infrastructure wizard and server optimization expert. He ensures Zerlo runs at lightning speed and scales seamlessly.",
        skills: ["DevOps", "Server Management", "Scalability"],
      },
    },
    technology: {
      title: "Powered by Innovation",
      subtitle: "Our cutting-edge technology stack enables instant creation of professional websites and games",
      features: {
        aiGeneration: {
          title: "AI Generation",
          description: "Advanced neural networks for instant content creation",
        },
        smartCoding: {
          title: "Smart Coding",
          description: "Intelligent code generation and optimization",
        },
        cloudInfrastructure: {
          title: "Cloud Infrastructure",
          description: "Scalable servers handling millions of requests",
        },
        gameEngine: {
          title: "Game Engine",
          description: "Real-time game creation and deployment",
        },
      },
    },
    cta: {
      title: "Ready to Create Something Amazing?",
      description: "Join thousands of creators who are already building the future with Zerlo's AI-powered platform",
      primaryButton: "Start Creating Now",
      secondaryButton: "Learn More",
    },
    footer: {
      tagline: "Building the future of digital creation, one AI-powered project at a time.",
      copyright: "© 2024 Zerlo. Crafted with ❤️ by Ural Revivo & Gabi Shalmayev",
    },
  },
  fr: {
    hero: {
      subtitle: "Plateforme de Développement IA",
      title: "Zerlo",
      description:
        "Construire l'avenir du développement web et du gaming avec l'IA. Créez des sites web époustouflants et des jeux captivants en quelques secondes.",
      badges: {
        fast: "Ultra Rapide",
        aiPowered: "Alimenté par l'IA",
        gamesAndSites: "Jeux & Sites",
      },
    },
    mission: {
      title: "Notre Mission",
      description:
        "Chez Zerlo, nous croyons que tout le monde devrait avoir le pouvoir de créer. Notre technologie IA de pointe démocratise le développement web et la création de jeux.",
      cards: {
        globalImpact: {
          title: "Impact Mondial",
          description: "Autonomiser les créateurs du monde entier avec une technologie IA accessible",
        },
        innovationFirst: {
          title: "Innovation d'Abord",
          description: "Repousser les limites du possible avec l'IA",
        },
        communityDriven: {
          title: "Axé Communauté",
          description: "Construire ensemble avec notre incroyable communauté de créateurs",
        },
      },
    },
    team: {
      title: "Rencontrez les Visionnaires",
      subtitle: "Deux développeurs passionnés en mission pour révolutionner la création numérique",
      ural: {
        role: "Co-Fondateur & Développeur Principal",
        description:
          "À 22 ans, Ural apporte une expertise exceptionnelle en intégration IA et développement full-stack. Il conçoit nos systèmes IA principaux.",
        skills: ["Systèmes IA", "Full-Stack", "Architecture"],
      },
      gabi: {
        role: "Co-Fondateur & Responsable Infrastructure",
        description:
          "Également 22 ans, Gabi est notre magicien de l'infrastructure et expert en optimisation serveur. Il assure que Zerlo fonctionne à la vitesse de l'éclair.",
        skills: ["DevOps", "Gestion Serveur", "Évolutivité"],
      },
    },
    technology: {
      title: "Alimenté par l'Innovation",
      subtitle: "Notre pile technologique de pointe permet la création instantanée de sites web et jeux professionnels",
      features: {
        aiGeneration: {
          title: "Génération IA",
          description: "Réseaux de neurones avancés pour la création de contenu instantané",
        },
        smartCoding: {
          title: "Codage Intelligent",
          description: "Génération et optimisation intelligente de code",
        },
        cloudInfrastructure: {
          title: "Infrastructure Cloud",
          description: "Serveurs évolutifs gérant des millions de requêtes",
        },
        gameEngine: {
          title: "Moteur de Jeu",
          description: "Création et déploiement de jeux en temps réel",
        },
      },
    },
    cta: {
      title: "Prêt à Créer Quelque Chose d'Incroyable?",
      description: "Rejoignez des milliers de créateurs qui construisent déjà l'avenir avec la plateforme IA de Zerlo",
      primaryButton: "Commencer à Créer",
      secondaryButton: "En Savoir Plus",
    },
    footer: {
      tagline: "Construire l'avenir de la création numérique, un projet IA à la fois.",
      copyright: "© 2024 Zerlo. Créé avec ❤️ par Ural Revivo & Gabi Shalmayev",
    },
  },
  he: {
    hero: {
      subtitle: "פלטפורמת פיתוח מבוססת בינה מלאכותית",
      title: "זרלו",
      description: "בונים את עתיד פיתוח האתרים והמשחקים עם בינה מלאכותית. צרו אתרים מדהימים ומשחקים מרתקים תוך שניות.",
      badges: {
        fast: "מהיר כברק",
        aiPowered: "מונע בינה מלאכותית",
        gamesAndSites: "משחקים ואתרים",
      },
    },
    mission: {
      title: "המשימה שלנו",
      description:
        "בזרלו, אנחנו מאמינים שלכל אחד צריך להיות הכוח ליצור. הטכנולוגיה המתקדמת שלנו מדמוקרטת את פיתוח האתרים ויצירת המשחקים.",
      cards: {
        globalImpact: {
          title: "השפעה גלובלית",
          description: "העצמת יוצרים ברחבי העולם עם טכנולוגיית בינה מלאכותית נגישה",
        },
        innovationFirst: {
          title: "חדשנות קודם כל",
          description: "דוחפים את הגבולות של מה שאפשר עם בינה מלאכותית",
        },
        communityDriven: {
          title: "מונע קהילה",
          description: "בונים יחד עם הקהילה המדהימה של יוצרים שלנו",
        },
      },
    },
    team: {
      title: "פגשו את החזונאים",
      subtitle: "שני מפתחים נלהבים במשימה לחולל מהפכה ביצירה דיגיטלית",
      ural: {
        role: "שותף מייסד ומפתח ראשי",
        description:
          "בגיל 22, אוראל מביא מומחיות יוצאת דופן באינטגרציית בינה מלאכותית ופיתוח מלא. הוא מתכנן את מערכות הבינה המלאכותית הליבה שלנו.",
        skills: ["מערכות בינה מלאכותית", "פיתוח מלא", "ארכיטקטורה"],
      },
      gabi: {
        role: "שותף מייסד וראש תשתיות",
        description:
          "גם הוא בן 22, גבי הוא קוסם התשתיות ומומחה אופטימיזציית שרתים שלנו. הוא מבטיח שזרלו פועל במהירות הברק.",
        skills: ["DevOps", "ניהול שרתים", "מדרגיות"],
      },
    },
    technology: {
      title: "מונע על ידי חדשנות",
      subtitle: "מחסנית הטכנולוגיה המתקדמת שלנו מאפשרת יצירה מיידית של אתרים ומשחקים מקצועיים",
      features: {
        aiGeneration: {
          title: "יצירת בינה מלאכותית",
          description: "רשתות עצביות מתקדמות ליצירת תוכן מיידי",
        },
        smartCoding: {
          title: "קידוד חכם",
          description: "יצירה ואופטימיזציה חכמה של קוד",
        },
        cloudInfrastructure: {
          title: "תשתית ענן",
          description: "שרתים מדרגיים המטפלים במיליוני בקשות",
        },
        gameEngine: {
          title: "מנוע משחקים",
          description: "יצירה ופריסה של משחקים בזמן אמת",
        },
      },
    },
    cta: {
      title: "מוכנים ליצור משהו מדהים?",
      description: "הצטרפו לאלפי יוצרים שכבר בונים את העתיד עם הפלטפורמה המבוססת בינה מלאכותית של זרלו",
      primaryButton: "התחילו ליצור עכשיו",
      secondaryButton: "למדו עוד",
    },
    footer: {
      tagline: "בונים את עתיד היצירה הדיגיטלית, פרויקט אחד מבוסס בינה מלאכותית בכל פעם.",
      copyright: "© 2024 זרלו. נוצר באהבה ❤️ על ידי אוראל רביבו וגבי שלמייב",
    },
  },
  zh: {
    hero: {
      subtitle: "AI驱动的开发平台",
      title: "Zerlo",
      description: "用AI构建网页开发和游戏的未来。在几秒钟内创建令人惊叹的网站和引人入胜的游戏。",
      badges: {
        fast: "闪电般快速",
        aiPowered: "AI驱动",
        gamesAndSites: "游戏和网站",
      },
    },
    mission: {
      title: "我们的使命",
      description:
        "在Zerlo，我们相信每个人都应该拥有创造的力量。我们的尖端AI技术使网页开发和游戏创作民主化，让任何人都能在几秒钟内将想法变为现实。",
      cards: {
        globalImpact: {
          title: "全球影响",
          description: "通过可访问的AI技术赋能全球创作者",
        },
        innovationFirst: {
          title: "创新优先",
          description: "推动AI可能性的边界",
        },
        communityDriven: {
          title: "社区驱动",
          description: "与我们令人惊叹的创作者社区一起构建",
        },
      },
    },
    team: {
      title: "认识远见者",
      subtitle: "两位充满激情的开发者，致力于革命性地改变数字创作",
      ural: {
        role: "联合创始人兼首席开发者",
        description: "22岁的Ural在AI集成和全栈开发方面拥有卓越的专业知识。他设计我们的核心AI系统并确保无缝的用户体验。",
        skills: ["AI系统", "全栈", "架构"],
      },
      gabi: {
        role: "联合创始人兼基础设施负责人",
        description: "同样22岁的Gabi是我们的基础设施向导和服务器优化专家。他确保Zerlo以闪电般的速度运行并无缝扩展。",
        skills: ["DevOps", "服务器管理", "可扩展性"],
      },
    },
    technology: {
      title: "创新驱动",
      subtitle: "我们的尖端技术栈实现专业网站和游戏的即时创建",
      features: {
        aiGeneration: {
          title: "AI生成",
          description: "用于即时内容创建的先进神经网络",
        },
        smartCoding: {
          title: "智能编码",
          description: "智能代码生成和优化",
        },
        cloudInfrastructure: {
          title: "云基础设施",
          description: "处理数百万请求的可扩展服务器",
        },
        gameEngine: {
          title: "游戏引擎",
          description: "实时游戏创建和部署",
        },
      },
    },
    cta: {
      title: "准备创造令人惊叹的作品？",
      description: "加入成千上万已经在用Zerlo的AI驱动平台构建未来的创作者",
      primaryButton: "立即开始创作",
      secondaryButton: "了解更多",
    },
    footer: {
      tagline: "构建数字创作的未来，一次一个AI驱动的项目。",
      copyright: "© 2024 Zerlo. 由Ural Revivo和Gabi Shalmayev用❤️精心制作",
    },
  },
  ar: {
    hero: {
      subtitle: "منصة تطوير مدعومة بالذكاء الاصطناعي",
      title: "زيرلو",
      description: "بناء مستقبل تطوير الويب والألعاب بالذكاء الاصطناعي. إنشاء مواقع ويب مذهلة وألعاب جذابة في ثوانٍ.",
      badges: {
        fast: "سريع كالبرق",
        aiPowered: "مدعوم بالذكاء الاصطناعي",
        gamesAndSites: "ألعاب ومواقع",
      },
    },
    mission: {
      title: "مهمتنا",
      description:
        "في زيرلو، نؤمن أن كل شخص يجب أن يملك القوة للإبداع. تقنيتنا المتطورة للذكاء الاصطناعي تجعل تطوير الويب وإنشاء الألعاب ديمقراطياً.",
      cards: {
        globalImpact: {
          title: "تأثير عالمي",
          description: "تمكين المبدعين حول العالم بتقنية ذكاء اصطناعي متاحة",
        },
        innovationFirst: {
          title: "الابتكار أولاً",
          description: "دفع حدود ما هو ممكن بالذكاء الاصطناعي",
        },
        communityDriven: {
          title: "مدفوع بالمجتمع",
          description: "البناء معاً مع مجتمعنا المذهل من المبدعين",
        },
      },
    },
    team: {
      title: "تعرف على أصحاب الرؤية",
      subtitle: "مطوران شغوفان في مهمة لثورة الإبداع الرقمي",
      ural: {
        role: "شريك مؤسس ومطور رئيسي",
        description:
          "في سن 22، يجلب أورال خبرة استثنائية في تكامل الذكاء الاصطناعي والتطوير الشامل. يصمم أنظمة الذكاء الاصطناعي الأساسية لدينا.",
        skills: ["أنظمة الذكاء الاصطناعي", "التطوير الشامل", "الهندسة المعمارية"],
      },
      gabi: {
        role: "شريك مؤسس ورئيس البنية التحتية",
        description:
          "أيضاً في سن 22، جابي هو ساحر البنية التحتية وخبير تحسين الخوادم لدينا. يضمن أن زيرلو يعمل بسرعة البرق.",
        skills: ["DevOps", "إدارة الخوادم", "قابلية التوسع"],
      },
    },
    technology: {
      title: "مدعوم بالابتكار",
      subtitle: "مجموعة التقنيات المتطورة لدينا تمكن الإنشاء الفوري للمواقع والألعاب المهنية",
      features: {
        aiGeneration: {
          title: "توليد الذكاء الاصطناعي",
          description: "شبكات عصبية متقدمة لإنشاء المحتوى الفوري",
        },
        smartCoding: {
          title: "البرمجة الذكية",
          description: "توليد وتحسين الكود الذكي",
        },
        cloudInfrastructure: {
          title: "البنية التحتية السحابية",
          description: "خوادم قابلة للتوسع تتعامل مع ملايين الطلبات",
        },
        gameEngine: {
          title: "محرك الألعاب",
          description: "إنشاء ونشر الألعاب في الوقت الفعلي",
        },
      },
    },
    cta: {
      title: "مستعد لإنشاء شيء مذهل؟",
      description: "انضم إلى آلاف المبد��ين الذين يبنون المستقبل بالفعل مع منصة زيرلو المدعومة بالذكاء الاصطناعي",
      primaryButton: "ابدأ الإنشاء الآن",
      secondaryButton: "تعلم المزيد",
    },
    footer: {
      tagline: "بناء مستقبل الإبداع الرقمي، مشروع واحد مدعوم بالذكاء الاصطناعي في كل مرة.",
      copyright: "© 2024 زيرلو. صُنع بحب ❤️ من قبل أورال رفيفو وجابي شلمايف",
    },
  },
  ru: {
    hero: {
      subtitle: "Платформа разработки на базе ИИ",
      title: "Zerlo",
      description:
        "Строим будущее веб-разработки и игр с помощью ИИ. Создавайте потрясающие веб-сайты и увлекательные игры за секунды.",
      badges: {
        fast: "Молниеносно быстро",
        aiPowered: "На базе ИИ",
        gamesAndSites: "Игры и сайты",
      },
    },
    mission: {
      title: "Наша миссия",
      description:
        "В Zerlo мы верим, что у каждого должна быть сила творить. Наша передовая технология ИИ демократизирует веб-разработку и создание игр.",
      cards: {
        globalImpact: {
          title: "Глобальное влияние",
          description: "Расширение возможностей создателей по всему миру с доступной технологией ИИ",
        },
        innovationFirst: {
          title: "Инновации прежде всего",
          description: "Расширяем границы возможного с ИИ",
        },
        communityDriven: {
          title: "Движимые сообществом",
          description: "Строим вместе с нашим удивительным сообществом создателей",
        },
      },
    },
    team: {
      title: "Познакомьтесь с визионерами",
      subtitle: "Два страстных разработчика на миссии революционизировать цифровое творчество",
      ural: {
        role: "Со-основатель и ведущий разработчик",
        description:
          "В 22 года Урал привносит исключительную экспертизу в интеграции ИИ и полноценной разработке. Он проектирует наши основные системы ИИ.",
        skills: ["Системы ИИ", "Полный стек", "Архитектура"],
      },
      gabi: {
        role: "Со-основатель и руководитель инфраструктуры",
        description:
          "Также 22 года, Габи - наш волшебник инфраструктуры и эксперт по оптимизации серверов. Он обеспечивает молниеносную работу Zerlo.",
        skills: ["DevOps", "Управление серверами", "Масштабируемость"],
      },
    },
    technology: {
      title: "Движимые инновациями",
      subtitle: "Наш передовой технологический стек обеспечивает мгновенное создание профессиональных веб-сайтов и игр",
      features: {
        aiGeneration: {
          title: "Генерация ИИ",
          description: "Продвинутые нейронные сети для мгновенного создания контента",
        },
        smartCoding: {
          title: "Умное кодирование",
          description: "Интеллектуальная генерация и оптимизация кода",
        },
        cloudInfrastructure: {
          title: "Облачная инфраструктура",
          description: "Масштабируемые серверы, обрабатывающие миллионы запросов",
        },
        gameEngine: {
          title: "Игровой движок",
          description: "Создание и развертывание игр в реальном времени",
        },
      },
    },
    cta: {
      title: "Готовы создать что-то удивительное?",
      description: "Присоединяйтесь к тысячам создателей, которые уже строят будущее с платформой Zerlo на базе ИИ",
      primaryButton: "Начать создавать сейчас",
      secondaryButton: "Узнать больше",
    },
    footer: {
      tagline: "Строим будущее цифрового творчества, один проект на базе ИИ за раз.",
      copyright: "© 2024 Zerlo. Создано с ❤️ Уралом Ревиво и Габи Шалмаевым",
    },
  },
  hi: {
    hero: {
      subtitle: "AI-संचालित विकास प्लेटफॉर्म",
      title: "ज़रलो",
      description: "AI के साथ वेब डेवलपमेंट और गेमिंग का भविष्य बना रहे हैं। सेकंडों में शानदार वेबसाइट और आकर्षक गेम बनाएं।",
      badges: {
        fast: "बिजली की तेज़ी",
        aiPowered: "AI-संचालित",
        gamesAndSites: "गेम्स और साइट्स",
      },
    },
    mission: {
      title: "हमारा मिशन",
      description:
        "ज़रलो में, हम मानते हैं कि हर किसी के पास बनाने की शक्ति होनी चाहिए। हमारी अत्याधुनिक AI तकनीक वेब डेवलपमेंट और गेम निर्माण को लोकतांत्रिक बनाती है।",
      cards: {
        globalImpact: {
          title: "वैश्विक प्रभाव",
          description: "सुलभ AI तकनीक के साथ दुनिया भर के रचनाकारों को सशक्त बनाना",
        },
        innovationFirst: {
          title: "नवाचार पहले",
          description: "AI के साथ संभावनाओं की सीमाओं को आगे बढ़ाना",
        },
        communityDriven: {
          title: "समुदाय संचालित",
          description: "हमारे अद्भुत रचनाकार समुदाय के साथ मिलकर निर्माण",
        },
      },
    },
    team: {
      title: "दूरदर्शियों से मिलें",
      subtitle: "डिजिटल निर्माण में क्रांति लाने के मिशन पर दो जुनूनी डेवलपर्स",
      ural: {
        role: "सह-संस्थापक और मुख्य डेवलपर",
        description:
          "22 साल की उम्र में, उराल AI एकीकरण और फुल-स्टैक डेवलपमेंट में असाधारण विशेषज्ञता लाते हैं। वे हमारे मुख्य AI सिस्टम डिज़ाइन करते हैं।",
        skills: ["AI सिस्टम", "फुल-स्टैक", "आर्किटेक्चर"],
      },
      gabi: {
        role: "सह-संस्थापक और इंफ्रास्ट्रक्चर लीड",
        description:
          "वे भी 22 साल के हैं, गैबी हमारे इंफ्रास्ट्रक्चर जादूगर और सर्वर ऑप्टिमाइज़ेशन विशेषज्ञ हैं। वे सुनिश्चित करते हैं कि ज़रलो बिजली की गति से चले।",
        skills: ["DevOps", "सर्वर प्रबंधन", "स्केलेबिलिटी"],
      },
    },
    technology: {
      title: "नवाचार द्वारा संचालित",
      subtitle: "हमारा अत्याधुनिक तकनीकी स्टैक पेशेवर वेबसाइटों और गेम्स का तत्काल निर्माण सक्षम बनाता है",
      features: {
        aiGeneration: {
          title: "AI जेनरेशन",
          description: "तत्काल सामग्री निर्माण के लिए उन्नत न्यूरल नेटवर्क",
        },
        smartCoding: {
          title: "स्मार्ट कोडिंग",
          description: "बुद्धिमान कोड जेनरेशन और ऑप्टिमाइज़ेशन",
        },
        cloudInfrastructure: {
          title: "क्लाउड इंफ्रास्ट्रक्चर",
          description: "लाखों अनुरोधों को संभालने वाले स्केलेबल सर्वर",
        },
        gameEngine: {
          title: "गेम इंजन",
          description: "रियल-टाइम गेम निर्माण और तैनाती",
        },
      },
    },
    cta: {
      title: "कुछ अद्भुत बनाने के लिए तैयार हैं?",
      description: "हजारों रचनाकारों से जुड़ें जो पहले से ही ज़रलो के AI-संचालित प्लेटफॉर्म के साथ भविष्य का निर्माण कर रहे हैं",
      primaryButton: "अभी बनाना शुरू करें",
      secondaryButton: "और जानें",
    },
    footer: {
      tagline: "डिजिटल निर्माण का भविष्य बना रहे हैं, एक समय में एक AI-संचालित प्रोजेक्ट।",
      copyright: "© 2024 ज़रलो। उराल रेविवो और गैबी शलमायेव द्वारा ❤️ के साथ तैयार",
    },
  },
}

export default async function AboutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const language = user?.user_metadata?.language || "en"
  const t = translations[language] || translations.en

  return (
    <div className="min-h-screen bg-gray-50">
    <Navbar />
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">{t.hero.title}</h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">{t.hero.description}</p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Badge variant="secondary" className="bg-[#8888881A] text-gray-800 border-[#8888881A]">
                <Zap className="w-3 h-3 mr-1" />
                {t.hero.badges.fast}
              </Badge>
              <Badge variant="secondary" className="bg-[#8888881A] text-gray-800 border-[#8888881A]">
                <Code className="w-3 h-3 mr-1" />
                {t.hero.badges.aiPowered}
              </Badge>
              <Badge variant="secondary" className="bg-[#8888881A] text-gray-800 border-[#8888881A]">
                <Gamepad2 className="w-3 h-3 mr-1" />
                {t.hero.badges.gamesAndSites}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t.mission.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t.mission.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white border-[#8888881A] transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8888881A] rounded-xl mx-auto mb-6 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.mission.cards.globalImpact.title}</h3>
                  <p className="text-gray-600">{t.mission.cards.globalImpact.description}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8888881A] transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8888881A] rounded-xl mx-auto mb-6 flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.mission.cards.innovationFirst.title}</h3>
                  <p className="text-gray-600">{t.mission.cards.innovationFirst.description}</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8888881A] transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-[#8888881A] rounded-xl mx-auto mb-6 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t.mission.cards.communityDriven.title}</h3>
                  <p className="text-gray-600">{t.mission.cards.communityDriven.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.team.title}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t.team.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Ural Revivo */}
            <Card className="bg-gradient-to-br from-[#0099ff23] to-[#8888881A] border-gray-200">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0099FF] to-[#8888881A] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">UR</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Oral Revivo</h3>
                <p className="text-gray-600 text-center mb-4 font-medium">{t.team.ural.role}</p>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">{t.team.ural.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {t.team.ural.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-[#8888881A] text-gray-800 border-[#8888881A]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gabi Shalmayev */}
            <Card className="bg-gradient-to-br from-[#0099ff23] to-[#8888881A] border-gray-200">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#8888881A] to-[#0099FF] rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">GS</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Gabi Shalmiev</h3>
                <p className="text-gray-600 text-center mb-4 font-medium">{t.team.gabi.role}</p>
                <p className="text-gray-600 text-center mb-6 leading-relaxed">{t.team.gabi.description}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {t.team.gabi.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-[#8888881A] text-gray-800 border-[#8888881A]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t.technology.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t.technology.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8888881A] to-[#0099FF] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.technology.features.aiGeneration.title}</h3>
              <p className="text-gray-600 text-sm">{t.technology.features.aiGeneration.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8888881A] to-[#0099FF] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.technology.features.smartCoding.title}</h3>
              <p className="text-gray-600 text-sm">{t.technology.features.smartCoding.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8888881A] to-[#0099FF] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t.technology.features.cloudInfrastructure.title}
              </h3>
              <p className="text-gray-600 text-sm">{t.technology.features.cloudInfrastructure.description}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8888881A] to-[#0099FF] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.technology.features.gameEngine.title}</h3>
              <p className="text-gray-600 text-sm">{t.technology.features.gameEngine.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t.cta.title}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{t.cta.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              {t.cta.primaryButton}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 bg-transparent"
            >
              {t.cta.secondaryButton}
            </Button>
          </div>
        </div>
      </section>
    <Footer />
    </div>
  )
}
