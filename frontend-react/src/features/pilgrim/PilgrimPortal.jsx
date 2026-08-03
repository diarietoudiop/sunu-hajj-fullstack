import React, { useState, useEffect } from 'react';
import { 
  User, CreditCard, Shield, Plane, Hotel, CheckSquare, 
  Wallet, FileText, Send, LogOut, Sun, Moon, CheckCircle2, 
  Clock, XCircle, ShieldCheck, Heart, Smartphone, Upload, Edit, Save, X, Globe, Menu, Compass, Bell
} from 'lucide-react';
import { ApiService, sendRealSms, sendRealEmail } from '../../services/api';

const TRANSLATIONS = {
  fr: {
    title: "SUNU HAJJ",
    subtitle: "Espace Pèlerin Sunu Hajj",
    welcome: "Assalamou Alaykoum",
    desc: "Suivez l'avancement de vos visas, de vos vols charter et organisez vos préparatifs en toute sérénité.",
    passport: "Passeport Sénégalais",
    dossierTitle: "Mon Dossier Sunu Hajj",
    agency: "Agence Hajj Agréée",
    blood: "Groupe Sanguin",
    phone: "Téléphone",
    email: "Adresse Email",
    emergency: "Proche à contacter (Urgence)",
    notSpecified: "Non renseigné",
    validationDgp: "Validation Sunu Hajj :",
    medicalStatus: "Aptitude Médicale :",
    logisticsTitle: "Vos Informations de Voyage & Visas",
    nusukSync: "Portail Saoudien Nusuk",
    visaStatus: "Visa Officiel Hajj",
    flight: "Vol Charter assigné",
    room: "Numéro de Chambre",
    hotelMakkah: "Logement La Mecque (Makkah)",
    hotelMadinah: "Logement Médine (Madinah)",
    checklistTitle: "Ma Checklist interactive de voyage",
    budgetTitle: "Simulateur de Budget Hajj",
    budgetTotal: "Budget Total Estimé :",
    budgetAdvice: "Conseil Logistique Sunu Hajj :",
    vaultTitle: "Coffre-fort Documents Chiffrés",
    vaultDesc: "Sauvegardez de manière sécurisée vos pièces officielles sur les serveurs de la Sunu Hajj.",
    smsTitle: "Alerter ma Famille par SMS",
    smsDesc: "Configurez le numéro de votre proche au Sénégal et simulez des alertes rapides.",
    logout: "Déconnexion",
    editCoords: "Modifier mon dossier",
    save: "Enregistrer les modifications",
    cancel: "Annuler",
    statusOnline: "Serveur Sunu Hajj Connecté",
    statusOffline: "Mode Offline local",
    portalLabel: "Portail Pèlerin Officiel",
    noAgency: "Sans agence",
    waitingLogistics: "Logistique de voyage en attente",
    waitingLogisticsDesc: "Vos informations de vol charter, d'hôtels à Makkah/Madinah et votre visa s'afficheront ici dès que la Sunu Hajj aura validé votre dossier.",
    importer: "Importer",
    charge: "Chargé",
    nonFourni: "Non fourni",
    passportCopy: "Copie de Passeport",
    vaccineCard: "Carnet de Vaccination",
    phoneEmergency: "Téléphone du proche",
    nameEmergency: "Nom du proche",
    smsAero: "✈️ Aéroport",
    smsArriv: "🇸🇦 Arrivée Djeddah",
    smsArafat: "⛰️ Mont Arafat",
    smsRet: "🔄 Vol Retour",
    medApte: "🟢 Apte au Voyage",
    medInapte: "🔴 Inaptitude Médicale",
    medAttente: "⏳ En attente examen",
    insValide: "🟢 Inscription Validée",
    insRefuse: "🔴 Inscription Refusée",
    insExamen: "⏳ Dossier en examen",
    nusukSyncLabel: "🇸🇦 Synchronisé",
    nusukAttente: "⏳ En attente",
    visaEmis: "🟢 Émis (Consulat)",
    visaRefuse: "🔴 Refusé / Bloqué",
    visaCours: "⏳ En cours",
    priceAgency: "Forfait de l'Agence Hajj",
    pocketMoney: "Argent de poche personnel",
    sacrifice: "Frais de sacrifice (Hady)",
    shopping: "Cadeaux & Achats (Shopping)",
    budgetTight: "Budget très serré. Veillez à limiter les frais de shopping et à négocier au mieux votre package d'hébergement.",
    budgetBalanced: "Budget équilibré et conforme aux recommandations Sunu Hajj. Recommandé pour un séjour serein.",
    budgetVip: "Budget confortable (VIP). Parfait pour bénéficier des hôtels proches des Harams et des services haut de gamme.",
    smsAlertSuccess: "Alerte SMS envoyée avec succès !",
    fullNameLabel: "Nom Complet",
    tabDossier: "Mon Dossier Hajj",
    tabLogistics: "Suivi Voyage & Visa",
    tabChecklist: "Checklist Préparatifs",
    tabBudget: "Budget & Simulateur",
    tabVault: "Coffre-fort Documents",
    tabSMS: "SMS Alertes Famille",
    officialBadge: "PÈLERIN OFFICIEL"
  },
  en: {
    title: "SUNU HAJJ",
    subtitle: "Sunu Hajj Pilgrim Portal",
    welcome: "Assalamou Alaykoum",
    desc: "Track the progress of your visas, charter flights and organize your preparations with peace of mind.",
    passport: "Senegalese Passport",
    dossierTitle: "My Sunu Hajj Senegal File",
    agency: "Approved Hajj Agency",
    blood: "Blood Type",
    phone: "Phone Number",
    email: "Email Address",
    emergency: "Emergency Contact",
    notSpecified: "Not specified",
    validationDgp: "Sunu Hajj Validation:",
    medicalStatus: "Medical Fitness:",
    logisticsTitle: "Your Travel & Visa Information",
    nusukSync: "Saudi Nusuk Portal",
    visaStatus: "Official Hajj Visa",
    flight: "Assigned Charter Flight",
    room: "Room Number",
    hotelMakkah: "Makkah Accommodation",
    hotelMadinah: "Madinah Accommodation",
    checklistTitle: "My Interactive Travel Checklist",
    budgetTitle: "Hajj Budget Simulator",
    budgetTotal: "Estimated Total Budget:",
    budgetAdvice: "Sunu Hajj Logistics Advice:",
    vaultTitle: "Encrypted Documents Vault",
    vaultDesc: "Securely save your official documents on Sunu Hajj Senegal servers.",
    smsTitle: "Alert my Family by SMS",
    smsDesc: "Configure your relative's phone number in Senegal and simulate quick alerts.",
    logout: "Log Out",
    editCoords: "Edit my file",
    save: "Save changes",
    cancel: "Cancel",
    statusOnline: "Sunu Hajj Server Connected",
    statusOffline: "Local Offline Mode",
    portalLabel: "Official Pilgrim Portal",
    noAgency: "No agency",
    waitingLogistics: "Travel logistics pending",
    waitingLogisticsDesc: "Your charter flight details, Makkah/Madinah hotels, and visa will appear here as soon as the Sunu Hajj validates your file.",
    importer: "Import",
    charge: "Uploaded",
    nonFourni: "Not provided",
    passportCopy: "Passport Copy",
    vaccineCard: "Vaccination Card",
    phoneEmergency: "Relative's phone",
    nameEmergency: "Relative's name",
    smsAero: "✈️ Airport",
    smsArriv: "🇸🇦 Jeddah Arrival",
    smsArafat: "⛰️ Mount Arafat",
    smsRet: "🔄 Return Flight",
    medApte: "🟢 Fit for Travel",
    medInapte: "🔴 Unfit for Travel",
    medAttente: "⏳ Awaiting medical exam",
    insValide: "🟢 Registration Approved",
    insRefuse: "🔴 Registration Rejected",
    insExamen: "⏳ File under review",
    nusukSyncLabel: "🇸🇦 Synced",
    nusukAttente: "⏳ Pending",
    visaEmis: "🟢 Issued (Consulate)",
    visaRefuse: "🔴 Refused / Blocked",
    visaCours: "⏳ In progress",
    priceAgency: "Hajj Agency Package",
    pocketMoney: "Personal Pocket Money",
    sacrifice: "Sacrifice fees (Hady)",
    shopping: "Gifts & Shopping",
    budgetTight: "Very tight budget. Limit shopping expenses and negotiate your accommodation package.",
    budgetBalanced: "Balanced budget and in line with Sunu Hajj recommendations. Recommended for a peaceful stay.",
    budgetVip: "Comfortable budget (VIP). Perfect for staying close to the Harams and high-end services.",
    smsAlertSuccess: "SMS Alert sent successfully!",
    fullNameLabel: "Full Name",
    tabDossier: "My Hajj File",
    tabLogistics: "Travel & Visa Tracking",
    tabChecklist: "Preparations Checklist",
    tabBudget: "Budget & Simulator",
    tabVault: "Documents Vault",
    tabSMS: "Family SMS Alerts",
    officialBadge: "OFFICIAL PILGRIM"
  },
  ar: {
    title: "سون الحج",
    subtitle: "بوابة الحاج Sunu Hajj",
    welcome: "السلام عليكم",
    desc: "تابع حالة التأشيرة، رحلات الطيران، وتفاصيل الإقامة في مكة والمدينة بكل سهولة.",
    passport: "جواز السفر السنغالي",
    dossierTitle: "ملفي لدى بعثة الحج السنغالية",
    agency: "وكالة الحج المعتمدة",
    blood: "فصيلة الدم",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    emergency: "شخص للطوارئ",
    notSpecified: "غير محدد",
    validationDgp: "اعتماد البعثة :",
    medicalStatus: "اللياقة الطبية :",
    logisticsTitle: "تفاصيل السفر والإقامة والتأشيرة",
    nusukSync: "منصة نسك السعودية",
    visaStatus: "تأشيرة الحج الرسمية",
    flight: "رحلة الطيران المخصصة",
    room: "رقم الغرفة",
    hotelMakkah: "السكن في مكة المكرمة",
    hotelMadinah: "السكن في المدينة المنورة",
    checklistTitle: "قائمة التحضير التفاعلية للسفر",
    budgetTitle: "محاكي ميزانية الحج",
    budgetTotal: "إجمالي الميزانية التقديرية :",
    budgetAdvice: "نصيحة بعثة الحج :",
    vaultTitle: "خزنة المستندات المشفرة",
    vaultDesc: "احفظ مستنداتك الرسمية بشكل آمن على خوادم البعثة السنغالية.",
    smsTitle: "إرسال تنبيهات للعائلة بالرسائل القصيرة",
    smsDesc: "ضع رقم هاتف قريبك في السنغال لإرسال رسائل قصيرة عند كل مرحلة.",
    logout: "تسجيل الخروج",
    editCoords: "تعديل ملفي",
    save: "حفظ التعديلات",
    cancel: "إلغاء",
    statusOnline: "خادم البعثة متصل",
    statusOffline: "الوضع المحلي (دون اتصال)",
    portalLabel: "بوابة الحاج الرسمية",
    noAgency: "بدون وكالة",
    waitingLogistics: "معلومات السفر والإقامة قيد الانتظار",
    waitingLogisticsDesc: "ستظهر تفاصيل رحلتك، الفنادق، ورقم الغرفة هنا فور اعتماد البعثة لملفك.",
    importer: "تحميل",
    charge: "تم التحميل",
    nonFourni: "غير متوفر",
    passportCopy: "نسخة جواز السفر",
    vaccineCard: "دفتر التطعيمات",
    phoneEmergency: "هاتف قريبك",
    nameEmergency: "اسم قريبك",
    smsAero: "✈️ المطار",
    smsArriv: "🇸🇦 الوصول لجدة",
    smsArafat: "⛰️ صعيد عرفات",
    smsRet: "🔄 رحلة العودة",
    medApte: "🟢 لائق طبياً للحج",
    medInapte: "🔴 غير لائق طبياً",
    medAttente: "⏳ قيد الفحص الطبي",
    insValide: "🟢 تم قبول التسجيل",
    insRefuse: "🔴 تم رفض التسجيل",
    insExamen: "⏳ الملف قيد الدراسة",
    nusukSyncLabel: "🇸🇦 تم الربط بنسِك",
    nusukAttente: "⏳ قيد المزامنة",
    visaEmis: "🟢 تأشيرة صادرة",
    visaRefuse: "🔴 تأشيرة مرفوضة",
    visaCours: "⏳ قيد الإجراء",
    priceAgency: "سعر باقة الوكالة",
    pocketMoney: "المصروف الشخصي",
    sacrifice: "تكلفة الهدي (الأضحية)",
    shopping: "الهدايا والمشتريات",
    budgetTight: "الميزانية محدودة جداً. يرجى تقليل المشتريات واختيار باقات اقتصادية.",
    budgetBalanced: "ميزانية متوازنة ومتوافقة تماماً مع توصيات البعثة الرسمية.",
    budgetVip: "ميزانية مريحة (VIP). مناسبة للفنادق القريبة من الحرمين الشريفين.",
    smsAlertSuccess: "تم إرسال الرسالة بنجاح لقريبك !",
    fullNameLabel: "الاسم الكامل",
    tabDossier: "ملفي الشخصي",
    tabLogistics: "السفر والتأشيرة",
    tabChecklist: "قائمة التحضيرات",
    tabBudget: "الميزانية والنفقات",
    tabVault: "خزنة المستندات",
    tabSMS: "إرسال التنبيهات",
    officialBadge: "حاج رسمي معتمد"
  }
};

const SMS_MESSAGES = {
  fr: {
    depart: "Sunu Hajj: Cher proche, je viens d'enregistrer mes bagages à l'aéroport de Dakar. Prêt pour l'embarquement. Priez pour moi !",
    arrivee: "Sunu Hajj: Alhamdoulillah, je suis bien arrivé à Djeddah. Le voyage s'est bien passé. Je me dirige vers La Mecque.",
    arafat: "Sunu Hajj: Je suis actuellement sur le mont Arafat. Je prie pour toute la famille. Que Dieu accepte nos prières.",
    retour: "Sunu Hajj: Alhamdoulillah, je viens de décoller de Djeddah. Retour imminent à Dakar. À très bientôt !"
  },
  en: {
    depart: "Sunu Hajj: Dear family, I have just checked in my luggage at Dakar Airport. Ready for boarding. Keep me in your prayers!",
    arrivee: "Sunu Hajj: Alhamdoulillah, I have safely arrived in Jeddah. The flight was good. Heading to Makkah now.",
    arafat: "Sunu Hajj: I am currently on Mount Arafat. Praying for the whole family. May Allah accept our prayers.",
    retour: "Sunu Hajj: Alhamdoulillah, I have just taken off from Jeddah. On my way back to Dakar. See you soon!"
  },
  ar: {
    depart: "حجنا: يا عزيزي، لقد أكملت إجراءات الحقائب في مطار دكار وأنا مستعد للصعود إلى الطائرة. نسألكم الدعاء!",
    arrivee: "حجنا: الحمد لله، وصلت بسلام إلى مطار جدة. الرحلة كانت ميسرة وأنا متوجه الآن إلى مكة المكرمة.",
    arafat: "حجنا: أنا الآن في صعيد عرفات الطاهر، أدعو الله لكم بالخير والقبول.",
    retour: "حجنا: الحمد لله، أقلعت طائعتنا من جدة عائدين إلى دكار. نراكم قريباً!"
  }
};

function PilgrimPortal({ pilgrim = {}, isApiOnline, darkMode, setDarkMode, onLogout, onUpdateProfile }) {
  const safePilgrim = pilgrim || {};

  // Navigation & Language state
  const [activeTab, setActiveTab] = useState('dossier');
  const [lang, setLang] = useState('fr');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(safePilgrim.fullName || safePilgrim.name || 'Pèlerin Sunu Hajj');
  const [selectedAgencyId, setSelectedAgencyId] = useState(safePilgrim.selectedAgencyId || 1);
  const [bloodType, setBloodType] = useState(() => {
    try {
      const mockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');
      const found = mockList.find(p => p && (
        p.id === safePilgrim.id || 
        String(p.id) === String(safePilgrim.id) || 
        (p.passportNumber && safePilgrim.passportNumber && p.passportNumber.toUpperCase() === safePilgrim.passportNumber.toUpperCase())
      ));
      if (found && (found.bloodType || found.bloodGroup) && !(found.bloodType || found.bloodGroup).includes('déterminer')) {
        return found.bloodType || found.bloodGroup;
      }
    } catch (e) {}
    return safePilgrim.bloodType || safePilgrim.bloodGroup || 'À déterminer (Visite médicale)';
  });
  const [phone, setPhone] = useState(safePilgrim.phone || '');
  const [email, setEmail] = useState(safePilgrim.email || '');
  const [emergencyContactName, setEmergencyContactName] = useState(safePilgrim.emergencyContact?.name || safePilgrim.emergencyContactName || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(safePilgrim.emergencyContact?.phone || safePilgrim.emergencyContactPhone || '');

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);

  const [agenciesList, setAgenciesList] = useState([]);
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const list = await ApiService.getAgencies();
        setAgenciesList(list || []);
      } catch (e) {}
    };
    fetchAgencies();
  }, []);

  // Synchronize internal states if pilgrim prop changes (after update)
  useEffect(() => {
    if (pilgrim) {
      setFullName(pilgrim.fullName || pilgrim.name || 'Pèlerin Sunu Hajj');
      setSelectedAgencyId(pilgrim.selectedAgencyId || 1);
      
      const latestBlood = pilgrim.bloodType || pilgrim.bloodGroup;
      if (latestBlood && !latestBlood.includes('déterminer')) {
        setBloodType(latestBlood);
      } else {
        setBloodType('À déterminer (Visite médicale)');
      }

      setPhone(pilgrim.phone || '');
      setEmail(pilgrim.email || '');
      setEmergencyContactName(pilgrim.emergencyContact?.name || pilgrim.emergencyContactName || '');
      setEmergencyContactPhone(pilgrim.emergencyContact?.phone || pilgrim.emergencyContactPhone || '');

      if (pilgrim.doctorName || pilgrim.structureName || pilgrim.assignedDoctor) {
        setChosenDoctor({
          code: pilgrim.doctorCode || pilgrim.assignedDoctor?.code || "MED-DKR-01",
          doctorName: pilgrim.doctorName || pilgrim.assignedDoctor?.doctorName || "Dr. Médecin Chef",
          hospital: pilgrim.structureName || pilgrim.assignedDoctor?.hospital || "Structure Médicale Agréée",
          region: pilgrim.region || pilgrim.assignedDoctor?.region || "Sénégal"
        });
      }
    }
  }, [pilgrim]);

  // Auto-refresh pilgrim profile from localStorage & sessionStorage in real time
  useEffect(() => {
    const refreshFromStorage = () => {
      try {
        const mockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');
        const updatedPilgrim = mockList.find(p => p && (
          p.id === safePilgrim.id || 
          String(p.id) === String(safePilgrim.id) || 
          p.passportNumber === safePilgrim.passportNumber ||
          (p.passportNumber && safePilgrim.passportNumber && p.passportNumber.toUpperCase() === safePilgrim.passportNumber.toUpperCase())
        ));

        const storedSession = (() => {
          try { return JSON.parse(sessionStorage.getItem('dgp_pilgrim') || 'null'); } catch(e) { return null; }
        })();

        const source = updatedPilgrim || storedSession || safePilgrim;

        if (source) {
          const bType = source.bloodType || source.bloodGroup;
          if (bType && !bType.includes('déterminer')) {
            setBloodType(bType);
          }

          if (source.doctorName || source.structureName || source.assignedDoctor) {
            setChosenDoctor({
              code: source.doctorCode || source.assignedDoctor?.code || "MED-DKR-01",
              doctorName: source.doctorName || source.assignedDoctor?.doctorName || "Dr. Médecin Chef",
              hospital: source.structureName || source.assignedDoctor?.hospital || "Structure Médicale Agréée",
              region: source.region || source.assignedDoctor?.region || "Sénégal"
            });
          }
        }
      } catch (e) {}
    };

    refreshFromStorage();
    window.addEventListener('storage', refreshFromStorage);
    const interval = setInterval(refreshFromStorage, 1000);
    return () => {
      window.removeEventListener('storage', refreshFromStorage);
      clearInterval(interval);
    };
  }, [safePilgrim.id, safePilgrim.passportNumber]);

  // Budget State
  const [packagePrice, setPackagePrice] = useState(safePilgrim.selectedAgencyId === 1 ? 3600000 : safePilgrim.selectedAgencyId === 2 ? 4900000 : 8500000);
  const [pocketMoney, setPocketMoney] = useState(500000);
  const [sacrificePrice, setSacrificePrice] = useState(150000);
  const [shoppingPrice, setShoppingPrice] = useState(200000);
  
  // Document Vault State
  const [passportUploaded, setPassportUploaded] = useState(false);
  const [passportFile, setPassportFile] = useState(null);
  const [passportFileName, setPassportFileName] = useState('');
  const [vaccineUploaded, setVaccineUploaded] = useState(false);
  const [vaccineFile, setVaccineFile] = useState(null);
  const [vaccineFileName, setVaccineFileName] = useState('');
  const [previewFile, setPreviewFile] = useState(null);

  // SMS Simulator State
  const [smsPhone, setSmsPhone] = useState(safePilgrim.emergencyContact?.phone || safePilgrim.emergencyContactPhone || '+221 77 123 45 67');
  const [smsHistory, setSmsHistory] = useState([]);

  // Checklist State
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Compléter l'examen médical d'aptitude", done: safePilgrim.medicalStatus === 'apte' },
    { id: 2, text: "Verser l'acompte à l'agence de voyage", done: safePilgrim.paymentStatus === 'paid' },
    { id: 3, text: "Téléverser la copie du passeport dans le coffre-fort", done: false },
    { id: 4, text: "Téléverser le carnet de vaccination (Fièvre jaune / Méningite)", done: false },
    { id: 5, text: "Participer aux séminaires de formation Sunu Hajj", done: false },
    { id: 6, text: "Étiqueter les bagages aux normes de la Sunu HajjT", done: false },
    { id: 7, text: "Effectuer le change en Riyals Saoudiens (SAR)", done: false },
  ]);

  // Sync checklist with document vault uploads and dynamic DB statuses
  useEffect(() => {
    setChecklist(prev => prev.map(item => {
      if (item.id === 1) return { ...item, done: pilgrim.medicalStatus === 'apte' };
      if (item.id === 2) return { ...item, done: pilgrim.paymentStatus === 'paid' };
      if (item.id === 3) return { ...item, done: passportUploaded };
      if (item.id === 4) return { ...item, done: vaccineUploaded };
      return item;
    }));
  }, [passportUploaded, vaccineUploaded, pilgrim.medicalStatus, pilgrim.paymentStatus]);

  // Announcements / Notifications State
  const [announcements, setAnnouncements] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTravelPass, setShowTravelPass] = useState(false);

  // Payment Gateway State
  const [paymentMode, setPaymentMode] = useState('wave'); // 'wave' | 'om' | 'card' | 'bank'
  const [selectedBank, setSelectedBank] = useState('cbao');
  const [paymentMobileNumber, setPaymentMobileNumber] = useState(safePilgrim.phone || '+221 77 123 45 67');
  const [cardHolder, setCardHolder] = useState(safePilgrim.fullName || 'Pèlerin Sunu Hajj');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('421');
  const [paymentAmount, setPaymentAmount] = useState('3600000');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: "TXN-WAVE-8841",
      date: "24/07/2026",
      amount: "3 600 000 FCFA",
      mode: "Wave Mobile Money 🌊",
      status: "Confirmé & Transmis à l'Agence",
      ref: "SN-HAJJ-2026-PAY-8841"
    }
  ]);

  // Email Notifications Log
  const [emailLogs, setEmailLogs] = useState([
    {
      id: 1,
      subject: "Confirmation d'Inscription & Reçu Hajj 2026",
      sender: "notifications@sunuhajj.sn",
      recipient: safePilgrim.email || "pelerin@sunuhajj.sn",
      date: new Date().toLocaleDateString('fr-FR'),
      status: "Délivré ✉️",
      preview: "Votre inscription au registre national Sunu Hajj a été validée par la Commission..."
    },
    {
      id: 2,
      subject: "Convocation Visite Médicale Hajj 2026",
      sender: "sante@sunuhajj.sn",
      recipient: safePilgrim.email || "pelerin@sunuhajj.sn",
      date: new Date().toLocaleDateString('fr-FR'),
      status: "Envoyé ✉️",
      preview: "Veuillez vous présenter muni de votre passeport à l'Hôpital Principal de Dakar..."
    }
  ]);

  // Load announcements
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [chosenDoctor, setChosenDoctor] = useState(() => {
    try {
      const mockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');
      const found = mockList.find(p => p && (
        p.id === safePilgrim.id || 
        String(p.id) === String(safePilgrim.id) || 
        (p.passportNumber && safePilgrim.passportNumber && p.passportNumber.toUpperCase() === safePilgrim.passportNumber.toUpperCase())
      ));
      if (found && (found.doctorName || found.structureName || found.assignedDoctor)) {
        return {
          code: found.doctorCode || found.assignedDoctor?.code || null,
          doctorName: found.doctorName || found.assignedDoctor?.doctorName || "Dr. Médecin Chef",
          hospital: found.structureName || found.assignedDoctor?.hospital || "Structure Médicale Agréée",
          region: found.region || found.assignedDoctor?.region || "Sénégal"
        };
      }
    } catch (e) {}
    return safePilgrim.assignedDoctor || null;
  });
  const [appointmentDate, setAppointmentDate] = useState('2026-08-05');
  const [appointmentTime, setAppointmentTime] = useState('09:30');
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const [showMedicalCertModal, setShowMedicalCertModal] = useState(false);
  const [showPilgrimBadgeModal, setShowPilgrimBadgeModal] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await ApiService.getAnnouncements();
        setAnnouncements(data);
        setUnreadCount(data.length);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  // Calculate total budget and Sunu Hajj advice
  const totalBudget = packagePrice + pocketMoney + sacrificePrice + shoppingPrice;
  const getBudgetAdvice = () => {
    if (totalBudget < 4000000) {
      return t.budgetTight;
    } else if (totalBudget <= 6000000) {
      return t.budgetBalanced;
    } else {
      return t.budgetVip;
    }
  };

  // Toggle checklist item
  const toggleChecklist = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  // Real File Upload Handlers
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === 'passport') {
        setPassportFile(event.target.result);
        setPassportFileName(file.name);
        setPassportUploaded(true);
      } else {
        setVaccineFile(event.target.result);
        setVaccineFileName(file.name);
        setVaccineUploaded(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (type) => {
    if (type === 'passport') {
      setPassportFile(null);
      setPassportFileName('');
      setPassportUploaded(false);
    } else {
      setVaccineFile(null);
      setVaccineFileName('');
      setVaccineUploaded(false);
    }
  };

  // Send SMS Simulation
  const sendSMS = (type) => {
    if (!smsPhone) return;
    
    const text = SMS_MESSAGES[lang][type];
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const logEntry = `[${time}] 📲 ${smsPhone} : "${text}"`;

    setSmsHistory(prev => [logEntry, ...prev]);
  };

  const getAgencyName = (id) => {
    const found = agenciesList.find(a => a.id == id);
    if (found) return found.name;
    if (id === 1) return "Voyages Teranga Hajj & Omra";
    if (id === 2) return "Dakar Air Services Hajj";
    if (id === 3) return "Sahel Omra & Hajj Confort";
    return t.noAgency || "Voyages Teranga Hajj & Omra";
  };

  const renderStatusPill = (status, type) => {
    if (type === 'medical') {
      switch (status) {
        case 'apte':
          return <span className="badge badge-economique" style={{ borderRadius: '20px', padding: '6px 12px' }}>{t.medApte}</span>;
        case 'inapte':
          return <span className="badge badge-danger" style={{ borderRadius: '20px', padding: '6px 12px' }}>{t.medInapte}</span>;
        default:
          return <span className="badge badge-standard" style={{ borderRadius: '20px', padding: '6px 12px' }}>{t.medAttente}</span>;
      }
    } else if (type === 'registration') {
      switch (status) {
        case 'approved':
          return <span className="badge badge-economique" style={{ borderRadius: '20px', padding: '6px 12px' }}>{t.insValide}</span>;
        case 'rejected':
          return <span className="badge badge-danger" style={{ borderRadius: '20px', padding: '6px 12px' }}>{t.insRefuse}</span>;
        default:
          return <span className="badge badge-standard" style={{ borderRadius: '20px', padding: '6px 12px' }}>{t.insExamen}</span>;
      }
    } else if (type === 'nusuk') {
      switch (status) {
        case 'synced':
          return <span className="badge badge-economique" style={{ fontSize: '0.8rem' }}>{t.nusukSyncLabel}</span>;
        case 'error':
          return <span className="badge badge-danger" style={{ fontSize: '0.8rem' }}>🔴 Erreur</span>;
        default:
          return <span className="badge badge-standard" style={{ fontSize: '0.8rem' }}>{t.nusukAttente}</span>;
      }
    } else if (type === 'visa') {
      switch (status) {
        case 'issued':
          return <span className="badge badge-economique" style={{ fontSize: '0.8rem' }}>{t.visaEmis}</span>;
        case 'rejected':
          return <span className="badge badge-danger" style={{ fontSize: '0.8rem' }}>{t.visaRefuse}</span>;
        default:
          return <span className="badge badge-standard" style={{ fontSize: '0.8rem' }}>{t.visaCours}</span>;
      }
    }
  };

  const handleProfileSave = async () => {
    try {
      await onUpdateProfile(pilgrim.id, {
        fullName,
        phone,
        email,
        bloodType,
        selectedAgencyId: parseInt(selectedAgencyId),
        emergencyContactName,
        emergencyContactPhone
      });
      setIsEditing(false);
    } catch (err) {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const completedCount = checklist.filter(item => item.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Sidebar Menu Config
  const menuItems = [
    { id: 'dossier', label: t.tabDossier, icon: User },
    { id: 'logistics', label: t.tabLogistics, icon: Plane },
    { id: 'payments', label: "Paiements & Banques", icon: Wallet },
    { id: 'checklist', label: t.tabChecklist, icon: CheckSquare },
    { id: 'vault', label: t.tabVault, icon: FileText }
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex' }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Pilgrim Customized Sidebar */}
      {/* Pilgrim Customized Sidebar */}
      <aside className="sidebar" style={{ minWidth: '280px', width: '280px', flexShrink: 0 }}>
        <div className="logo-section" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="logo-icon">🇸🇳</div>
          <div className="logo-meta" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <span className="logo-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{t.title}</span>
            <span className="logo-subtitle" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{t.subtitle}</span>
          </div>
        </div>

        <nav className="sidebar-nav" style={{ flex: 1, padding: '20px 12px' }}>
          <ul className="menu-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li 
                  key={item.id} 
                  className={`menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsEditing(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? 'white' : 'transparent',
                    color: isActive ? 'var(--primary-dark)' : 'rgba(255,255,255,0.85)',
                    transition: 'var(--transition-fast)',
                    flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                  }}
                >
                  <Icon size={18} />
                  <span className="menu-label" style={{ fontSize: '0.88rem' }}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer options */}
        <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
            <Globe size={16} style={{ color: 'var(--secondary)' }} />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                flex: 1
              }}
            >
              <option value="fr" style={{ color: 'black' }}>Français</option>
              <option value="en" style={{ color: 'black' }}>English</option>
              <option value="ar" style={{ color: 'black' }}>العربية</option>
            </select>
          </div>

          {/* Theme & Logout Buttons Row */}
          <div style={{ display: 'flex', justifySelf: 'stretch', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
            <button 
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.08)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={onLogout}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px', 
                backgroundColor: 'rgba(239, 68, 68, 0.15)', 
                color: '#f87171',
                border: 'none',
                height: '40px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                flex: 2,
                flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
              }}
            >
              <LogOut size={16} />
              {t.logout}
            </button>
          </div>

          <div className="sunuhajj-badge" style={{ alignSelf: 'center', fontSize: '0.72rem', letterSpacing: '0.5px', color: 'var(--secondary)' }}>
            {t.officialBadge}
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: 'var(--bg)', 
        marginLeft: lang === 'ar' ? '0' : '280px',
        marginRight: lang === 'ar' ? '280px' : '0',
        minHeight: '100vh',
        width: 'calc(100% - 280px)'
      }}>
        
        {/* Header toolbar */}
        <header className="header-panel" style={{ 
          borderBottom: '1px solid var(--border)', 
          padding: '16px 30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>🇸🇳</span>
            <h2 className="page-title" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {activeTab === 'dossier' ? t.tabDossier : activeTab === 'logistics' ? t.tabLogistics : activeTab === 'checklist' ? t.tabChecklist : activeTab === 'budget' ? t.tabBudget : activeTab === 'vault' ? t.tabVault : t.tabSMS}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row', position: 'relative' }}>
            <span style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(56,161,105,0.12)', color: '#276749', border: '1px solid #C6F6D5', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              🟢 Compte Validé par Sunu Hajj
            </span>

            <button
              onClick={() => setShowPasswordModal(true)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              🔑 Mot de passe
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0); // clear count on click
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '50%',
                  backgroundColor: showNotifications ? 'var(--border)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
                className="table-row-hover"
                title={lang === 'fr' ? 'Notifications' : 'Notifications'}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: lang === 'ar' ? 'auto' : '0',
                  left: lang === 'ar' ? '0' : 'auto',
                  backgroundColor: 'var(--surface-overlay)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  width: '320px',
                  zIndex: 1000,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                      {lang === 'fr' ? 'Communiqués Officiels' : lang === 'en' ? 'Official Announcements' : 'البيانات الرسمية'}
                    </strong>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      {lang === 'fr' ? 'Fermer' : lang === 'en' ? 'Close' : 'إغلاق'}
                    </button>
                  </div>
                  {announcements.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                      {lang === 'fr' ? 'Aucun communiqué pour le moment.' : lang === 'en' ? 'No announcements yet.' : 'لا توجد بيانات حالياً.'}
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {announcements.map((ann) => (
                        <div key={ann.id} style={{ padding: '10px', backgroundColor: 'var(--bg)', borderLeft: '3px solid var(--primary)', borderRadius: '6px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--secondary-dark)', textTransform: 'uppercase' }}>
                              {ann.category === 'admin' ? (lang === 'fr' ? 'Administratif' : 'Administrative') : (lang === 'fr' ? 'Sécurité / Vol' : 'Security / Flight')}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ann.date}</span>
                          </div>
                          <h4 style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--primary-dark)', margin: '0 0 4px 0' }}>
                            {lang === 'fr' ? ann.title_fr : lang === 'en' ? (ann.title_en || ann.title_fr) : (ann.title_ar || ann.title_fr)}
                          </h4>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: '1.4', margin: 0 }}>
                            {lang === 'fr' ? ann.desc_fr : lang === 'en' ? (ann.desc_en || ann.desc_fr) : (ann.desc_ar || ann.desc_fr)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span className={`status-dot ${isApiOnline ? 'dot-online' : 'dot-offline'}`} />
              {isApiOnline ? t.statusOnline : t.statusOffline}
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          
          {/* Banner welcome */}
          <div className="panel-card animate-slide-up" style={{ 
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
            color: 'white',
            padding: '24px 30px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '30px',
            flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
          }}>
            <div style={{ zIndex: 1, textAlign: lang === 'ar' ? 'right' : 'left' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                {t.portalLabel}
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px', color: 'white' }}>
                {t.welcome}, {pilgrim.fullName}
              </h2>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowPilgrimBadgeModal(true)}
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#042F1A',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                >
                  <span>🪪</span> Mon Badge Pèlerin & Pass Nusuk 🇸🇦
                </button>

                <button
                  onClick={() => setShowMedicalCertModal(true)}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.18)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>📄</span> Certificat Médical (PDF)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: lang === 'ar' ? 'flex-start' : 'flex-end', zIndex: 1 }}>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>{t.passport}</span>
              <span style={{ fontSize: '1.3rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--secondary)', letterSpacing: '1px' }}>
                {pilgrim.passportNumber}
              </span>
            </div>
          </div>

          {/* TAB 1: Dossier Details & Editing */}
          {activeTab === 'dossier' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Visual Roadmap / Progress Steps for Elderly Pilgrims */}
              <div className="panel-card animate-slide-up" style={{ padding: '24px 30px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                  <Compass size={18} style={{ color: 'var(--secondary-dark)' }} />
                  {lang === 'fr' ? "Mon Avancement de Préparation" : lang === 'wo' ? "Sama tanki Hajj bi" : "حالة تقدم تحضيرات الحج"}
                </h4>

                {/* Steps Timeline Grid */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  flexWrap: 'wrap', 
                  gap: '20px',
                  position: 'relative',
                  flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                }}>
                  {/* Step 1: Inscription */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--accent-green-light)', 
                      border: '2px solid var(--accent-green)', 
                      color: 'var(--accent-green)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)',
                      marginBottom: '8px'
                    }}>
                      ✓
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {lang === 'fr' ? "1. Inscription" : lang === 'wo' ? "1. Bindu" : "١. التسجيل"}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                      {lang === 'fr' ? "Validée" : lang === 'wo' ? "Pare na" : "مكتمل"}
                    </span>
                  </div>

                  {/* Connecting line */}
                  <div style={{ flex: 1, height: '3px', backgroundColor: 'var(--border)', minWidth: '15px' }} className="d-none d-md-block" />

                  {/* Step 2: Médical */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: pilgrim.medicalStatus === 'apte' ? 'var(--accent-green-light)' : 'rgba(212, 175, 55, 0.1)', 
                      border: pilgrim.medicalStatus === 'apte' ? '2px solid var(--accent-green)' : '2px solid var(--secondary)', 
                      color: pilgrim.medicalStatus === 'apte' ? 'var(--accent-green)' : 'var(--secondary-dark)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)',
                      marginBottom: '8px'
                    }}>
                      {pilgrim.medicalStatus === 'apte' ? "✓" : "2"}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {lang === 'fr' ? "2. Médical" : lang === 'wo' ? "2. Docteur" : "٢. الفحص الطبي"}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: pilgrim.medicalStatus === 'apte' ? 'var(--accent-green)' : 'var(--secondary-dark)', fontWeight: 700 }}>
                      {pilgrim.medicalStatus === 'apte' ? (lang === 'fr' ? "Apte" : "Apte") : (lang === 'fr' ? "En attente" : "Dañuy xaar")}
                    </span>
                  </div>

                  {/* Connecting line */}
                  <div style={{ flex: 1, height: '3px', backgroundColor: 'var(--border)', minWidth: '15px' }} className="d-none d-md-block" />

                  {/* Step 3: Validation Sunu Hajj */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: pilgrim.registrationStatus === 'approved' ? 'var(--accent-green-light)' : 'rgba(212, 175, 55, 0.1)', 
                      border: pilgrim.registrationStatus === 'approved' ? '2px solid var(--accent-green)' : '2px solid var(--secondary)', 
                      color: pilgrim.registrationStatus === 'approved' ? 'var(--accent-green)' : 'var(--secondary-dark)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)',
                      marginBottom: '8px'
                    }}>
                      {pilgrim.registrationStatus === 'approved' ? "✓" : "3"}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      {lang === 'fr' ? "3. Validation Sunu Hajj" : lang === 'wo' ? "3. Saytu Sunu Hajj" : "٣. اعتماد البعثة"}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: pilgrim.registrationStatus === 'approved' ? 'var(--accent-green)' : 'var(--secondary-dark)', fontWeight: 700 }}>
                      {pilgrim.registrationStatus === 'approved' ? (lang === 'fr' ? "Approuvé" : "Nangu na") : (lang === 'fr' ? "En examen" : "Saytu")}
                    </span>
                  </div>

                  {/* Connecting line */}
                  <div style={{ flex: 1, height: '3px', backgroundColor: 'var(--border)', minWidth: '15px' }} className="d-none d-md-block" />

                  {/* Step 4: Visa & Nusuk */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: pilgrim.visaStatus === 'issued' ? 'var(--accent-green-light)' : 'var(--bg)', 
                      border: pilgrim.visaStatus === 'issued' ? '2px solid var(--accent-green)' : '2px solid var(--border)', 
                      color: pilgrim.visaStatus === 'issued' ? 'var(--accent-green)' : 'var(--text-muted)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 800,
                      marginBottom: '8px'
                    }}>
                      {pilgrim.visaStatus === 'issued' ? "✓" : "4"}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: pilgrim.visaStatus === 'issued' ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                      {lang === 'fr' ? "4. Visa & Nusuk" : lang === 'wo' ? "4. Visa" : "٤. التأشيرة"}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {pilgrim.visaStatus === 'issued' ? (lang === 'fr' ? "Émis" : "Émis") : (lang === 'fr' ? "En attente" : "Xaar")}
                    </span>
                  </div>

                  {/* Connecting line */}
                  <div style={{ flex: 1, height: '3px', backgroundColor: 'var(--border)', minWidth: '15px' }} className="d-none d-md-block" />

                  {/* Step 5: Vol */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: '1 1 120px', minWidth: '100px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: pilgrim.flightNumber ? 'var(--accent-green-light)' : 'var(--bg)', 
                      border: pilgrim.flightNumber ? '2px solid var(--accent-green)' : '2px solid var(--border)', 
                      color: pilgrim.flightNumber ? 'var(--accent-green)' : 'var(--text-muted)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontWeight: 800,
                      marginBottom: '8px'
                    }}>
                      {pilgrim.flightNumber ? "✓" : "5"}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: pilgrim.flightNumber ? 'var(--primary-dark)' : 'var(--text-muted)' }}>
                      {lang === 'fr' ? "5. Vol & Voyage" : lang === 'wo' ? "5. Plane" : "٥. الرحلة والسكن"}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {pilgrim.flightNumber ? (lang === 'fr' ? "Assigné" : "Wér na") : (lang === 'fr' ? "En attente" : "Xaar")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Profile Info Card & Right Columns side by side */}
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                
                {/* Profile Card */}
                <div className="panel-card animate-slide-up" style={{ flex: '1 1 480px', padding: '30px' }}>
                  <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <User size={20} style={{ color: 'var(--primary)' }} />
                      {lang === 'fr' ? "Mes Informations Personnelles" : lang === 'wo' ? "Sama Xibaar yi" : "بياناتي الشخصية"}
                    </h3>
                    
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          fontSize: '0.82rem', 
                          fontWeight: 700, 
                          color: 'var(--primary)', 
                          backgroundColor: 'var(--primary-light)', 
                          border: 'none', 
                          padding: '8px 16px', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                          transition: 'var(--transition)'
                        }}
                        className="table-row-hover"
                      >
                        <Edit size={13} />
                        {t.editCoords}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                        <button 
                          onClick={handleProfileSave}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px', 
                            fontSize: '0.82rem', 
                            fontWeight: 700, 
                            color: 'white', 
                            backgroundColor: 'var(--primary)', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                          }}
                        >
                          <Save size={13} />
                          {t.save}
                        </button>
                        <button 
                          onClick={() => {
                            setIsEditing(false);
                            setFullName(pilgrim.fullName || '');
                            setSelectedAgencyId(pilgrim.selectedAgencyId || 1);
                            setBloodType(pilgrim.bloodType || 'O+');
                            setPhone(pilgrim.phone || '');
                            setEmail(pilgrim.email || '');
                            setEmergencyContactName(pilgrim.emergencyContact?.name || pilgrim.emergencyContactName || '');
                            setEmergencyContactPhone(pilgrim.emergencyContact?.phone || pilgrim.emergencyContactPhone || '');
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '4px', 
                            fontSize: '0.82rem', 
                            fontWeight: 700, 
                            color: 'var(--text-muted)', 
                            backgroundColor: 'var(--bg)', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                          }}
                        >
                          <X size={13} />
                          {t.cancel}
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    
                    {/* Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.fullNameLabel}</span>
                      {!isEditing ? (
                        <strong style={{ fontSize: '1.25rem', marginTop: '4px', color: 'var(--primary-dark)' }}>{fullName}</strong>
                      ) : (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={fullName} 
                          onChange={e => setFullName(e.target.value)} 
                          style={{ padding: '8px 12px', height: '40px', marginTop: '4px', fontSize: '1rem', borderRadius: '6px' }}
                        />
                      )}
                    </div>

                    {/* Agency */}
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.agency}</span>
                      {!isEditing ? (
                        <strong style={{ fontSize: '1.15rem', color: 'var(--primary)', marginTop: '4px' }}>
                          🏢 {getAgencyName(selectedAgencyId)}
                        </strong>
                      ) : (
                        <select
                          className="form-control"
                          value={selectedAgencyId}
                          onChange={e => setSelectedAgencyId(e.target.value)}
                          style={{ padding: '8px 12px', height: '40px', marginTop: '4px', fontSize: '0.95rem', borderRadius: '6px' }}
                        >
                          {agenciesList.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({(a.price || 3600000).toLocaleString()} FCFA)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      
                      {/* Blood Group */}
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: '130px', backgroundColor: 'var(--bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.blood}</span>
                        {!isEditing ? (
                          <strong style={{ fontSize: '1.25rem', color: 'var(--accent-red)', marginTop: '4px' }}>
                            🩸 {bloodType || t.notSpecified}
                          </strong>
                        ) : (
                          <select
                            className="form-control"
                            value={bloodType}
                            onChange={e => setBloodType(e.target.value)}
                            style={{ padding: '8px 12px', height: '40px', marginTop: '4px', fontSize: '0.95rem', borderRadius: '6px' }}
                          >
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="Inconnu">Inconnu</option>
                          </select>
                        )}
                      </div>

                      {/* Phone */}
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.phone}</span>
                        {!isEditing ? (
                          <strong style={{ fontSize: '1.15rem', marginTop: '4px', color: 'var(--primary-dark)' }}>📞 {phone}</strong>
                        ) : (
                          <input 
                            type="text" 
                            className="form-control" 
                            value={phone} 
                            onChange={e => setPhone(e.target.value)} 
                            style={{ padding: '8px 12px', height: '40px', marginTop: '4px', fontSize: '0.95rem', borderRadius: '6px' }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.email}</span>
                      {!isEditing ? (
                        <strong style={{ fontSize: '1.1rem', marginTop: '4px', color: 'var(--primary-dark)' }}>✉️ {email || t.notSpecified}</strong>
                      ) : (
                        <input 
                          type="email" 
                          className="form-control" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          style={{ padding: '8px 12px', height: '40px', marginTop: '4px', fontSize: '0.95rem', borderRadius: '6px' }}
                        />
                      )}
                    </div>

                    {/* Emergency Contact */}
                    <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border)', paddingTop: '20px', gap: '10px' }}>
                      <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 800 }}>⚠️ {t.emergency}</span>
                      {!isEditing ? (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.04)', border: '1px dashed rgba(239,68,68,0.25)', padding: '14px 18px', borderRadius: '10px' }}>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'block' }}>
                            👤 {emergencyContactName || t.notSpecified}
                          </strong>
                          {emergencyContactPhone && (
                            <span style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                              📞 {emergencyContactPhone}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder={t.nameEmergency}
                            value={emergencyContactName} 
                            onChange={e => setEmergencyContactName(e.target.value)} 
                            style={{ padding: '8px 12px', height: '40px', fontSize: '0.9rem', flex: 1, borderRadius: '6px' }}
                          />
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder={t.phoneEmergency}
                            value={emergencyContactPhone} 
                            onChange={e => setEmergencyContactPhone(e.target.value)} 
                            style={{ padding: '8px 12px', height: '40px', fontSize: '0.9rem', flex: 1, borderRadius: '6px' }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Status Cards Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '320px', flexShrink: 0 }}>
                  
                  {/* Validation Sunu Hajj Status Card */}
                  <div style={{ 
                    backgroundColor: pilgrim.registrationStatus === 'approved' ? 'var(--accent-green-light)' : 'rgba(212, 175, 55, 0.08)',
                    border: pilgrim.registrationStatus === 'approved' ? '1.5px solid var(--accent-green)' : '1.5px solid var(--secondary)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: pilgrim.registrationStatus === 'approved' ? 'var(--accent-green)' : 'var(--secondary-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {lang === 'fr' ? "Statut Dossier Sunu Hajj" : lang === 'wo' ? "Dossier Sunu Hajj" : "حالة اعتماد الملف"}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {pilgrim.registrationStatus === 'approved' ? "🟢" : "⏳"}
                      </span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: 800 }}>
                        {pilgrim.registrationStatus === 'approved' ? (lang === 'fr' ? "Dossier Validé" : "Validé") : (lang === 'fr' ? "Dossier en Examen" : "En examen")}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)', margin: 0 }}>
                      {pilgrim.registrationStatus === 'approved' 
                        ? (lang === 'fr' ? "Félicitations ! Votre dossier d'inscription a été validé officiellement par la Délégation Générale." : "Votre dossier est validé.")
                        : (lang === 'fr' ? "Votre dossier est en cours d'examen par la Commission Sunu Hajj. Nos agents étudient vos pièces jointes." : "Dossier bi mi ngi ci saytu. Sunu Hajj mi ngi ko seet.")
                      }
                    </p>
                    {pilgrim.registrationStatus === 'approved' && (
                      <button 
                        onClick={() => setShowTravelPass(true)} 
                        className="btn btn-secondary" 
                        style={{ 
                          width: '100%', 
                          height: '42px', 
                          marginTop: '16px', 
                          fontWeight: 800, 
                          fontSize: '0.8rem', 
                          borderColor: 'var(--accent-green)', 
                          color: 'var(--primary-dark)',
                          backgroundColor: 'rgba(4, 47, 26, 0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>🎫</span> {lang === 'fr' ? "Pass Voyage / Reçu" : "Pass Voyage / Reçu"}
                      </button>
                    )}
                  </div>

                  {/* Medical Status Card */}
                  <div style={{ 
                    backgroundColor: pilgrim.medicalStatus === 'apte' ? 'var(--accent-green-light)' : 'rgba(212, 175, 55, 0.08)',
                    border: pilgrim.medicalStatus === 'apte' ? '1.5px solid var(--accent-green)' : '1.5px solid var(--secondary)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <span style={{ fontSize: '0.85rem', color: pilgrim.medicalStatus === 'apte' ? 'var(--accent-green)' : 'var(--secondary-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {lang === 'fr' ? "Aptitude Médicale" : lang === 'wo' ? "Docteur & Wer" : "اللياقة الطبية"}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {pilgrim.medicalStatus === 'apte' ? "🟢" : "🩺"}
                      </span>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontWeight: 800 }}>
                        {pilgrim.medicalStatus === 'apte' ? (lang === 'fr' ? "Apte au Voyage" : "Apte au Voyage") : (lang === 'fr' ? "En Attente Visite" : "En attente visite")}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: '1.5', color: 'var(--text-muted)', margin: 0 }}>
                      {pilgrim.medicalStatus === 'apte'
                        ? (lang === 'fr' ? "Votre visite médicale est validée. Vous êtes apte physiquement à accomplir les rites du Hajj." : "Apte na ngir tukki.")
                        : (lang === 'fr' ? "Veuillez effectuer votre visite médicale obligatoire auprès d'un médecin agréé par la Sunu Hajj." : "Démlen seeti docteur yi Sunu Hajj nangu ngir seet wér-gi-yaram.")
                      }
                    </p>

                    {chosenDoctor && (
                      <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(10,92,54,0.06)', border: '1px solid rgba(10,92,54,0.15)', fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: 800, color: '#0A5C36', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🩺</span> {chosenDoctor.doctorName || chosenDoctor.name}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                          🏥 {chosenDoctor.hospital || chosenDoctor.name} ({chosenDoctor.region || 'Sénégal'})
                        </span>
                        {appointmentBooked && (
                          <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 800, display: 'block', marginTop: '4px' }}>
                            📅 RDV Confirmé : le {appointmentDate} à {appointmentTime}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                      <button 
                        onClick={() => setShowDoctorModal(true)}
                        style={{ 
                          width: '100%', 
                          height: '38px', 
                          fontWeight: 800, 
                          fontSize: '0.78rem', 
                          borderRadius: '10px',
                          border: 'none', 
                          color: '#ffffff',
                          backgroundColor: '#0A5C36',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <span>🩺</span> {chosenDoctor ? "Changer de Médecin / RDV" : "Choisir mon Médecin Agréé"}
                      </button>

                      <button 
                        onClick={() => setShowMedicalCertModal(true)}
                        style={{ 
                          width: '100%', 
                          height: '38px', 
                          fontWeight: 800, 
                          fontSize: '0.78rem', 
                          borderRadius: '10px',
                          border: '1px solid #D4AF37', 
                          color: '#042F1A',
                          backgroundColor: 'rgba(212,175,55,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <span>📄</span> Télécharger Certificat Médical (PDF)
                      </button>

                      <button 
                        onClick={() => setShowPilgrimBadgeModal(true)}
                        style={{ 
                          width: '100%', 
                          height: '38px', 
                          fontWeight: 800, 
                          fontSize: '0.78rem', 
                          borderRadius: '10px',
                          border: '1px solid #0A5C36', 
                          color: '#0A5C36',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <span>🪪</span> Mon Badge Pèlerin & Pass Nusuk 🇸🇦
                      </button>
                    </div>
                  </div>

                  {/* Support Card for Elderly */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, rgba(4,47,26,0.06) 0%, rgba(212,175,55,0.08) 100%)',
                    border: '1px dashed var(--border)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      👴 {lang === 'fr' ? "Besoin d'aide ou d'explications ?" : "Dañu bëgg ndimbal ?"}
                    </strong>
                    <p style={{ fontSize: '0.82rem', lineHeight: '1.5', color: 'var(--text-muted)', margin: 0 }}>
                      {lang === 'fr' ? "Si vous rencontrez des difficultés, vous pouvez contacter gratuitement l'assistance Sunu Hajj au numéro vert ou demander à un proche de vous assister." : "Mën nga woo Sunu Hajj gratuit ci 800 10 20 30."}
                    </p>
                    <div style={{ 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      textAlign: 'center', 
                      fontSize: '0.95rem', 
                      fontWeight: 800,
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      📞 800 10 20 30
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Logistics, Hotels, Flight */}
          {activeTab === 'logistics' && (
            <div style={{ width: '100%' }}>
              {pilgrim.registrationStatus === 'approved' ? (
                <div className="panel-card animate-slide-up" style={{ border: '1.2px solid var(--secondary)', boxShadow: 'var(--shadow-lg)' }}>
                  <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <span style={{ fontSize: '1.2rem' }}>🇸🇦</span>
                      {t.logisticsTitle}
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg)', padding: '14px', borderRadius: 'var(--radius-sm)', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <Shield size={24} style={{ color: 'var(--secondary)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.nusukSync}</span>
                        <div style={{ marginTop: '4px' }}>{renderStatusPill(pilgrim.nusukSyncStatus, 'nusuk')}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg)', padding: '14px', borderRadius: 'var(--radius-sm)', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                      <FileText size={24} style={{ color: 'var(--secondary)' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.visaStatus}</span>
                        <div style={{ marginTop: '4px' }}>{renderStatusPill(pilgrim.visaStatus, 'visa')}</div>
                      </div>
                    </div>

                    {/* Boarding Pass */}
                    <div style={{
                      gridColumn: 'span 2',
                      background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      padding: '24px',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'stretch',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                    }}>
                      {/* Left: Main Details */}
                      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--secondary)' }}>
                            {lang === 'fr' ? "CARTE D'EMBARQUEMENT VOL" : lang === 'en' ? "FLIGHT BOARDING PASS" : "بطاقة صعود الطائرة"}
                          </span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                            ✈️ {pilgrim.flightNumber && pilgrim.flightNumber !== 'Non assigné' ? pilgrim.flightNumber : 'TX-201'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                          <div style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>DSS</h3>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)' }}>Dakar Blaise Diagne</span>
                          </div>
                          
                          {/* Airplane vector/icon spacer */}
                          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '0 20px', position: 'relative' }}>
                            <div style={{ flex: 1, height: '1px', borderTop: '2px dashed rgba(255,255,255,0.3)' }} />
                            <span style={{ fontSize: '1.1rem', margin: '0 8px' }}>✈️</span>
                            <div style={{ flex: 1, height: '1px', borderTop: '2px dashed rgba(255,255,255,0.3)' }} />
                          </div>

                          <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>MED</h3>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.7)' }}>Prince Mohammad, Medina</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '0.78rem' }}>
                          <div>
                            <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2px' }}>
                              {lang === 'fr' ? 'PÈLERIN' : 'PILGRIM'}
                            </span>
                            <strong>{pilgrim.fullName}</strong>
                          </div>
                          <div>
                            <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2px' }}>
                              {lang === 'fr' ? 'DATE DÉPART' : 'DEPARTURE DATE'}
                            </span>
                            <strong>28 Mai 2026</strong>
                          </div>
                          <div>
                            <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '2px' }}>
                              {lang === 'fr' ? 'EMBARQUEMENT' : 'BOARDING'}
                            </span>
                            <strong>04:30 AM</strong>
                          </div>
                        </div>
                      </div>

                      {/* Divider perforated line */}
                      <div style={{ borderLeft: '2px dashed rgba(255, 255, 255, 0.25)', margin: '0 24px' }} />

                      {/* Right: Tear-off Stub */}
                      <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
                            {lang === 'fr' ? 'PORTE' : 'GATE'}
                          </span>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>C-05</strong>
                        </div>
                        
                        <div>
                          <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
                            {lang === 'fr' ? 'SIÈGE / SALLE' : 'SEAT / ROOM'}
                          </span>
                          <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{pilgrim.roomNumber && pilgrim.roomNumber !== 'Non assigné' ? pilgrim.roomNumber : '1204'}</strong>
                        </div>

                        {/* QR Code representation */}
                        <div 
                          onClick={() => setShowTravelPass(true)}
                          style={{ 
                            marginTop: '10px', 
                            height: '42px', 
                            backgroundColor: 'white', 
                            borderRadius: '6px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            padding: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'var(--transition)'
                          }}
                          className="table-row-hover"
                          title="Cliquez pour afficher le pass complet"
                        >
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=SunuHajj2026-${pilgrim.passportNumber}`}
                            alt="QR Code" 
                            style={{ height: '34px', width: '34px' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* QR Code & Print Pass Action Button */}
                    <div style={{
                      gridColumn: 'span 2',
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '5px',
                      marginBottom: '10px'
                    }}>
                      <button
                        onClick={() => setShowTravelPass(true)}
                        className="btn btn-primary"
                        style={{
                          height: '46px',
                          padding: '0 32px',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--primary-dark)',
                          borderColor: 'var(--secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          boxShadow: 'var(--shadow-sm)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        <span>🎫</span> {lang === 'fr' ? "Afficher mon Pass Voyage & QR Code Officiel" : "Show my Travel Pass & Official QR Code"}
                      </button>
                    </div>

                    {/* Hotel Makkah Card */}
                    <div style={{
                      gridColumn: 'span 2',
                      backgroundColor: 'var(--surface-overlay)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        color: 'var(--secondary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        flexShrink: 0
                      }}>
                        🏢
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--secondary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {lang === 'fr' ? 'HÉBERGEMENT LA MECQUE (MAKKAH)' : lang === 'en' ? 'MAKKAH ACCOMMODATION' : 'سكن مكة المكرمة'}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                          {pilgrim.hotelMakkah && pilgrim.hotelMakkah !== 'Non assigné' ? pilgrim.hotelMakkah : (lang === 'fr' ? 'Hôtel en attente d\'attribution' : 'Hotel pending assignment')}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          📍 {pilgrim.hotelMakkah && pilgrim.hotelMakkah !== 'Non assigné' ? "Zone hôtelière centrale, à 800m de la Kaaba (navettes 24h/24)" : t.notSpecified}
                        </span>
                      </div>
                    </div>

                    {/* Hotel Madinah Card */}
                    <div style={{
                      gridColumn: 'span 2',
                      backgroundColor: 'var(--surface-overlay)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        color: 'var(--secondary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        flexShrink: 0
                      }}>
                        🏢
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--secondary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {lang === 'fr' ? 'HÉBERGEMENT MÉDINE (MADINAH)' : lang === 'en' ? 'MADINAH ACCOMMODATION' : 'سكن المدينة المنورة'}
                        </span>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-dark)', margin: 0 }}>
                          {pilgrim.hotelMadinah && pilgrim.hotelMadinah !== 'Non assigné' ? pilgrim.hotelMadinah : (lang === 'fr' ? 'Hôtel en attente d\'attribution' : 'Hotel pending assignment')}
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          📍 {pilgrim.hotelMadinah && pilgrim.hotelMadinah !== 'Non assigné' ? "Zone Nord du Haram de Médine, à 300m de la Mosquée du Prophète" : t.notSpecified}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="panel-card animate-slide-up" style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.04)',
                  border: '1px dashed var(--secondary)',
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <Clock size={48} style={{ color: 'var(--secondary)' }} />
                    <h4 style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>{t.waitingLogistics}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '450px', lineHeight: '1.5' }}>
                      {t.waitingLogisticsDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Interactive Checklist */}
          {activeTab === 'checklist' && (
            <div className="panel-card animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <CheckSquare size={18} style={{ color: 'var(--primary)' }} />
                  {t.checklistTitle}
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>{progressPercent}% {lang === 'ar' ? 'اكتمل' : 'complété'}</span>
              </div>

              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${progressPercent}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--primary)', 
                  borderRadius: '4px',
                  transition: 'width 0.5s ease-in-out',
                  float: lang === 'ar' ? 'right' : 'none'
                }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
                {checklist.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '14px', 
                      backgroundColor: item.done ? 'var(--primary-light)' : 'var(--bg)', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '1px solid var(--border)',
                      transition: 'var(--transition-fast)',
                      flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={item.done}
                      onChange={() => {}} 
                      style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ 
                      fontSize: '0.9rem', 
                      color: item.done ? 'var(--primary)' : 'var(--text)',
                      fontWeight: item.done ? 600 : 400,
                      textDecoration: item.done ? 'line-through' : 'none',
                      flex: 1,
                      textAlign: lang === 'ar' ? 'right' : 'left'
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Budget Simulator */}
          {activeTab === 'budget' && (
            <div className="panel-card animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <Wallet size={18} style={{ color: 'var(--primary)' }} />
                  {t.budgetTitle}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
                
                <div className="form-group">
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '6px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.priceAgency}</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{packagePrice.toLocaleString('fr-FR')} F CFA</strong>
                  </div>
                  <input 
                    type="range" 
                    min="3000000" 
                    max="10000000" 
                    step="100000"
                    value={packagePrice} 
                    onChange={e => setPackagePrice(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '6px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.pocketMoney}</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{pocketMoney.toLocaleString('fr-FR')} F CFA</strong>
                  </div>
                  <input 
                    type="range" 
                    min="100000" 
                    max="3000000" 
                    step="50000"
                    value={pocketMoney} 
                    onChange={e => setPocketMoney(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '6px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.sacrifice}</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{sacrificePrice.toLocaleString('fr-FR')} F CFA</strong>
                  </div>
                  <input 
                    type="range" 
                    min="100000" 
                    max="300000" 
                    step="10000"
                    value={sacrificePrice} 
                    onChange={e => setSacrificePrice(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '6px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.shopping}</span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{shoppingPrice.toLocaleString('fr-FR')} F CFA</strong>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="1000000" 
                    step="25000"
                    value={shoppingPrice} 
                    onChange={e => setShoppingPrice(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div style={{ 
                  backgroundColor: 'var(--bg)', 
                  padding: '20px', 
                  borderRadius: 'var(--radius-sm)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  border: '1px solid var(--border)',
                  flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{t.budgetTotal}</span>
                  <strong style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800 }}>
                    {totalBudget.toLocaleString('fr-FR')} {lang === 'ar' ? 'فرنك غرب إفريقي' : 'F CFA'}
                  </strong>
                </div>

                <div style={{ 
                  backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                  border: '1px solid var(--secondary)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  gap: '12px',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                  textAlign: lang === 'ar' ? 'right' : 'left'
                }}>
                  <ShieldCheck size={24} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--secondary-dark)', display: 'block', marginBottom: '4px' }}>{t.budgetAdvice}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{getBudgetAdvice()}</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: Payments & Bank API - LUXURY REDESIGN */}
          {activeTab === 'payments' && (
            <div className="panel-card animate-slide-up" style={{ width: '100%', padding: '32px', backgroundColor: 'var(--surface)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}>
              
              {/* Top Header */}
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                      💳
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0, letterSpacing: '-0.3px' }}>
                        Guichet Officiel de Paiement Hajj 2026
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                        Règlement sécurisé multi-banques & mobile money sous le contrôle de la DGP
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(16,185,129,0.12)', color: '#047857', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔒 Connexion Sécurisée SSL 256-bit
                  </span>
                </div>
              </div>

              {/* Luxury Pass / Card Hero Widget */}
              <div style={{ 
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px', 
                background: 'linear-gradient(135deg, #022013 0%, #064024 50%, #0A5C36 100%)', 
                color: '#ffffff', 
                padding: '30px', 
                marginBottom: '32px',
                boxShadow: '0 20px 40px rgba(4,47,26,0.35)',
                border: '1px solid rgba(212,175,55,0.3)'
              }}>
                {/* Background Watermark Decorative Elements */}
                <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', fontSize: '12rem', opacity: 0.06, userSelect: 'none', pointerEvents: 'none' }}>
                  🕋
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.15)', padding: '4px 10px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)' }}>
                        🇸🇳 RÉPUBLIQUE DU SÉNÉGAL • D.G.P
                      </span>
                    </div>

                    <span style={{ fontSize: '0.85rem', opacity: 0.8, display: 'block' }}>Solde & Tarif Intégral du Package Hajj</span>
                    
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, margin: '6px 0', color: '#FFFFFF', letterSpacing: '-0.5px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                      {safePilgrim.paymentStatus === 'paid' ? "0 FCFA" : "3.600.000 FCFA"}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                      <span style={{ fontSize: '0.82rem', padding: '4px 12px', borderRadius: '12px', backgroundColor: safePilgrim.paymentStatus === 'paid' ? '#DEF7EC' : 'rgba(254,240,138,0.15)', color: safePilgrim.paymentStatus === 'paid' ? '#03543F' : '#FEF08A', border: safePilgrim.paymentStatus === 'paid' ? '1px solid #31C48D' : '1px solid rgba(254,240,138,0.3)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {safePilgrim.paymentStatus === 'paid' ? "🟢 Versement Intégral Confirmé à 100%" : "🟡 En attente de règlement (Acompte ou Solde)"}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                    {/* SIM Card Chip Mock */}
                    <div style={{ width: '48px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #FFE259 0%, #FFA751 100%)', border: '1px solid #D4AF37', marginBottom: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', inset: '4px', border: '1px solid rgba(0,0,0,0.2)', borderRadius: '4px' }} />
                    </div>

                    <button 
                      onClick={() => window.print()}
                      style={{ 
                        padding: '10px 18px', 
                        borderRadius: '12px', 
                        border: '1px solid #D4AF37', 
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)', 
                        color: '#FFFFFF', 
                        fontWeight: 800, 
                        fontSize: '0.85rem', 
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      🖨️ Télécharger Reçu d'Attestation (PDF)
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment Mode Selector Cards */}
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>1.</span> Choisissez votre Mode de Règlement Sécurisé :
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                
                {/* Wave Sénégal - Authentic Penguin Logo */}
                <div
                  onClick={() => setPaymentMode('wave')}
                  style={{
                    padding: '20px',
                    borderRadius: '18px',
                    border: paymentMode === 'wave' ? '2.5px solid #1DC3EC' : '1px solid var(--border)',
                    backgroundColor: paymentMode === 'wave' ? 'rgba(29,195,236,0.06)' : 'var(--bg)',
                    boxShadow: paymentMode === 'wave' ? '0 10px 25px rgba(29,195,236,0.2)' : '0 4px 12px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    {/* Authentic Wave Cyan Circle + Penguin SVG */}
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1DC3EC', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(29,195,236,0.4)', border: '2px solid #FFFFFF' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#1DC3EC"/>
                        <path d="M7.5 13.5C7.5 10.462 9.962 8 13 8C14.2 8 15.3 8.4 16.2 9.1L14.7 10.6C14.2 10.2 13.6 10 13 10C11.067 10 9.5 11.567 9.5 13.5C9.5 15.433 11.067 17 13 17C14.4 17 15.6 16.2 16.1 15H13V13H18.5V18.5H16.8L16.5 17.2C15.5 18.3 14.3 19 13 19C9.962 19 7.5 16.538 7.5 13.5Z" fill="white"/>
                      </svg>
                    </div>
                    {paymentMode === 'wave' && (
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1DC3EC', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 900 }}>✓</span>
                    )}
                  </div>
                  <strong style={{ fontSize: '0.98rem', display: 'block', color: 'var(--text)', marginBottom: '2px' }}>Wave Sénégal</strong>
                  <span style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 700, display: 'block' }}>Sans aucun frais</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Validation QR instantanée</span>
                </div>

                {/* Orange Money */}
                <div
                  onClick={() => setPaymentMode('om')}
                  style={{
                    padding: '20px',
                    borderRadius: '18px',
                    border: paymentMode === 'om' ? '2.5px solid #FF6600' : '1px solid var(--border)',
                    backgroundColor: paymentMode === 'om' ? 'rgba(255,102,0,0.06)' : 'var(--bg)',
                    boxShadow: paymentMode === 'om' ? '0 10px 25px rgba(255,102,0,0.2)' : '0 4px 12px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#FF6600', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(255,102,0,0.35)', border: '2px solid #FFFFFF' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'sans-serif', letterSpacing: '-0.5px' }}>OM</span>
                    </div>
                    {paymentMode === 'om' && (
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#FF6600', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 900 }}>✓</span>
                    )}
                  </div>
                  <strong style={{ fontSize: '0.98rem', display: 'block', color: 'var(--text)', marginBottom: '2px' }}>Orange Money</strong>
                  <span style={{ fontSize: '0.78rem', color: '#C2410C', fontWeight: 700, display: 'block' }}>Passerelle OM Web</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Code USSD / Maxit</span>
                </div>

                {/* Carte Bancaire */}
                <div
                  onClick={() => setPaymentMode('card')}
                  style={{
                    padding: '20px',
                    borderRadius: '18px',
                    border: paymentMode === 'card' ? '2.5px solid #0A5C36' : '1px solid var(--border)',
                    backgroundColor: paymentMode === 'card' ? 'rgba(10,92,54,0.06)' : 'var(--bg)',
                    boxShadow: paymentMode === 'card' ? '0 10px 25px rgba(10,92,54,0.2)' : '0 4px 12px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #1A1F71 0%, #111827 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(0,0,0,0.25)', border: '2px solid #FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#EB001B', opacity: 0.9 }} />
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#F79E1B', marginLeft: '-7px', opacity: 0.9 }} />
                      </div>
                    </div>
                    {paymentMode === 'card' && (
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 900 }}>✓</span>
                    )}
                  </div>
                  <strong style={{ fontSize: '0.98rem', display: 'block', color: 'var(--text)', marginBottom: '2px' }}>Carte Visa / Master</strong>
                  <span style={{ fontSize: '0.78rem', color: '#0A5C36', fontWeight: 700, display: 'block' }}>3D-Secure Sécurisé</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Toutes banques</span>
                </div>

                {/* API Banque */}
                <div
                  onClick={() => setPaymentMode('bank')}
                  style={{
                    padding: '20px',
                    borderRadius: '18px',
                    border: paymentMode === 'bank' ? '2.5px solid #1E3A8A' : '1px solid var(--border)',
                    backgroundColor: paymentMode === 'bank' ? 'rgba(30,58,138,0.06)' : 'var(--bg)',
                    boxShadow: paymentMode === 'bank' ? '0 10px 25px rgba(30,58,138,0.2)' : '0 4px 12px rgba(0,0,0,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 14px rgba(30,58,138,0.35)', border: '2px solid #FFFFFF' }}>
                      <span style={{ fontSize: '1.4rem' }}>🏛️</span>
                    </div>
                    {paymentMode === 'bank' && (
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 900 }}>✓</span>
                    )}
                  </div>
                  <strong style={{ fontSize: '0.98rem', display: 'block', color: 'var(--text)', marginBottom: '2px' }}>API Banque Directe</strong>
                  <span style={{ fontSize: '0.78rem', color: '#1E3A8A', fontWeight: 700, display: 'block' }}>CBAO / BHS / Ecobank</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Virement institutionnel</span>
                </div>

              </div>

              {/* Form Container */}
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>2.</span> Renseignez les Informations du Règlement :
              </h4>

              <form onSubmit={(e) => {
                e.preventDefault();
                setIsProcessingPayment(true);
                setTimeout(() => {
                  setIsProcessingPayment(false);
                  const newTxn = {
                    id: `TXN-${paymentMode.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    date: new Date().toLocaleDateString('fr-FR'),
                    amount: `${parseInt(paymentAmount).toLocaleString('fr-FR')} FCFA`,
                    mode: paymentMode === 'wave' ? 'Wave Sénégal 🌊' : paymentMode === 'om' ? 'Orange Money 🍊' : paymentMode === 'card' ? 'Carte Bancaire 💳' : `API Banque (${selectedBank.toUpperCase()}) 🏛️`,
                    status: "Confirmé & Rapproché par API Banque",
                    ref: `SN-HAJJ-2026-PAY-${Math.floor(100000 + Math.random() * 900000)}`
                  };
                  setPaymentHistory([newTxn, ...paymentHistory]);
                  
                  // Fire REAL SMS and REAL EMAIL
                  sendRealSms(paymentMobileNumber || safePilgrim.phone || '+221 77 123 45 67', `Sunu Hajj: Versement de ${newTxn.amount} reçu via ${newTxn.mode}. Ref: ${newTxn.id}`);
                  sendRealEmail(safePilgrim.email || 'pelerin@sunuhajj.sn', `Reçu Officiel de Versement Hajj 2026 - ${newTxn.id}`, `Bonjour ${safePilgrim.fullName},\n\nVotre versement de ${newTxn.amount} a été validé avec succès sur la plateforme officielle Sunu Hajj.\n\nMode: ${newTxn.mode}\nRéférence TXN: ${newTxn.id}\nDate: ${newTxn.date}\n\nDirection Générale du Hajj - République du Sénégal`);

                  alert(`✅ Paiement de ${newTxn.amount} validé avec succès ! L'application SMS et un Email de confirmation réel ont été transmis.`);
                }, 1500);
              }} style={{ backgroundColor: 'var(--bg)', padding: '28px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
                
                {paymentMode === 'wave' || paymentMode === 'om' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{paymentMode === 'wave' ? '🌊' : '🍊'}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                          {paymentMode === 'wave' ? 'Règlement Direct via Wave Sénégal Mobile' : 'Règlement Direct via Orange Money Sénégal'}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Un push de confirmation SMS/Notification sera envoyé sur le numéro saisi.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                          Numéro Mobile Money Sénégal *
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '14px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>🇸🇳</span>
                          <input 
                            type="tel" 
                            required
                            className="form-control"
                            value={paymentMobileNumber}
                            onChange={e => setPaymentMobileNumber(e.target.value)}
                            placeholder="+221 77 000 00 00"
                            style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1.5px solid var(--border)', fontSize: '1.05rem', fontWeight: 800, backgroundColor: 'var(--surface)' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>
                          Montant du Versement à Effectuer *
                        </label>
                        <select 
                          value={paymentAmount}
                          onChange={e => setPaymentAmount(e.target.value)}
                          className="form-select"
                          style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid var(--border)', fontWeight: 800, fontSize: '0.98rem', backgroundColor: 'var(--surface)' }}
                        >
                          <option value="3600000">3 600 000 FCFA — Paiement Intégral du Package Hajj</option>
                          <option value="1800000">1 800 000 FCFA — Acompte 50% Obligatoire de Confirmation</option>
                          <option value="1000000">1 000 000 FCFA — Versement Partiel Tranche 1</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : paymentMode === 'card' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                      <span style={{ fontSize: '1.8rem' }}>💳</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                          Paiement Chiffré par Carte Bancaire Visa / Mastercard
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Authentification 3D-Secure avec envoi du code SMS OTP bancaire.
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Nom complet du Titulaire de la Carte *</label>
                        <input type="text" required className="form-control" value={cardHolder} onChange={e => setCardHolder(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', fontWeight: 700 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Numéro de la Carte *</label>
                        <input type="text" required className="form-control" value={cardNumber} onChange={e => setCardNumber(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', fontWeight: 700, fontFamily: 'monospace' }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Expire (MM/AA) *</label>
                        <input type="text" required className="form-control" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', fontWeight: 700 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>CVC / CVV *</label>
                        <input type="password" maxLength={3} required className="form-control" value={cardCvc} onChange={e => setCardCvc(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', fontWeight: 700 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Montant FCFA *</label>
                        <select value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="form-select" style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--surface)', fontWeight: 800 }}>
                          <option value="3600000">3 600 000 FCFA</option>
                          <option value="1800000">1 800 000 FCFA</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🏛️</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                          Passerelle Institutionnelle API Banque & Virement Rapproché
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Rapprochement direct par Webhook API avec la Banque Centrale et la Commission National Hajj.
                        </span>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Sélectionner la Banque Partenaire Agréée *</label>
                      <select value={selectedBank} onChange={e => setSelectedBank(e.target.value)} className="form-select" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid var(--border)', fontWeight: 800, fontSize: '0.95rem', backgroundColor: 'var(--surface)' }}>
                        <option value="cbao">CBAO Groupe Attijariwafa bank (Compte Général Hajj SN-01001-445)</option>
                        <option value="orabank">Orabank Sénégal (Compte Commission Hajj SN-02004-981)</option>
                        <option value="bhs">Banque de l'Habitat du Sénégal - BHS (Compte Spécial Epargne Hajj)</option>
                        <option value="ecobank">Ecobank Sénégal (Compte Titres & Versements Directs)</option>
                        <option value="boa">Bank of Africa (BOA Sénégal)</option>
                      </select>
                    </div>

                    <div style={{ padding: '18px 22px', backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.3)' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#8A6D1B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span>📋</span> Coordonnées Bancaires Officiellement Agréées :
                      </strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '0.5px' }}>
                          IBAN : SN012 01001 00349812734 88
                        </span>
                        <button 
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText("SN012 01001 00349812734 88");
                            alert("📋 RIB/IBAN copié dans le presse-papier !");
                          }}
                          style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #D4AF37', backgroundColor: '#FFFFFF', color: '#8A6D1B', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Copier le RIB
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0A5C36 0%, #042F1A 100%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    marginTop: '24px',
                    boxShadow: '0 10px 25px rgba(10,92,54,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {isProcessingPayment ? (
                    <span>⏳ Traitement de la Transaction API...</span>
                  ) : (
                    <span>💳 Valider le Règlement de {parseInt(paymentAmount).toLocaleString('fr-FR')} FCFA →</span>
                  )}
                </button>
              </form>

              {/* Transactions History */}
              <div style={{ marginTop: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📜 Historique des Transactions & Reçus Bancaires
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Rapprochement temps réel API
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {paymentHistory.map(p => (
                    <div key={p.id} style={{ padding: '18px 20px', borderRadius: '16px', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900 }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--text)', fontFamily: 'monospace' }}>{p.id}</strong>
                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(56,161,105,0.12)', color: '#276749', fontWeight: 800 }}>
                              {p.status}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                            {p.mode} • Effectué le {p.date}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#15803D' }}>
                          {p.amount}
                        </h4>
                        <button 
                          onClick={() => window.print()}
                          style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginTop: '4px' }}
                        >
                          📄 Reçu PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: Multi-Channel Notifications (SMS & Email) */}
          {activeTab === 'notifications' && (
            <div className="panel-card animate-slide-up" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bell size={22} style={{ color: 'var(--primary)' }} />
                  Centre de Notifications Multi-Canaux (SMS & Email Directs)
                </h3>
                <span style={{ fontSize: '0.8rem', padding: '4px 12px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#8A6D1B', fontWeight: 800 }}>
                  📱 Passerelle SMS Orange API & Webhook Email
                </span>
              </div>

              {/* Split layout: SMS Panel & Email Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', marginTop: '20px' }}>
                
                {/* SMS Channel Card */}
                <div style={{ backgroundColor: 'var(--bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📱 Canal SMS Direct (Orange / Touba SMS)
                    </h4>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '8px', backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 700 }}>
                      En Service 🟢
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Les SMS officiels sont expédiés automatiquement à chaque étape de votre dossier Hajj.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const txt = `Sunu Hajj: Bonjour ${safePilgrim.fullName}, votre dossier Hajj 2026 (Passeport: ${safePilgrim.passportNumber}) est validé ! Statut médical: ${safePilgrim.medicalStatus === 'apte' ? 'APTE' : 'EN ATTENTE'}.`;
                        sendRealSms(safePilgrim.phone || '+221 77 123 45 67', txt);
                        alert(`📱 L'application SMS de votre téléphone s'ouvre pour envoyer le SMS officiel à ${safePilgrim.phone || '+221 77 123 45 67'} !`);
                      }}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#0A5C36', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      🚀 Envoyer un SMS Réel sur mon Mobile ({safePilgrim.phone || '+221 77 123 45 67'})
                    </button>

                    <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#ffffff', borderLeft: '4px solid #15803D', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#718096', marginBottom: '4px' }}>
                        <span>De: SUNU HAJJ</span>
                        <span>Aujourd'hui, 09:15</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A202C', margin: 0 }}>
                        📲 "Sunu Hajj: Félicitations {safePilgrim.fullName}, votre inscription est confirmée sous le Passeport {safePilgrim.passportNumber}. Votre visa est en cours de traitement."
                      </p>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#ffffff', borderLeft: '4px solid #D4AF37', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#718096', marginBottom: '4px' }}>
                        <span>De: SANTE HAJJ</span>
                        <span>Hier, 16:40</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1A202C', margin: 0 }}>
                        🩺 "Rappel Visite Médicale: Votre dossier médical est disponible à l'Hôpital Principal de Dakar (Code: MED-DKR-01). Statut actuel: {safePilgrim.medicalStatus === 'apte' ? 'APTE ✓' : 'EN ATTENTE'}."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Channel Card */}
                <div style={{ backgroundColor: 'var(--bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      ✉️ Canal Email Officiel (SMTP / Resend API)
                    </h4>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '8px', backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 700 }}>
                      En Service 🟢
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Reçus de paiement, convocations de vol et badges de voyage expédiés par email.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const subj = "Reçu & Confirmation Dossier Hajj 2026";
                        const body = `Bonjour ${safePilgrim.fullName},\n\nVotre dossier pour le Hajj 2026 a bien été enregistré sur la plateforme officielle Sunu Hajj.\n\n- Passeport: ${safePilgrim.passportNumber}\n- Visite Médicale: ${safePilgrim.medicalStatus === 'apte' ? 'APTE ✓' : 'En attente'}\n- Agence: ${safePilgrim.selectedAgencyId || 'Agence Agréée'}\n\nDirection Générale du Hajj (DGP) - République du Sénégal`;
                        sendRealEmail(safePilgrim.email || 'pelerin@sunuhajj.sn', subj, body);
                        alert(`✉️ L'application Email s'ouvre pour envoyer l'email réel à ${safePilgrim.email || 'pelerin@sunuhajj.sn'} !`);
                      }}
                      style={{ padding: '10px 14px', borderRadius: '10px', border: 'none', backgroundColor: '#8A6D1B', color: '#ffffff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      🚀 Expédier un Email Réel ({safePilgrim.email || 'pelerin@sunuhajj.sn'})
                    </button>
                    {emailLogs.map(mail => (
                      <div key={mail.id} style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#ffffff', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#718096', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{mail.sender}</span>
                          <span>{mail.date}</span>
                        </div>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 800, color: '#1A202C' }}>
                          {mail.subject}
                        </h5>
                        <p style={{ fontSize: '0.78rem', color: '#4A5568', margin: 0 }}>
                          {mail.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: Document Vault */}
          {activeTab === 'vault' && (
            <div className="panel-card animate-slide-up" style={{ width: '100%' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
                  {t.vaultTitle}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5' }}>
                {t.vaultDesc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <CreditCard size={24} style={{ color: passportUploaded ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.passportCopy}</span>
                      <span style={{ fontSize: '0.75rem', color: passportUploaded ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                        {passportUploaded ? `${passportFileName} (téléchargé)` : t.nonFourni}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {passportUploaded && (
                      <>
                        <button
                          onClick={() => setPreviewFile({ type: 'passport', data: passportFile, name: passportFileName })}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--bg)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Aperçu
                        </button>
                        <button
                          onClick={() => handleRemoveFile('passport')}
                          style={{
                            padding: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ef4444',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Supprimer"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {!passportUploaded && (
                      <label style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                      }}>
                        <Upload size={14} />
                        <span>{t.importer}</span>
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileChange(e, 'passport')} 
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                    <Heart size={24} style={{ color: vaccineUploaded ? 'var(--accent-green)' : 'var(--text-muted)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t.vaccineCard}</span>
                      <span style={{ fontSize: '0.75rem', color: vaccineUploaded ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                        {vaccineUploaded ? `${vaccineFileName} (téléchargé)` : t.nonFourni}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {vaccineUploaded && (
                      <>
                        <button
                          onClick={() => setPreviewFile({ type: 'vaccine', data: vaccineFile, name: vaccineFileName })}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: 'var(--bg)',
                            border: '1px solid var(--border)',
                            color: 'var(--text)',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Aperçu
                        </button>
                        <button
                          onClick={() => handleRemoveFile('vaccine')}
                          style={{
                            padding: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#ef4444',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Supprimer"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                    {!vaccineUploaded && (
                      <label style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
                      }}>
                        <Upload size={14} />
                        <span>{t.importer}</span>
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileChange(e, 'vaccine')} 
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: SMS Simulator */}
          {activeTab === 'sms' && (
            <div className="panel-card animate-slide-up" style={{ width: '100%' }}>
              <div className="panel-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                <h3 className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: lang === 'ar' ? 'row-reverse' : 'row' }}>
                  <Smartphone size={18} style={{ color: 'var(--primary)' }} />
                  {t.smsTitle}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.5' }}>
                {t.smsDesc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder={t.phoneEmergency}
                    value={smsPhone}
                    onChange={e => setSmsPhone(e.target.value)}
                    style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => sendSMS('depart')}
                    className="action-btn"
                    style={{ fontSize: '0.82rem', padding: '10px', borderRadius: '6px', display: 'flex', gap: '6px', justifyContent: 'center' }}
                  >
                    {t.smsAero}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => sendSMS('arrivee')}
                    className="action-btn"
                    style={{ fontSize: '0.82rem', padding: '10px', borderRadius: '6px', display: 'flex', gap: '6px', justifyContent: 'center' }}
                  >
                    {t.smsArriv}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => sendSMS('arafat')}
                    className="action-btn"
                    style={{ fontSize: '0.82rem', padding: '10px', borderRadius: '6px', display: 'flex', gap: '6px', justifyContent: 'center' }}
                  >
                    {t.smsArafat}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => sendSMS('retour')}
                    className="action-btn"
                    style={{ fontSize: '0.82rem', padding: '10px', borderRadius: '6px', display: 'flex', gap: '6px', justifyContent: 'center' }}
                  >
                    {t.smsRet}
                  </button>
                </div>

                {smsHistory.length > 0 && (
                  <div style={{ 
                    maxHeight: '180px', 
                    overflowY: 'auto', 
                    border: '1px solid var(--border)', 
                    backgroundColor: 'var(--bg)', 
                    padding: '12px', 
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {smsHistory.map((log, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-muted)', borderBottom: '1px dashed var(--border)', paddingBottom: '6px', textAlign: 'left' }}>
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {previewFile && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '20px'
            }}>
              <div style={{
                backgroundColor: 'var(--surface-overlay)',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '500px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text)' }}>
                    Aperçu : {previewFile.name}
                  </strong>
                  <button 
                    onClick={() => setPreviewFile(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', backgroundColor: 'var(--bg)', borderRadius: '8px', overflow: 'hidden' }}>
                  {previewFile.data && previewFile.data.startsWith('data:image/') ? (
                    <img src={previewFile.data} alt="Aperçu" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <FileText size={48} style={{ color: 'var(--primary)' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fichier non-image (PDF/Document)</span>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setPreviewFile(null)}
                  className="btn btn-secondary" 
                  style={{ alignSelf: 'flex-end' }}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {showTravelPass && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1200,
              padding: '20px',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '0',
                maxWidth: '680px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                color: '#333333',
                overflow: 'hidden'
              }}>
                {/* Print Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                  padding: '24px 30px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '4px solid var(--secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid var(--secondary)' }} />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.3px', color: '#ffffff' }}>SUNU HAJJ 2026</h3>
                      <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Délégation Générale au Pèlerinage</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', padding: '4px 10px', backgroundColor: 'var(--secondary-dark)', color: 'white', borderRadius: '4px' }}>
                      PASS VOYAGE & REÇU
                    </span>
                  </div>
                </div>

                {/* Print Body */}
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Pilgrim Info Bar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', paddingBottom: '20px', borderBottom: '1px dashed #e5e7eb' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Nom Complet</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>{fullName}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>N° Passeport</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '2px' }}>{pilgrim.passportNumber}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Agence de Voyage</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151', marginTop: '2px' }}>
                        {selectedAgencyId === 1 ? 'Voyages Teranga Hajj & Omra' : selectedAgencyId === 2 ? 'Dakar Air Services Hajj' : 'Sahel Omra & Hajj Confort'}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Groupe Sanguin</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151', marginTop: '2px' }}>{bloodType || 'Non renseigné'}</div>
                    </div>
                  </div>

                  {/* Logistics Section */}
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ✈️ Vol charter & hébergements
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>N° DE VOL</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{pilgrim.flightNumber || 'TX-202 (Charter Direct)'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>VISA STATUS</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-green)' }}>🟢 NUSUK SYNC / ACTIF</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>HÔTEL LA MECQUE</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{pilgrim.hotelMakkah && pilgrim.hotelMakkah !== 'Non assigné' ? pilgrim.hotelMakkah : 'Hôtel central (Agréé Sunu Hajj)'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>HÔTEL MÉDINE</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>{pilgrim.hotelMadinah && pilgrim.hotelMadinah !== 'Non assigné' ? pilgrim.hotelMadinah : 'Hôtel central (Agréé Sunu Hajj)'}</div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code and Seals */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>🔒 Certification Digitale</span>
                      <p style={{ fontSize: '0.72rem', color: '#6b7280', maxWidth: '380px', margin: 0, lineHeight: 1.4 }}>
                        Ce pass voyage constitue votre reçu officiel de validation auprès du Gouvernement du Sénégal. Il contient vos droits d'accès aux camps de Mina, Arafat, et aux transports officiels.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=SunuHajj2026-${pilgrim.passportNumber}`} 
                        alt="QR Code Pass" 
                        style={{ border: '2px solid #e5e7eb', borderRadius: '8px', padding: '4px', backgroundColor: '#fff' }} 
                      />
                      <div style={{ fontSize: '0.58rem', color: '#9ca3af', fontWeight: 700, marginTop: '4px' }}>N° {pilgrim.passportNumber}</div>
                    </div>
                  </div>

                </div>

                {/* Footer buttons */}
                <div style={{
                  backgroundColor: '#f3f4f6',
                  padding: '16px 30px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button 
                    onClick={() => setShowTravelPass(false)} 
                    className="btn btn-secondary"
                    style={{ height: '40px', fontSize: '0.85rem' }}
                  >
                    Fermer
                  </button>
                  <button 
                    onClick={() => window.print()} 
                    className="btn btn-primary"
                    style={{ height: '40px', fontSize: '0.85rem', fontWeight: 800, backgroundColor: 'var(--primary-dark)' }}
                  >
                    🖨️ Imprimer mon Pass
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* Pilgrim Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '20px', padding: '32px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                🔑 Modifier mon Mot de Passe / Code PIN
              </h3>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            {passwordMsg && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', backgroundColor: passwordMsg.type === 'success' ? '#DEF7EC' : '#FDE8E8', color: passwordMsg.type === 'success' ? '#03543F' : '#9B1C1C', fontSize: '0.85rem', fontWeight: 600 }}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              if (newPassword.length < 6) {
                setPasswordMsg({ text: "Le mot de passe doit contenir au moins 6 caractères.", type: 'error' });
                return;
              }
              if (newPassword !== confirmPassword) {
                setPasswordMsg({ text: "Les mots de passe ne correspondent pas.", type: 'error' });
                return;
              }
              setPasswordMsg({ text: "Mot de passe mis à jour et validé avec succès !", type: 'success' });
              setTimeout(() => { setShowPasswordModal(false); setPasswordMsg(null); setNewPassword(''); setConfirmPassword(''); }, 1500);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Nouveau mot de passe
                </label>
                <input 
                  type="password" 
                  required 
                  className="form-control"
                  placeholder="Minimum 6 caractères"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>
                  Confirmer le mot de passe
                </label>
                <input 
                  type="password" 
                  required 
                  className="form-control"
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)', fontWeight: 700, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--primary-dark)', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Choice & Medical Appointment Modal */}
      {showDoctorModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', borderRadius: '24px', padding: '32px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '1.5px solid var(--border)' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                  🩺 Choix du Médecin Agréé & Prise de RDV
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Région de résidence : <strong>{safePilgrim.region || "Dakar"}</strong>
                </span>
              </div>
              <button onClick={() => setShowDoctorModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Sélectionnez votre Médecin ou Centre Médical Agréé :
              </span>

              {[
                { code: 'MED-DKR-01', doctorName: 'Dr. Babacar Ndiaye', hospital: 'Hôpital Principal de Dakar', region: 'Dakar', phone: '+221 33 839 50 50' },
                { code: 'MED-DKR-02', doctorName: 'Dr. Aïssatou Sow', hospital: 'Hôpital Aristide Le Dantec', region: 'Dakar', phone: '+221 33 889 38 00' },
                { code: 'MED-THIES-01', doctorName: 'Dr. Cheikh Tall', hospital: 'Hôpital Régional de Thiès', region: 'Thiès', phone: '+221 33 951 10 20' },
                { code: 'MED-SL-01', doctorName: 'Dr. Mouhamadou Kane', hospital: 'Hôpital Régional de Saint-Louis', region: 'Saint-Louis', phone: '+221 33 961 12 34' }
              ].map(doc => {
                const isSelected = chosenDoctor && chosenDoctor.code === doc.code;
                return (
                  <div 
                    key={doc.code}
                    onClick={() => setChosenDoctor(doc)}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      border: isSelected ? '2px solid #0A5C36' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'rgba(10,92,54,0.06)' : 'var(--bg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: isSelected ? '#0A5C36' : 'rgba(10,92,54,0.1)', color: isSelected ? '#FFFFFF' : '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900 }}>
                        🩺
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--primary-dark)' }}>{doc.doctorName}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>🏥 {doc.hospital} ({doc.region})</span>
                        <span style={{ fontSize: '0.72rem', color: '#0A5C36', fontWeight: 700 }}>Code : {doc.code} | 📞 {doc.phone}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ backgroundColor: '#0A5C36', color: '#ffffff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem' }}>✓</span>
                    )}
                  </div>
                );
              })}

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'block', marginBottom: '10px' }}>
                  📅 Programmer la date de votre visite médicale :
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Date souhaitée</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={appointmentDate}
                      onChange={e => setAppointmentDate(e.target.value)}
                      style={{ padding: '8px 12px', height: '42px', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Heure de passage</label>
                    <select
                      className="form-control"
                      value={appointmentTime}
                      onChange={e => setAppointmentTime(e.target.value)}
                      style={{ padding: '8px 12px', height: '42px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700 }}
                    >
                      <option value="08:30">08:30 - Matin</option>
                      <option value="09:30">09:30 - Matin</option>
                      <option value="11:00">11:00 - Matin</option>
                      <option value="15:00">15:00 - Après-midi</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  setAppointmentBooked(true);
                  const doctorData = {
                    selectedMedicalCode: chosenDoctor.code,
                    selectedDoctorId: chosenDoctor.code,
                    selectedDoctorName: chosenDoctor.doctorName,
                    selectedHospital: chosenDoctor.hospital,
                    medicalAppointmentDate: appointmentDate,
                    medicalAppointmentTime: appointmentTime
                  };
                  try {
                    await ApiService.updatePilgrimProfile(safePilgrim.id, doctorData);
                  } catch (e) {}
                  
                  // Save to local storage mock pilgrims list
                  try {
                    const mockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');
                    const idx = mockList.findIndex(p => p.id === safePilgrim.id || p.passportNumber === safePilgrim.passportNumber);
                    if (idx !== -1) {
                      mockList[idx] = { ...mockList[idx], ...doctorData };
                      localStorage.setItem('mock_pilgrims', JSON.stringify(mockList));
                    }
                  } catch (e) {}

                  sendRealSms(phone || safePilgrim.phone || '+221 77 123 45 67', `Sunu Hajj: Votre RDV médical avec ${chosenDoctor.doctorName} (${chosenDoctor.hospital}) est confirmé pour le ${appointmentDate} à ${appointmentTime}.`);
                  alert(`✅ Visite médicale programmée avec succès !\n\nMédecin : ${chosenDoctor.doctorName}\nStructure : ${chosenDoctor.hospital}\nDate : Le ${appointmentDate} à ${appointmentTime}\n\nUn SMS de confirmation a été transmis.`);
                  setShowDoctorModal(false);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  marginTop: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#0A5C36',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(10,92,54,0.25)'
                }}
              >
                🚀 Valider mon Médecin & Réserver le RDV Médical
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CERTIFICAT MEDICAL D'APTITUDE PDF */}
      {showMedicalCertModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', border: '3px double #D4AF37', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button 
              onClick={() => setShowMedicalCertModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: '1rem', color: '#64748b' }}
            >
              ✕
            </button>

            {/* Official Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0A5C36', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '1px', color: '#042F1A' }}>RÉPUBLIQUE DU SÉNÉGAL</div>
              <div style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b' }}>Un Peuple - Un But - Une Foi</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A5C36', marginTop: '4px' }}>MINISTÈRE DE LA SANTÉ ET DE L'ACTION SOCIALE</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37' }}>DÉLÉGATION GÉNÉRALE AU HAJJ (DGP)</div>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#042F1A', textTransform: 'uppercase', letterSpacing: '1px', margin: 0, textDecoration: 'underline' }}>
                CERTIFICAT D'APTITUDE MÉDICALE AU HAJJ 2026
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '6px' }}>N° Document Certifié : DGP-MED-2026-{(safePilgrim.passportNumber || 'SN92837').slice(-5)}</span>
            </div>

            {/* Content Body */}
            <div style={{ fontSize: '0.88rem', lineHeight: '1.8', color: '#1e293b', margin: '24px 0', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 12px 0' }}>
                Je soussigné(e), <strong>{chosenDoctor?.doctorName || 'Dr. Mouhamadou Kane'}</strong>, Médecin d'État assermenté et agréé par la Commission Médicale Nationale du Hajj, certifie avoir examiné ce jour le pèlerin :
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}>
                <div><strong>Nom & Prénom :</strong> {safePilgrim.fullName || safePilgrim.name || 'Samba DIOP'}</div>
                <div><strong>N° Passeport :</strong> {safePilgrim.passportNumber || 'SN8492049'}</div>
                <div><strong>Région :</strong> {safePilgrim.region || chosenDoctor?.region || 'Dakar'}</div>
                <div><strong>Groupe Sanguin :</strong> {safePilgrim.bloodType || 'O+ (Positif)'}</div>
                <div><strong>Structure Sanitaire :</strong> {chosenDoctor?.hospital || chosenDoctor?.name || 'Hôpital Régional de Saint-Louis'}</div>
                <div><strong>Téléphone :</strong> {safePilgrim.phone || '+221 78 591 07 67'}</div>
              </div>

              {/* Carnet de Vaccination & Dates certifiées */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong style={{ fontSize: '0.82rem', color: '#042F1A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  💉 CARNET DE VACCINATION SÉNÉGAL (DATES D'INJECTION CERTIFIÉES) :
                </strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    🟡 <strong>Fièvre Jaune :</strong> {safePilgrim.vaccines?.yellowFeverDate || '12/05/2026'} ({safePilgrim.vaccines?.yellowFeverBatch || 'LOT-YF2026-DKR'})
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    🟢 <strong>Méningite ACYW135 :</strong> {safePilgrim.vaccines?.meningitisDate || '12/05/2026'} ({safePilgrim.vaccines?.meningitisBatch || 'LOT-MN2026-DKR'})
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    🔵 <strong>Grippe Saisonnière :</strong> {safePilgrim.vaccines?.fluVaccineDate || '12/05/2026'}
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    🟣 <strong>COVID-19 Pfizer :</strong> {safePilgrim.vaccines?.covidVaccineDate || '10/04/2026'}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(10,92,54,0.08)', borderRadius: '8px', borderLeft: '4px solid #0A5C36', fontWeight: 800, color: '#0A5C36', textAlign: 'center', fontSize: '0.95rem' }}>
                CONCLUSIONS MÉDICALES : 🟢 APTE À L'ACCOMPLISSEMENT DU PÈLERINAGE À LA MECQUE
              </div>
            </div>

            {/* Official Stamp & Signatures */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed #0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900, color: '#0A5C36', margin: '0 auto 6px' }}>
                  TAMPON D'ÉTAT<br/>SÉNÉGAL
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Scellé Numérique Officiel</span>
              </div>

              <div style={{ textAlign: 'center' }}>
                {/* Simulated QR Code */}
                <div style={{ width: '74px', height: '74px', backgroundColor: '#042F1A', color: '#ffffff', padding: '6px', borderRadius: '6px', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', textAlign: 'center' }}>
                  [QR CODE VERIFICATION DGP]
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Scan Sécurité Makkah</span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Fait à Dakar, le {new Date().toLocaleDateString('fr-FR')}</span>
                <strong style={{ fontSize: '0.85rem', color: '#042F1A', display: 'block', marginTop: '6px' }}>{chosenDoctor?.doctorName || 'Dr. Mouhamadou Kane'}</strong>
                <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#0A5C36' }}>Signature & Cachet du Médecin</span>
              </div>
            </div>

            {/* Print Button */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => window.print()} 
                style={{ flex: 1, height: '46px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                🖨️ Imprimer / Sauvegarder en PDF
              </button>
              <button 
                onClick={() => setShowMedicalCertModal(false)}
                style={{ width: '120px', height: '46px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BADGE OFFICIEL PELLERIN & PASS NUSUK SAUDI */}
      {showPilgrimBadgeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', maxWidth: '440px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', border: '2px solid #D4AF37', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', position: 'relative' }}>
            <button 
              onClick={() => setShowPilgrimBadgeModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem', color: '#64748b' }}
            >
              ✕
            </button>

            {/* Badge Card Lanyard UI */}
            <div style={{ borderRadius: '16px', border: '3px solid #0A5C36', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 8px 25px rgba(0,0,0,0.12)' }}>
              {/* Badge Header Banner */}
              <div style={{ background: 'linear-gradient(135deg, #042F1A 0%, #0A5C36 100%)', color: '#ffffff', padding: '14px', textAlign: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', marginBottom: '4px' }}>
                  <span>🇸🇳</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#D4AF37', letterSpacing: '2px' }}>ROYAUME D'ARABIE SAOUDITE - SÉNÉGAL</span>
                  <span>🇸🇦</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>HAJJ 2026 — PASS PÈLERIN</h3>
                <span style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: 700 }}>CARD IDENTIFICATION & NUSUK PERMIT</span>
              </div>

              {/* Badge Body */}
              <div style={{ padding: '20px', textAlign: 'center' }}>
                {/* Pilgrim Avatar Frame */}
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #D4AF37', margin: '0 auto 12px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                  👳‍♂️
                </div>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#042F1A', margin: '0 0 4px 0' }}>
                  {safePilgrim.fullName || safePilgrim.name || 'Samba DIOP'}
                </h2>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0A5C36', display: 'block', marginBottom: '14px' }}>
                  Passeport : {safePilgrim.passportNumber || 'SN9283741'} | Groupe : {safePilgrim.bloodType || 'O+'}
                </span>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.74rem', margin: '12px 0' }}>
                  <div><span style={{ color: '#64748b' }}>Agence :</span><br/><strong>{safePilgrim.agencyName || 'Teranga Hajj'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Région :</span><br/><strong>{safePilgrim.region || 'Dakar'}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Nusuk Status :</span><br/><strong style={{ color: '#047857' }}>🟢 SYNCHRONISÉ</strong></div>
                  <div><span style={{ color: '#64748b' }}>Aptitude :</span><br/><strong style={{ color: '#047857' }}>🟢 VALIDAIT (APTE)</strong></div>
                </div>

                {/* QR Code Nusuk Saudi */}
                <div style={{ margin: '16px 0 8px 0', padding: '12px', backgroundColor: '#042F1A', color: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#ffffff', color: '#000000', borderRadius: '6px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 900 }}>
                    [QR NUSUK SAUDI]
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 800, display: 'block' }}>NUSUK HAJJ VISA ID</span>
                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>SA-2026-SN-84920</strong>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>Scannable à Makkah, Mina & Arafat</span>
                  </div>
                </div>
              </div>

              {/* Badge Footer */}
              <div style={{ backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', padding: '8px', textAlign: 'center', fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>
                📞 Urgence DGP Sénégal sur place : +966 50 000 0000 / 800 10 20 30
              </div>
            </div>

            {/* Print Button */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.print()} 
                style={{ flex: 1, height: '44px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                🖨️ Imprimer mon Badge (Format Plastifié)
              </button>
              <button 
                onClick={() => setShowPilgrimBadgeModal(false)}
                style={{ width: '100px', height: '44px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PilgrimPortal;
