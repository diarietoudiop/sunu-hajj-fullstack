// Mock Data & Service State for Sunu Hajj React Native Pilgrim Mobile App

export const CURRENT_PILGRIM = {
  id: 1,
  fullName: "Malick Ndiaye",
  passportNumber: "SN55555",
  phone: "+221 78 591 07 67",
  email: "malick.ndiaye@gmail.com",
  gender: "M",
  age: 68,
  region: "Dakar",
  agencyId: 1,
  agencyName: "Voyages Teranga Hajj & Omra",
  medicalStatus: "apte", // 'apte' | 'inapte' | 'pending'
  bloodType: "B+",
  doctorName: "Dr. Babacar Ndiaye (Hôpital Principal Dakar)",
  registrationStatus: "approved",
  nusukStatus: "synced",
  nusukVisaId: "SA-2026-SN-84920",
  visaStatus: "issued",
  paymentStatus: "paid",
  flightNumber: "Air Sénégal HC-2026-DKR",
  flightDate: "15 Juin 2026 - 02h30 GMT",
  hotelMakkah: "Abraj Al Bait Royal Hotel",
  hotelMadinah: "Pullman Zamzam Madina",
  roomNumber: "Chambre 704 • Lit N° 2",
  emergencyContact: {
    name: "Ousmane Ndiaye (Fils)",
    phone: "+221 77 123 45 67",
    relation: "Fils / Proche au Sénégal"
  }
};

export const ROOMMATES = [
  { id: 'rm-1', fullName: 'El Hadji Ousmane Diop', phone: '+221 77 345 67 89', age: 78, bedNumber: 'Lit N° 1', role: 'Senior', tag: '👴 Senior (>65 ans)' },
  { id: 'rm-2', fullName: 'Moussa Faye', phone: '+221 78 456 78 90', age: 50, bedNumber: 'Lit N° 3', role: 'Adulte', tag: '👨 Adulte' },
  { id: 'rm-3', fullName: 'Cheikh Tidiane Ndiaye', phone: '+221 70 567 89 01', age: 28, bedNumber: 'Lit N° 4', role: 'Jeune', tag: '🛡️ Référent Jeune' }
];

export const SACRED_SITES = [
  {
    id: 'site-1',
    name: 'Masjid Al-Haram & Kaaba',
    city: 'Makkah',
    type: 'Lieu Saint',
    distance: '500m (Navette 3 min)',
    desc: 'Lieu saint principal pour les Tawaf et le Saï.',
    icon: '🕋',
    lat: 21.4225,
    lng: 39.8262
  },
  {
    id: 'site-2',
    name: 'Hôtel Abraj Al Bait Royal',
    city: 'Makkah',
    type: 'Logement Pèlerin',
    distance: 'Face à la Porte King Abdulaziz',
    desc: 'Votre hôtel officiel à La Mecque. Chambre 704.',
    icon: '🏨',
    lat: 21.4187,
    lng: 39.8256
  },
  {
    id: 'site-3',
    name: 'Campement Sénégal (Zone 42)',
    city: 'Mina',
    type: 'Tentes Pèlerins',
    distance: 'Proche Pont des Jamarat',
    desc: 'Tente N° 42 réservée à la délégation sénégalaise.',
    icon: '🎪',
    lat: 21.4133,
    lng: 39.8933
  },
  {
    id: 'site-4',
    name: 'Poste Médical DGP Sénégal',
    city: 'Mina',
    type: 'Santé Urgence',
    distance: '150m de votre tente',
    desc: 'Equipe médicale sénégalaise avec le Dr. Babacar Ndiaye.',
    icon: '🏥',
    lat: 21.4140,
    lng: 39.8950
  },
  {
    id: 'site-5',
    name: 'Jabal Al-Rahmah (Mont Arafat)',
    city: 'Arafat',
    type: 'Lieu Saint',
    distance: '18 km de Makkah',
    desc: 'Station d\'Arafat (Jour culminant du Hajj).',
    icon: '⛰️',
    lat: 21.3548,
    lng: 39.9841
  },
  {
    id: 'site-6',
    name: 'Masjid An-Nabawi (Mosquée du Prophète)',
    city: 'Madinah',
    type: 'Lieu Saint',
    distance: '150m de votre hôtel',
    desc: 'Médine la Lumineuse - Prière à la Rawdah Shareef.',
    icon: '🕌',
    lat: 24.4672,
    lng: 39.6111
  }
];

export const NOTIFICATIONS = [
  {
    id: 'n-1',
    title: ' Visite Médicale Validée',
    message: 'Félicitations Malick ! Votre bilan d\'aptitude physique et groupe sanguin B+ ont été validés par le Dr. Babacar Ndiaye.',
    time: 'Il y a 15 min',
    channel: 'WhatsApp',
    read: false
  },
  {
    id: 'n-2',
    title: '🕋 Visa Nusuk Émis',
    message: 'Votre visa officiel Hajj SA-2026-SN-84920 a été émis par le Ministère Saoudien.',
    time: 'Il y a 2h',
    channel: 'SMS',
    read: true
  },
  {
    id: 'n-3',
    title: '✈️ Vol Air Sénégal Confirmé',
    message: 'Vol HC-2026-DKR confirmé pour le 15 Juin 2026 à 02h30. Aéroport DSS.',
    time: 'Hier',
    channel: 'WhatsApp',
    read: true
  }
];
