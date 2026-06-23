import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// In-memory Database Mock
let announcements = [
  {
    id: 1,
    date: "23 Juin 2026",
    category: "admin",
    title_fr: "Ouverture des visites médicales",
    desc_fr: "La DGP informe les futurs pèlerins que les visites médicales d'aptitude ont débuté dans les hôpitaux régionaux agréés. Veuillez prendre rendez-vous rapidement.",
    title_wo: "Tambali wér-gi-yaram seet gi",
    desc_wo: "Njiitu Hajj bi (DGP) ngi xamal pèlerin yi ne faj gi door na ci fajukaay yu mag yi ci reew mi. Waajleen ko ci saasa.",
    title_ar: "بدء الفحوصات الطبية للحجاج",
    desc_ar: "تعلن البعثة الرسمية للحجاج عن بدء الفحوصات الطبية للتأكد من القدرة البدنية في المستشفيات الإقليمية. يرجى حجز موعد سريعاً."
  },
  {
    id: 2,
    date: "15 Juin 2026",
    category: "security",
    title_fr: "Mise en garde contre les faux démarcheurs",
    desc_fr: "Attention aux intermédiaires non agréés qui proposent des visas ou forfaits Hajj parallèles. Seules les agences officielles ont l'autorisation.",
    title_wo: "Moytooleen naxkat yi",
    desc_wo: "Moytooleen ñiy jaay visa yu fake walla forfaits yu amul yoon. Agence yu dëggër yi rekk lañu nangu.",
    title_ar: "تحذير من سماسرة التأشيرات غير المرخصين",
    desc_ar: "تحذر بعثة الحج من التعامل مع الوسطاء غير المعتمدين الذين يعرضون تأشيرات أو باقات حج موازية. الوكالات المرخصة هي المصرح لها فقط."
  }
];

let agencies = [
  {
    id: 1,
    name: "Voyages Teranga Hajj & Omra",
    price: 3600000,
    type: "economique",
    rating: 4.8,
    address: "Avenue Cheikh Anta Diop, Dakar",
    phone: "+221 33 824 12 34",
    email: "contact@terangahajj.sn",
    desc_fr: "Package économique comprenant le vol charter, l'hébergement en hôtel 3 étoiles à La Mecque à 1.5km du Haram (avec navettes gratuites 24h/24), et restauration sénégalaise.",
    desc_wo: "Forfait bu yomb ci ndaje, and ak plane bi, dëkk ci hôtel 3 étoiles (1.5km ci Haram) and ak auto transport, ak ñam u Sénégal.",
    desc_ar: "باقة اقتصادية متميزة تشمل الطيران العارض، السكن في فندق 3 نجوم على بعد 1.5 كم من الحرم مع حافلات نقل مجانية على مدار الساعة، ووجبات سنغالية يومية.",
    features: ["Vol direct Dakar-Djeddah", "Hébergement 3★ avec navette", "Demi-pension (Plats sénégalais)", "Guide religieux dédié", "Assistance médicale incluse"]
  },
  {
    id: 2,
    name: "Dakar Air Services Hajj",
    price: 4900000,
    type: "standard",
    rating: 4.5,
    address: "Immeuble Fahd, Place de l'Indépendance, Dakar",
    phone: "+221 33 889 45 45",
    email: "hajj@dakarair.sn",
    desc_fr: "Forfait standard de grande qualité. Hôtel 4 étoiles à Médine et La Mecque à 500m du Haram. Pension complète et encadrement spirituel par des oulémas réputés.",
    desc_wo: "Forfait standard bu am qualité. Hôtel 4 étoiles ci Médine ak Maka ci 500m ci Haram. Dunde bu mat ak ñaani oulémas yu rëy.",
    desc_ar: "باقة قياسية عالية الجودة. فندق 4 نجوم في المدينة ومكة على بعد 500 متر من الحرم. إقامة كاملة مع إرشاد ديني متميز من أشهر العلماء السنغاليين.",
    features: ["Vol régulier Royal Air Maroc", "Hôtels 4★ proches des Harams", "Pension complète buffet", "Médecin sénégalais dans l'hôtel", "Séminaires préparatoires inclus"]
  },
  {
    id: 3,
    name: "Sahel Omra & Hajj Confort",
    price: 8500000,
    type: "vip",
    rating: 4.9,
    address: "Almadies, Route du Méridien, Dakar",
    phone: "+221 33 869 90 00",
    email: "vip@sahelhajj.com",
    desc_fr: "L'excellence pour votre pèlerinage. Hôtels 5 étoiles situés directement sur l'esplanade du Haram (Makkah Clock Tower). Tentes VIP climatisées à Mina et Arafat avec lits.",
    desc_wo: "Forfait VIP bu gën a mag. Hôtel 5 étoiles ci Haram bi rekk (Clock Tower). Tente VIP and ak clim ak lal ci Mina ak Arafat.",
    desc_ar: "باقة النخبة الفاخرة. فندق 5 نجوم مطل مباشرة على ساحة الحرم (أبراج البيت). مخيمات مطورة لكبار الشخصيات مكيفة ومجهزة بأسرة في منى وعرفات.",
    features: ["Vol Business Class Emirates", "Hôtels 5★ sur le Haram", "Pension complète gastronomique", "Tentes VIP privées à Mina", "Assistance personnalisée 24h/24"]
  }
];

const defaultChecklist = [
  { id: 1, cat: "admin", text_fr: "Vérifier la validité de mon passeport (min 6 mois)", text_wo: "Seet lane passeport bi am na 6 mois laata mu reer", text_ar: "التحقق من صلاحية جواز السفر (6 أشهر كحد أدنى)", checked: false },
  { id: 2, cat: "admin", text_fr: "Faire les photos d'identité aux normes saoudiennes", text_wo: "Defal photo identité yu Maka nangu", text_ar: "إعداد الصور الشخصية بالمواصفات السعودية المطلوبة", checked: false },
  { id: 3, cat: "health", text_fr: "Faire le vaccin obligatoire (Méningite & Fièvre jaune)", text_wo: "Def vaccins obligatoires yi (Méningite, Fièvre Jaune)", text_ar: "أخذ اللقاحات الإلزامية (الحمى الشوكية والصفراء)", checked: false },
  { id: 4, cat: "health", text_fr: "Préparer une trousse médicale (pansements, paracétamol)", text_wo: "Defal sa boite pharmacie (pansements, médicaments)", text_ar: "تجهيز حقيبة طبية شخصية (مسكنات، مطهر، ضمادات)", checked: false },
  { id: 5, cat: "luggage", text_fr: "Acheter deux pagnes d'Ihram blancs (pour les hommes)", text_wo: "Jënd 2 pagnes Ihram yu weex (ngir goor yi)", text_ar: "شراء ملابس الإحرام البيضاء (للرجال)", checked: false },
  { id: 6, cat: "luggage", text_fr: "Préparer une valise solide identifiée avec nom et adresse", text_wo: "Waajal valise bu dëggër and ak sa tour ak sa adresse", text_ar: "تجهيز حقيبة متينة وكتابة الاسم والعنوان عليها بوضوح", checked: false },
  { id: 7, cat: "spiritual", text_fr: "Apprendre les invocations de base et l'intention du Hajj", text_wo: "Jàng ñaan u Hajj yi ak intention u Hajj bi", text_ar: "حفظ الأدعية الأساسية ونية أداء مناسك الحج", checked: false }
];

let inquiries = [];

// API ENDPOINTS

// 1. Announcements
app.get('/api/announcements', (req, res) => {
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const { category, title_fr, desc_fr, title_wo, desc_wo, title_ar, desc_ar } = req.body;
  if (!title_fr || !desc_fr) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  const newAnn = {
    id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: category || 'admin',
    title_fr,
    desc_fr,
    title_wo: title_wo || title_fr,
    desc_wo: desc_wo || desc_fr,
    title_ar: title_ar || title_fr,
    desc_ar: desc_ar || desc_fr
  };

  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

// 2. Agencies
app.get('/api/agencies', (req, res) => {
  res.json(agencies);
});

app.post('/api/agencies', (req, res) => {
  const { name, price, type, rating, address, phone, email, desc_fr, desc_wo, desc_ar, features } = req.body;
  if (!name || !price || !type) {
    return res.status(400).json({ error: "Champs obligatoires manquants (nom, prix, type)" });
  }

  const newAgency = {
    id: agencies.length > 0 ? Math.max(...agencies.map(a => a.id)) + 1 : 1,
    name,
    price: parseInt(price),
    type,
    rating: parseFloat(rating) || 4.5,
    address: address || "Dakar, Sénégal",
    phone: phone || "+221 ",
    email: email || "",
    desc_fr: desc_fr || name,
    desc_wo: desc_wo || desc_fr || name,
    desc_ar: desc_ar || desc_fr || name,
    features: features || ["Assistance médicale", "Encadrement religieux"]
  };

  agencies.push(newAgency);
  res.status(201).json(newAgency);
});

app.delete('/api/agencies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  agencies = agencies.filter(a => a.id !== id);
  res.json({ message: "Agence retirée avec succès", id });
});

// 3. Agency Inquiries / Contact forms
app.post('/api/agencies/:id/inquiry', (req, res) => {
  const id = parseInt(req.params.id);
  const agency = agencies.find(a => a.id === id);
  if (!agency) {
    return res.status(404).json({ error: "Agence introuvable" });
  }

  const { name, phone } = req.body;
  const newInquiry = {
    id: inquiries.length + 1,
    agencyId: id,
    agencyName: agency.name,
    clientName: name,
    clientPhone: phone,
    timestamp: new Date()
  };

  inquiries.push(newInquiry);
  console.log(`[INQUIRY RECEVIED] Pour ${agency.name} par ${name} (${phone})`);
  res.status(201).json({ message: "Demande reçue", inquiry: newInquiry });
});

// 4. Default Checklist
app.get('/api/checklist', (req, res) => {
  res.json(defaultChecklist);
});

// 5. Budget Calculation and personalized advice
app.post('/api/budget/calculate', (req, res) => {
  const { packagePrice, pocketMoney, sacrificePrice, shoppingPrice, lang } = req.body;
  const total = parseInt(packagePrice || 0) + parseInt(pocketMoney || 0) + parseInt(sacrificePrice || 0) + parseInt(shoppingPrice || 0);
  
  let advice = "";
  const selectedLang = lang || 'fr';

  if (total > 8000000) {
    if (selectedLang === 'ar') {
      advice = "ميزانيتك ممتازة وتغطي الباقات الفاخرة (VIP). ننصحك بالتأكد من جودة الخدمات التعاقدية كالفنادق والمواصلات الخاصة.";
    } else if (selectedLang === 'wo') {
      advice = "Sa koppar fés na lool. Waajal say hôtel 5 étoiles ak auto transport yu VIP.";
    } else {
      advice = "Votre budget correspond à un forfait haut de gamme (VIP). Assurez-vous d'avoir des garanties contractuelles solides sur les hôtels 5 étoiles et les transports privatifs.";
    }
  } else if (total < 4200000) {
    if (selectedLang === 'ar') {
      advice = "ميزانيتك تقع ضمن الفئة الاقتصادية. تأكد من توفر حافلات مجانية لنقلك من الفندق إلى الحرم المكي الشريف لتجنب أعباء المشي الطويل.";
    } else if (selectedLang === 'wo') {
      advice = "Sa koppar dafa yomb. Seetal bu baax ndax am na auto transport di jogé hôtel ba Haram bi.";
    } else {
      advice = "Votre budget est dans la tranche économique. Vérifiez que l'agence agréée propose des navettes de transport régulières entre l'hôtel et le Haram.";
    }
  } else {
    if (selectedLang === 'ar') {
      advice = "ميزانيتك متوازنة جداً. نوصي دائماً بالاحتفاظ بنسبة 10% إضافية للحالات الطبية أو النفقات غير المتوقعة في الأراضي المقدسة.";
    } else if (selectedLang === 'wo') {
      advice = "Sa koppar ngi fés bu baax. Prévoyal say koppari emergency (10% li ci des) ngir wér-gi-yaram walla leneen lu jot ci Maka.";
    } else {
      advice = "Votre budget est bien équilibré. Prévoyez toujours une marge d'au moins 10% en cas d'urgence médicale ou de frais imprévus en Arabie Saoudite.";
    }
  }

  res.json({ total, advice });
});

// 6. Traffic Stats (Admin dashboard query)
app.get('/api/stats', (req, res) => {
  res.json({
    totalVisits: 1245,
    activePilgrims: 412,
    registeredInquiries: inquiries.length,
    announcementsCount: announcements.length,
    agenciesCount: agencies.length,
    inquiriesHistory: inquiries.slice(-5) // Get last 5 inquiries
  });
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Sunu Hajj Server running on http://localhost:${PORT}`);
  console.log(`========================================`);
});
