// SOS Emergency & Sacred Sites GPS Tracking Service for Sunu Hajj

const SOS_STORAGE_KEY = 'sunuhajj_sos_alerts_v1';

export const MOCK_SACRED_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Masjid Al-Haram (Grande Mosquée & Kaaba)',
    city: 'Makkah',
    type: 'holy_site',
    lat: 21.4225,
    lng: 39.8262,
    description: 'Lieu saint principal. Tawaf et Saï.',
    icon: '🕌'
  },
  {
    id: 'loc-2',
    name: 'Abraj Al Bait Royal Hotel (Hôtel Pèlerin State/DGP)',
    city: 'Makkah',
    type: 'hotel',
    lat: 21.4187,
    lng: 39.8256,
    description: 'Face au Haram - Logement des pèlerins Sénégalais.',
    icon: '🏨'
  },
  {
    id: 'loc-3',
    name: 'Campement Sénégal Mina (Zone 42 - Secteur B)',
    city: 'Mina',
    type: 'tents',
    lat: 21.4133,
    lng: 39.8933,
    description: 'Tentes climatisées réservées aux pèlerins sénégalais. Proche Pont Jamarat.',
    icon: '🎪'
  },
  {
    id: 'loc-4',
    name: 'Poste Médical Officiel DGP Sénégal (Mina)',
    city: 'Mina',
    type: 'medical',
    lat: 21.4140,
    lng: 39.8950,
    description: 'Centre de soins d\'urgence avec médecins et ambulances sénégalaises.',
    icon: '🏥'
  },
  {
    id: 'loc-5',
    name: 'Mount Arafat (Jabal Al-Rahmah / Mont de la Miséricorde)',
    city: 'Arafat',
    type: 'holy_site',
    lat: 21.3548,
    lng: 39.9841,
    description: 'Station d\'Arafat (Jour culminant du Hajj).',
    icon: '⛰️'
  },
  {
    id: 'loc-6',
    name: 'Poste Médical Officiel DGP Sénégal (Arafat)',
    city: 'Arafat',
    type: 'medical',
    lat: 21.3560,
    lng: 39.9855,
    description: 'Tente médicale principale de la Délégation Générale à Arafat.',
    icon: '🚑'
  },
  {
    id: 'loc-7',
    name: 'Masjid An-Nabawi (Mosquée du Prophète)',
    city: 'Madinah',
    type: 'holy_site',
    lat: 24.4672,
    lng: 39.6111,
    description: 'Médine la Lumineuse - Visite de la Rawdah Shareef.',
    icon: '🕌'
  },
  {
    id: 'loc-8',
    name: 'Pullman Zamzam Madina Hotel',
    city: 'Madinah',
    type: 'hotel',
    lat: 24.4685,
    lng: 39.6095,
    description: 'Hôtel 5 étoiles Médine à 150m de la Mosquée du Prophète.',
    icon: '🏨'
  }
];

export const INITIAL_SOS_ALERTS = [
  {
    id: 'sos-101',
    pilgrimId: 1,
    pilgrimName: 'Malick Ndiaye',
    passportNumber: 'SN55555',
    phone: '+221 78 591 07 67',
    locationName: 'Pont des Jamarat (Mina)',
    city: 'Mina',
    gpsCoords: { lat: 21.4138, lng: 39.8942 },
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'assigned', // 'active' | 'assigned' | 'resolved'
    assignedTeam: 'Brigade Médicale N° 3 (Dr. Babacar Ndiaye)',
    batteryLevel: '82%',
    note: 'Pèlerin égaré après le lapidage des stèles. Légère désorientation.'
  },
  {
    id: 'sos-102',
    pilgrimId: 50,
    pilgrimName: 'Adja Fatou Binetou Ndiaye',
    passportNumber: 'SN12345',
    phone: '+221 77 654 32 10',
    locationName: 'Porte King Abdulaziz (Masjid Al-Haram)',
    city: 'Makkah',
    gpsCoords: { lat: 21.4218, lng: 39.8250 },
    timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
    status: 'resolved',
    assignedTeam: 'Secours DGP Sénégal (Agent Moussa Faye)',
    batteryLevel: '45%',
    note: 'Senior de 76 ans raccompagnée en sécurité à son hôtel Abraj Al Bait.'
  }
];

class SosService {
  getAlerts() {
    try {
      const saved = localStorage.getItem(SOS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading SOS alerts", e);
    }
    return INITIAL_SOS_ALERTS;
  }

  saveAlerts(list) {
    try {
      localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('sunuhajj_sos_update', { detail: list }));
    } catch (e) {
      console.error("Error saving SOS alerts", e);
    }
  }

  triggerSOS({ pilgrimId, pilgrimName, passportNumber, phone, city = 'Mina', locationName = 'Campement Sénégal (Mina)', gpsCoords }) {
    const newAlert = {
      id: `sos-${Date.now()}`,
      pilgrimId: pilgrimId || 99,
      pilgrimName: pilgrimName || 'Pèlerin Sénégalais',
      passportNumber: passportNumber || 'SN-UNKNOWN',
      phone: phone || '+221 77 000 00 00',
      locationName: locationName || 'Lieux Saints (Makkah / Mina)',
      city: city || 'Mina',
      gpsCoords: gpsCoords || { lat: 21.4133 + (Math.random() - 0.5) * 0.005, lng: 39.8933 + (Math.random() - 0.5) * 0.005 },
      timestamp: new Date().toISOString(),
      status: 'active',
      assignedTeam: 'Attente affectation Brigade DGP',
      batteryLevel: '91%',
      note: 'Signal SOS Déclenché depuis l\'Application Mobile Sunu Hajj'
    };

    const current = this.getAlerts();
    const updated = [newAlert, ...current];
    this.saveAlerts(updated);

    // Broadcast live SOS event for instant UI popup
    window.dispatchEvent(new CustomEvent('sunuhajj_live_sos_triggered', { detail: newAlert }));

    return newAlert;
  }

  updateAlertStatus(id, newStatus, assignedTeam = null) {
    const current = this.getAlerts();
    const updated = current.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          assignedTeam: assignedTeam || a.assignedTeam
        };
      }
      return a;
    });
    this.saveAlerts(updated);
  }

  resolveAlert(id) {
    this.updateAlertStatus(id, 'resolved', 'Secouru par l\'Équipe DGP');
  }
}

export const sosService = new SosService();
