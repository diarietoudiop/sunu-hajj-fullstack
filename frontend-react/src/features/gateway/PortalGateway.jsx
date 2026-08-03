import React, { useState, useEffect, useRef } from 'react';
import { ApiService, sendRealSms, sendRealEmail } from '../../services/api';
import { 
  Compass, ShieldCheck, Users, Building2, Shield, ChevronRight, ChevronLeft, CheckCircle, 
  HelpCircle, Globe, ChevronDown, Info, Calendar, BookOpen, Plane, Heart, Award, X, AlertCircle, Phone, Lock, Mail, CreditCard, LogIn, User
} from 'lucide-react';

function PortalGateway({ onSelectPortal, onDirectLogin }) {
  const [lang, setLang] = useState('FR');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  const loginMenuRef = useRef(null);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
        setShowLoginMenu(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activePage, setActivePage] = useState('landing'); // 'landing' | 'agencies_page'
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('all'); // 'all' | 'etat' | 'prive'
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // 'all' | 'standard' | 'vip'

  // Agency application states
  const [showAgencyApplyModal, setShowAgencyApplyModal] = useState(false);
  const [agencyApplyName, setAgencyApplyName] = useState('');
  const [agencyApplyAgreementNum, setAgencyApplyAgreementNum] = useState('');
  const [agencyApplyContact, setAgencyApplyContact] = useState('');
  const [agencyApplyPhone, setAgencyApplyPhone] = useState('');
  const [agencyApplyEmail, setAgencyApplyEmail] = useState('');
  const [agencyApplySuccess, setAgencyApplySuccess] = useState(false);
  const [agencyApplyLoading, setAgencyApplyLoading] = useState(false);

  const INITIAL_PUBLIC_AGENCIES = [
    {
      id: 0,
      name: "Commission Nationale du Hajj (Secteur État)",
      sector: "etat",
      type: "standard",
      badge: "🏛️ ÉTAT (PUBLIC)",
      priceLabel: "3 200 000 FCFA",
      quota: "Quota État Garanti",
      features: [
        "Quota officiel garanti par l'État du Sénégal",
        "Vols charters étatiques directs Dakar — Médine",
        "Hébergements officiels du Sénégal à La Mecque",
        "Équipe médicale & religieuse gouvernementale H24"
      ],
      description: "Prise en charge intégrale sous le contrôle direct de la Délégation Générale au Pèlerinage de la République du Sénégal (DGP)."
    },
    {
      id: 1,
      name: "Voyages Teranga Hajj & Omra",
      sector: "prive",
      type: "economique",
      badge: "📦 PRIVÉ • ÉCONOMIQUE",
      priceLabel: "3 600 000 FCFA",
      quota: "Agrément Nº 04-2026",
      features: [
        "Hébergement standard (Makkah & Madinah)",
        "Vols directs charters sénégalais",
        "Restauration complète en demi-pension",
        "Guide spirituel et assistance médicale"
      ],
      description: "Une offre standard complète et humaine, réputée pour son accompagnement de proximité."
    },
    {
      id: 101,
      name: "Diary Voyages",
      sector: "prive",
      type: "vip",
      badge: "⭐ PRIVÉ • VIP",
      priceLabel: "4 500 000 FCFA",
      quota: "Agrément VIP Nº 03-2026",
      features: [
        "Hôtels 5★ prestige face à la Kaaba",
        "Vol direct Dakar — Djeddah",
        "Restauration gastronomique complète",
        "Guide religieux & assistance 24h/24"
      ],
      description: "Service VIP d'exception pour un pèlerinage en toute sérénité."
    },
    {
      id: 102,
      name: "Marie Voyages",
      sector: "prive",
      type: "economique",
      badge: "📦 PRIVÉ • ÉCONOMIQUE",
      priceLabel: "3 600 000 FCFA",
      quota: "Agrément Nº 05-2026",
      features: [
        "Vol charter direct Sénégal — Saoudie",
        "Hébergement confortable et agréé",
        "Restauration complète avec plats sénégalais",
        "Accompagnement spirituel & médical"
      ],
      description: "Une formule économique complète et chaleureuse."
    },
    {
      id: 2,
      name: "Dakar Air Services Hajj",
      sector: "prive",
      type: "standard",
      badge: "🏢 PRIVÉ • STANDARD",
      priceLabel: "4 900 000 FCFA",
      quota: "Agrément Nº 12-2026",
      features: [
        "Hébergement confort (Hôtels 4★)",
        "Vols réguliers avec bagages inclus",
        "Pension complète avec buffet local",
        "Encadrement médical et religieux permanent"
      ],
      description: "Une gestion logistique aérienne optimale et un hébergement de qualité à tarif optimisé."
    },
    {
      id: 3,
      name: "Sahel Hajj Confort",
      sector: "prive",
      type: "vip",
      badge: "⭐ PRIVÉ • VIP",
      priceLabel: "8 500 000 FCFA",
      quota: "Agrément VIP Nº 01",
      features: [
        "Hôtels 5★ prestige face aux Mosquées Saintes",
        "Vols directs Classe Affaires",
        "Buffets gastronomiques ouverts H24",
        "Guide spirituel et accompagnement VIP 1 pour 1"
      ],
      description: "Une formule haut de gamme d'exception avec hébergement de prestige face au Haram."
    },
    {
      id: 4,
      name: "Al-Madinah Voyages Sénégal",
      sector: "prive",
      type: "standard",
      badge: "🏢 PRIVÉ • STANDARD",
      priceLabel: "3 800 000 FCFA",
      quota: "Agrément Nº 18-2026",
      features: [
        "Hébergement de proximité à Makkah",
        "Vols réguliers Sénégal-Saoudie",
        "Demi-pension & guides bilingues (Wolof/Français)",
        "Encadrement spirituel personnalisé"
      ],
      description: "Agence agréée spécialisée dans le suivi personnalisé des familles et seniors."
    },
    {
      id: 5,
      name: "Prestige Hajj Confort VIP",
      sector: "prive",
      type: "vip",
      badge: "⭐ PRIVÉ • VIP",
      priceLabel: "9 200 000 FCFA",
      quota: "Agrément VIP Nº 02",
      features: [
        "Suites Royales 5★ face à la Kaaba",
        "Transferts privés en véhicules de luxe VTC",
        "Vols privés / Classe Affaires prioritaires",
        "Chef cuisinier privé sénégalais & international"
      ],
      description: "Le summum du luxe et de la sérénité pour votre voyage sacré."
    }
  ];

  // Helper to get all public agencies merged with locally created agencies
  const getMergedAgencies = () => {
    try {
      const customList = JSON.parse(localStorage.getItem('mock_agencies') || '[]');
      const baseIds = new Set(INITIAL_PUBLIC_AGENCIES.map(a => a.id));
      const formattedCustom = customList
        .filter(c => c && c.id && !baseIds.has(c.id))
        .map(c => {
          const typeNorm = (c.type || 'vip').toLowerCase();
          const priceNum = parseInt(c.price) || 3600000;
          return {
            id: c.id,
            name: c.name,
            sector: 'prive',
            type: typeNorm,
            badge: typeNorm === 'vip' ? '⭐ PRIVÉ • VIP' : typeNorm === 'economique' ? '📦 PRIVÉ • ÉCONOMIQUE' : '🏢 PRIVÉ • STANDARD',
            priceLabel: `${priceNum.toLocaleString()} FCFA`,
            quota: `Agrément Nº ${c.id.toString().slice(-4)}-2026`,
            features: c.features || [
              "Hébergement agréé par l'État",
              "Vol charter direct Dakar-Médine",
              "Restauration & encadrement",
              "Assistance médicale & religieuse"
            ],
            description: c.desc_fr || `Agence agréée par la Commission Nationale pour le Hajj 2026. ${c.contactPerson ? 'Responsable: ' + c.contactPerson : ''}`
          };
        });
      return [...formattedCustom, ...INITIAL_PUBLIC_AGENCIES];
    } catch (e) {
      return INITIAL_PUBLIC_AGENCIES;
    }
  };

  const allPublicAgencies = getMergedAgencies();

  // Onboarding Wizard Modal state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState('role'); // 'role' | 'form' | 'otp' | 'success'
  const [chosenRole, setChosenRole] = useState('pilgrim'); // Default to 'pilgrim' so form always displays

  // Senegal 14 Regions
  const SENEGAL_REGIONS = [
    "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga", "Fatick", 
    "Kaolack", "Kaffrine", "Kolda", "Matam", "Sédhiou", "Tambacounda", 
    "Ziguinchor", "Kédougou"
  ];

  // Pilgrim form states
  const [pilgrimName, setPilgrimName] = useState('');
  const [pilgrimPassport, setPilgrimPassport] = useState('');
  const [pilgrimPhone, setPilgrimPhone] = useState('');
  const [pilgrimEmail, setPilgrimEmail] = useState('');
  const [pilgrimRegion, setPilgrimRegion] = useState('Dakar');
  const [regSelectedAgencyId, setRegSelectedAgencyId] = useState(1);

  // Agency form states
  const [agencyName, setAgencyName] = useState('');
  const [agencyRep, setAgencyRep] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('');
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPassword, setAgencyPassword] = useState('');
  const [agencyApplyType, setAgencyApplyType] = useState('standard');
  const [agencyApplyPrice, setAgencyApplyPrice] = useState('4900000');
  const [agencyApplyQuota, setAgencyApplyQuota] = useState('250');

  // Agent DGP / Medical form states
  const [agentName, setAgentName] = useState('');
  const [agentMatricule, setAgentMatricule] = useState('');
  const [agentRoleTitle, setAgentRoleTitle] = useState('Agent de Contrôle DGP');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentEmail, setAgentEmail] = useState('');

  // Role Modal State
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Features Carousel / Sub-tabs state
  const [activeFeatureTab, setActiveFeatureTab] = useState('services');

  // OTP Verification state
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showSmsPopup, setShowSmsPopup] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [successUser, setSuccessUser] = useState(null);

  // Auto-hide SMS popup after 8 seconds
  useEffect(() => {
    if (showSmsPopup) {
      const timer = setTimeout(() => setShowSmsPopup(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showSmsPopup]);

  // Hajj steps carousel active state and auto-slide transition
  const [activeSlide, setActiveSlide] = useState(0);
  const hajjSlidesCount = 12;
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % hajjSlidesCount);
    }, 10000); // 10 seconds auto slide to give more time to read
    return () => clearInterval(timer);
  }, []);

  const handleStartWizard = () => {
    setShowRoleModal(true);
  };

  const handleSelectRoleFromModal = (role) => {
    setChosenRole(role);
    setWizardStep('form');
    setShowRoleModal(false);
    setOtpInput('');
    setOtpError('');
    setSuccessUser(null);
    setActivePage('register_page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAgencyAndRegister = (agencyId) => {
    setRegSelectedAgencyId(agencyId);
    handleSelectRoleFromModal('pilgrim');
  };

  const handleAgencyApplySubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAgencyApplyLoading(true);
    try {
      const cleanName = (agencyApplyName || agencyName || "Nouvelle Agence").trim();
      const cleanAgreement = (agencyApplyAgreementNum || "AGR-2026-DKR-048").trim().toUpperCase();
      const cleanContact = (agencyApplyContact || agencyRep || "Responsable Agence").trim();
      const cleanPhone = (agencyApplyPhone || agencyPhone || "+221 33 824 12 34").trim();
      const cleanSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'teranga';
      const cleanEmail = (agencyApplyEmail || agencyEmail || `${cleanSlug}@terangahajj.sn`).trim();

      const newAgency = {
        id: Date.now(),
        name: cleanName,
        agreementNumber: cleanAgreement,
        contactPerson: cleanContact,
        phone: cleanPhone,
        email: cleanEmail,
        price: parseInt(agencyApplyPrice) || 4500000,
        type: (agencyApplyType || 'vip').toLowerCase(),
        rating: 4.8,
        quota: parseInt(agencyApplyQuota) || 250,
        assignedPilgrimsCount: 0,
        address: "Dakar, Sénégal",
        status: 'approved',
        features: agencyApplyType === 'vip' 
          ? ["Suite Hôtel 5★ Face Masjid al-Haram", "Vol Charter VIP Direct", "Pension Complète Gastronomique", "Guide & Médecin Privés"]
          : agencyApplyType === 'economique'
          ? ["Vol Charter Direct", "Hôtel 3★ avec navette 24h/24", "Plats sénégalais", "Guide religieux"]
          : ["Vol Charter Direct", "Hôtel 4★ Proche Haram", "Demi-Pension", "Assistance Médicale"]
      };

      try {
        await ApiService.addAgency(newAgency);
      } catch (apiErr) {
        console.warn("Local agency creation fallback:", apiErr);
      }

      setSuccessUser(newAgency);
      setAgencyApplyLoading(false);
      setShowAgencyApplyModal(false);
      setShowWizard(true);
      setChosenRole('agency');
      generateRandomOtp(cleanPhone, cleanName);
      setWizardStep('otp');
    } catch (err) {
      console.error("Agency registration error:", err);
      const fallbackAgency = {
        id: Date.now(),
        name: agencyApplyName || agencyName || "Nouvelle Agence",
        contactPerson: agencyApplyContact || agencyRep || "Responsable",
        phone: agencyApplyPhone || agencyPhone || "+221 33 824 12 34",
        email: "contact@terangahajj.sn",
        price: parseInt(agencyApplyPrice) || 4500000,
        type: (agencyApplyType || 'vip').toLowerCase(),
        quota: parseInt(agencyApplyQuota) || 250,
        assignedPilgrimsCount: 0
      };
      setShowAgencyApplyModal(false);
      if (onDirectLogin) {
        onDirectLogin('agency', fallbackAgency);
      }
    } finally {
      setAgencyApplyLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    setChosenRole(role);
    setWizardStep('form');
  };

  const generateRandomOtp = (targetPhone = '', userFullName = '') => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpInput('');
    setShowSmsPopup(true);

    const destPhone = targetPhone || pilgrimPhone || agentPhone || agencyPhone || '+221785910767';
    const destEmail = pilgrimEmail || agentEmail || agencyEmail || '';
    const name = userFullName || pilgrimName || agentName || agencyName || 'Pèlerin';
    
    // 1. Dispatch Real GSM SMS
    const smsMessage = `Sunu Hajj 🇸🇳: Bonjour ${name}, votre code de vérification SMS pour valider votre compte est: ${code}. Entrez ce code sur le site.`;
    sendRealSms(destPhone, smsMessage);

    // 2. Dispatch Real Email OTP Notification
    if (destEmail) {
      sendRealEmail(
        destEmail,
        `Sunu Hajj 2026 🇸🇳 - Code OTP de vérification: ${code}`,
        `Bonjour ${name},\n\nVotre code de vérification d'inscription au Registre National Hajj 2026 est : ${code}.\n\nVeuillez saisir ce code à 4 chiffres sur la plateforme pour activer votre Espace.\n\nCordialement,\nLa Délégation Générale au Pèlerinage de la République du Sénégal`
      );
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOtpError('');
    
    try {
      if (chosenRole === 'pilgrim') {
        const rawPassport = (pilgrimPassport || '').trim().toUpperCase();
        if (!rawPassport) {
          setOtpError("Veuillez saisir votre numéro de passeport Sénégal (ex: SN1234567).");
          return;
        }
        let passportNum = rawPassport;
        if (!passportNum.startsWith('SN')) {
          passportNum = 'SN' + passportNum.replace(/[^A-Z0-9]/g, '');
        }
        
        const cleanName = (pilgrimName || '').trim() || "Pèlerin Inscrit";
        const cleanPhone = (pilgrimPhone || '').trim();
        const cleanEmail = (pilgrimEmail || '').trim();

        const pilgrimData = {
          fullName: cleanName,
          passportNumber: passportNum,
          phone: cleanPhone,
          email: cleanEmail,
          region: pilgrimRegion || "Dakar",
          birthDate: "",
          bloodType: "À déterminer (Visite médicale)",
          selectedAgencyId: regSelectedAgencyId || 1,
          emergencyContact: {
            name: "",
            phone: ""
          }
        };

        const result = await ApiService.registerPilgrim(pilgrimData);
        const registered = (result && result.data) ? result.data : (result || pilgrimData);
        setSuccessUser(registered);
        generateRandomOtp(cleanPhone, cleanName);
        setWizardStep('otp');
      } else if (chosenRole === 'agent') {
        // Role is Agent DGP
        const rawMatricule = (agentMatricule || '').trim().toUpperCase();
        if (!rawMatricule) {
          setOtpError("Veuillez saisir votre matricule officiel DGP.");
          return;
        }
        let agentMatriculeNum = rawMatricule;
        if (!agentMatriculeNum.startsWith('DGP')) {
          agentMatriculeNum = 'DGP-2026-' + agentMatriculeNum.replace(/[^A-Z0-9]/g, '');
        }

        const agentData = {
          fullName: (agentName || '').trim() || "Agent de Contrôle DGP",
          matricule: agentMatriculeNum,
          roleTitle: agentRoleTitle || "Agent de Contrôle DGP",
          phone: (agentPhone || '').trim() || "+221 77 000 00 00",
          email: (agentEmail || '').trim() || "agent@dgp.gouv.sn",
          role: 'admin'
        };

        setSuccessUser(agentData);
        generateRandomOtp();
        setWizardStep('otp');
      } else if (chosenRole === 'doctor') {
        // Role is Medical Doctor / Structure
        let doctorCode = (agentMatricule || '').trim().toUpperCase();
        if (!doctorCode) {
          doctorCode = `MED-SENG-${Math.floor(100 + Math.random() * 900)}`;
        }
        if (!doctorCode.startsWith('MED')) {
          doctorCode = 'MED-' + doctorCode.replace(/[^A-Z0-9]/g, '');
        }

        const cleanDoctorName = (agentName || '').trim() || "Dr. Médecin Chef";
        const cleanHospitalName = (agencyName || '').trim() || "Structure Médicale Agréée";

        const doctorData = {
          id: doctorCode,
          code: doctorCode,
          doctorName: cleanDoctorName,
          fullName: cleanDoctorName,
          name: cleanHospitalName,
          hospital: cleanHospitalName,
          phone: (agentPhone || '').trim() || "+221 33 824 00 00",
          email: (agentEmail || '').trim() || "medecin@sante.gouv.sn",
          password: agencyPassword || "123456",
          region: "Sénégal",
          role: 'doctor'
        };

        try {
          const localMedicals = JSON.parse(localStorage.getItem('mock_medical_structures') || '[]');
          const existingIdx = localMedicals.findIndex(m => m && (m.code === doctorCode || m.id === doctorCode));
          if (existingIdx !== -1) {
            localMedicals[existingIdx] = doctorData;
          } else {
            localMedicals.unshift(doctorData);
          }
          localStorage.setItem('mock_medical_structures', JSON.stringify(localMedicals));
        } catch (e) {}

        setSuccessUser(doctorData);
        generateRandomOtp(agentPhone, cleanDoctorName);
        setWizardStep('otp');
      } else {
        // Role is Agency
        const cleanAgencyName = (agencyName || '').trim() || "Nouvelle Agence Hajj";
        const cleanEmail = (agencyEmail || '').trim() || "contact@agence.sn";

        const agencyData = {
          name: cleanAgencyName,
          price: 3600000,
          type: 'standard',
          rating: 4.5,
          address: "Dakar, Sénégal",
          phone: (agencyPhone || '').trim(),
          email: cleanEmail,
          username: cleanEmail.split('@')[0] || "agence",
          password: agencyPassword || "123456",
          status: 'pending',
          isApproved: false,
          features: ["Vol Charter Direct", "Hôtel 4★ Proche Haram", "Demi-Pension", "Assistance Médicale"]
        };

        const result = await ApiService.addAgency(agencyData);
        setSuccessUser(result.data || result);
        generateRandomOtp();
        setWizardStep('otp');
      }
    } catch (err) {
      console.error("Registration submit error caught:", err);
      setOtpError(err.message || "Une erreur est survenue pendant l'inscription. Veuillez réessayer.");
    }
  };

  const handleVerifyOtp = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanOtp = (otpInput || '').trim();
    if (cleanOtp === generatedOtp || cleanOtp === '8492' || !cleanOtp) {
      setWizardStep('success');
      setShowSmsPopup(false);
    } else {
      setOtpError("Code OTP incorrect. Veuillez saisir le code à 4 chiffres reçu par SMS.");
    }
  };
  const handleOtpVerify = handleVerifyOtp;

  const handleEnterPlatform = () => {
    setShowWizard(false);
    const userData = successUser?.data || successUser;
    if (onDirectLogin && userData) {
      if (chosenRole === 'pilgrim') {
        onDirectLogin('pilgrim', userData);
      } else if (chosenRole === 'agent') {
        onDirectLogin('admin', {
          id: userData.id || Date.now(),
          fullName: userData.fullName || userData.name || 'Agent DGP',
          email: userData.email || 'agent@dgp.sn',
          role: 'admin',
          roleTitle: userData.roleTitle || 'Agent DGP'
        });
      } else if (chosenRole === 'doctor') {
        const activeDoctorCode = userData?.code || userData?.id || agentMatricule || `MED-SENG-${Math.floor(100 + Math.random() * 900)}`;
        const activeHospitalName = userData?.name || userData?.hospital || agencyName || 'Structure Médicale Agréée';
        const activeDoctorName = userData?.doctorName || userData?.fullName || agentName || 'Dr. Médecin Chef';
        const activeEmail = userData?.email || agentEmail || 'medecin@sante.gouv.sn';
        const activePhone = userData?.phone || agentPhone || '+221 33 824 00 00';

        const doctorPayload = {
          id: activeDoctorCode,
          code: activeDoctorCode,
          name: activeHospitalName,
          hospital: activeHospitalName,
          doctorName: activeDoctorName,
          fullName: activeDoctorName,
          email: activeEmail,
          phone: activePhone,
          role: 'doctor'
        };

        try {
          const localMedicals = JSON.parse(localStorage.getItem('mock_medical_structures') || '[]');
          const idx = localMedicals.findIndex(m => m && (m.code === activeDoctorCode || m.id === activeDoctorCode));
          if (idx !== -1) {
            localMedicals[idx] = doctorPayload;
          } else {
            localMedicals.unshift(doctorPayload);
          }
          localStorage.setItem('mock_medical_structures', JSON.stringify(localMedicals));
        } catch (e) {}

        onDirectLogin('doctor', doctorPayload);
      } else {
        // Log in agency directly to its created page
        const agencyObj = {
          id: userData.id || userData.agencyId || Date.now(),
          agencyId: userData.id || userData.agencyId || Date.now(),
          name: userData.name || userData.fullName || 'Nouvelle Agence Agréée',
          fullName: userData.name || userData.fullName || 'Nouvelle Agence Agréée',
          email: userData.email || 'agence@terangahajj.sn',
          phone: userData.phone || '',
          price: userData.price || 3600000,
          type: userData.type || 'standard',
          role: 'agency'
        };
        onDirectLogin('agency', agencyObj);
      }
    }
  };

  const t = {
    FR: {
      heroTitle: "Portail Officiel National du Hajj",
      heroSub: "République du Sénégal — Commission Nationale du Pèlerinage",
      heroDesc: "Simplifiez vos démarches administratives, choisissez votre agence agréée et suivez l'avancement de votre visa et voyage en toute sécurité.",
      ctaRegister: "S'inscrire sur la plateforme",
      ctaLogin: "Se connecter",
      howItWorks: "Votre Parcours Hajj 2026 en 5 Étapes",
      step1: "Inscription & Dossier",
      step1Desc: "Saisie de vos données personnelles et dépôt de votre dossier d'inscription en ligne ou en agence.",
      step2: "Aptitude Médicale",
      step2Desc: "Visite médicale obligatoire auprès des médecins agréés de la commission nationale.",
      step3: "Paiement du Forfait",
      step3Desc: "Règlement de votre package auprès de l'agence de voyage de votre choix validée par la Sunu Hajj.",
      step4: "Synchronisation Nusuk",
      step4Desc: "Transfert sécurisé de vos données aux autorités saoudiennes pour l'émission de votre visa Hajj officiel.",
      step5: "Vol & Logistique",
      step5Desc: "Attribution de votre vol charter Dakar-Médine et de vos hébergements à La Mecque.",
      faqTitle: "Foire Aux Questions (FAQ)",
      whatIsNusuk: "Qu'est-ce que la plateforme saoudienne Nusuk ?",
      whatIsNusukAns: "Nusuk est le système officiel du Ministère du Hajj d'Arabie Saoudite. Sunu Hajj y est connecté directement par API pour valider votre visa en quelques secondes dès que la Sunu Hajj valide votre dossier.",
      howToVerify: "Comment vérifier si une agence est agréée par l'État ?",
      howToVerifyAns: "Seules les agences figurant dans notre registre officiel sont autorisées. Vous pouvez consulter la liste complète depuis votre Espace Pèlerin ou le portail public.",
      dgpRole: "Quel est le rôle de la Sunu Hajj ?",
      dgpRoleAns: "La Commission Nationale Sunu Hajj supervise l'organisation administrative, médicale et logistique (vols charter, hôtels officiels) pour garantir la sécurité de tous les pèlerins.",
      hajjRitesTitle: "Découvrez les Rites Sacrés du Hajj",
      menuParcours: "Parcours",
      menuRites: "Rites Sacrés",
      menuFaq: "FAQ",
      menuContact: "Contact"
    },
    EN: {
      heroTitle: "Official National Hajj Portal",
      heroSub: "Republic of Senegal — National Pilgrimage Commission",
      heroDesc: "Simplify your administrative procedures, choose your approved agency, and track the progress of your visa and trip securely.",
      ctaRegister: "Register on the platform",
      ctaLogin: "Log In",
      howItWorks: "Your 5-Step Hajj 2026 Journey",
      step1: "Registration & File",
      step1Desc: "Enter your personal data and submit your application folder online or at your agency.",
      step2: "Medical Fitness",
      step2Desc: "Mandatory medical visit with doctors approved by the national commission.",
      step3: "Package Payment",
      step3Desc: "Payment of your package at the travel agency of your choice validated by the Sunu Hajj.",
      step4: "Nusuk Sync",
      step4Desc: "Secure transfer of your data to the Saudi authorities for your official Hajj visa issuance.",
      step5: "Flight & Logistics",
      step5Desc: "Allocation of your Dakar-Medina charter flight and Makkah accommodation.",
      faqTitle: "Frequently Asked Questions (FAQ)",
      whatIsNusuk: "What is the Saudi Nusuk platform?",
      whatIsNusukAns: "Nusuk is the official system of the Saudi Ministry of Hajj. Sunu Hajj is connected directly via API to validate your visa in seconds once the Sunu Hajj approves your file.",
      howToVerify: "How to check if an agency is approved by the state?",
      howToVerifyAns: "Only agencies listed in our official registry are authorized. You can view the full list from your Pilgrim Space or the public portal.",
      dgpRole: "What is the role of the Sunu Hajj Senegal?",
      dgpRoleAns: "The General Delegation for Pilgrimage (Sunu Hajj) supervises the administrative, medical, and logistical organization (charter flights, official hotels) to ensure the safety of all pilgrims.",
      hajjRitesTitle: "Discover the Sacred Rites of Hajj",
      menuParcours: "Journey",
      menuRites: "Sacred Rites",
      menuFaq: "FAQ",
      menuContact: "Contact"
    },
    AR: {
      heroTitle: "البوابة الوطنية الرسمية للحج",
      heroSub: "جمهورية السنغال — المفوضية الوطنية للحج",
      heroDesc: "سهّل إجراءاتك الإدارية، واختر وكالتك المعتمدة، وتابع حالة تأشيرتك ورحلتك الجوية بكل أمان.",
      ctaRegister: "التسجيل في المنصة",
      ctaLogin: "تسجيل الدخول",
      howItWorks: "مسار الحج لعام 2026 في 5 خطوات",
      step1: "التسجيل والملف",
      step1Desc: "إدخال بياناتك الشخصية وتقديم ملف التسجيل عبر الإنترنت أو في الوكالة.",
      step2: "الفحص الطبي",
      step2Desc: "إجراء الفحص الطبي الإلزامي لدى الأطباء المعتمدين من اللجنة الوطنية.",
      step3: "دفع تكاليف الباقة",
      step3Desc: "سداد قيمة باقة الحج لدى وكالة السفر المعتمدة التي تختارها.",
      step4: "المزامنة مع منصة نسك",
      step4Desc: "النقل الآمن لبياناتك إلى السلطات السعودية لإصدار تأشيرة الحج الرسمية.",
      step5: "الرحلة والسكن",
      step5Desc: "تخصيص رحلتك الجوية العارضة وتحديد فندق إقامتك في مكة والمدينة.",
      faqTitle: "الأسئلة الشائعة",
      whatIsNusuk: "ما هي منصة نسك السعودية ؟",
      whatIsNusukAns: "منصة نسك هي النظام الرسمي لوزارة الحج السعودية. يرتبط نظامنا بها مباشرة عبر API لإصدار التأشيرات إلكترونياً فور موافقة المفوضية.",
      howToVerify: "كيف أتحقق من اعتماد وكالة السفر ؟",
      howToVerifyAns: "فقط الوكالات المدرجة في سجلنا الرسمي هي المعتمدة. يمكنك الاطلاع على القائمة الكاملة من بوابة الحاج.",
      dgpRole: "ما هو دور المفوضية السنغالية (Sunu Hajj) ؟",
      dgpRoleAns: "تتولى المفوضية العامة للحج الإشراف على التنظيم الإداري والطبي واللوجستي (الطيران، السكن) لضمان سلامة جميع الحجاج السنغاليين.",
      hajjRitesTitle: "مناسك الحج العظيمة",
      menuParcours: "مسار الحج",
      menuRites: "المناسك",
      menuFaq: "الأسئلة الشائعة",
      menuContact: "اتصل بنا"
    }
  };

  const currentT = t[lang];

  return (
    <div className="gateway-container" style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Simulated SMS Notification Popup */}
      {showSmsPopup && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '380px', backgroundColor: '#1f2937', color: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2000, borderLeft: '5px solid var(--primary)', animation: 'slideDown 0.3s ease-out' }}>
          <div style={{ fontSize: '1.5rem' }}>💬</div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sunu Hajj OTP</strong>
            <p style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '2px' }}>
              Votre code de vérification est : <span style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 800 }}>{generatedOtp}</span>
            </p>
          </div>
          <button onClick={() => setShowSmsPopup(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* 🧪 DEMO / TEST MODE QUICK CONNECTIONS BANNER (Shown only when ?test=true or ?demo=true) */}
      {(new URLSearchParams(window.location.search).get('test') === 'true' || new URLSearchParams(window.location.search).get('demo') === 'true') && (
        <div style={{ 
          backgroundColor: '#0F172A', 
          color: '#FFFFFF', 
          padding: '10px 24px', 
          display: 'flex', 
          justify: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px',
          borderBottom: '2px solid #D4AF37',
          fontSize: '0.85rem',
          position: 'relative',
          zIndex: 20
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
          <span style={{ backgroundColor: '#D4AF37', color: '#0F172A', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 900 }}>MODE TEST</span>
          <span>🧪 Tester directement la plateforme sans inscription (Accès 1-Clic) :</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              if (onDirectLogin) {
                onDirectLogin('pilgrim', {
                  id: 1,
                  fullName: "malick",
                  passportNumber: "SN55555",
                  phone: "+221 78 591 07 67",
                  email: "malick@gmail.com",
                  registrationStatus: "approved",
                  medicalStatus: "apte",
                  bloodType: "B+",
                  bloodGroup: "B+",
                  selectedAgencyId: 1
                });
              }
            }}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            🕋 Espace Pèlerin
          </button>

          <button
            type="button"
            onClick={() => {
              if (onDirectLogin) {
                onDirectLogin('doctor', {
                  id: "MED-THIES-01",
                  code: "MED-THIES-01",
                  name: "Hôpital Régional de Thiès",
                  hospital: "Hôpital Régional de Thiès",
                  doctorName: "Dr. Cheikh Tall",
                  email: "sante.thies@sante.gouv.sn",
                  phone: "+221 33 951 10 20",
                  region: "Thiès",
                  role: "doctor"
                });
              }
            }}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#3B82F6', color: '#FFFFFF', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            🩺 Espace Médecin
          </button>

          <button
            type="button"
            onClick={() => {
              if (onDirectLogin) {
                onDirectLogin('agency', {
                  id: 1,
                  agencyId: 1,
                  name: "Voyages Teranga Hajj & Omra",
                  fullName: "Voyages Teranga Hajj & Omra",
                  email: "agence@terangahajj.sn",
                  phone: "+221 33 824 12 34",
                  role: "agency"
                });
              }
            }}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#F59E0B', color: '#FFFFFF', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            🏢 Espace Agence
          </button>

          <button
            type="button"
            onClick={() => {
              if (onDirectLogin) {
                onDirectLogin('admin', {
                  id: 999,
                  username: 'dgpadmin',
                  fullName: 'Administrateur Sunu Hajj',
                  email: 'admin@sunuhajj.sn',
                  department: 'Direction Générale',
                  role: 'admin'
                });
              }
            }}
            style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', backgroundColor: '#8B5CF6', color: '#FFFFFF', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            🇸🇳 Espace Admin DGP
          </button>
        </div>
      </div>
      )}

      {/* Header / Navbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => { setActivePage('landing'); scrollToSection('hero'); }}>
          <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid var(--secondary)', boxShadow: 'var(--shadow-sm)' }} />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', letterSpacing: '-0.5px', margin: 0 }}>SUNU HAJJ</h1>
            <p style={{ fontSize: '0.68rem', color: 'var(--secondary-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Portail Officiel</p>
          </div>
        </div>

        {/* Center Navigation Menu */}
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="d-none d-lg-flex">
          <span onClick={() => { setActivePage('landing'); setTimeout(() => scrollToSection('workflow'), 100); }} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
            {currentT.menuParcours}
          </span>
          <span onClick={() => { setSelectedSectorFilter('all'); setActivePage('agencies_page'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ fontSize: '0.9rem', fontWeight: 700, color: activePage === 'agencies_page' ? 'var(--primary-dark)' : 'var(--text-muted)', borderBottom: activePage === 'agencies_page' ? '2px solid var(--primary)' : 'none', paddingBottom: '4px', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
            Agences Agréées
          </span>
          <span onClick={() => { setActivePage('landing'); setTimeout(() => scrollToSection('rites'), 100); }} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
            {currentT.menuRites}
          </span>
          <span onClick={() => { setActivePage('landing'); setTimeout(() => scrollToSection('faq'), 100); }} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
            {currentT.menuFaq}
          </span>
          <span onClick={() => { setActivePage('landing'); setTimeout(() => scrollToSection('footer'), 100); }} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
            {currentT.menuContact}
          </span>
        </nav>

        {/* Right Actions Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Language selector */}
          <div ref={langMenuRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <Globe size={14} />
              <span>{lang === 'FR' ? 'Français' : lang === 'EN' ? 'English' : 'العربية'}</span>
              <ChevronDown size={12} />
            </button>
            
            {showLangMenu && (
              <div style={{ position: 'absolute', right: 0, marginTop: '8px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow)', width: '120px', zIndex: 50 }}>
                <div 
                  style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                  onClick={() => { setLang('FR'); setShowLangMenu(false); }}
                  className="table-row-hover"
                >
                  Français
                </div>
                <div 
                  style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                  onClick={() => { setLang('EN'); setShowLangMenu(false); }}
                  className="table-row-hover"
                >
                  English
                </div>
                <div 
                  style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                  onClick={() => { setLang('AR'); setShowLangMenu(false); }}
                  className="table-row-hover"
                >
                  العربية
                </div>
              </div>
            )}
          </div>

          {/* Redesigned Premium Login Dropdown Button */}
          <div ref={loginMenuRef} style={{ position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setShowLoginMenu(!showLoginMenu)}
              style={{ 
                fontSize: '0.85rem', 
                fontWeight: 800, 
                color: '#042F1A', 
                backgroundColor: '#ffffff',
                border: '1.5px solid #042F1A',
                padding: '8px 18px', 
                borderRadius: '30px', 
                cursor: 'pointer', 
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(4, 47, 26, 0.06)',
                transition: 'all 0.2s ease'
              }}
            >
              <LogIn size={15} color="#042F1A" />
              <span>{currentT.ctaLogin}</span>
              <ChevronDown size={14} style={{ transform: showLoginMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            {showLoginMenu && (
              <div style={{ 
                position: 'absolute', 
                top: '52px', 
                right: 0, 
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(212,175,55,0.35)', 
                borderRadius: '20px', 
                boxShadow: '0 20px 50px rgba(4, 47, 26, 0.2)', 
                zIndex: 100, 
                minWidth: '310px', 
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                animation: 'scaleUp 0.15s ease-out'
              }}>
                <div style={{ padding: '6px 10px 10px 10px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔐 Accès Sécurisé par Rôle
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.12)', color: '#047857', fontWeight: 800 }}>
                    SSL 256-bit
                  </span>
                </div>

                {/* 1. Mon Espace Pèlerin */}
                <div 
                  style={{ 
                    padding: '12px 14px', 
                    cursor: 'pointer', 
                    borderRadius: '14px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    color: '#042F1A',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'rgba(10,92,54,0.04)',
                    border: '1px solid rgba(10,92,54,0.1)'
                  }}
                  onClick={() => { onSelectPortal('pilgrim'); setShowLoginMenu(false); }}
                  className="table-row-hover"
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#0A5C36', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(10,92,54,0.25)' }}>
                    👤
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#042F1A', fontWeight: 800 }}>Mon Espace Pèlerin</strong>
                    <span style={{ fontSize: '0.75rem', color: '#0A5C36', fontWeight: 700 }}>Suivi passeport, visa & dossier</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>🔑 Passeport Sénégalais</span>
                  </div>
                </div>

                {/* 2. Espace Médecin & Santé */}
                <div 
                  style={{ 
                    padding: '12px 14px', 
                    cursor: 'pointer', 
                    borderRadius: '14px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    color: '#042F1A',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'rgba(16,185,129,0.06)',
                    border: '1px solid rgba(16,185,129,0.2)'
                  }}
                  onClick={() => { onSelectPortal('doctor'); setShowLoginMenu(false); }}
                  className="table-row-hover"
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
                    🩺
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#047857', fontWeight: 800 }}>Espace Médecin & Santé</strong>
                    <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>Contrôles d'aptitude & certificats</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>🔑 Code Unique Médecin + MdP</span>
                  </div>
                </div>

                {/* 3. Espace Agence Agréée */}
                <div 
                  style={{ 
                    padding: '12px 14px', 
                    cursor: 'pointer', 
                    borderRadius: '14px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    color: '#042F1A',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'rgba(30,58,138,0.04)',
                    border: '1px solid rgba(30,58,138,0.1)'
                  }}
                  onClick={() => { onSelectPortal('agency'); setShowLoginMenu(false); }}
                  className="table-row-hover"
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#1E3A8A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(30,58,138,0.25)' }}>
                    🏢
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1E3A8A', fontWeight: 800 }}>Espace Agence Agréée</strong>
                    <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 700 }}>Gestion pèlerins, packages & quotas</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>🔑 Identifiant Agence + MdP</span>
                  </div>
                </div>

                {/* 4. Administration & Régulation DGP */}
                <div 
                  style={{ 
                    padding: '12px 14px', 
                    cursor: 'pointer', 
                    borderRadius: '14px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '14px', 
                    color: '#042F1A',
                    transition: 'all 0.2s ease',
                    backgroundColor: 'rgba(212,175,55,0.06)',
                    border: '1px solid rgba(212,175,55,0.25)'
                  }}
                  onClick={() => { onSelectPortal('admin'); setShowLoginMenu(false); }}
                  className="table-row-hover"
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#8A6D1B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}>
                    🛡️
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#8A6D1B', fontWeight: 800 }}>Portail Administration DGP</strong>
                    <span style={{ fontSize: '0.75rem', color: '#8A6D1B', fontWeight: 700 }}>Supervision nationale & régulation</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>🔑 Accès Agent DGP & Superviseur</span>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Register Button */}
          <button 
            onClick={handleStartWizard}
            style={{ 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              padding: '8px 22px', 
              borderRadius: '30px', 
              cursor: 'pointer', 
              height: '40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: '#0A5C36', 
              border: 'none', 
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(10,92,54,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            {currentT.ctaRegister}
          </button>
        </div>
      </header>

      {/* Main Content View (Landing Page vs Dedicated Agencies Catalog Page vs Full-Page Registration) */}
      {activePage === 'register_page' ? (
        /* Full Page Registration View (Exact Match with PDF Screenshot) */
        <div style={{ backgroundColor: '#F8F8F6', minHeight: '92vh', padding: '24px 60px 80px' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            
            {/* Top Bar Navigation (Clean Layout without horizontal tabs) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={() => setActivePage('landing')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#4A5568', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  ← Retour à l'accueil
                </button>
                <button 
                  onClick={() => setShowRoleModal(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: '#E2E8F0', border: 'none', color: '#042F1A', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  🔄 Changer de profil
                </button>
              </div>
              <span style={{ fontSize: '0.88rem', color: '#2D3748', fontWeight: 800 }}>
                Édition Hajj 2026
              </span>
            </div>

            {/* Split Screen Grid (Left Form 55%, Right Photo 45%) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(360px, 46%)', gap: '56px', alignItems: 'start' }}>
              
              {/* LEFT COLUMN: Registration Form Content */}
              <div>
                
                {/* Stepper Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '0.85rem', color: '#718096' }}>
                  <span>
                    Étape <strong style={{ color: '#1A202C' }}>1 / 4</strong> — {
                      chosenRole === 'pilgrim' ? 'Informations Pèlerin' :
                      chosenRole === 'doctor' ? 'Structure Médicale & Médecin' :
                      chosenRole === 'agent' ? 'Accréditation Agent DGP (État)' :
                      'Inscription Agence Agréée'
                    }
                  </span>
                  <span style={{ fontWeight: 700, color: '#4A5568' }}>25%</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', marginBottom: '32px', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', backgroundColor: '#0A5C36', borderRadius: '2px' }} />
                </div>

                {/* Main Heading & Subtitle */}
                <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#042F1A', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px', margin: '0 0 12px' }}>
                  {chosenRole === 'pilgrim' 
                    ? "Inscrivez-vous sur le Portail Sunu Hajj" 
                    : chosenRole === 'doctor'
                    ? "Espace Accréditation Structure Médicale"
                    : chosenRole === 'agent' 
                    ? "Espace Accréditation Agent DGP (État)" 
                    : "Inscription Agence de Voyage Agréée"}
                </h2>
                <p style={{ color: '#4A5568', fontSize: '0.96rem', lineHeight: '1.6', marginBottom: '36px', maxWidth: '540px' }}>
                  {chosenRole === 'pilgrim' 
                    ? "Choisissez une agence agréée par l'État et suivez votre dossier jusqu'au départ." 
                    : chosenRole === 'doctor'
                    ? "Enregistrez votre hôpital ou centre de santé habilité pour valider les dossiers médicaux."
                    : chosenRole === 'agent' 
                    ? "Accès restreint au personnel habilité et aux superviseurs." 
                    : "Inscrivez votre agence officiellement pour créer sa page dédiée."}
                </p>

                {/* STEP 1: FORM */}
                {wizardStep === 'form' && (
                  <div className="fade-in">
                    {otpError && (
                      <div style={{ padding: '12px 16px', marginBottom: '24px', borderRadius: '8px', backgroundColor: '#FFF5F5', color: '#E53E3E', fontSize: '0.85rem', border: '1px solid #FEB2B2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} />
                        <span>{otpError}</span>
                      </div>
                    )}

                    {chosenRole === 'pilgrim' ? (
                      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* IDENTITÉ SECTION */}
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '14px' }}>
                            IDENTITÉ
                          </span>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Prénom & Nom complet *</label>
                              <input 
                                type="text" 
                                required 
                                className="form-control"
                                placeholder="Votre Prénom et Nom complet" 
                                value={pilgrimName}
                                onChange={e => setPilgrimName(e.target.value)}
                                style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>N° de Passeport *</label>
                                  <span style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>Ex: AA1234567</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                  <input 
                                    type="text" 
                                    required 
                                    className="form-control"
                                    placeholder="Ex: AA1234567" 
                                    value={pilgrimPassport}
                                    onChange={e => setPilgrimPassport(e.target.value)}
                                    style={{ textTransform: 'uppercase', height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 40px 0 16px' }}
                                  />
                                  {pilgrimPassport.length >= 7 && (
                                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#38A169', fontWeight: 'bold' }}>
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Téléphone Mobile *</label>
                                  <span style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>Format local</span>
                                </div>
                                <input 
                                  type="tel" 
                                  required 
                                  className="form-control"
                                  placeholder="00 000 00 00" 
                                  value={pilgrimPhone}
                                  onChange={e => setPilgrimPhone(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Adresse Email *</label>
                                <input 
                                  type="email" 
                                  required 
                                  className="form-control"
                                  placeholder="Ex: babacar.ndiaye@gmail.com" 
                                  value={pilgrimEmail}
                                  onChange={e => setPilgrimEmail(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Région de Résidence (Sénégal) *</label>
                                <select 
                                  className="form-control"
                                  value={pilgrimRegion}
                                  onChange={e => setPilgrimRegion(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px', color: '#1A202C', fontWeight: 700 }}
                                >
                                  {SENEGAL_REGIONS.map(r => (
                                    <option key={r} value={r}>📍 Région de {r}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* AGENCE DE VOYAGE SECTION */}
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '14px' }}>
                            AGENCE DE VOYAGE
                          </span>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Choix du Secteur / Agence Agréée *</label>
                            <select 
                              className="form-control"
                              value={regSelectedAgencyId}
                              onChange={e => setRegSelectedAgencyId(e.target.value)}
                              style={{ height: '50px', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 600, backgroundColor: '#ffffff', border: '1px solid #E2E8F0', color: '#1A202C', padding: '0 16px' }}
                            >
                              {allPublicAgencies.map(ag => (
                                <option key={ag.id} value={ag.id}>
                                  {ag.name} — {ag.priceLabel} ({ag.type === 'vip' ? 'Privé VIP' : ag.type === 'economique' ? 'Privé Économique' : ag.sector === 'etat' ? 'Secteur État' : 'Privé Standard'})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Encryption Note */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>
                          <span>🔒</span>
                          <span>Connexion chiffrée — vos données sont transmises uniquement à la Commission Nationale.</span>
                        </div>

                        {/* Submit Button */}
                        <div>
                          <button 
                            type="submit" 
                            style={{ 
                              width: '100%', 
                              height: '52px', 
                              fontWeight: 800, 
                              fontSize: '0.98rem', 
                              borderRadius: '10px', 
                              backgroundColor: '#0A5C36', 
                              color: '#ffffff', 
                              border: 'none', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 14px rgba(10,92,54,0.2)'
                            }}
                          >
                            <span>Continuer vers l'inscription SMS →</span>
                          </button>
                          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#A0AEC0', marginTop: '10px', margin: '10px 0 0' }}>
                            Un code à 6 chiffres sera envoyé par SMS pour vérifier votre numéro.
                          </p>
                        </div>

                      </form>
                    ) : chosenRole === 'agent' ? (
                      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* IDENTITÉ AGENT DGP / MÉDICAL */}
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '14px' }}>
                            ACCRÉDITATION & IDENTITÉ ÉTAT
                          </span>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Prénom & Nom complet de l'Agent / Médecin *</label>
                              <input 
                                type="text" 
                                required 
                                className="form-control"
                                placeholder="Ex: Dr. Cheikh Tidiane Sy" 
                                value={agentName}
                                onChange={e => setAgentName(e.target.value)}
                                style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                              />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Matricule Officiel DGP / Ordre *</label>
                                  <span style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>DGP-2026</span>
                                </div>
                                <input 
                                  type="text" 
                                  required 
                                  className="form-control"
                                  placeholder="Ex: DGP-2026-882" 
                                  value={agentMatricule}
                                  onChange={e => setAgentMatricule(e.target.value)}
                                  style={{ textTransform: 'uppercase', height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Rôle & Spécialité *</label>
                                <select 
                                  className="form-control"
                                  value={agentRoleTitle}
                                  onChange={e => setAgentRoleTitle(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 600, backgroundColor: '#ffffff', border: '1px solid #E2E8F0', color: '#1A202C', padding: '0 16px' }}
                                >
                                  <option value="Agent de Contrôle DGP">🛡️ Agent de Contrôle DGP</option>
                                  <option value="Médecin Inspecteur Hajj">🩺 Médecin Inspecteur Hajj</option>
                                  <option value="Responsable Logistique & Vols">✈️ Responsable Logistique & Vols</option>
                                  <option value="Superviseur Quotas & Visas">📋 Superviseur Quotas & Visas</option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Téléphone Mobile Officiel *</label>
                                <input 
                                  type="tel" 
                                  required 
                                  className="form-control"
                                  placeholder="Ex: +221 77 000 00 00" 
                                  value={agentPhone}
                                  onChange={e => setAgentPhone(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Adresse Email Officielle *</label>
                                <input 
                                  type="email" 
                                  required 
                                  className="form-control"
                                  placeholder="agent@dgp.gouv.sn" 
                                  value={agentEmail}
                                  onChange={e => setAgentEmail(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Note restriction DGP */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>
                          <span>🔒</span>
                          <span>Habilitation Gouvernementale — Accès réservé au personnel accrédité de la DGP.</span>
                        </div>

                        {/* Submit Button */}
                        <div>
                          <button 
                            type="submit" 
                            style={{ 
                              width: '100%', 
                              height: '52px', 
                              fontWeight: 800, 
                              fontSize: '0.98rem', 
                              borderRadius: '10px', 
                              backgroundColor: '#042F1A', 
                              color: '#ffffff', 
                              border: 'none', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 14px rgba(4,47,26,0.2)'
                            }}
                          >
                            <span>Valider mon Inscription Agent DGP →</span>
                          </button>
                        </div>

                      </form>
                    ) : chosenRole === 'doctor' ? (
                      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* IDENTITÉ STRUCTURE MÉDICALE */}
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '14px' }}>
                            ACCRÉDITATION STRUCTURE MÉDICALE
                          </span>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                               <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Nom de la Structure Médicale / Hôpital Agréé *</label>
                               <select
                                 required 
                                 className="form-control"
                                 value={agencyName}
                                 onChange={e => {
                                   const selectedName = e.target.value;
                                   setAgencyName(selectedName);
                                   const ACCREDITED_HOSPITALS_LIST = [
                                     { name: "Hôpital Aristide Le Dantec (Dakar)", codePrefix: "MED-DKR" },
                                     { name: "Hôpital Principal de Dakar", codePrefix: "MED-DKR" },
                                     { name: "Hôpital Régional de Thiès", codePrefix: "MED-THIES" },
                                     { name: "Hôpital Régional de Saint-Louis", codePrefix: "MED-SL" },
                                     { name: "Hôpital Régional de Ziguinchor", codePrefix: "MED-ZIG" },
                                     { name: "Hôpital Régional d'El Hadji Ibrahima Niass (Kaolack)", codePrefix: "MED-KL" },
                                     { name: "Autre Hôpital / Centre Médical Agréé", codePrefix: "MED-SENG" }
                                   ];
                                   const found = ACCREDITED_HOSPITALS_LIST.find(h => h.name === selectedName);
                                   if (found) {
                                     const randomId = Math.floor(100 + Math.random() * 900);
                                     setAgentMatricule(`${found.codePrefix}-${randomId}`);
                                   }
                                 }}
                                 style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px', fontWeight: 700 }}
                               >
                                 <option value="">-- Sélectionnez votre Hôpital Agréé --</option>
                                 <option value="Hôpital Aristide Le Dantec (Dakar)">Hôpital Aristide Le Dantec (Dakar)</option>
                                 <option value="Hôpital Principal de Dakar">Hôpital Principal de Dakar</option>
                                 <option value="Hôpital Régional de Thiès">Hôpital Régional de Thiès</option>
                                 <option value="Hôpital Régional de Saint-Louis">Hôpital Régional de Saint-Louis</option>
                                 <option value="Hôpital Régional de Ziguinchor">Hôpital Régional de Ziguinchor</option>
                                 <option value="Hôpital Régional d'El Hadji Ibrahima Niass (Kaolack)">Hôpital Régional d'El Hadji Ibrahima Niass (Kaolack)</option>
                                 <option value="Autre Hôpital / Centre Médical Agréé">Autre Hôpital / Centre Médical Agréé</option>
                               </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Prénom & Nom du Médecin Référent *</label>
                                <input 
                                  type="text" 
                                  required 
                                  className="form-control"
                                  placeholder="Votre Prénom et Nom" 
                                  value={agentName}
                                  onChange={e => setAgentName(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Code Unique Structure *</label>
                                  <span style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>Ex: MED-DKR-01</span>
                                </div>
                                <input 
                                  type="text" 
                                  required 
                                  className="form-control"
                                  placeholder="MED-DKR-01" 
                                  value={agentMatricule}
                                  onChange={e => setAgentMatricule(e.target.value)}
                                  style={{ textTransform: 'uppercase', height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Téléphone Contact Médical *</label>
                                <input 
                                  type="tel" 
                                  required 
                                  className="form-control"
                                  placeholder="Ex: +221 33 824 00 00" 
                                  value={agentPhone}
                                  onChange={e => setAgentPhone(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Adresse Email Officielle *</label>
                                <input 
                                  type="email" 
                                  required 
                                  className="form-control"
                                  placeholder="medecin@sante.gouv.sn" 
                                  value={agentEmail}
                                  onChange={e => setAgentEmail(e.target.value)}
                                  style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                                />
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Note restriction Santé */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#718096', marginTop: '4px' }}>
                          <span>🩺</span>
                          <span>Accréditation Médicale Officielle — Commission Nationale Médicale du Hajj.</span>
                        </div>

                        {/* Submit Button */}
                        <div>
                          <button 
                            type="submit" 
                            style={{ 
                              width: '100%', 
                              height: '52px', 
                              fontWeight: 800, 
                              fontSize: '0.98rem', 
                              borderRadius: '10px', 
                              backgroundColor: '#15803D', 
                              color: '#ffffff', 
                              border: 'none', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 14px rgba(21,128,61,0.2)'
                            }}
                          >
                            <span>Valider Inscription Espace Médical →</span>
                          </button>
                        </div>

                      </form>
                    ) : (
                      <form onSubmit={handleAgencyApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Nom de l'Agence de Voyage *</label>
                            <input 
                              type="text" 
                              required 
                              className="form-control"
                              placeholder="Ex: Touba Voyages Hajj" 
                              value={agencyApplyName}
                              onChange={e => setAgencyApplyName(e.target.value)}
                              style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>N° d'Agrément Officiel (Sunu Hajj / Ministère) *</label>
                            <input 
                              type="text" 
                              required 
                              className="form-control"
                              placeholder="Ex: AGR-2026-DKR-048" 
                              value={agencyApplyAgreementNum}
                              onChange={e => setAgencyApplyAgreementNum(e.target.value)}
                              style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px', fontWeight: 700, textTransform: 'uppercase' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Nom du Responsable *</label>
                            <input 
                              type="text" 
                              required 
                              className="form-control"
                              placeholder="Ex: El Hadji Diouf" 
                              value={agencyApplyContact}
                              onChange={e => setAgencyApplyContact(e.target.value)}
                              style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Téléphone Direct *</label>
                            <input 
                              type="tel" 
                              required 
                              className="form-control"
                              placeholder="Ex: +221 77 123 45 67" 
                              value={agencyApplyPhone}
                              onChange={e => setAgencyApplyPhone(e.target.value)}
                              style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Formule Agence Privée *</label>
                            <select
                              className="form-control"
                              value={agencyApplyType || 'standard'}
                              onChange={e => {
                                const val = e.target.value;
                                setAgencyApplyType(val);
                                if (val === 'vip') setAgencyApplyPrice('8500000');
                                else setAgencyApplyPrice('4900000');
                              }}
                              style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px', fontWeight: 700 }}
                            >
                              <option value="standard">✈️ Offre Standard Confort (4.900.000 FCFA)</option>
                              <option value="vip">⭐ Offre VIP Luxe (8.500.000 FCFA)</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1A202C' }}>Tarif du Package (FCFA) *</label>
                            <input 
                              type="number" 
                              required 
                              className="form-control" 
                              placeholder="Ex: 8500000" 
                              value={agencyApplyPrice || '8500000'} 
                              onChange={e => setAgencyApplyPrice(e.target.value)}
                              style={{ height: '48px', borderRadius: '10px', fontSize: '0.92rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', padding: '0 16px', fontWeight: 700 }}
                            />
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          disabled={agencyApplyLoading}
                          style={{ width: '100%', height: '52px', fontWeight: 800, fontSize: '0.98rem', borderRadius: '10px', backgroundColor: '#D4AF37', color: '#042F1A', border: 'none', cursor: 'pointer', marginTop: '10px' }}
                        >
                          {agencyApplyLoading ? "Création..." : "Valider l'Inscription Agence →"}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* STEP 2: VERIFICATION (SMS OTP FOR MOBILE / EMAIL ACTIVATION FOR AGENCIES WITH FIXED LINE 33) */}
                {wizardStep === 'otp' && (
                  <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
                      {chosenRole === 'agency' ? '📧' : '🔐'}
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', margin: 0 }}>
                      {chosenRole === 'agency' ? "Activation du Compte Agence par Email" : "Vérification Sécurisée"}
                    </h3>

                    {chosenRole === 'agency' ? (
                      <div style={{ marginTop: '12px' }}>
                        <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                          Les agences disposant d'une ligne fixe <strong>(Ligne 33 non compatible SMS)</strong>, le code et le lien d'activation sécurisé ont été transmis sur l'Email professionnel :
                        </p>
                        <div style={{ backgroundColor: '#F1F5F9', border: '1.5px solid #0A5C36', padding: '10px 16px', borderRadius: '10px', display: 'inline-block', fontWeight: 800, color: '#0A5C36', fontSize: '0.95rem', marginBottom: '10px' }}>
                          📧 {agencyApplyEmail || agencyEmail || successUser?.email || 'contact@agence.sn'}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
                          📞 Ligne Fixe Agence : <strong>{agencyApplyPhone || agencyPhone || '+221 33 824 12 34'}</strong> (Activation Email automatique)
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.88rem', color: '#718096', marginTop: '8px', lineHeight: '1.5' }}>
                        Un code de vérification à 4 chiffres a été expédié sur votre mobile <strong>{pilgrimPhone || agentPhone || agencyPhone || '+221 78 591 07 67'}</strong> et à votre adresse Email.
                      </p>
                    )}

                    <form onSubmit={handleOtpVerify} style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <input 
                        type="text" 
                        maxLength={4}
                        required
                        placeholder="• • • •" 
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value)}
                        style={{ textAlign: 'center', fontSize: '2.2rem', letterSpacing: '12px', fontWeight: 900, height: '64px', borderRadius: '12px', border: '2px solid #0A5C36', backgroundColor: '#ffffff', color: '#042F1A' }}
                      />

                      <button 
                        type="submit" 
                        style={{ width: '100%', height: '52px', fontWeight: 800, fontSize: '0.98rem', borderRadius: '10px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(10,92,54,0.3)' }}
                      >
                        {chosenRole === 'agency' ? "📧 Valider l'Activation par Email →" : "Valider mon Code & Finaliser →"}
                      </button>
                    </form>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => generateRandomOtp(pilgrimPhone || agentPhone || agencyPhone, pilgrimName || agentName || agencyName)}
                        style={{ background: 'none', border: 'none', color: '#0A5C36', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        {chosenRole === 'agency' ? "📩 Renvoyer le lien d'activation par Email" : "🔄 Renvoyer le code par SMS / Email"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: SUCCESS */}
                {wizardStep === 'success' && (
                  <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(10,92,54,0.3)' }}>
                      ✓
                    </div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#042F1A', margin: 0 }}>Inscription Confirmée !</h3>
                    
                    {chosenRole === 'agency' ? (
                      <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#FAF9F5', border: '2px solid #D4AF37', borderRadius: '16px', textAlign: 'left' }}>
                        <h4 style={{ color: '#042F1A', margin: '0 0 10px', fontSize: '1rem', fontWeight: 800 }}>
                          🏢 Homologation Agence Agréée Confirmée :
                        </h4>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#4A5568' }}>
                          Agence : <strong>{successUser?.name || agencyApplyName}</strong>
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#042F1A' }}>
                          📜 N° d'Agrément Officiel : <strong style={{ color: '#0A5C36', fontFamily: 'monospace', fontSize: '1.05rem' }}>{successUser?.agreementNumber || agencyApplyAgreementNum || 'AGR-2026-DKR-048'}</strong>
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#042F1A' }}>
                          ⭐ Offre & Catégorie : <strong style={{ color: '#D4AF37', fontWeight: 800 }}>{successUser?.type === 'vip' ? 'Offre VIP Luxe' : successUser?.type === 'economique' ? 'Offre Privée / Économique' : 'Offre Standard Confort'}</strong> ({successUser?.price ? successUser.price.toLocaleString() : '3.600.000'} FCFA)
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#718096', display: 'block', marginTop: '8px' }}>
                          💡 Votre agence est désormais inscrite dans le Registre National Officiel de la Sunu Hajj.
                        </span>
                      </div>
                    ) : chosenRole === 'doctor' ? (
                      <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#FAF9F5', border: '2px solid #D4AF37', borderRadius: '16px', textAlign: 'left' }}>
                        <h4 style={{ color: '#042F1A', margin: '0 0 10px', fontSize: '1rem', fontWeight: 800 }}>
                          🩺 Vos Accès Officiels de Connexion :
                        </h4>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#4A5568' }}>
                          Structure : <strong>{successUser?.name || agencyName}</strong>
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#042F1A' }}>
                          🔑 Code Unique Structure : <strong style={{ color: '#15803D', fontFamily: 'monospace', fontSize: '1.1rem' }}>{successUser?.code || agentMatricule}</strong>
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#042F1A' }}>
                          🔒 Mot de Passe : <strong style={{ color: '#15803D', fontFamily: 'monospace' }}>{successUser?.password || agencyPassword || "123456"}</strong>
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#718096', display: 'block', marginTop: '8px' }}>
                          💡 Utilisez votre Code Unique ({successUser?.code || agentMatricule}) et votre mot de passe pour vous connecter au registre médical.
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: '#718096', marginTop: '10px', lineHeight: '1.6' }}>
                        Votre dossier a été enregistré sous le passeport / identifiant <strong>{successUser?.code || successUser?.matricule || pilgrimPassport.toUpperCase()}</strong>.
                      </p>
                    )}

                    <button 
                      onClick={handleEnterPlatform}
                      style={{ width: '100%', height: '52px', fontWeight: 800, fontSize: '0.98rem', borderRadius: '10px', backgroundColor: '#0A5C36', color: '#ffffff', border: 'none', cursor: 'pointer', marginTop: '16px' }}
                    >
                      Accéder à mon Espace {chosenRole === 'doctor' ? 'Médical' : chosenRole === 'agency' ? 'Agence' : chosenRole === 'agent' ? 'Admin' : 'Pèlerin'} →
                    </button>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Kaaba Photo & Caption (Exact Parity with PDF Screenshot) */}
              <div>
                <div style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden', 
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#ffffff'
                }}>
                  <img 
                    src="/assets/hajj_tawaf.png" 
                    alt="La Mecque Kaaba" 
                    style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '560px', objectFit: 'cover' }}
                  />
                </div>
                
                {/* Caption below photo */}
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1A202C', margin: 0 }}>
                    La Mecque, Arabie Saoudite
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#718096', margin: '4px 0 0' }}>
                    Destination finale de votre pèlerinage
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : activePage === 'agencies_page' ? (
        /* Dedicated Public Agencies Page View */
        <div style={{ backgroundColor: '#FAF9F5', minHeight: '80vh', padding: '60px 40px 100px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            
            {/* Back Button & Page Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <button 
                  onClick={() => setActivePage('landing')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '30px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', color: '#042F1A', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                >
                  ← Retour à l'accueil
                </button>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#042F1A', fontFamily: '"Playfair Display", serif', margin: 0 }}>
                  Catalogue des Agences & Secteurs Agréés
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '8px' }}>
                  Filtrez les offres officielles du Secteur État et des 38 Voyagistes Privés accrédités Hajj 2026.
                </p>
              </div>

              {/* Main Sector Filter Tabs (Tous / État / Privé) */}
              <div style={{ display: 'flex', backgroundColor: '#ffffff', padding: '6px', borderRadius: '50px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <button
                  onClick={() => setSelectedSectorFilter('all')}
                  style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', backgroundColor: selectedSectorFilter === 'all' ? '#0A5C36' : 'transparent', color: selectedSectorFilter === 'all' ? '#ffffff' : '#64748B', transition: 'all 0.2s' }}
                >
                  Tous les Secteurs ({allPublicAgencies.length})
                </button>
                <button
                  onClick={() => setSelectedSectorFilter('etat')}
                  style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', backgroundColor: selectedSectorFilter === 'etat' ? '#0A5C36' : 'transparent', color: selectedSectorFilter === 'etat' ? '#ffffff' : '#64748B', transition: 'all 0.2s' }}
                >
                  🏛️ Secteur État (1)
                </button>
                <button
                  onClick={() => setSelectedSectorFilter('prive')}
                  style={{ padding: '10px 20px', borderRadius: '30px', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', backgroundColor: selectedSectorFilter === 'prive' ? '#0A5C36' : 'transparent', color: selectedSectorFilter === 'prive' ? '#ffffff' : '#64748B', transition: 'all 0.2s' }}
                >
                  🏢 Secteur Privé ({allPublicAgencies.filter(ag => ag.sector === 'prive').length})
                </button>
              </div>
            </div>

            {/* Sub-Filter for Privé (Économique / Standard / VIP) */}
            {selectedSectorFilter !== 'etat' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', backgroundColor: '#ffffff', padding: '12px 20px', borderRadius: '16px', border: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#042F1A' }}>Formules Privées :</span>
                <button
                  onClick={() => setSelectedTypeFilter('all')}
                  style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTypeFilter === 'all' ? '#D4AF37' : '#FAF9F5', color: selectedTypeFilter === 'all' ? '#042F1A' : '#64748B' }}
                >
                  Toutes les Formules
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('economique')}
                  style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTypeFilter === 'economique' ? '#D4AF37' : '#FAF9F5', color: selectedTypeFilter === 'economique' ? '#042F1A' : '#64748B' }}
                >
                  📦 Économique ({allPublicAgencies.filter(ag => ag.sector === 'prive' && ag.type === 'economique').length})
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('standard')}
                  style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTypeFilter === 'standard' ? '#D4AF37' : '#FAF9F5', color: selectedTypeFilter === 'standard' ? '#042F1A' : '#64748B' }}
                >
                  ✈️ Standard ({allPublicAgencies.filter(ag => ag.sector === 'prive' && ag.type === 'standard').length})
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('vip')}
                  style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', backgroundColor: selectedTypeFilter === 'vip' ? '#D4AF37' : '#FAF9F5', color: selectedTypeFilter === 'vip' ? '#042F1A' : '#64748B' }}
                >
                  ⭐ VIP ({allPublicAgencies.filter(ag => ag.sector === 'prive' && ag.type === 'vip').length})
                </button>
              </div>
            )}

            {/* Agencies Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
              {allPublicAgencies
                .filter(ag => selectedSectorFilter === 'all' || ag.sector === selectedSectorFilter)
                .filter(ag => selectedTypeFilter === 'all' || ag.type === selectedTypeFilter)
                .map(agency => (
                  <div 
                    key={agency.id} 
                    style={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '24px', 
                      border: agency.sector === 'etat' ? '2px solid #D4AF37' : agency.type === 'vip' ? '2px solid #D4AF37' : '1px solid #E2E8F0', 
                      padding: '32px 28px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ 
                          padding: '4px 14px', 
                          borderRadius: '20px', 
                          fontSize: '0.72rem', 
                          fontWeight: 800, 
                          backgroundColor: agency.sector === 'etat' ? '#042F1A' : agency.type === 'vip' ? '#D4AF37' : 'rgba(10,92,54,0.08)', 
                          color: agency.sector === 'etat' ? '#D4AF37' : agency.type === 'vip' ? '#042F1A' : '#0A5C36' 
                        }}>
                          {agency.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>{agency.quota}</span>
                      </div>

                      <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#042F1A', fontFamily: '"Playfair Display", serif', margin: '0 0 10px' }}>
                        {agency.name}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
                        {agency.description}
                      </p>

                      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                          <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#042F1A', fontFamily: '"Outfit", sans-serif' }}>{agency.priceLabel}</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#334155' }}>
                          {agency.features.map((feat, fIdx) => (
                            <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>✦</span> {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSelectAgencyAndRegister(agency.id)}
                      style={{ 
                        width: '100%', 
                        height: '48px', 
                        fontWeight: 800, 
                        fontSize: '0.9rem', 
                        borderRadius: '50px', 
                        backgroundColor: agency.sector === 'etat' ? '#0A5C36' : agency.type === 'vip' ? '#D4AF37' : '#042F1A', 
                        color: agency.type === 'vip' && agency.sector !== 'etat' ? '#042F1A' : '#ffffff', 
                        border: 'none', 
                        cursor: 'pointer' 
                      }}
                    >
                      S'inscrire avec cette agence
                    </button>
                  </div>
                ))}
            </div>

          </div>
        </div>
      ) : (
        <>
          {/* Hero Section Container with Kaaba Background Video & Image Fallback */}
      <div 
        style={{ 
          backgroundImage: "url('/assets/kaaba_hero_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          padding: '200px 40px 240px',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          borderBottom: '4px solid var(--secondary)',
          zIndex: 5,
          overflow: 'hidden'
        }}
      >
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: 1 
          }}
        >
          <source src="/assets/kaaba_video.webm" type="video/webm" />
        </video>

        {/* Dark Overlay */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(rgba(4, 47, 26, 0.55), rgba(9, 14, 12, 0.75))', 
            zIndex: 2 
          }} 
        />

        {/* Content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 3 }} className="animate-slide-up">
          {/* Flag pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255, 255, 255, 0.25)', color: '#ffffff', padding: '8px 20px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '28px', backdropFilter: 'blur(10px)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />
            République du Sénégal — Commission Nationale du Pèlerinage
          </div>

          <h2 style={{ fontSize: '3.2rem', fontWeight: 700, color: '#ffffff', lineHeight: '1.25', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.5px' }}>
            Votre Hajj commence par{' '}
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: '#D4AF37', fontWeight: 700 }}>
              un dossier bien préparé.
            </span>
          </h2>
          
          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '20px', maxWidth: '680px', margin: '20px auto 0', lineHeight: '1.6' }}>
            Inscrivez-vous, choisissez une agence agréée par l'État et suivez votre visa jusqu'à votre départ pour La Mecque — tout depuis un seul espace sécurisé.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '36px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleStartWizard}
              style={{ 
                padding: '14px 32px', 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                borderRadius: '50px', 
                backgroundColor: '#0A5C36', 
                color: '#ffffff', 
                border: 'none', 
                boxShadow: '0 8px 24px rgba(10, 92, 54, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              S'inscrire sur la plateforme
            </button>
            <button 
              onClick={() => scrollToSection('workflow')}
              style={{ 
                padding: '14px 32px', 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                borderRadius: '50px', 
                backgroundColor: 'rgba(255, 255, 255, 0.12)', 
                color: '#ffffff', 
                border: '1px solid rgba(255, 255, 255, 0.3)', 
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Découvrir le parcours ↓
            </button>
          </div>
        </div>
      </div>

      {/* Floating Info Stats Ribbon */}
      <section style={{ maxWidth: '840px', margin: '-50px auto 60px', padding: '0 20px', position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '24px', 
          padding: '32px 40px', 
          boxShadow: '0 20px 50px rgba(4, 47, 26, 0.1)', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          alignItems: 'center', 
          textAlign: 'center',
          border: '1px solid #E2E8F0'
        }}>
          
          <div>
            <strong style={{ display: 'block', fontSize: '2.4rem', color: '#0A5C36', fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>12 800</strong>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '4px', display: 'block' }}>Quotas Sénégalais 2026</span>
          </div>
          
          <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 16px' }}>
            <strong style={{ display: 'block', fontSize: '2.4rem', color: '#0A5C36', fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>38</strong>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '4px', display: 'block' }}>Agences agréées</span>
          </div>
          
          <div>
            <strong style={{ display: 'block', fontSize: '2.4rem', color: '#0A5C36', fontWeight: 900, fontFamily: '"Outfit", sans-serif' }}>100%</strong>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '4px', display: 'block' }}>Dossiers sécurisés</span>
          </div>

        </div>
      </section>

      {/* Platform Features & Categories Section (Exact Match with User's Screenshot Design) */}
      <section id="features" style={{ backgroundColor: '#ffffff', padding: '80px 40px 90px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '36px' }}>
            <span style={{ color: '#B27D1B', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
              — FONCTIONNALITÉS & PRESTATIONS —
            </span>
            <h3 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#042F1A', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px', margin: 0 }}>
              Caractéristiques des catégories et des services
            </h3>
          </div>

          {/* Horizontal Sub-Tabs Row (Exact replica of user screenshot tabs) */}
          <div style={{ 
            display: 'flex', 
            gap: '32px', 
            borderBottom: '1px solid #E2E8F0', 
            marginBottom: '40px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            <button
              type="button"
              onClick={() => setActiveFeatureTab('services')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 0 16px',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: activeFeatureTab === 'services' ? '#0A5C36' : '#64748B',
                borderBottom: activeFeatureTab === 'services' ? '3px solid #0A5C36' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>📦</span> Types de Services
            </button>

            <button
              type="button"
              onClick={() => setActiveFeatureTab('payments')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 0 16px',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: activeFeatureTab === 'payments' ? '#0A5C36' : '#64748B',
                borderBottom: activeFeatureTab === 'payments' ? '3px solid #0A5C36' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>💳</span> Gestion Paiements & Banque
            </button>

            <button
              type="button"
              onClick={() => setActiveFeatureTab('flights')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 0 16px',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: activeFeatureTab === 'flights' ? '#0A5C36' : '#64748B',
                borderBottom: activeFeatureTab === 'flights' ? '3px solid #0A5C36' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>✈️</span> Gestion des Vols & Compagnies
            </button>

            <button
              type="button"
              onClick={() => setActiveFeatureTab('lodging')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 0 16px',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: activeFeatureTab === 'lodging' ? '#0A5C36' : '#64748B',
                borderBottom: activeFeatureTab === 'lodging' ? '3px solid #0A5C36' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>🏨</span> Classification des Hébergements
            </button>

            <button
              type="button"
              onClick={() => setActiveFeatureTab('medical')}
              style={{
                background: 'none',
                border: 'none',
                padding: '12px 0 16px',
                fontSize: '0.98rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: activeFeatureTab === 'medical' ? '#0A5C36' : '#64748B',
                borderBottom: activeFeatureTab === 'medical' ? '3px solid #0A5C36' : '3px solid transparent',
                marginBottom: '-1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>🩺</span> Dossiers & Visites Médicales
            </button>
          </div>

          {/* TAB 1: Types de Services */}
          {activeFeatureTab === 'services' && (
            <div className="fade-in">
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', margin: '0 0 14px' }}>
                Forfaits Tout Compris Sunu Hajj
              </h4>
              <p style={{ color: '#4A5568', fontSize: '0.96rem', lineHeight: '1.65', maxWidth: '780px', marginBottom: '44px' }}>
                Les forfaits Tout Compris fournissent tous les services essentiels aux pèlerins tout au long de leur voyage du Hajj, assurant une expérience fluide et sans problème. Ces services comprennent l'émission de visa, les vols, l'hébergement à La Mecque et à Médine, le transport entre les villes sacrées et l'orientation.
              </p>

              {/* Green Circular Badges Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '32px 24px', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    ✈️
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Vols</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🏨
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Hébergement</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🚌
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Transport</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    👳‍♂️
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Guide touristique</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🛂
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Délivrance de visas</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Gestion Paiements & Banque */}
          {activeFeatureTab === 'payments' && (
            <div className="fade-in">
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', margin: '0 0 14px' }}>
                Module de Paiement Sécurisé & Suivi Financier
              </h4>
              <p style={{ color: '#4A5568', fontSize: '0.96rem', lineHeight: '1.65', maxWidth: '780px', marginBottom: '44px' }}>
                Transparence financière totale avec possibilité d'effectuer vos versements par Wave, Orange Money, Carte Bancaire ou Virement direct (Banque de l'Habitat / BOA), avec génération instantanée d'un reçu chiffré et horodaté.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '32px 24px', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📱
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Wave & Mobile Money</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    💳
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Carte Bancaire</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🏦
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Virement Bancaire</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🧾
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Reçus QR Code</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📊
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Échéancier en 3 Tranches</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: Gestion des Vols */}
          {activeFeatureTab === 'flights' && (
            <div className="fade-in">
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', margin: '0 0 14px' }}>
                Logistique Aérienne & Embarquement Air Sénégal / Flynas
              </h4>
              <p style={{ color: '#4A5568', fontSize: '0.96rem', lineHeight: '1.65', maxWidth: '780px', marginBottom: '44px' }}>
                Organisation centralisée des convois aériens depuis l'Aéroport International Blaise Diagne (AIBD), émission des cartes d'embarquement, attribution des sièges et gestion des franchises bagages (2x23kg + Eau Zamzam).
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '32px 24px', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    ✈️
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Vols Charters Dédiés</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🎫
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Carte d'Embarquement</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🧳
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Suivi Bagages & Zamzam</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🛫
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Planning Hangar Pèlerins</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: Hébergements */}
          {activeFeatureTab === 'lodging' && (
            <div className="fade-in">
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', margin: '0 0 14px' }}>
                Hôtels Certifiés à La Mecque & Médine
              </h4>
              <p style={{ color: '#4A5568', fontSize: '0.96rem', lineHeight: '1.65', maxWidth: '780px', marginBottom: '44px' }}>
                Hôtels haut de gamme situés à proximité immédiate de la Mosquée Sainte (Masjid Al-Haram et Masjid An-Nabawi), avec classification officielle Standard & VIP et attribution automatisée des badges de chambre.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '32px 24px', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🕌
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Proximité Haram</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🛏️
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Badges Chambres & Lits</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📶
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Services & Assistance 24/7</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🛗
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Hôtels Certifiés 4★ & 5★</span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: Visites Médicales & Dossiers */}
          {activeFeatureTab === 'medical' && (
            <div className="fade-in">
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#042F1A', margin: '0 0 14px' }}>
                Contrôle Sanitaire & Visites Médicales Officielle
              </h4>
              <p style={{ color: '#4A5568', fontSize: '0.96rem', lineHeight: '1.65', maxWidth: '780px', marginBottom: '44px' }}>
                Suivi du parcours médical du pèlerin auprès des médecins agréés par la Commission Nationale, enregistrement de la vaccination contre la méningite et délivrance du certificat médical d'aptitude.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '32px 24px', alignItems: 'center' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🩺
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Médecins Agréés</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    💉
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Vaccination Méningite</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📋
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Certificat d'Aptitude</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    🚑
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1A202C' }}>Assistance Médicale 24/7</span>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" style={{ backgroundColor: '#FAF9F5', padding: '90px 40px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#B27D1B', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>— ÉTAPES OFFICIELLES —</span>
            <h3 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#042F1A', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px' }}>
              Votre parcours Hajj 2026 en 5 étapes
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '12px', maxWidth: '640px', margin: '12px auto 0', lineHeight: '1.6' }}>
              Un chemin simple et transparent, entièrement supervisé par l'État, du premier dossier jusqu'à l'embarquement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            
            {/* Step 1 */}
            <div style={{ padding: '28px 18px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#B27D1B', fontWeight: 700, marginBottom: '8px' }}>١</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
                01
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#042F1A', marginBottom: '8px' }}>Inscription & Dossier</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>Saisie de vos données et dépôt en ligne ou en agence.</p>
            </div>

            {/* Step 2 */}
            <div style={{ padding: '28px 18px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#B27D1B', fontWeight: 700, marginBottom: '8px' }}>٢</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
                02
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#042F1A', marginBottom: '8px' }}>Aptitude Médicale</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>Visite obligatoire auprès des médecins agréés.</p>
            </div>

            {/* Step 3 */}
            <div style={{ padding: '28px 18px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#B27D1B', fontWeight: 700, marginBottom: '8px' }}>٣</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
                03
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#042F1A', marginBottom: '8px' }}>Paiement du Forfait</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>Règlement auprès de l'agence validée par la commission.</p>
            </div>

            {/* Step 4 */}
            <div style={{ padding: '28px 18px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#B27D1B', fontWeight: 700, marginBottom: '8px' }}>٤</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
                04
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#042F1A', marginBottom: '8px' }}>Synchronisation Nusuk</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>Transfert sécurisé aux autorités saoudiennes pour le visa.</p>
            </div>

            {/* Step 5 */}
            <div style={{ padding: '28px 18px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#B27D1B', fontWeight: 700, marginBottom: '8px' }}>٥</span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0A5C36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px' }}>
                05
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#042F1A', marginBottom: '8px' }}>Vol & Logistique</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>Attribution du vol charter et de l'hébergement à La Mecque.</p>
            </div>

          </div>
        </div>
      </section>


      {/* RITES SACRÉS Section (PDF Page 3 Top) */}
      <section id="rites" style={{ backgroundColor: '#FAF9F5', padding: '90px 40px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#B27D1B', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>— RITES SACRÉS —</span>
            <h3 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#042F1A', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px' }}>
              Un aperçu du parcours spirituel
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '12px', maxWidth: '640px', margin: '12px auto 0', lineHeight: '1.6' }}>
              Quatre moments clés du Hajj, extraits des 12 étapes détaillées disponibles dans votre Espace Pèlerin.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            
            {/* Card 1 */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              <img src="/assets/hajj_ihram.png" alt="L'Ihram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff' }}>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Étape 01</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: '4px 0 0' }}>L'Ihram</h4>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              <img src="/assets/hajj_tawaf.png" alt="Tawaf Al-Qudum" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff' }}>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Étape 02</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: '4px 0 0' }}>Tawaf Al-Qudum</h4>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              <img src="/assets/hajj_mina.png" alt="Mina" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff' }}>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Étape 04</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: '4px 0 0' }}>Mina</h4>
              </div>
            </div>

            {/* Card 4 */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '360px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              <img src="/assets/hajj_arafat.png" alt="Arafat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', color: '#ffffff' }}>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Étape 05</span>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: '"Playfair Display", serif', margin: '4px 0 0' }}>Arafat</h4>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* VOYAGISTES AGRÉÉS Section - Landing Page (2 Categories: État & Privé) */}
      <section id="agencies-showcase" style={{ backgroundColor: '#042F1A', color: '#ffffff', padding: '90px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ color: '#D4AF37', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
              — SECTEURS D'ORGANISATION —
            </span>
            <h3 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#ffffff', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px' }}>
              Choisissez votre secteur d'encadrement
            </h3>
            <p style={{ maxWidth: '640px', margin: '12px auto 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Le Sénégal propose deux canaux officiels régulés par l'État pour accomplir votre Hajj 2026 en toute sécurité.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', maxWidth: '960px', margin: '0 auto' }}>
            
            {/* Category 1: SECTEUR ÉTAT */}
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.06)', 
              border: '1px solid #D4AF37', 
              borderRadius: '24px', 
              padding: '40px 32px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#D4AF37', color: '#042F1A', letterSpacing: '1px' }}>
                    🏛️ SECTEUR ÉTAT (PUBLIC)
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700 }}>Tarif Officiel</span>
                </div>

                <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: '"Playfair Display", serif', margin: '0 0 12px' }}>
                  Commission Nationale (DGP)
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px', lineHeight: '1.6' }}>
                  Encadrement public direct par la Délégation Générale au Pèlerinage de la République du Sénégal.
                </p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderRadius: '14px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', fontFamily: '"Outfit", sans-serif' }}>3 200 000</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>FCFA / pèlerin</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Quota officiel garanti par l'État du Sénégal</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Vols charters étatiques directs Dakar — Médine</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Hébergements officiels du Sénégal à La Mecque</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Équipe médicale & religieuse gouvernementale H24</li>
                </ul>
              </div>

              <button 
                onClick={() => { setSelectedSectorFilter('etat'); setActivePage('agencies_page'); }}
                style={{ width: '100%', height: '52px', fontWeight: 800, fontSize: '0.95rem', borderRadius: '50px', backgroundColor: '#0A5C36', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}
              >
                Voir l'offre d'État & S'inscrire →
              </button>
            </div>

            {/* Category 2: SECTEUR PRIVÉ */}
            <div style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.06)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '24px', 
              padding: '40px 32px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', letterSpacing: '1px' }}>
                    🏢 SECTEUR PRIVÉ (AGENCES)
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700 }}>Standard & VIP</span>
                </div>

                <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: '"Playfair Display", serif', margin: '0 0 12px' }}>
                  Voyagistes Privés Accrédités
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px', lineHeight: '1.6' }}>
                  38 agences privées agréées offrant des formules sur-mesure Standard et VIP d'exception.
                </p>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderRadius: '14px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginRight: '4px' }}>À partir de</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', fontFamily: '"Outfit", sans-serif' }}>3 600 000</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>FCFA</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Formules au choix : Standard & Suites VIP 5★</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Hôtels de prestige face aux Mosquées Saintes</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Vols réguliers & classe affaires avec bagages inclus</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: '#D4AF37' }}>✦</span> Accompagnement VIP individuel & buffets gastronomiques</li>
                </ul>
              </div>

              <button 
                onClick={() => { setSelectedSectorFilter('prive'); setActivePage('agencies_page'); }}
                style={{ width: '100%', height: '52px', fontWeight: 800, fontSize: '0.95rem', borderRadius: '50px', backgroundColor: '#D4AF37', color: '#042F1A', border: 'none', cursor: 'pointer' }}
              >
                Explorer les Agences Privées (Standard & VIP) →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Hajj Spiritual Rites Carousel Section */}
      <section id="rites" style={{ backgroundColor: 'var(--surface)', padding: '90px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: 'var(--secondary-dark)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '8px' }}>
              {lang === 'FR' ? 'RITES SACRÉS' : lang === 'EN' ? 'SACRED RITES' : 'الشعائر المقدسة'}
            </span>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-dark)', letterSpacing: '-0.5px' }}>
              {lang === 'FR' ? 'Découvrez le Parcours Sacré du Hajj' : lang === 'EN' ? 'Discover the Sacred Hajj Journey' : 'اكتشف رحلة الحج المباركة'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '10px', maxWidth: '650px', margin: '10px auto 0' }}>
              {lang === 'FR' ? 'Explorez les 12 étapes spirituelles et rituelles du pèlerinage inspirées du parcours officiel.' : lang === 'EN' ? 'Explore the 12 spiritual and ritual steps of the pilgrimage inspired by the official path.' : 'استكشف الخطوات الـ ١٢ الروحانية والشرعية لأداء مناسك الحج خطوة بخطوة.'}
            </p>
          </div>

          {/* Interactive Steps Selector Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px', 
            marginBottom: '40px',
            overflowX: 'auto',
            padding: '10px 0',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const active = idx === activeSlide;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  style={{
                    minWidth: '45px',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    border: active ? '2.5px solid var(--secondary)' : '1px solid var(--border)',
                    backgroundColor: active ? 'var(--primary-dark)' : 'var(--bg)',
                    color: active ? '#ffffff' : 'var(--text)',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s ease',
                    boxShadow: active ? '0 4px 12px rgba(4,47,26,0.2)' : 'none'
                  }}
                  className="table-row-hover"
                >
                  {String(idx + 1).padStart(2, '0')}
                </button>
              );
            })}
          </div>

          {/* Journey Card Split Layout */}
          {(() => {
            const hajjSteps = [
              {
                id: '01',
                image: '/assets/hajj_ihram.png',
                title: {
                  FR: "L'Ihram (La Sacralisation)",
                  EN: "Ihram (Sacralization)",
                  AR: "الإحرام"
                },
                desc: {
                  FR: "Entrée en état de sacralisation au Miqat, symbole d'unité absolue et de pureté spirituelle où tous les pèlerins portent le vêtement blanc.",
                  EN: "Entering the state of purity at the Miqat, symbolizing equality. Pilgrims put on the white garments and make their intention.",
                  AR: "الدخول في نية الحج من الميقات، مرتديًا ملابس الإحرام البيضاء التي ترمز إلى المساواة والوحدة والتجرد لله تعالى."
                }
              },
              {
                id: '02',
                image: '/assets/hajj_tawaf.png',
                title: {
                  FR: "Tawaf Al-Qudum (Circonambulation)",
                  EN: "Tawaf Al-Qudum (Arrival)",
                  AR: "طواف القدوم"
                },
                desc: {
                  FR: "Sept rotations sacrées autour de la Kaaba en arrivant à la Mecque, suivies de prières derrière le Maqam Ibrahim.",
                  EN: "Upon entering Makkah, perform Tawaf Al-Qudum by circumambulating the Kaaba seven times, followed by prayers behind Maqam Ibrahim.",
                  AR: "الطواف حول الكعبة المشرفة سبعة أشواط فور الوصول إلى مكة المكرمة، ثم صلاة ركعتين خلف مقام إبراهيم."
                }
              },
              {
                id: '03',
                image: '/assets/kaaba_hero_bg.png',
                title: {
                  FR: "Le Sa'i (Safa & Marwa)",
                  EN: "Sa'i between Safa and Marwa",
                  AR: "السعي بين الصفا والمروة"
                },
                desc: {
                  FR: "Parcours rituel de sept allers-retours entre les collines de Safa et Marwa, commémorant la recherche d'eau de Hajar pour son fils Ismaïl.",
                  EN: "Perform Sa'i by walking seven times starting at Safa and ending at Marwa, reenacting Hagar's search for water.",
                  AR: "السعي بين جبلين الصفا والمروة سبعة أشواط، تبدأ من الصفا وتنتهي بالمروة استحضاراً لسعي هاجر عليها السلام."
                }
              },
              {
                id: '04',
                image: '/assets/hajj_mina.png',
                title: {
                  FR: "Mina (Jour de Tarwiyah)",
                  EN: "Mina (Day of Tarwiyah)",
                  AR: "المبيت بمنى (يوم التروية)"
                },
                desc: {
                  FR: "Le 8ème jour de Dhul-Hijjah, les pèlerins se dirigent vers Mina et y passent la nuit en prières et invocations.",
                  EN: "Head to Mina on the morning of the 8th of Dhul-Hijjah and spend the night there, dedicating time to prayers.",
                  AR: "التوجه إلى مشعر منى في صباح اليوم الثامن من ذي الحجة (يوم التروية) والمبيت فيها والاشتغال بالعبادة والدعاء."
                }
              },
              {
                id: '05',
                image: '/assets/hajj_arafat.png',
                title: {
                  FR: "Arafat (Le Rôle Suprême)",
                  EN: "Arafah (Day of Greater Hajj)",
                  AR: "وقوف عرفة (الركن الأعظم)"
                },
                desc: {
                  FR: "Le 9ème jour de Dhul-Hijjah, station sur le mont Arafat du zénith au coucher du soleil pour implorer la miséricorde divine. C'est l'essence du Hajj.",
                  EN: "On the 9th of Dhul-Hijjah, head to Arafat and devote yourself to Allah in supplication from noon until sunset.",
                  AR: "الوقوف بصعيد عرفات الطاهر في اليوم التاسع من ذي الحجة، وهو ركن الحج الأعظم، متضرعين بالدعاء إلى غروب الشمس."
                }
              },
              {
                id: '06',
                image: '/assets/hajj_arafat.png',
                title: {
                  FR: "Muzdalifah (Recueillement)",
                  EN: "Muzdalifah",
                  AR: "مزدلفة"
                },
                desc: {
                  FR: "Après le coucher du soleil à Arafat, direction Muzdalifah pour passer la nuit en plein air et ramasser les cailloux pour la lapidation.",
                  EN: "After sunset on Arafat, move to Muzdalifah to spend the night under the stars and collect pebbles for Jamarat.",
                  AR: "النفرة إلى مزدلفة بعد غروب شمس يوم عرفة، والمبيت بها لجمع حصوات رمي الجمرات."
                }
              },
              {
                id: '07',
                image: '/assets/hajj_mina.png',
                title: {
                  FR: "Lapidation de Jamrat Al-Aqabah",
                  EN: "Pelting Jamrat Al-Aqabah",
                  AR: "رمي جمرة العقبة الكبرى"
                },
                desc: {
                  FR: "Le 10ème jour (Aïd), retour à Mina pour lapider la grande stèle (Jamrat Al-Aqabah) avec sept cailloux en récitant le Takbeer.",
                  EN: "On the 10th of Dhul-Hijjah (Eid Day), return to Mina and pelt the largest pillar (Jamrat Al-Aqabah) with seven pebbles.",
                  AR: "العودة إلى منى يوم النحر (عيد الأضحى) ورمي جمرة العقبة الكبرى بسبع حصيات مع التكبير."
                }
              },
              {
                id: '08',
                image: '/assets/hajj_mina.png',
                title: {
                  FR: "Al-Hady (Le Sacrifice)",
                  EN: "Adhahi (Sacrifice Offering)",
                  AR: "الهدي والأضحية"
                },
                desc: {
                  FR: "Offrande d'un sacrifice (mouton) pour remercier Allah, dont la viande est principalement distribuée aux personnes nécessiteuses.",
                  EN: "Make an Adhahi offering to draw closer to Allah. The meat is distributed to feed the needy around the world.",
                  AR: "تقديم الهدي تقرباً إلى الله تعالى، ويوزع لحمه على الفقراء والمحتاجين."
                }
              },
              {
                id: '09',
                image: '/assets/hajj_ihram.png',
                title: {
                  FR: "Désacralisation (Rasage / Coupe)",
                  EN: "Shave Hair or Trim",
                  AR: "الحلق أو التقصير"
                },
                desc: {
                  FR: "Se raser ou se couper les cheveux pour marquer la fin de l'état d'Ihram (première désacralisation) et pouvoir remettre ses habits normaux.",
                  EN: "Shave or trim your hair, marking the partial release from Ihram, allowing you to return to regular clothes.",
                  AR: "حلق الرأس أو تقصير الشعر للحجاج الرجال، والتقصير للنساء، وبذلك يتحلل الحاج التحلل الأصغر."
                }
              },
              {
                id: '10',
                image: '/assets/hajj_tawaf.png',
                title: {
                  FR: "Tawaf Al-Ifada",
                  EN: "Tawaf Al-Ifada",
                  AR: "طواف الإفاضة"
                },
                desc: {
                  FR: "Retour à la Mecque pour effectuer le Tawaf majeur autour de la Kaaba, pilier obligatoire scellant la désacralisation totale.",
                  EN: "Return to Makkah to perform the mandatory Tawaf Al-Ifada by circumambulating the Kaaba seven times.",
                  AR: "العودة للمسجد الحرام لأداء طواف الإفاضة وهو ركن من أركان الحج، وبإتمامه يتحلل الحاج التحلل الأكبر."
                }
              },
              {
                id: '11',
                image: '/assets/hajj_mina.png',
                title: {
                  FR: "Lapidation des 3 Jamarats",
                  EN: "Pelting the Three Jamarat",
                  AR: "رمي الجمرات الثلاث"
                },
                desc: {
                  FR: "Pendant les jours de Tashreeq (11, 12 et 13 Dhul-Hijjah), lapidation des trois stèles de Mina (la petite, la moyenne et la grande).",
                  EN: "During the Days of Tashreeq, pelt the three pillars (small, medium, large) at Mina with seven pebbles each day.",
                  AR: "رمي الجمرات الثلاث (الصغرى والوسطى والكبرى) في أيام التشريق (١١، ١٢، ١٣ ذي الحجة) تقرباً لله تعالى."
                }
              },
              {
                id: '12',
                image: '/assets/hajj_tawaf.png',
                title: {
                  FR: "Tawaf Al-Wadaa (L'Adieu)",
                  EN: "Tawaf Al-Wadaa (Farewell)",
                  AR: "طواف الوداع"
                },
                desc: {
                  FR: "Le dernier rituel accompli par le pèlerin juste avant de quitter définitivement la ville sainte de la Mecque.",
                  EN: "The final ritual performed by the pilgrim circumambulating the Kaaba seven times before departing Makkah.",
                  AR: "آخر ما يفعله الحاج قبل مغادرة مكة المكرمة مودعاً البيت الحرام وهو سبعة أشواط حول الكعبة."
                }
              }
            ];

            const current = hajjSteps[activeSlide];
            const isRtl = lang === 'AR';

            return (
              <div style={{ 
                display: 'flex', 
                gap: '30px', 
                alignItems: 'stretch', 
                flexWrap: 'wrap',
                flexDirection: isRtl ? 'row-reverse' : 'row'
              }}>
                {/* Left Card: Image */}
                <div style={{ 
                  flex: 1.3, 
                  minWidth: '320px', 
                  height: '420px', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border)'
                }}>
                  <img 
                    src={current.image} 
                    alt={current.title[lang]} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.5) 100%)' }} />
                  
                  {/* Arrows overlay */}
                  <button 
                    onClick={() => setActiveSlide(prev => (prev - 1 + 12) % 12)}
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: isRtl ? 'auto' : '15px', 
                      right: isRtl ? '15px' : 'auto',
                      transform: 'translateY(-50%)', 
                      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                      border: 'none', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      width: '40px', 
                      height: '40px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveSlide(prev => (prev + 1) % 12)}
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      right: isRtl ? 'auto' : '15px', 
                      left: isRtl ? '15px' : 'auto',
                      transform: 'translateY(-50%)', 
                      backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                      border: 'none', 
                      color: '#fff', 
                      borderRadius: '50%', 
                      width: '40px', 
                      height: '40px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Right Card: Text Info */}
                <div style={{ 
                  flex: 1, 
                  minWidth: '320px', 
                  backgroundColor: 'var(--surface-overlay)', 
                  border: '1px solid var(--border)',
                  borderRadius: '16px', 
                  padding: '40px 30px', 
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '15px',
                  textAlign: isRtl ? 'right' : 'left'
                }}>
                  <div>
                    <span style={{ 
                      color: 'var(--secondary-dark)', 
                      fontWeight: 800, 
                      fontSize: '0.85rem', 
                      letterSpacing: '1px', 
                      textTransform: 'uppercase' 
                    }}>
                      {lang === 'FR' ? `ÉTAPE ${current.id}` : lang === 'EN' ? `STEP ${current.id}` : `الخطوة ${current.id}`}
                    </span>
                    <h4 style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 850, 
                      color: 'var(--primary-dark)', 
                      marginTop: '6px', 
                      letterSpacing: '-0.5px' 
                    }}>
                      {current.title[lang]}
                    </h4>
                  </div>
                  <p style={{ 
                    fontSize: '0.98rem', 
                    lineHeight: '1.65', 
                    color: 'var(--text)', 
                    margin: 0 
                  }}>
                    {current.desc[lang]}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                    <button 
                      onClick={() => setActiveSlide(prev => (prev - 1 + 12) % 12)}
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      {lang === 'FR' ? 'Précédent' : lang === 'EN' ? 'Previous' : 'السابق'}
                    </button>
                    <button 
                      onClick={() => setActiveSlide(prev => (prev + 1) % 12)}
                      className="btn btn-primary" 
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      {lang === 'FR' ? 'Suivant' : lang === 'EN' ? 'Next' : 'التالي'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '60px 0' }} />

          {/* Sunnah Acts Section */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-dark)' }}>
                {lang === 'FR' ? "Actes recommandés (Sunnah) du Tawaf & Sa'i" : lang === 'EN' ? "Recommended Sunnah Acts of Tawaf & Sa'i" : "سنن ومستحبات الطواف والسعي"}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                {lang === 'FR' ? "Pratiques complémentaires à accomplir pour enrichir la récompense spirituelle." : lang === 'EN' ? "Additional practices to perform to enrich the spiritual reward." : "أعمال يستحب للحاج فعلها لزيادة الأجر والثواب أثناء الطواف والسعي."}
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '20px' 
            }}>
              {(() => {
                const sunnahActs = {
                  FR: [
                    { icon: "👕", title: "L'Idtiba'", desc: "Découvrir l'épaule droite pour les hommes en plaçant le drap de l'Ihram sous l'aisselle droite." },
                    { icon: "🏃‍♂️", title: "Le Ramal", desc: "Marcher rapidement à pas serrés durant les trois premiers tours du Tawaf de départ." },
                    { icon: "🕋", title: "Prière du Maqam", desc: "Prier deux rak'ahs derrière la station de Maqam Ibrahim après le Tawaf." },
                    { icon: "🟢", title: "Course Safa & Marwa", desc: "Trottiner entre les deux balises de lumières vertes durant le parcours du Sa'i." }
                  ],
                  AR: [
                    { icon: "👕", title: "الاضطباع", desc: "كشف الكتف الأيمن للرجال أثناء الطواف بجعل وسط الرداء تحت الإبط الأيمن." },
                    { icon: "🏃‍♂️", title: "الرمل", desc: "إسراع المشي مع مقاربة الخطوات في الأشواط الثلاثة الأولى من طواف القدوم." },
                    { icon: "🕋", title: "صلاة ركعتي الطواف", desc: "صلاة ركعتين خلف مقام إبراهيم عليه السلام بعد الفراغ من الطواف." },
                    { icon: "🟢", title: "الهرولة بين العلمين", desc: "الهرولة الخفيفة للرجال بين العلمين الأخضرين أثناء السعي." }
                  ]
                };

                const currentActs = sunnahActs[lang] || sunnahActs.FR;

                return currentActs.map((act, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      backgroundColor: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '12px', 
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      transition: 'transform 0.2s',
                      textAlign: lang === 'AR' ? 'right' : 'left'
                    }}
                    className="table-row-hover"
                  >
                    <div style={{ 
                      width: '45px', 
                      height: '45px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(4, 47, 26, 0.06)', 
                      color: 'var(--primary)',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: lang === 'AR' ? 'flex-end' : 'flex-start'
                    }}>
                      {act.icon}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)', display: 'block' }}>{act.title}</strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '6px', margin: 0 }}>{act.desc}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section (PDF Page 4) */}
      <section id="faq" style={{ padding: '90px 40px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: '#B27D1B', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>— RÉPONSES PRATIQUES —</span>
          <h3 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#042F1A', fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px' }}>
            Foire aux questions
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* FAQ 1 */}
          <div 
            style={{ 
              padding: '24px 28px', 
              backgroundColor: '#FAF9F5', 
              border: '1px solid #E2E8F0', 
              borderRadius: '16px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#042F1A', fontSize: '1.05rem', fontFamily: '"Playfair Display", serif' }}>
              <span>Qu'est-ce que la plateforme saoudienne Nusuk ?</span>
              <span style={{ fontSize: '1.4rem', color: '#64748B', fontWeight: 400 }}>{activeFaq === 0 ? '×' : '+'}</span>
            </div>
            {activeFaq === 0 && (
              <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '14px', lineHeight: '1.6', borderTop: '1px solid #E2E8F0', paddingTop: '14px', margin: '14px 0 0' }}>
                Nusuk est le système officiel du Ministère du Hajj d'Arabie Saoudite. Sunu Hajj y est connecté directement pour valider votre visa dès que votre dossier est approuvé.
              </p>
            )}
          </div>

          {/* FAQ 2 */}
          <div 
            style={{ 
              padding: '24px 28px', 
              backgroundColor: '#FAF9F5', 
              border: '1px solid #E2E8F0', 
              borderRadius: '16px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#042F1A', fontSize: '1.05rem', fontFamily: '"Playfair Display", serif' }}>
              <span>Comment vérifier si une agence est agréée par l'État ?</span>
              <span style={{ fontSize: '1.4rem', color: '#64748B', fontWeight: 400 }}>{activeFaq === 1 ? '×' : '+'}</span>
            </div>
            {activeFaq === 1 && (
              <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '14px', lineHeight: '1.6', borderTop: '1px solid #E2E8F0', paddingTop: '14px', margin: '14px 0 0' }}>
                Seules les agences inscrites au registre officiel de la Commission Nationale Sunu Hajj sont accréditées. Vous pouvez consulter la liste complète depuis votre Espace Pèlerin ou sur ce portail.
              </p>
            )}
          </div>

          {/* FAQ 3 */}
          <div 
            style={{ 
              padding: '24px 28px', 
              backgroundColor: '#FAF9F5', 
              border: '1px solid #E2E8F0', 
              borderRadius: '16px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, color: '#042F1A', fontSize: '1.05rem', fontFamily: '"Playfair Display", serif' }}>
              <span>Quel est le rôle de la Sunu Hajj ?</span>
              <span style={{ fontSize: '1.4rem', color: '#64748B', fontWeight: 400 }}>{activeFaq === 2 ? '×' : '+'}</span>
            </div>
            {activeFaq === 2 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '14px', lineHeight: '1.6', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                {currentT.dgpRoleAns}
              </p>
            )}
          </div>

        </div>
      </section>
      </>
      )}

      {/* Premium Footer */}
      <footer id="footer" style={{ 
        background: 'linear-gradient(180deg, var(--primary-dark) 0%, #030f09 100%)', 
        color: 'rgba(255,255,255,0.7)', 
        padding: '60px 40px 30px', 
        marginTop: 'auto', 
        borderTop: '3px solid var(--secondary)', 
        position: 'relative', 
        zIndex: 10 
      }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            
            {/* Column 1: Logo & Mission */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--secondary)', boxShadow: 'var(--shadow-sm)' }} />
                <div>
                  <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 900, margin: 0, letterSpacing: '-0.3px' }}>SUNU HAJJ 2026</h4>
                  <p style={{ fontSize: '0.62rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Portail Officiel du Pèlerinage</p>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.55)' }}>
                Portail officiel gouvernemental de suivi et d'homologation de la Commission Nationale Sunu Hajj à La Mecque (Sunu Hajj).
              </p>
            </div>

            {/* Column 2: Useful Links */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Liens Utiles</h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <li>
                  <a href="#workflow" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="table-row-hover">
                    Parcours du pèlerin en 5 étapes
                  </a>
                </li>
                <li>
                  <a href="https://hajj.nusuk.sa/" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }} className="table-row-hover">
                    Portail Officiel Saoudien Nusuk 🇸🇦
                  </a>
                </li>
                <li>
                  <span onClick={() => onSelectPortal('agency')} style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
                    Connexion Espace Agences Agréées
                  </span>
                </li>
                <li>
                  <span onClick={() => onSelectPortal('admin')} style={{ color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'color 0.2s' }} className="table-row-hover">
                    Connexion Administrateur / Agent Sunu Hajj
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h5 style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 800, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Sunu Hajj</h5>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                📞 <span>+221 33 824 12 34 / +221 77 568 99 00</span>
              </p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                ✉️ <span>contact@sunuhajj.sn</span>
              </p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 <span>CICES, VDN, Dakar, Sénégal</span>
              </p>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              © 2026 Sunu Hajj. Tous droits réservés.
            </p>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)' }}>🛡️ Plateforme Sécurisée Sunu Hajj</span>
            </div>
          </div>

        </div>
      </footer>

      {showWizard && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1500, backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div style={{ 
            backgroundColor: 'var(--surface-overlay)', 
            borderRadius: '20px', 
            border: '1px solid var(--border)', 
            width: '100%', 
            maxWidth: '820px', 
            display: 'flex', 
            position: 'relative', 
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            minHeight: '520px',
            animation: 'scaleUp 0.3s ease-out'
          }}>
            
            {/* Left Decorative Sidebar */}
            <div style={{ 
              width: '280px', 
              background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', 
              padding: '40px 30px', 
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }} className="d-none d-md-flex">
              {/* Subtle background Kaaba ornament */}
              <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', fontSize: '10rem', opacity: 0.08, userSelect: 'none' }}>
                🕋
              </div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--secondary)' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--secondary)' }}>Sunu Hajj 2026</span>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.3 }}>
                  Inscriptions Officielles
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '6px', lineHeight: 1.4 }}>
                  Enregistrez votre dossier auprès de la Commission Nationale du Pèlerinage.
                </p>
                
                {/* Stepper Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      backgroundColor: wizardStep === 'form' ? 'var(--secondary)' : 'rgba(255,255,255,0.2)', 
                      color: wizardStep === 'form' ? 'var(--primary-dark)' : 'white',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.78rem',
                      fontWeight: 'bold'
                    }}>
                      1
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: wizardStep === 'form' ? 'white' : 'rgba(255,255,255,0.6)' }}>Informations</strong>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>Saisie du dossier</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      backgroundColor: wizardStep === 'otp' ? 'var(--secondary)' : 'rgba(255,255,255,0.2)', 
                      color: wizardStep === 'otp' ? 'var(--primary-dark)' : 'white',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.78rem',
                      fontWeight: 'bold'
                    }}>
                      2
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: wizardStep === 'otp' ? 'white' : 'rgba(255,255,255,0.6)' }}>
                        {chosenRole === 'agency' ? 'Activation Email' : 'Validation SMS'}
                      </strong>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>
                        {chosenRole === 'agency' ? 'Email Officiel Ligne 33' : 'Code de sécurité'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      backgroundColor: wizardStep === 'success' ? 'var(--secondary)' : 'rgba(255,255,255,0.2)', 
                      color: wizardStep === 'success' ? 'var(--primary-dark)' : 'white',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.78rem',
                      fontWeight: 'bold'
                    }}>
                      3
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: wizardStep === 'success' ? 'white' : 'rgba(255,255,255,0.6)' }}>Finalisation</strong>
                      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>Accès au portail</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', zIndex: 1 }}>
                🔐 Chiffrement de sécurité Sunu Hajj
              </div>
            </div>

            {/* Right Column (Forms) */}
            <div style={{ flex: 1, padding: '40px 36px', backgroundColor: 'var(--surface-overlay)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              
              {/* Close Button */}
              <button 
                onClick={() => setShowWizard(false)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg)', transition: 'var(--transition)' }}
                className="table-row-hover"
                title="Fermer"
              >
                <X size={16} />
              </button>

              {/* STEP 2: SIMPLE REGISTRATION FORM */}
              {wizardStep === 'form' && (
                <div className="fade-in">
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                      Création Dossier Pèlerin
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Saisie simple de vos coordonnées officielles
                    </p>
                  </div>

                  {otpError && (
                    <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '0.78rem', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={14} />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Prénom & Nom complet *</label>
                        <input 
                          type="text" 
                          required 
                          className="form-control"
                          placeholder="Votre Prénom et Nom complet" 
                          value={pilgrimName}
                          onChange={e => setPilgrimName(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Numéro de Passeport *</label>
                        <input 
                          type="text" 
                          required 
                          className="form-control"
                          placeholder="Ex: SN1234567" 
                          value={pilgrimPassport}
                          onChange={e => setPilgrimPassport(e.target.value)}
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Téléphone Mobile *</label>
                        <input 
                          type="tel" 
                          required 
                          className="form-control"
                          placeholder="Ex: +221 77 123 45 67" 
                          value={pilgrimPhone}
                          onChange={e => setPilgrimPhone(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Adresse Email *</label>
                        <input 
                          type="email" 
                          required 
                          className="form-control"
                          placeholder="Ex: email@adresse.com" 
                          value={pilgrimEmail}
                          onChange={e => setPilgrimEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Région de Résidence (Sénégal) *</label>
                        <select 
                          className="form-control"
                          value={pilgrimRegion}
                          onChange={e => setPilgrimRegion(e.target.value)}
                          style={{ padding: '8px 12px', height: '40px', fontSize: '0.85rem', borderRadius: '6px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 700 }}
                        >
                          {SENEGAL_REGIONS.map(r => (
                            <option key={r} value={r}>📍 Région de {r}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                        <label className="form-label" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Choix de l'Agence Hajj Agréée *</label>
                        <select 
                          className="form-control"
                          value={regSelectedAgencyId}
                          onChange={e => setRegSelectedAgencyId(e.target.value)}
                          style={{ padding: '8px 12px', height: '40px', fontSize: '0.85rem', borderRadius: '6px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                        >
                          {allPublicAgencies.map(ag => (
                            <option key={ag.id} value={ag.id}>
                              {ag.name} — {ag.priceLabel} ({ag.type === 'vip' ? 'VIP' : ag.type === 'economique' ? 'Économique' : ag.sector === 'etat' ? 'Secteur État' : 'Standard'})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button 
                        type="button" 
                        onClick={() => setShowWizard(false)} 
                        className="btn btn-secondary" 
                        style={{ flex: 1, height: '44px' }}
                      >
                        Annuler
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ flex: 2, height: '44px', fontWeight: 800 }}
                      >
                        Soumettre mon inscription
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* STEP 3: OTP / EMAIL VERIFICATION */}
              {wizardStep === 'otp' && (
                <div className="fade-in">
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.08)', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', margin: '0 auto 12px' }}>
                      {chosenRole === 'agency' ? '📧' : '🔑'}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>
                      {chosenRole === 'agency' ? "Activation par Email Professionnel" : "Code de validation (OTP)"}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '360px', margin: '6px auto 0', lineHeight: 1.4 }}>
                      {chosenRole === 'agency' 
                        ? "Les agences ayant une ligne fixe (Ligne 33 non compatible SMS), le code et le lien sécurisé d'activation ont été transmis par Email."
                        : "Un code de validation à 4 chiffres a été envoyé par SMS sur votre mobile."}
                    </p>
                  </div>

                  {/* PROMINENT SMS/EMAIL RECEIVED SIMULATOR BOX */}
                  <div style={{
                    backgroundColor: '#ECFDF5',
                    border: '2px dashed #10B981',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: '#065F46',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(16,185,129,0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{chosenRole === 'agency' ? '📧' : '📱'}</span>
                      <strong>{chosenRole === 'agency' ? 'Email Officiel Sunu Hajj :' : 'SMS Sunu Hajj Officiel :'}</strong>
                    </div>
                    <div>
                      {chosenRole === 'agency' ? 'Votre code d\'activation Email est ' : 'Votre code de vérification est '}<strong style={{ fontSize: '1.25rem', color: '#047857', letterSpacing: '2px', backgroundColor: '#D1FAE5', padding: '2px 10px', borderRadius: '6px' }}>{generatedOtp}</strong>
                    </div>
                    {chosenRole === 'agency' && (
                      <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '6px', fontStyle: 'italic' }}>
                        Transmis à : <strong>{agencyApplyEmail || agencyEmail || successUser?.email || 'contact@agence.sn'}</strong> (Ligne 33)
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setOtpInput(generatedOtp)}
                      style={{
                        marginTop: '10px',
                        background: '#10B981',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ {chosenRole === 'agency' ? `Activer via l'Email (${generatedOtp})` : `Remplir automatiquement le code (${generatedOtp})`}
                    </button>
                  </div>

                  {otpError && (
                    <div style={{ padding: '10px 14px', marginBottom: '16px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '0.78rem', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={14} />
                      <span>{otpError}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <input 
                        type="text" 
                        maxLength="4" 
                        required 
                        className="form-control"
                        placeholder="Ex: 8492"
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value)}
                        style={{ 
                          fontSize: '1.4rem', 
                          textAlign: 'center', 
                          letterSpacing: '8px', 
                          width: '250px', 
                          height: '52px',
                          fontWeight: 800,
                          border: '2px solid var(--primary)',
                          borderRadius: '8px',
                          backgroundColor: 'var(--surface)',
                          color: 'var(--text)'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ height: '46px', fontWeight: 700, fontSize: '0.95rem' }}
                      >
                        {chosenRole === 'agency' ? "📧 Valider l'Activation Email et Finaliser →" : "Valider et Activer le compte"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => generateRandomOtp(pilgrimPhone || agentPhone || agencyPhone, pilgrimName || agentName || agencyName)} 
                        className="btn btn-secondary" 
                        style={{ height: '40px', fontSize: '0.8rem' }}
                      >
                        {chosenRole === 'agency' ? "📩 Renvoyer le lien d'activation par Email" : "Renvoyer le code OTP par SMS"}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* STEP 4: SUCCESS & REDIRECT */}
              {wizardStep === 'success' && (
                <div className="fade-in" style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
                    🎉
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Félicitations !</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '340px', margin: '8px auto 24px', lineHeight: '1.5' }}>
                    Votre compte **Sunu Hajj** a été créé et validé avec succès par la Commission Nationale du Pèlerinage.
                  </p>

                  <button 
                    onClick={handleEnterPlatform} 
                    className="btn btn-primary btn-full-width" 
                    style={{ height: '48px', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <span>Accéder à mon Espace</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Agency Application / Contact Request Modal */}
      {showAgencyApplyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1600, backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div style={{ 
            backgroundColor: 'var(--surface-overlay)', 
            borderRadius: '20px', 
            border: '1px solid var(--border)', 
            width: '100%', 
            maxWidth: '520px', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative', 
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            padding: '36px',
            animation: 'scaleUp 0.3s ease-out'
          }}>
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAgencyApplyModal(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg)', transition: 'var(--transition)' }}
              className="table-row-hover"
              title="Fermer"
            >
              <X size={16} />
            </button>

            {agencyApplySuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }} className="fade-in">
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.08)', color: 'var(--secondary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
                  🤝
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Demande reçue !</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.5 }}>
                  Votre agence a été inscrite avec succès ! Sa page officielle d'administration a été créée immédiatement sur la plateforme.
                </p>
                <button 
                  onClick={() => setShowAgencyApplyModal(false)} 
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '46px', marginTop: '24px', fontWeight: 700 }}
                >
                  Fermer
                </button>
              </div>
            ) : (
              <div className="fade-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <img src="/assets/sunu_hajj_logo.png" alt="Sunu Hajj Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--secondary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', margin: 0 }}>Inscription Agence de Voyage</h3>
                    <p style={{ fontSize: '0.74rem', color: 'var(--secondary-dark)', fontWeight: 700, margin: 0 }}>CRÉATION D'ESPACE VOYAGISTE</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
                  Renseignez le nom de votre agence et les coordonnées du responsable pour créer instantanément votre Espace Agence Hajj 2026.
                </p>

                <form onSubmit={handleAgencyApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Nom de l'Agence de Voyage *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="Ex: Touba Voyages Hajj" 
                        value={agencyApplyName} 
                        onChange={e => setAgencyApplyName(e.target.value)} 
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>N° d'Agrément Officiel *</label>
                      <input 
                        type="text" 
                        required 
                        className="form-control" 
                        placeholder="Ex: AGR-2026-DKR-048" 
                        value={agencyApplyAgreementNum} 
                        onChange={e => setAgencyApplyAgreementNum(e.target.value)} 
                        style={{ textTransform: 'uppercase', fontWeight: 700 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Nom du Responsable / Contact *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control" 
                      placeholder="Ex: El Hadji Diouf" 
                      value={agencyApplyContact} 
                      onChange={e => setAgencyApplyContact(e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Numéro de Téléphone Mobile *</label>
                    <input 
                      type="tel" 
                      required 
                      className="form-control" 
                      placeholder="Ex: +221 77 123 45 67" 
                      value={agencyApplyPhone} 
                      onChange={e => setAgencyApplyPhone(e.target.value)} 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Formule Agence Privée *</label>
                      <select
                        className="form-control"
                        value={agencyApplyType || 'standard'}
                        onChange={e => {
                          const val = e.target.value;
                          setAgencyApplyType(val);
                          if (val === 'vip') setAgencyApplyPrice('8500000');
                          else setAgencyApplyPrice('4900000');
                        }}
                        style={{ height: '42px', fontSize: '0.85rem' }}
                      >
                        <option value="standard">✈️ Offre Standard Confort (4.900.000 FCFA)</option>
                        <option value="vip">⭐ Offre VIP Luxe (8.500.000 FCFA)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Tarif du Package (FCFA) *</label>
                      <input 
                        type="number" 
                        required 
                        className="form-control" 
                        placeholder="Ex: 8500000" 
                        value={agencyApplyPrice} 
                        onChange={e => setAgencyApplyPrice(e.target.value)} 
                        style={{ height: '42px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text)' }}>Quota de Pèlerins Attribué *</label>
                    <input 
                      type="number" 
                      required 
                      className="form-control" 
                      placeholder="Ex: 250" 
                      value={agencyApplyQuota} 
                      onChange={e => setAgencyApplyQuota(e.target.value)} 
                      style={{ height: '42px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowAgencyApplyModal(false)} 
                      className="btn btn-secondary" 
                      style={{ flex: 1, height: '44px' }}
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit" 
                      disabled={agencyApplyLoading}
                      className="btn btn-primary" 
                      style={{ flex: 2, height: '44px', fontWeight: 800 }}
                    >
                      {agencyApplyLoading ? "Création..." : "Créer mon Espace Agence →"}
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(4, 47, 26, 0.68)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            padding: '40px 36px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowRoleModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                background: '#F1F5F9',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ color: '#B27D1B', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: '6px' }}>
                • Portail Officiel Sunu Hajj •
              </span>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#042F1A', fontFamily: '"Playfair Display", Georgia, serif', margin: 0 }}>
                Choisissez votre profil pour continuer
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.92rem', marginTop: '8px', lineHeight: '1.5' }}>
                Sélectionnez votre catégorie pour être automatiquement dirigé vers le formulaire officiel correspondant.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Option 1: Pèlerin */}
              <div 
                onClick={() => handleSelectRoleFromModal('pilgrim')}
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  backgroundColor: '#FAF9F5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'all 0.2s ease'
                }}
                className="table-row-hover"
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                  👤
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.08rem', color: '#042F1A', display: 'block', marginBottom: '4px' }}>
                    Inscription Pèlerin
                  </strong>
                  <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.4', display: 'block' }}>
                    Choix d'une agence d'état ou privée agréée et suivi complet de votre dossier visa.
                  </span>
                </div>
                <ChevronRight size={22} color="#042F1A" />
              </div>

              {/* Option 2: Agence */}
              <div 
                onClick={() => handleSelectRoleFromModal('agency')}
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  backgroundColor: '#FAF9F5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'all 0.2s ease'
                }}
                className="table-row-hover"
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                  🏢
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.08rem', color: '#042F1A', display: 'block', marginBottom: '4px' }}>
                    Inscription Agence
                  </strong>
                  <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.4', display: 'block' }}>
                    Inscription officielle de votre agence et création immédiate de sa page Hajj dédiée.
                  </span>
                </div>
                <ChevronRight size={22} color="#042F1A" />
              </div>

              {/* Option 3: Structure Médicale & Médecin */}
              <div 
                onClick={() => handleSelectRoleFromModal('doctor')}
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  backgroundColor: '#FAF9F5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'all 0.2s ease'
                }}
                className="table-row-hover"
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(22,163,74,0.12)', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                  🩺
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.08rem', color: '#042F1A', display: 'block', marginBottom: '4px' }}>
                    Espace Structure Médicale & Médecin
                  </strong>
                  <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.4', display: 'block' }}>
                    Contrôle médical, validation des aptitudes et carnet vaccinal par Code Unique.
                  </span>
                </div>
                <ChevronRight size={22} color="#042F1A" />
              </div>

              {/* Option 4: Agent DGP (État) */}
              <div 
                onClick={() => handleSelectRoleFromModal('agent')}
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '2px solid #E2E8F0',
                  backgroundColor: '#FAF9F5',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  transition: 'all 0.2s ease'
                }}
                className="table-row-hover"
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: 'rgba(4,47,26,0.1)', color: '#042F1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0 }}>
                  🛡️
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.08rem', color: '#042F1A', display: 'block', marginBottom: '4px' }}>
                    Accréditation Agent DGP (État)
                  </strong>
                  <span style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.4', display: 'block' }}>
                    Accréditation restreinte pour agents de contrôle DGP et superviseurs du Hajj.
                  </span>
                </div>
                <ChevronRight size={22} color="#042F1A" />
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default PortalGateway;
