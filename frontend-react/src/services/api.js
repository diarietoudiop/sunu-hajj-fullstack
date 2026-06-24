const API_BASE = 'http://localhost:3000/api';

// Fallback Mock Data in case backend is offline
const MOCK_STATS = {
  totalVisits: 1245,
  activePilgrims: 412,
  registeredInquiries: 3,
  announcementsCount: 2,
  agenciesCount: 3,
  inquiriesHistory: [
    { id: 1, agencyId: 1, agencyName: "Voyages Teranga Hajj", clientName: "Moussa Ndiaye", clientPhone: "+221 77 123 45 67", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, agencyId: 2, agencyName: "Dakar Air Services", clientName: "Fatou Sow", clientPhone: "+221 76 987 65 43", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, agencyId: 3, agencyName: "Sahel Hajj Confort", clientName: "Abdou Diop", clientPhone: "+221 70 555 44 33", timestamp: new Date(Date.now() - 86400000).toISOString() }
  ]
};

const MOCK_AGENCIES = [
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

const MOCK_ANNOUNCEMENTS = [
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

export const ApiService = {
  // Test backend connection
  async checkConnection() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Get Stats
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, using mock stats.");
      return MOCK_STATS;
    }
  },

  // Get Agencies
  async getAgencies() {
    try {
      const res = await fetch(`${API_BASE}/agencies`);
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, using mock agencies.");
      return MOCK_AGENCIES;
    }
  },

  // Add Agency
  async addAgency(agency) {
    try {
      const res = await fetch(`${API_BASE}/agencies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agency)
      });
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, adding agency locally (mock).");
      const mockNew = {
        id: Date.now(),
        ...agency,
        price: parseInt(agency.price) || 4000000,
        rating: 4.5
      };
      return { mock: true, data: mockNew };
    }
  },

  // Delete Agency
  async deleteAgency(id) {
    try {
      const res = await fetch(`${API_BASE}/agencies/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) return true;
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, deleting agency locally (mock).");
      return { mock: true, id };
    }
  },

  // Get Announcements
  async getAnnouncements() {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, using mock announcements.");
      return MOCK_ANNOUNCEMENTS;
    }
  },

  // Add Announcement
  async addAnnouncement(announcement) {
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement)
      });
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, adding announcement locally (mock).");
      const mockNew = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        ...announcement
      };
      return { mock: true, data: mockNew };
    }
  },

  // Get Pilgrims
  async getPilgrims() {
    try {
      const res = await fetch(`${API_BASE}/pilgrims`);
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, using mock pilgrims.");
      return MOCK_PILGRIMS;
    }
  },

  // Register Pilgrim
  async registerPilgrim(pilgrim) {
    try {
      const res = await fetch(`${API_BASE}/pilgrims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pilgrim)
      });
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, registering pilgrim locally (mock).");
      const mockNew = {
        id: Date.now(),
        ...pilgrim,
        medicalStatus: 'pending',
        registrationStatus: 'pending',
        registrationDate: new Date().toISOString().split('T')[0]
      };
      return { mock: true, data: mockNew };
    }
  },

  // Update Pilgrim Registration Status
  async updatePilgrimStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/pilgrims/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, updating status locally (mock).");
      return { mock: true, id, status };
    }
  },

  // Update Pilgrim Medical Status
  async updatePilgrimMedical(id, medicalStatus) {
    try {
      const res = await fetch(`${API_BASE}/pilgrims/${id}/medical`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicalStatus })
      });
      if (res.ok) return await res.json();
      throw new Error("API error");
    } catch (err) {
      console.warn("Backend offline, updating medical status locally (mock).");
      return { mock: true, id, medicalStatus };
    }
  }
};

const MOCK_PILGRIMS = [
  {
    id: 1,
    fullName: "Moustapha Diop",
    phone: "+221 77 567 89 12",
    email: "moustapha.diop@gmail.com",
    passportNumber: "SN9876543",
    birthDate: "1988-05-14",
    bloodType: "A+",
    medicalStatus: "apte",
    registrationStatus: "approved",
    selectedAgencyId: 1,
    emergencyContact: { name: "Awa Diop (Épouse)", phone: "+221 76 112 34 56" },
    registrationDate: "2026-06-10"
  },
  {
    id: 2,
    fullName: "Khadidiatou Diallo",
    phone: "+221 78 123 45 67",
    email: "khadija.diallo@hotmail.fr",
    passportNumber: "SN1234567",
    birthDate: "1994-11-23",
    bloodType: "O-",
    medicalStatus: "pending",
    registrationStatus: "pending",
    selectedAgencyId: 2,
    emergencyContact: { name: "Ibrahima Diallo (Frère)", phone: "+221 70 889 00 11" },
    registrationDate: "2026-06-18"
  },
  {
    id: 3,
    fullName: "Ousmane Ndiaye",
    phone: "+221 70 999 88 77",
    email: "ousmane.ndiaye@yahoo.sn",
    passportNumber: "SN4567890",
    birthDate: "1972-02-05",
    bloodType: "B+",
    medicalStatus: "apte",
    registrationStatus: "pending",
    selectedAgencyId: 1,
    emergencyContact: { name: "Fatoumata Ndiaye (Fille)", phone: "+221 77 444 33 22" },
    registrationDate: "2026-06-20"
  },
  {
    id: 4,
    fullName: "Aïssatou Sow",
    phone: "+221 76 456 78 90",
    email: "aissatou.sow@live.fr",
    passportNumber: "SN3344556",
    birthDate: "1965-09-30",
    bloodType: "O+",
    medicalStatus: "inapte",
    registrationStatus: "rejected",
    selectedAgencyId: 3,
    emergencyContact: { name: "Abdou Sow (Fils)", phone: "+221 77 888 99 99" },
    registrationDate: "2026-06-22"
  }
];
