"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import "@/styles/terms.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// All translations
const translations: Record<
  string,
  {
    title: string;
    updateDate: string;
    section1Title: string;
    section1Text: string;
    section1List: string[];
    section2Title: string;
    section2Text: string;
    section2List: string[];
    section3Title: string;
    section3Text: string;
    section4Title: string;
    section4Text: string;
    section5Title: string;
    section5Text: string;
    section5List: string[];
    section6Title: string;
    section6Text: string;
    section7Title: string;
    section7Text: string;
    section8Title: string;
    section8Text: string;
    section9Title: string;
    section9Text: string;
    section9Email: string;
    fontButton: string;
    fontCloseButton: string;
    fontPlaceholder: string;
  }
> = {
  en: {
    title: "Terms of Service",
    updateDate: "Last Updated: August 7, 2025",
    section1Title: "What is Our Service?",
    section1Text:
      "Our platform lets you create and manage games using artificial intelligence (AI) and advanced tools. Through the site you can:",
    section1List: [
      "Have our AI automatically create games for you based on your instructions.",
      "Edit and modify these games directly within the website at any time, no extra software needed.",
      "After creating a game, easily add a multiplayer game server directly on the site.",
      "Use another AI that generates code and provides a real-time preview of the code, which you can use or modify.",
      "Play games created by other users.",
      "Participate in competitions like “Top 5” and “Game of the Month”.",
      "Get a free domain address (e.g., yourgame.zarlo.com).",
      "And if you want, purchase your own private/custom domain.",
    ],
    section2Title: "Who Owns the Games?",
    section2Text:
      "Every game or content you create through the site belongs only to you. This means:",
    section2List: [
      "You can publish your game anywhere you want.",
      "You can sell, share, or distribute it without any limitations.",
      "The site does not claim ownership of your game or its content.",
      "We will not use your game without your permission.",
    ],
    section3Title: "Featuring Your Games on the Site",
    section3Text:
      "If we want to feature your game in places like the “Top 5” list or homepage, we will ask for your explicit permission first. We will not publicly display your game without your clear consent.",
    section4Title: "Free and Paid Domains",
    section4Text:
      "If you do not purchase a private domain, your game will have a free address that includes our site name, for example: yourgame.zarlo.com. If you want a unique domain without our branding, you can buy a private domain.",
    section5Title: "What is Allowed and Not Allowed in Games?",
    section5Text:
      "You can create games that include action, fighting, or comic-style violence. However, it is prohibited to upload games that contain:",
    section5List: [
      "Hate, racism, discrimination, or harmful speech against individuals or groups.",
      "Explicit or offensive sexual content.",
      "Illegal content or material that infringes copyrights. If these rules are broken, we may remove your content from the site.",
    ],
    section6Title: "Responsibility and Content Backup",
    section6Text:
      "The site provides the service “as is” and does not guarantee your games will always be available or error-free. It is important that you keep backups of your games on your own computer or elsewhere to avoid losing them.",
    section7Title: "Your Account and Security",
    section7Text:
      "You are responsible for everything that happens with your account. Please keep your password secure and do not share your login details with anyone.",
    section8Title: "Changes to the Terms",
    section8Text:
      "We may update these Terms from time to time. Continuing to use the site after updates means you agree to the new Terms.",
    section9Title: "Contact Us",
    section9Text:
      "If you have any questions, requests, or problems, feel free to contact us anytime at:",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "Font Size",
    fontCloseButton: "Close Font Controls",
    fontPlaceholder: "Custom px",
  },
  fr: {
    title: "Conditions de service",
    updateDate: "Dernière mise à jour : 7 août 2025",
    section1Title: "Quel est notre service ?",
    section1Text:
      "Notre plateforme vous permet de créer et de gérer des jeux en utilisant l'intelligence artificielle (IA) et des outils avancés. Via le site, vous pouvez :",
    section1List: [
      "Faire en sorte que notre IA crée automatiquement des jeux pour vous en fonction de vos instructions.",
      "Modifier et éditer ces jeux directement sur le site à tout moment, sans logiciel supplémentaire.",
      "Après avoir créé un jeu, ajouter facilement un serveur de jeu multijoueur directement sur le site.",
      "Utiliser une autre IA qui génère du code et fournit un aperçu en temps réel du code, que vous pouvez utiliser ou modifier.",
      "Jouer à des jeux créés par d'autres utilisateurs.",
      "Participer à des compétitions comme « Top 5 » et « Jeu du mois ».",
      "Obtenir une adresse de domaine gratuite (par exemple, votrejeu.zarlo.com).",
      "Et si vous le souhaitez, acheter votre propre domaine privé/personnalisé.",
    ],
    section2Title: "À qui appartiennent les jeux ?",
    section2Text:
      "Chaque jeu ou contenu que vous créez via le site vous appartient exclusivement. Cela signifie :",
    section2List: [
      "Vous pouvez publier votre jeu où vous voulez.",
      "Vous pouvez le vendre, le partager ou le distribuer sans aucune limitation.",
      "Le site ne revendique pas la propriété de votre jeu ou de son contenu.",
      "Nous n'utiliserons pas votre jeu sans votre permission.",
    ],
    section3Title: "Mettre en avant vos jeux sur le site",
    section3Text:
      "Si nous souhaitons mettre en avant votre jeu dans des endroits comme la liste « Top 5 » ou la page d'accueil, nous vous demanderons d'abord votre permission explicite. Nous n'afficherons pas publiquement votre jeu sans votre consentement clair.",
    section4Title: "Domaines gratuits et payants",
    section4Text:
      "Si vous n'achetez pas un domaine privé, votre jeu aura une adresse gratuite incluant le nom de notre site, par exemple : votrejeu.zarlo.com. Si vous souhaitez un domaine unique sans notre marque, vous pouvez acheter un domaine privé.",
    section5Title: "Qu'est-ce qui est autorisé et interdit dans les jeux ?",
    section5Text:
      "Vous pouvez créer des jeux incluant de l'action, des combats ou de la violence de style bande dessinée. Cependant, il est interdit de télécharger des jeux contenant :",
    section5List: [
      "Haine, racisme, discrimination ou discours nuisible contre des individus ou des groupes.",
      "Contenu sexuel explicite ou offensant.",
      "Contenu illégal ou matériel enfreignant les droits d'auteur. Si ces règles sont enfreintes, nous pouvons supprimer votre contenu du site.",
    ],
    section6Title: "Responsabilité et sauvegarde du contenu",
    section6Text:
      "Le site fournit le service « tel quel » et ne garantit pas que vos jeux seront toujours disponibles ou sans erreur. Il est important que vous conserviez des sauvegardes de vos jeux sur votre propre ordinateur ou ailleurs pour éviter de les perdre.",
    section7Title: "Votre compte et sécurité",
    section7Text:
      "Vous êtes responsable de tout ce qui se passe avec votre compte. Veuillez garder votre mot de passe en sécurité et ne partagez pas vos informations de connexion avec qui que ce soit.",
    section8Title: "Modifications des conditions",
    section8Text:
      "Nous pouvons mettre à jour ces conditions de temps à autre. Continuer à utiliser le site après les mises à jour signifie que vous acceptez les nouvelles conditions.",
    section9Title: "Contactez-nous",
    section9Text:
      "Si vous avez des questions, des demandes ou des problèmes, n'hésitez pas à nous contacter à tout moment à :",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "Taille de la police",
    fontCloseButton: "Fermer les contrôles de police",
    fontPlaceholder: "Px personnalisé",
  },
  ru: {
    title: "Условия использования",
    updateDate: "Последнее обновление: 7 августа 2025 года",
    section1Title: "Что такое наша услуга?",
    section1Text:
      "Наша платформа позволяет создавать и управлять играми с использованием искусственного интеллекта (ИИ) и передовых инструментов. На сайте вы можете:",
    section1List: [
      "Попросить наш ИИ автоматически создавать игры для вас на основе ваших инструкций.",
      "Редактировать и изменять эти игры непосредственно на сайте в любое время, без дополнительного программного обеспечения.",
      "После создания игры легко добавить сервер для многопользовательской игры прямо на сайте.",
      "Использовать другой ИИ, который генерирует код и предоставляет предварительный просмотр кода в реальном времени, который вы можете использовать или изменять.",
      "Играть в игры, созданные другими пользователями.",
      "Участвовать в конкурсах, таких как «Топ-5» и «Игра месяца».",
      "Получить бесплатный адрес домена (например, yourgame.zarlo.com).",
      "И, если хотите, приобрести собственный частный/персонализированный домен.",
    ],
    section2Title: "Кому принадлежат игры?",
    section2Text:
      "Каждая игра или контент, который вы создаете через сайт, принадлежит только вам. Это означает:",
    section2List: [
      "Вы можете публиковать свою игру где угодно.",
      "Вы можете продавать, делиться или распространять ее без каких-либо ограничений.",
      "Сайт не претендует на владение вашей игрой или ее контентом.",
      "Мы не будем использовать вашу игру без вашего разрешения.",
    ],
    section3Title: "Продвижение ваших игр на сайте",
    section3Text:
      "Если мы захотим представить вашу игру в таких местах, как список «Топ-5» или главная страница, мы сначала запросим ваше явное разрешение. Мы не будем публично показывать вашу игру без вашего явного согласия.",
    section4Title: "Бесплатные и платные домены",
    section4Text:
      "Если вы не приобретаете частный домен, ваша игра будет иметь бесплатный адрес, включающий название нашего сайта, например: yourgame.zarlo.com. Если вы хотите уникальный домен без нашего бренда, вы можете купить частный домен.",
    section5Title: "Что разрешено и что запрещено в играх?",
    section5Text:
      "Вы можете создавать игры, включающие экшн, бои или комиксный стиль насилия. Однако запрещено загружать игры, содержащие:",
    section5List: [
      "Ненависть, расизм, дискриминацию или вредоносные высказывания против отдельных лиц или групп.",
      "Откровенный или оскорбительный сексуальный контент.",
      "Незаконный контент или материалы, нарушающие авторские права. Если эти правила будут нарушены, мы можем удалить ваш контент с сайта.",
    ],
    section6Title: "Ответственность и резервное копирование контента",
    section6Text:
      "Сайт предоставляет услугу «как есть» и не гарантирует, что ваши игры всегда будут доступны или безошибочны. Важно, чтобы вы сохраняли резервные копии своих игр на своем компьютере или в другом месте, чтобы избежать их потери.",
    section7Title: "Ваш аккаунт и безопасность",
    section7Text:
      "Вы несете ответственность за все, что происходит с вашим аккаунтом. Пожалуйста, храните свой пароль в безопасности и не делитесь данными для входа с кем-либо.",
    section8Title: "Изменения условий",
    section8Text:
      "Мы можем время от времени обновлять эти условия. Продолжение использования сайта после обновлений означает, что вы соглашаетесь с новыми условиями.",
    section9Title: "Свяжитесь с нами",
    section9Text:
      "Если у вас есть вопросы, запросы или проблемы, не стесняйтесь обращаться к нам в любое время по адресу:",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "Размер шрифта",
    fontCloseButton: "Закрыть управление шрифтом",
    fontPlaceholder: "Пользовательский размер в пикселях",
  },
  hi: {
    title: "सेवा की शर्तें",
    updateDate: "अंतिम अपडेट: 7 अगस्त, 2025",
    section1Title: "हमारी सेवा क्या है?",
    section1Text:
      "हमारा प्लेटफॉर्म आपको कृत्रिम बुद्धिमत्ता (एआई) और उन्नत उपकरणों का उपयोग करके गेम बनाने और प्रबंधित करने की सुविधा देता है। साइट के माध्यम से आप:",
    section1List: [
      "हमारे एआई से आपके निर्देशों के आधार पर स्वचालित रूप से गेम बनवा सकते हैं।",
      "इन गेम्स को वेबसाइट पर किसी भी समय बिना किसी अतिरिक्त सॉफ्टवेयर के संपादित और संशोधित कर सकते हैं।",
      "गेम बनाने के बाद, साइट पर ही आसानी से मल्टीप्लेयर गेम सर्वर जोड़ा जा सकता है।",
      "एक अन्य एआई का उपयोग कर सकते हैं जो कोड जनरेट करता है और कोड का रीयल-टाइम पूर्वावलोकन प्रदान करता है, जिसे आप उपयोग या संशोधित कर सकते हैं।",
      "दूसरे उपयोगकर्ताओं द्वारा बनाए गए गेम खेल सकते हैं।",
      "«टॉप 5» और «गेम ऑफ द मंथ» जैसे प्रतियोगिताओं में भाग ले सकते हैं।",
      "एक मुफ्त डोमेन पता प्राप्त कर सकते हैं (उदाहरण के लिए, yourgame.zarlo.com)।",
      "और यदि आप चाहें, तो अपना निजी/कस्टम डोमेन खरीद सकते हैं।",
    ],
    section2Title: "गेम्स का मालिक कौन है?",
    section2Text:
      "साइट के माध्यम से आपके द्वारा बनाया गया प्रत्येक गेम या सामग्री केवल आपकी है। इसका मतलब है:",
    section2List: [
      "आप अपने गेम को कहीं भी प्रकाशित कर सकते हैं।",
      "आप इसे बिना किसी सीमा के बेच, साझा या वितरित कर सकते हैं।",
      "साइट आपके गेम या उसकी सामग्री पर स्वामित्व का दावा नहीं करती।",
      "हम आपकी अनुमति के बिना आपके गेम का उपयोग नहीं करेंगे।",
    ],
    section3Title: "साइट पर आपके गेम्स को प्रदर्शित करना",
    section3Text:
      "यदि हम आपके गेम को «टॉप 5» सूची या होमपेज जैसे स्थानों पर प्रदर्शित करना चाहते हैं, तो हम पहले आपकी स्पष्ट अनुमति लेंगे। हम आपकी स्पष्ट सहमति के बिना आपके गेम को सार्वजनिक रूप से प्रदर्शित नहीं करेंगे।",
    section4Title: "मुफ्त और सशुल्क डोमेन",
    section4Text:
      "यदि आप निजी डोमेन नहीं खरीदते हैं, तो आपके गेम का एक मुफ्त पता होगा जिसमें हमारी साइट का नाम शामिल होगा, उदाहरण के लिए: yourgame.zarlo.com। यदि आप हमारे ब्रांडिंग के बिना एक अद्वितीय डोमेन चाहते हैं, तो आप एक निजी डोमेन खरीद सकते हैं।",
    section5Title: "गेम्स में क्या अनुमति है और क्या नहीं?",
    section5Text:
      "आप एक्शन, लड़ाई, या कॉमिक-शैली की हिंसा वाले गेम बना सकते हैं। हालांकि, ऐसे गेम अपलोड करना निषिद्ध है जो शामिल हों:",
    section5List: [
      "नफरत, नस्लवाद, भेदभाव, या व्यक्तियों या समूहों के खिलाफ हानिकारक भाषण।",
      "स्पष्ट या आक्रामक यौन सामग्री।",
      "गैरकानूनी सामग्री या कॉपीराइट का उल्लंघन करने वाली सामग्री। यदि ये नियम तोड़े गए, तो हम आपकी सामग्री को साइट से हटा सकते हैं।",
    ],
    section6Title: "जिम्मेदारी और सामग्री बैकअप",
    section6Text:
      "साइट सेवा को «जैसी है» प्रदान करती है और यह गारंटी नहीं देती कि आपके गेम हमेशा उपलब्ध होंगे या त्रुटि-मुक्त होंगे। यह महत्वपूर्ण है कि आप अपने गेम्स का बैकअप अपने कंप्यूटर या कहीं और रखें ताकि उन्हें खोने से बचा जा सके।",
    section7Title: "आपका खाता और सुरक्षा",
    section7Text:
      "आपके खाते के साथ होने वाली हर चीज के लिए आप जिम्मेदार हैं। कृपया अपने पासवर्ड को सुरक्षित रखें और अपनी लॉगिन जानकारी किसी के साथ साझा न करें।",
    section8Title: "शर्तों में परिवर्तन",
    section8Text:
      "हम समय-समय पर इन शर्तों को अपडेट कर सकते हैं। अपडेट के बाद साइट का उपयोग जारी रखने का मतलब है कि आप नई शर्तों से सहमत हैं।",
    section9Title: "हमसे संपर्क करें",
    section9Text:
      "यदि आपके कोई प्रश्न, अनुरोध या समस्याएं हैं, तो कृपया किसी भी समय हमसे संपर्क करने में संकोच न करें:",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "फ़ॉन्ट आकार",
    fontCloseButton: "फ़ॉन्ट नियंत्रण बंद करें",
    fontPlaceholder: "कस्टम px",
  },
  zh: {
    title: "服务条款",
    updateDate: "最后更新：2025年8月7日",
    section1Title: "我们的服务是什么？",
    section1Text:
      "我们的平台允许您使用人工智能（AI）和高级工具创建和管理游戏。通过该网站，您可以：",
    section1List: [
      "让我们的AI根据您的指令自动为您创建游戏。",
      "随时在网站上直接编辑和修改这些游戏，无需额外的软件。",
      "创建游戏后，可直接在网站上轻松添加多人游戏服务器。",
      "使用另一个生成代码并提供代码实时预览的AI，您可以使用或修改该代码。",
      "玩其他用户创建的游戏。",
      "参与“前五名”和“月度最佳游戏”等竞赛。",
      "获得一个免费的域名地址（例如，yourgame.zarlo.com）。",
      "如果您愿意，可以购买自己的私人/自定义域名。",
    ],
    section2Title: "游戏归谁所有？",
    section2Text:
      "您通过网站创建的每款游戏或内容仅归您所有。这意味着：",
    section2List: [
      "您可以在任何地方发布您的游戏。",
      "您可以不受任何限制地出售、分享或分发它。",
      "网站不对您的游戏或其内容主张所有权。",
      "未经您的许可，我们不会使用您的游戏。",
    ],
    section3Title: "在网站上展示您的游戏",
    section3Text:
      "如果我们想在“前五名”列表或主页等地方展示您的游戏，我们会先明确征得您的许可。我们不会在没有您明确同意的情况下公开展示您的游戏。",
    section4Title: "免费和付费域名",
    section4Text:
      "如果您不购买私人域名，您的游戏将有一个包含我们网站名称的免费地址，例如：yourgame.zarlo.com。如果您想要一个不带我们品牌的独特域名，您可以购买一个私人域名。",
    section5Title: "游戏中允许和禁止的内容是什么？",
    section5Text:
      "您可以创建包含动作、战斗或漫画风格暴力的游戏。但是，禁止上传包含以下内容的游戏：",
    section5List: [
      "针对个人或群体的仇恨、种族主义、歧视或有害言论。",
      "露骨或冒犯性的性内容。",
      "非法内容或侵犯版权的材料。如果违反这些规则，我们可能会从网站上删除您的内容。",
    ],
    section6Title: "责任和内容备份",
    section6Text:
      "网站以“现状”提供服务，不保证您的游戏始终可用或无错误。重要的是，您应在自己的电脑或其他地方保留游戏的备份，以避免丢失。",
    section7Title: "您的账户和安全",
    section7Text:
      "您对账户上发生的一切负责。请保持您的密码安全，不要与任何人分享您的登录信息。",
    section8Title: "条款变更",
    section8Text:
      "我们可能会不时更新这些条款。在更新后继续使用网站意味着您同意新的条款。",
    section9Title: "联系我们",
    section9Text:
      "如果您有任何问题、请求或疑问，请随时通过以下方式联系我们：",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "字体大小",
    fontCloseButton: "关闭字体控制",
    fontPlaceholder: "自定义像素",
  },
  ar: {
    title: "شروط الخدمة",
    updateDate: "آخر تحديث: 7 أغسطس 2025",
    section1Title: "ما هي خدمتنا؟",
    section1Text:
      "تتيح منصتنا لك إنشاء وإدارة الألعاب باستخدام الذكاء الاصطناعي (AI) وأدوات متقدمة. من خلال الموقع، يمكنك:",
    section1List: [
      "جعل الذكاء الاصطناعي الخاص بنا ينشئ ألعابًا لك تلقائيًا بناءً على تعليماتك.",
      "تعديل وتحرير هذه الألعاب مباشرة على الموقع في أي وقت، دون الحاجة إلى برامج إضافية.",
      "بعد إنشاء لعبة، يمكنك بسهولة إضافة خادم لعبة متعدد اللاعبين مباشرة على الموقع.",
      "استخدام ذكاء اصطناعي آخر يولد رمزًا ويوفر معاينة فورية للرمز، والتي يمكنك استخدامها أو تعديلها.",
      "لعب الألعاب التي أنشأها مستخدمون آخرون.",
      "المشاركة في مسابقات مثل «أفضل 5» و«لعبة الشهر».",
      "الحصول على عنوان نطاق مجاني (على سبيل المثال، yourgame.zarlo.com).",
      "وإذا أردت، يمكنك شراء نطاق خاص/مخصص بك.",
    ],
    section2Title: "من يملك الألعاب؟",
    section2Text:
      "كل لعبة أو محتوى تقوم بإنشائه عبر الموقع يعود ملكيته لك وحدك. هذا يعني:",
    section2List: [
      "يمكنك نشر لعبتك في أي مكان تريد.",
      "يمكنك بيعها أو مشاركتها أو توزيعها دون أي قيود.",
      "الموقع لا يدعي ملكية لعبتك أو محتواها.",
      "لن نستخدم لعبتك دون إذنك.",
    ],
    section3Title: "عرض ألعابك على الموقع",
    section3Text:
      "إذا أردنا عرض لعبتك في أماكن مثل قائمة «أفضل 5» أو الصفحة الرئيسية، فسنطلب إذنك الصريح أولاً. لن نعرض لعبتك علنًا دون موافقتك الواضحة.",
    section4Title: "النطاقات المجانية والمدفوعة",
    section4Text:
      "إذا لم تشترِ نطاقًا خاصًا، فستحصل لعبتك على عنوان مجاني يتضمن اسم موقعنا، على سبيل المثال: yourgame.zarlo.com. إذا كنت تريد نطاقًا فريدًا دون علامتنا التجارية، يمكنك شراء نطاق خاص.",
    section5Title: "ما الذي يُسمح به وما الذي يُمنع في الألعاب؟",
    section5Text:
      "يمكنك إنشاء ألعاب تتضمن الحركة أو القتال أو العنف بأسلوب الكوميكس. ومع ذلك، يُمنع تحميل الألعاب التي تحتوي على:",
    section5List: [
      "الكراهية أو العنصرية أو التمييز أو الخطاب الضار ضد الأفراد أو الجماعات.",
      "محتوى جنسي صريح أو مسيء.",
      "محتوى غير قانوني أو مواد تنتهك حقوق الطبع والنشر. إذا تم خرق هذه القواعد، قد نزيل محتواك من الموقع.",
    ],
    section6Title: "المسؤولية ونسخ المحتوى احتياطيًا",
    section6Text:
      "يوفر الموقع الخدمة «كما هي» ولا يضمن أن تكون ألعابك متاحة دائمًا أو خالية من الأخطاء. من المهم أن تحتفظ بنسخ احتياطية من ألعابك على جهاز الكمبيوتر الخاص بك أو في مكان آخر لتجنب فقدانها.",
    section7Title: "حسابك والأمان",
    section7Text:
      "أنت مسؤول عن كل ما يحدث مع حسابك. يرجى الحفاظ على كلمة المرور الخاصة بك آمنة وعدم مشاركة تفاصيل تسجيل الدخول الخاصة بك مع أي شخص.",
    section8Title: "تغييرات في الشروط",
    section8Text:
      "قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرار استخدام الموقع بعد التحديثات يعني موافقتك على الشروط الجديدة.",
    section9Title: "اتصل بنا",
    section9Text:
      "إذا كانت لديك أي أسئلة أو طلبات أو مشاكل، لا تتردد في التواصل معنا في أي وقت على:",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "حجم الخط",
    fontCloseButton: "إغلاق عناصر التحكم في الخط",
    fontPlaceholder: "بكسل مخصص",
  },
  he: {
    title: "תנאי השירות",
    updateDate: "עודכן לאחרונה: 7 באוגוסט 2025",
    section1Title: "מהי השירות שלנו?",
    section1Text:
      "הפלטפורמה שלנו מאפשרת לך ליצור ולנהל משחקים באמצעות בינה מלאכותית (AI) וכלים מתקדמים. דרך האתר תוכל:",
    section1List: [
      "לגרום ל-AI שלנו ליצור משחקים עבורך באופן אוטומטי על בסיס ההוראות שלך.",
      "לערוך ולשנות את המשחקים האלה ישירות באתר בכל עת, ללא צורך בתוכנה נוספת.",
      "לאחר יצירת משחק, להוסיף בקלות שרת משחק מרובה משתתפים ישירות באתר.",
      "להשתמש ב-AI נוסף שמייצר קוד ומספק תצוגה מקדימה בזמן אמת של הקוד, אותו תוכל להשתמש או לשנות.",
      "לשחק במשחקים שנוצרו על ידי משתמשים אחרים.",
      "להשתתף בתחרויות כמו «חמשת המובילים» ו«משחק החודש».",
      "לקבל כתובת דומיין חינמית (לדוגמה, yourgame.zarlo.com).",
      "ואם תרצה, לרכוש דומיין פרטי/מותאם אישית משלך.",
    ],
    section2Title: "מי הבעלים של המשחקים?",
    section2Text:
      "כל משחק או תוכן שתיצור דרך האתר שייך רק לך. זה אומר:",
    section2List: [
      "אתה יכול לפרסם את המשחק שלך בכל מקום שתרצה.",
      "אתה יכול למכור, לשתף או להפיץ אותו ללא מגבלות.",
      "האתר לא תובע בעלות על המשחק שלך או על התוכן שלו.",
      "לא נשתמש במשחק שלך ללא רשותך.",
    ],
    section3Title: "הצגת המשחקים שלך באתר",
    section3Text:
      "אם נרצה להציג את המשחק שלך במקומות כמו רשימת «חמשת המובילים» או בדף הבית, נבקש תחילה את רשותך המפורשת. לא נציג את המשחק שלך בפומבי ללא הסכמתך המפורשת.",
    section4Title: "דומיינים חינמיים ותשלום",
    section4Text:
      "אם לא תרכוש דומיין פרטי, למשחק שלך תהיה כתובת חינמית שכוללת את שם האתר שלנו, לדוגמה: yourgame.zarlo.com. אם תרצה דומיין ייחודי ללא המיתוג שלנו, תוכל לרכוש דומיין פרטי.",
    section5Title: "מה מותר ואסור במשחקים?",
    section5Text:
      "אתה יכול ליצור משחקים הכוללים אקשן, קרבות או אלימות בסגנון קומיקס. עם זאת, אסור להעלות משחקים שמכילים:",
    section5List: [
      "שנאה, גזענות, אפליה או דיבור פוגעני נגד יחידים או קבוצות.",
      "תוכן מיני מפורש או פוגעני.",
      "תוכן לא חוקי או חומר המפר זכויות יוצרים. אם כללים אלה יופרו, אנו עשויים להסיר את התוכן שלך מהאתר.",
    ],
    section6Title: "אחריות וגיבוי תוכן",
    section6Text:
      "האתר מספק את השירות «כפי שהוא» ואינו מבטיח שהמשחקים שלך יהיו זמינים תמיד או נקיים משגיאות. חשוב שתשמור גיבויים של המשחקים שלך במחשב שלך או במקום אחר כדי למנוע אובדן.",
    section7Title: "החשבון שלך ואבטחה",
    section7Text:
      "אתה אחראי לכל מה שקורה בחשבונך. אנא שמור על הסיסמה שלך מאובטחת ואל תשתף את פרטי הכניסה שלך עם אף אחד.",
    section8Title: "שינויים בתנאים",
    section8Text:
      "אנו עשויים לעדכן את התנאים האלה מעת לעת. המשך השימוש באתר לאחר עדכונים פירושו שאתה מסכים לתנאים החדשים.",
    section9Title: "צור קשר",
    section9Text:
      "אם יש לך שאלות, בקשות או בעיות, אל תהסס לפנות אלינו בכל עת בכתובת:",
    section9Email: "zerlocontactus@gmail.com",
    fontButton: "גודל גופן",
    fontCloseButton: "סגור בקרות גופן",
    fontPlaceholder: "פיקסלים מותאמים אישית",
  },
};

export default function TermsyPage() {
  const [,setUser] = useState<User | null>(null);
  const [lang, setLang] = useState("en");
  const [showFontControls, setShowFontControls] = useState(false);
  const [, setFontSize] = useState<number | null>(null);
  const supabase = createClient();

  const fetchUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setUser(data.user);
      setLang(data.user.user_metadata?.language || "en");
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const applyFontSize = (size: number) => {
    document.querySelectorAll(".content, .title, h1, h2, p, li").forEach((el) => {
      (el as HTMLElement).style.fontSize = size + "px";
    });
    setFontSize(size);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      applyFontSize(value);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <main
      className="min-h-screen py-12 px-6"
    style={{
      backgroundSize: "100% auto", // full width, auto height
      backgroundPosition: "center -130px", // move image down
      backgroundRepeat: "no-repeat",
      backgroundImage: 'url("/assets/images/bg.jpg")'
    }}
    >
      {/* Fixed Font Control Button in Top-Right */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 999 }}>
        <Button
          variant={"blueFont"}
          onClick={() => setShowFontControls(!showFontControls)}
        >
          {showFontControls ? t.fontCloseButton : t.fontButton}
        </Button>

        {showFontControls && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "0.8rem",
              boxShadow:
                "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
              marginTop: "0.5rem",
              width: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Input
              type="number"
              placeholder={t.fontPlaceholder}
              onChange={handleSearchChange}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {[12, 14, 16, 18, 20, 24].map((size) => (
                <Button
                  key={size}
                  variant={"blueFont"}
                  onClick={() => applyFontSize(size)}
                >
                  {size}px
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="terms-container">
        <div className="title">
          <h1 className="text-3xl font-sans font-light italic text-gray-900">{t.title}</h1>
          <p className="update-date">{t.updateDate}</p>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section1Title}</h2>
          <p>{t.section1Text}</p>
          <ul>
            {t.section1List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section2Title}</h2>
          <p>{t.section2Text}</p>
          <ul>
            {t.section2List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section3Title}</h2>
          <p>{t.section3Text}</p>
        </div>

        <div className="content">
          <h2>{t.section4Title}</h2>
          <p>{t.section4Text}</p>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section5Title}</h2>
          <p>{t.section5Text}</p>
          <ul>
            {t.section5List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section6Title}</h2>
          <p>{t.section6Text}</p>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section7Title}</h2>
          <p>{t.section7Text}</p>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section8Title}</h2>
          <p>{t.section8Text}</p>
        </div>

        <div className="content">
          <h2 className="font-sans font-light italic">{t.section9Title}</h2>
          <p>
            {t.section9Text}{" "}
            <a href={`mailto:${t.section9Email}`}>{t.section9Email}</a>.
          </p>
        </div>
      </div>
    </main>
  );
}