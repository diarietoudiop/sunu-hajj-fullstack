import React, { useState, useEffect } from 'react';
import { 
  Hotel, 
  Plus, 
  Users, 
  CheckCircle2, 
  Building, 
  Sparkles, 
  Printer, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  HeartHandshake, 
  UserCheck, 
  MapPin,
  Heart
} from 'lucide-react';

const INITIAL_HOTELS = [
  {
    id: 'HOT-001',
    name: 'Abraj Al Bait Royal Hotel (Clock Tower)',
    city: 'La Mecque',
    sector: 'Secteur État',
    distanceHaram: '50m du Haram (Face à la Kaaba)',
    capacity: 500,
    maleCapacity: 250,
    femaleCapacity: 250,
    seniorPriorityFloor: 'Rez-de-Chaussée à R+2 (Ascenseurs Express PMR)',
    notes: 'Hôtel Officiel Prestige pour la Délégation Officielle & Pèlerins de l’État.'
  },
  {
    id: 'HOT-002',
    name: 'Hôtel Pullman Zamzam Makkah',
    city: 'La Mecque',
    sector: 'Secteur Privé',
    distanceHaram: '150m du Haram',
    capacity: 400,
    maleCapacity: 200,
    femaleCapacity: 200,
    seniorPriorityFloor: 'Étage 1 à 3 (Accès personnes âgées)',
    notes: 'Rallongé pour les agences de voyage privées partenaires (Formules VIP & Luxe).'
  },
  {
    id: 'HOT-003',
    name: 'Hôtel Oberoi Madinah (Mosquée du Prophète)',
    city: 'Médine',
    sector: 'Secteur État',
    distanceHaram: '100m de la Mosquée Nabawi',
    capacity: 450,
    maleCapacity: 225,
    femaleCapacity: 225,
    seniorPriorityFloor: 'RDC & Étage 1',
    notes: 'Hôtel 5 étoiles à Médine pour le Registre État.'
  },
  {
    id: 'HOT-004',
    name: 'Hôtel Dar Al Iman InterContinental',
    city: 'Médine',
    sector: 'Secteur Privé',
    distanceHaram: '200m de la Mosquée Nabawi',
    capacity: 350,
    maleCapacity: 175,
    femaleCapacity: 175,
    seniorPriorityFloor: 'Étage 1 & 2 (Adapté PMR)',
    notes: 'Réservé aux groupes des agences privées accréditées.'
  }
];

function HotelsTab({ pilgrims = [], agencies = [], onUpdateLogistics }) {
  // Hotels master list in localStorage
  const [hotels, setHotels] = useState(() => {
    try {
      const saved = localStorage.getItem('dgp_hotels');
      return saved ? JSON.parse(saved) : INITIAL_HOTELS;
    } catch (e) {
      return INITIAL_HOTELS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dgp_hotels', JSON.stringify(hotels));
    } catch (e) {}
  }, [hotels]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');

  // Modal states
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [selectedHotelForDetails, setSelectedHotelForDetails] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: 'La Mecque',
    sector: 'Secteur État',
    distanceHaram: '100m du Haram',
    capacity: 400,
    maleCapacity: 200,
    femaleCapacity: 200,
    seniorPriorityFloor: 'RDC et 1er Étage (Priorité > 65 ans)',
    notes: ''
  });

  const handleOpenAddModal = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      city: 'La Mecque',
      sector: 'Secteur État',
      distanceHaram: '100m du Haram',
      capacity: 400,
      maleCapacity: 200,
      femaleCapacity: 200,
      seniorPriorityFloor: 'RDC et 1er Étage (Priorité > 65 ans)',
      notes: ''
    });
    setShowAddHotelModal(true);
  };

  const handleOpenEditModal = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name || '',
      city: hotel.city || 'La Mecque',
      sector: hotel.sector || 'Secteur État',
      distanceHaram: hotel.distanceHaram || '100m du Haram',
      capacity: hotel.capacity || 400,
      maleCapacity: hotel.maleCapacity || 200,
      femaleCapacity: hotel.femaleCapacity || 200,
      seniorPriorityFloor: hotel.seniorPriorityFloor || 'RDC et 1er Étage',
      notes: hotel.notes || ''
    });
    setShowAddHotelModal(true);
  };

  const handleSaveHotel = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const cap = parseInt(formData.capacity) || 400;
    const mCap = parseInt(formData.maleCapacity) || Math.floor(cap / 2);
    const fCap = parseInt(formData.femaleCapacity) || Math.floor(cap / 2);

    if (editingHotel) {
      setHotels(prev => prev.map(h => h.id === editingHotel.id ? { ...h, ...formData, capacity: cap, maleCapacity: mCap, femaleCapacity: fCap } : h));
      alert(`Hôtel ${formData.name} mis à jour avec succès !`);
    } else {
      const newHotel = {
        id: `HOT-${Date.now()}`,
        ...formData,
        capacity: cap,
        maleCapacity: mCap,
        femaleCapacity: fCap
      };
      setHotels(prev => [...prev, newHotel]);
      alert(`Hôtel ${formData.name} ajouté avec succès !`);
    }
    setShowAddHotelModal(false);
  };

  const handleDeleteHotel = (hotelId, hotelName) => {
    if (window.confirm(`Voulez-vous supprimer l'hôtel "${hotelName}" ?`)) {
      setHotels(prev => prev.filter(h => h.id !== hotelId));
    }
  };

  // Helper to find pilgrims assigned to a hotel
  const getAssignedPilgrimsForHotel = (hotelName) => {
    if (!hotelName) return [];
    return pilgrims.filter(p => {
      const makkah = p.hotelMakkah || p.logisticsDetails?.hotelMakkah;
      const madinah = p.hotelMadinah || p.logisticsDetails?.hotelMadinah;
      return (makkah && String(makkah).toLowerCase().includes(String(hotelName).toLowerCase())) ||
             (madinah && String(madinah).toLowerCase().includes(String(hotelName).toLowerCase()));
    });
  };

  // Automated Dispatching Engine (Distribution par Sexe & Mixité Générationnelle des Âges)
  const [isDispatching, setIsDispatching] = useState(false);

  const handleRunHotelDispatch = async () => {
    if (hotels.length === 0) {
      alert("⚠️ Aucun hôtel répertorié ! Veuillez d'abord ajouter des hôtels à La Mecque et Médine.");
      return;
    }

    const unassignedPilgrims = pilgrims.filter(p => {
      const hasMakkah = p.hotelMakkah && p.hotelMakkah !== 'Non assigné' && p.hotelMakkah !== 'En cours';
      return !hasMakkah;
    });

    if (unassignedPilgrims.length === 0) {
      alert("ℹ️ Tous les pèlerins enregistrés possèdent déjà un hôtel, un étage, une chambre et un lit assignés !");
      return;
    }

    if (!window.confirm(`⚡ Lancer le Dispatching Équilibré par Sexe & Mixité Générationnelle pour ${unassignedPilgrims.length} pèlerins ?\n\n- Séparation stricte Hommes / Femmes\n- Mixité des âges (1 Senior + 2 Adultes + 1 Jeune par chambre)\n- Interdiction d'isoler 4 personnes très âgées (>75 ans) dans la même chambre.`)) {
      return;
    }

    setIsDispatching(true);

    setTimeout(async () => {
      let assignedCount = 0;
      const updatedMockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');

      const makkahHotels = hotels.filter(h => h.city === 'La Mecque');
      const madinahHotels = hotels.filter(h => h.city === 'Médine');

      // Helper to classify gender
      const getGender = (p) => {
        if (p.gender === 'F' || p.sexe === 'F' || p.gender === 'female' || p.sexe === 'female') return 'F';
        const name = String(p.fullName || p.name || '').toLowerCase();
        if (name.includes('mme') || name.includes('fatou') || name.includes('diariatou') || name.includes('awa') || name.includes('aminata') || name.includes('mariama') || name.includes('khalida') || name.includes('khadija') || name.includes('astou') || name.includes('ndeye') || name.includes('adama')) return 'F';
        return 'M';
      };

      // Helper to compute age
      const getAge = (p) => {
        if (p.age) return parseInt(p.age);
        const seed = String(p.id || p.passportNumber || '50').charCodeAt(0);
        return 25 + (seed % 55); // 25 to 80
      };

      // Split pilgrims by Gender
      const maleList = unassignedPilgrims.filter(p => getGender(p) === 'M');
      const femaleList = unassignedPilgrims.filter(p => getGender(p) === 'F');

      const processGenderQueue = async (pilgrimGroup, genderLabel) => {
        // Classify by Age Bracket
        const seniors = pilgrimGroup.filter(p => getAge(p) >= 65);
        const adults = pilgrimGroup.filter(p => getAge(p) >= 40 && getAge(p) < 65);
        const youths = pilgrimGroup.filter(p => getAge(p) < 40);

        let roomNumberCounter = genderLabel === 'F' ? 201 : 101;
        let currentHotelIndex = 0;

        while (seniors.length > 0 || adults.length > 0 || youths.length > 0) {
          // Form a room of 3 to 4 beds
          const roomPilgrims = [];
          
          // Take 1 Senior if available (so elders have assistance)
          if (seniors.length > 0) roomPilgrims.push({ p: seniors.shift(), role: 'Senior' });
          // Take up to 2 Adults
          if (adults.length > 0) roomPilgrims.push({ p: adults.shift(), role: 'Adulte' });
          if (adults.length > 0 && roomPilgrims.length < 3) roomPilgrims.push({ p: adults.shift(), role: 'Adulte' });
          // Take 1 Youth if available to assist
          if (youths.length > 0 && roomPilgrims.length < 4) roomPilgrims.push({ p: youths.shift(), role: 'Jeune' });

          // Fill any remaining 4th bed spot
          while (roomPilgrims.length < 4 && (adults.length > 0 || youths.length > 0 || seniors.length > 0)) {
            if (adults.length > 0) roomPilgrims.push({ p: adults.shift(), role: 'Adulte' });
            else if (youths.length > 0) roomPilgrims.push({ p: youths.shift(), role: 'Jeune' });
            else if (seniors.length > 0 && roomPilgrims.filter(x => x.role === 'Senior').length < 2) roomPilgrims.push({ p: seniors.shift(), role: 'Senior' });
            else break;
          }

          if (roomPilgrims.length === 0) break;

          // Pick hotel
          const hotelM = makkahHotels[currentHotelIndex % makkahHotels.length] || { name: 'Hôtel Clock Tower Makkah' };
          const hotelN = madinahHotels[currentHotelIndex % madinahHotels.length] || { name: 'Hôtel Oberoi Madinah' };
          
          const floorNum = Math.floor(roomNumberCounter / 20) + 1;
          const floorText = (roomPilgrims.some(x => x.role === 'Senior') && floorNum > 2) ? '1er Étage (Priorité Senior RDC/Accès PMR)' : `Étage ${floorNum}`;

          // Assign room details & bed number to each pilgrim in this room
          for (let bIdx = 0; bIdx < roomPilgrims.length; bIdx++) {
            const item = roomPilgrims[bIdx];
            const p = item.p;
            const bedNumber = bIdx + 1;
            const ageVal = getAge(p);

            const roomDetailString = `Chambre ${roomNumberCounter} (${floorText}) • Lit N° ${bedNumber} (Chambre ${roomPilgrims.length} Lits - Aile ${genderLabel === 'F' ? 'Femmes' : 'Hommes'})`;

            const logisticsData = {
              hotelMakkah: hotelM.name,
              hotelMadinah: hotelN.name,
              roomNumber: roomDetailString,
              floor: floorText,
              bedNumber: `Lit N° ${bedNumber}`,
              visaStatus: p.visaStatus || 'issued'
            };

            if (onUpdateLogistics) {
              await onUpdateLogistics(p.id, logisticsData);
            }

            const idx = updatedMockList.findIndex(m => m && (m.id === p.id || String(m.id) === String(p.id) || m.passportNumber === p.passportNumber));
            if (idx !== -1) {
              updatedMockList[idx] = {
                ...updatedMockList[idx],
                ...logisticsData,
                age: ageVal
              };
            }

            assignedCount += 1;
          }

          roomNumberCounter += 1;
          if (roomNumberCounter % 20 === 0) currentHotelIndex += 1;
        }
      };

      await processGenderQueue(femaleList, 'F');
      await processGenderQueue(maleList, 'M');

      localStorage.setItem('mock_pilgrims', JSON.stringify(updatedMockList));
      setIsDispatching(false);

      alert(`🎉 Dispatching Équilibré Terminé avec succès !\n\n✅ ${assignedCount} pèlerin(s) ont été attribués à leur Hôtel, Étage, Chambre et Lit avec mixité générationnelle (1 Senior + Adultes/Jeunes par chambre pour l'entraide).`);
    }, 1200);
  };

  // Filtered Hotels list
  const filteredHotels = hotels.filter(h => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      (h.name && h.name.toLowerCase().includes(query)) ||
      (h.city && h.city.toLowerCase().includes(query)) ||
      (h.distanceHaram && h.distanceHaram.toLowerCase().includes(query));

    const matchesCity = cityFilter === 'all' || 
      (cityFilter === 'makkah' && h.city === 'La Mecque') ||
      (cityFilter === 'madinah' && h.city === 'Médine');

    const matchesSector = sectorFilter === 'all' ||
      (sectorFilter === 'etat' && h.sector.includes('État')) ||
      (sectorFilter === 'prive' && h.sector.includes('Privé'));

    return matchesSearch && matchesCity && matchesSector;
  });

  // If a hotel is selected for details, render full page room-by-room view
  if (selectedHotelForDetails) {
    const assignedPilgrims = getAssignedPilgrimsForHotel(selectedHotelForDetails.name);

    // Group pilgrims by room
    const roomsMap = {};
    assignedPilgrims.forEach(p => {
      const roomRaw = p.roomNumber || 'Chambre 101 (RDC) • Lit N° 1';
      let roomKey = roomRaw;
      if (roomRaw.includes('•')) {
        roomKey = roomRaw.split('•')[0].trim();
      }
      if (!roomsMap[roomKey]) {
        roomsMap[roomKey] = [];
      }
      roomsMap[roomKey].push(p);
    });

    const roomKeys = Object.keys(roomsMap);

    return (
      <div className="tab-container animate-fade-in" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Back navigation & Header */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setSelectedHotelForDetails(null)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1.5px solid #0A5C36',
              backgroundColor: 'rgba(10,92,54,0.08)',
              color: '#0A5C36',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}
          >
            ← Retour à la liste des Hôtels
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', backgroundColor: 'var(--surface)', padding: '28px', borderRadius: '24px', border: '2px solid #0A5C36', boxShadow: '0 10px 30px rgba(10,92,54,0.1)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, padding: '4px 12px', borderRadius: '12px', backgroundColor: selectedHotelForDetails.city === 'La Mecque' ? 'rgba(212,175,55,0.2)' : 'rgba(16,185,129,0.2)', color: selectedHotelForDetails.city === 'La Mecque' ? '#8A6D1B' : '#047857' }}>
                  {selectedHotelForDetails.city === 'La Mecque' ? '🕋 LA MECQUE (MAKKAH)' : '🕌 MÉDINE (MADINAH)'}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36' }}>
                  {selectedHotelForDetails.sector}
                </span>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                🏨 {selectedHotelForDetails.name}
              </h2>
              <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                📍 {selectedHotelForDetails.distanceHaram} • 🏢 Capacité : {selectedHotelForDetails.capacity} Lits ({selectedHotelForDetails.maleCapacity} Hommes / {selectedHotelForDetails.femaleCapacity} Femmes)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Plan de Logement par Chambre - ${selectedHotelForDetails.name}</title>
                        <style>
                          body { font-family: Arial, sans-serif; padding: 20px; }
                          h2 { color: #0A5C36; }
                          .room-box { border: 1px solid #0A5C36; margin-bottom: 20px; padding: 15px; border-radius: 8px; }
                          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                          th { background-color: #f2f2f2; }
                        </style>
                      </head>
                      <body>
                        <h2>REPUBLIQUE DU SENEGAL - DELEGATION GENERALE AU HAJJ</h2>
                        <h3>Manifeste d'Hébergement par Chambre : ${selectedHotelForDetails.name} (${selectedHotelForDetails.city})</h3>
                        <p><strong>Distance du Haram :</strong> ${selectedHotelForDetails.distanceHaram}</p>
                        <hr/>
                        ${roomKeys.map(rk => `
                          <div class="room-box">
                            <h4>🔑 ${rk}</h4>
                            <table>
                              <thead>
                                <tr>
                                  <th>Lit</th>
                                  <th>Nom Complet</th>
                                  <th>Passeport</th>
                                  <th>Téléphone</th>
                                  <th>Âge / Rôle</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${roomsMap[rk].map((p, idx) => `
                                  <tr>
                                    <td>Lit N° ${idx + 1}</td>
                                    <td>${p.fullName || p.name}</td>
                                    <td>${p.passportNumber || 'SN3455677'}</td>
                                    <td>${p.phone || '+221 77 000 00 00'}</td>
                                    <td>${(parseInt(p.age || 45) >= 65) ? 'Senior (>65 ans)' : 'Adulte/Jeune'}</td>
                                  </tr>
                                `).join('')}
                              </tbody>
                            </table>
                          </div>
                        `).join('')}
                        <script>window.print();</script>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#0A5C36',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(10,92,54,0.3)'
                }}
              >
                <Printer size={18} />
                🖨️ Imprimer la Liste par Chambre
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar for this hotel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div style={{ padding: '18px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Pèlerins Logés</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-dark)', margin: '4px 0 0 0' }}>
              {assignedPilgrims.length} pèlerins
            </h3>
          </div>

          <div style={{ padding: '18px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nombre de Chambres</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0A5C36', margin: '4px 0 0 0' }}>
              🔑 {roomKeys.length} chambres
            </h3>
          </div>

          <div style={{ padding: '18px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mixité Générationnelle</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#8A6D1B', margin: '4px 0 0 0' }}>
              👵 Seniors + 👨 Adultes + 🛡️ Jeunes
            </h3>
          </div>
        </div>

        {/* ROOMS LIST SECTION */}
        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔑</span> Répartition Officielle par Chambre et par Lit :
        </h3>

        {roomKeys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--surface)', borderRadius: '20px', border: '1px dashed var(--border)' }}>
            <Hotel size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text)' }}>Aucun pèlerin affecté à cet hôtel pour le moment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Veuillez lancer le dispatching automatique pour affecter des pèlerins dans cet hôtel.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {roomKeys.map((roomKey, rIdx) => {
              const pilgrimsInRoom = roomsMap[roomKey];
              const firstPilgrim = pilgrimsInRoom[0] || {};
              const genderLabel = (firstPilgrim.gender === 'F' || firstPilgrim.sexe === 'F' || String(firstPilgrim.gender).toLowerCase() === 'femme') ? 'Femmes' : 'Hommes';
              const hasSenior = pilgrimsInRoom.some(p => (parseInt(p.age || 45) >= 65));

              return (
                <div key={rIdx} style={{ backgroundColor: 'var(--surface)', borderRadius: '20px', border: '1.5px solid var(--border)', boxShadow: '0 8px 25px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                  {/* Room Header */}
                  <div style={{ padding: '18px 24px', backgroundColor: genderLabel === 'Femmes' ? 'rgba(236,72,153,0.06)' : 'rgba(59,130,246,0.06)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: genderLabel === 'Femmes' ? 'rgba(236,72,153,0.15)' : 'rgba(59,130,246,0.15)', color: genderLabel === 'Femmes' ? '#BE185D' : '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                        🔑
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                          {roomKey}
                        </h4>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Capacité : {pilgrimsInRoom.length} Lits occupés
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: genderLabel === 'Femmes' ? 'rgba(236,72,153,0.15)' : 'rgba(59,130,246,0.15)', color: genderLabel === 'Femmes' ? '#BE185D' : '#1D4ED8', fontWeight: 900, fontSize: '0.82rem' }}>
                        {genderLabel === 'Femmes' ? '👩 Aile Femmes Non-Mixte' : '👨 Aile Hommes Non-Mixte'}
                      </span>
                      {hasSenior && (
                        <span style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(212,175,55,0.25)', color: '#8A6D1B', fontWeight: 900, fontSize: '0.82rem' }}>
                          👵 Entraide Générationnelle Senior
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Room Beds Grid */}
                  <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    {pilgrimsInRoom.map((p, pIdx) => {
                      const ageVal = parseInt(p.age || 45);
                      const isSenior = ageVal >= 65;
                      const isYouth = ageVal < 40;
                      const bedNumber = p.bedNumber || `Lit N° ${pIdx + 1}`;

                      return (
                        <div key={p.id || pIdx} style={{ backgroundColor: 'var(--bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 900, padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(212,175,55,0.2)', color: '#8A6D1B' }}>
                                🛏️ {bedNumber}
                              </span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0A5C36' }}>
                                {ageVal} ans
                              </span>
                            </div>

                            <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary-dark)', display: 'block', margin: '4px 0 2px 0' }}>
                              👤 {p.fullName || p.name}
                            </strong>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>
                              🪪 Passeport : {p.passportNumber || 'SN3455677'}
                            </span>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                              📞 {p.phone || '+221 77 000 00 00'}
                            </span>
                          </div>

                          <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed var(--border)', fontSize: '0.78rem', fontWeight: 800, color: isSenior ? '#DC2626' : isYouth ? '#0A5C36' : '#1D4ED8' }}>
                            {isSenior ? '👵 Senior (>65 ans) — Personne à assister' : isYouth ? '🛡️ Référent / Accompagnant Jeune' : '👨 Co-chambreur Adulte'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="tab-container animate-fade-in" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              <Hotel size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                Gestion des Hôtels & Répartition par Sexe / Âge (DGP)
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Programmation des complexes hôteliers à Makkah/Madinah et algorithme d'affectation des chambres par Sexe et par Âge
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Dispatch Button */}
          <button
            onClick={handleRunHotelDispatch}
            disabled={isDispatching}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(212,175,55,0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={18} />
            {isDispatching ? "Algorithme Sexe & Âge en cours..." : "⚡ Dispatching Hôtelier (Sexe & Âge)"}
          </button>

          {/* Add Hotel Button */}
          <button
            onClick={handleOpenAddModal}
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0A5C36 0%, #042F1A 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(10,92,54,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} />
            Ajouter un Hôtel Agréé
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hôtels Renseignés DGP</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', fontWeight: 800, fontSize: '0.78rem' }}>Makkah & Madinah</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
            {hotels.length} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>hôtels 5★</span>
          </h3>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Répartition par Sexe</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#8A6D1B', fontWeight: 800, fontSize: '0.78rem' }}>Ailes distinctes</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#8A6D1B', margin: 0 }}>
            👨 Hommes / 👩 Femmes
          </h3>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priorité Âge (Seniors &gt;65 ans)</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 800, fontSize: '0.78rem' }}>Bas Édifices & RDC</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', margin: 0 }}>
            👵 Accès RDC & Proche Haram
          </h3>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Rechercher un hôtel (ex: Clock Tower, Pullman Zamzam, Oberoi...)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', fontSize: '0.92rem', fontWeight: 600 }}
          />
        </div>

        {/* City Filter */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCityFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: cityFilter === 'all' ? '2px solid #0A5C36' : '1px solid var(--border)',
              backgroundColor: cityFilter === 'all' ? 'rgba(10,92,54,0.1)' : 'var(--bg)',
              color: cityFilter === 'all' ? '#0A5C36' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Toutes les Villes ({hotels.length})
          </button>

          <button
            onClick={() => setCityFilter('makkah')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: cityFilter === 'makkah' ? '2px solid #0A5C36' : '1px solid var(--border)',
              backgroundColor: cityFilter === 'makkah' ? 'rgba(10,92,54,0.1)' : 'var(--bg)',
              color: cityFilter === 'makkah' ? '#0A5C36' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🕋 La Mecque ({hotels.filter(h => h.city === 'La Mecque').length})
          </button>

          <button
            onClick={() => setCityFilter('madinah')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: cityFilter === 'madinah' ? '2px solid #0A5C36' : '1px solid var(--border)',
              backgroundColor: cityFilter === 'madinah' ? 'rgba(10,92,54,0.1)' : 'var(--bg)',
              color: cityFilter === 'madinah' ? '#0A5C36' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🕌 Médine ({hotels.filter(h => h.city === 'Médine').length})
          </button>
        </div>

      </div>

      {/* Hotels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredHotels.map(hotel => {
          const assignedPilgrims = getAssignedPilgrimsForHotel(hotel.name);

          return (
            <div
              key={hotel.id}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        backgroundColor: hotel.city === 'La Mecque' ? 'rgba(212,175,55,0.15)' : 'rgba(16,185,129,0.15)',
                        color: hotel.city === 'La Mecque' ? '#8A6D1B' : '#047857'
                      }}>
                        {hotel.city === 'La Mecque' ? '🕋 La Mecque (Makkah)' : '🕌 Médine (Madinah)'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '8px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36' }}>
                        {hotel.sector}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary-dark)', margin: '8px 0 2px 0' }}>
                      🏨 {hotel.name}
                    </h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
                      📍 {hotel.distanceHaram}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditModal(hotel)}
                      title="Modifier cet hôtel"
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', cursor: 'pointer' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                      title="Supprimer cet hôtel"
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#DC2626' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Gender & Senior Allocation Rules Box */}
                <div style={{ backgroundColor: 'var(--bg)', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '18px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', marginBottom: '10px' }}>
                    <div style={{ backgroundColor: 'rgba(59,130,246,0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <strong style={{ color: '#1D4ED8', display: 'block' }}>👨 Aile Hommes</strong>
                      <span>Capacité : {hotel.maleCapacity} lits</span>
                    </div>

                    <div style={{ backgroundColor: 'rgba(236,72,153,0.08)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.2)' }}>
                      <strong style={{ color: '#BE185D', display: 'block' }}>👩 Aile Femmes</strong>
                      <span>Capacité : {hotel.femaleCapacity} lits</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '10px', fontSize: '0.8rem', color: 'var(--text)' }}>
                    <strong style={{ color: '#8A6D1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      👵 Priorité Âge & Seniors (&gt;65 ans) :
                    </strong>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                      {hotel.seniorPriorityFloor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedHotelForDetails(hotel)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #0A5C36',
                    backgroundColor: 'rgba(10,92,54,0.06)',
                    color: '#0A5C36',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Users size={15} />
                  Pèlerins Logés ({assignedPilgrims.length})
                </button>

                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Plan de Logement - ${hotel.name}</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h2 { color: #0A5C36; }
                            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                          </style>
                        </head>
                        <body>
                          <h2>REPUBLIQUE DU SENEGAL - DELEGATION GENERALE AU HAJJ</h2>
                          <h3>Manifeste d'Hébergement Officiel : ${hotel.name} (${hotel.city})</h3>
                          <p><strong>Distance du Haram :</strong> ${hotel.distanceHaram}</p>
                          <p><strong>Capacité :</strong> ${hotel.capacity} Lits (Hommes: ${hotel.maleCapacity} / Femmes: ${hotel.femaleCapacity})</p>
                          <hr/>
                          <h4>Pèlerins Assignés par Chambre, Sexe et Âge</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th>Passeport</th>
                                <th>Chambre Assignée</th>
                                <th>Priorité Âge</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${assignedPilgrims.map((p, idx) => `
                                <tr>
                                  <td>${idx + 1}</td>
                                  <td>${p.fullName || p.name}</td>
                                  <td>${p.passportNumber || 'N/A'}</td>
                                  <td>${p.roomNumber || 'Attribuée'}</td>
                                  <td>${(parseInt(p.age || 45) >= 65) ? 'SENIOR (>65 ans) RDC' : 'Standard'}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                          <script>window.print();</script>
                        </body>
                      </html>
                    `);
                    printWindow.document.close();
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={15} />
                  Imprimer Logement
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL 1: Add / Edit Hotel */}
      {showAddHotelModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '650px', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Hotel size={22} style={{ color: '#0A5C36' }} />
                {editingHotel ? `Modifier l'Hôtel` : 'Ajouter un Hôtel Agréé par la DGP'}
              </h3>
              <button onClick={() => setShowAddHotelModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <form onSubmit={handleSaveHotel} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Nom de l'Hôtel *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Hôtel Abraj Al Bait Clock Tower"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Ville Saint-Siège *</label>
                  <select
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  >
                    <option value="La Mecque">🕋 La Mecque (Makkah)</option>
                    <option value="Médine">🕌 Médine (Madinah)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Secteur Réservé *</label>
                  <select
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  >
                    <option value="Secteur État">🏛️ Secteur État (Registre Officiel)</option>
                    <option value="Secteur Privé">🏢 Secteur Privé (Agences Agréées)</option>
                    <option value="Tous Secteurs / Mixte">🌐 Tous Secteurs / Mixte</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Capacité Lits *</label>
                  <input
                    type="number"
                    required
                    min={20}
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value, maleCapacity: Math.floor(e.target.value / 2), femaleCapacity: Math.floor(e.target.value / 2) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Lits Hommes 👨</label>
                  <input
                    type="number"
                    required
                    value={formData.maleCapacity}
                    onChange={e => setFormData({ ...formData, maleCapacity: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Lits Femmes 👩</label>
                  <input
                    type="number"
                    required
                    value={formData.femaleCapacity}
                    onChange={e => setFormData({ ...formData, femaleCapacity: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Distance au Haram (Kaaba / Nabawi) *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: 100m du Haram (Face à la Mosquée)"
                  value={formData.distanceHaram}
                  onChange={e => setFormData({ ...formData, distanceHaram: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Règles Priorités Seniors (&gt;65 ans) & Bas Étages *</label>
                <input
                  type="text"
                  value={formData.seniorPriorityFloor}
                  onChange={e => setFormData({ ...formData, seniorPriorityFloor: e.target.value })}
                  placeholder="ex: Rez-de-Chaussée & 1er Étage pour les personnes âgées."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddHotelModal(false)}
                  style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#0A5C36', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(10,92,54,0.3)' }}
                >
                  {editingHotel ? 'Enregistrer les modifications' : 'Ajouter l\'Hôtel'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default HotelsTab;
