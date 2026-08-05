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

  // Automated Dispatching Engine (Distribution par Sexe & Âge)
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
      alert("ℹ️ Tous les pèlerins enregistrés possèdent déjà un hôtel et une chambre assignés !");
      return;
    }

    if (!window.confirm(`⚡ Lancer le Dispatching Automatique des Hôtels par Sexe et par Âge pour ${unassignedPilgrims.length} pèlerins ?`)) {
      return;
    }

    setIsDispatching(true);

    setTimeout(async () => {
      let assignedCount = 0;
      const updatedMockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');

      // Hotels for Makkah & Madinah
      const makkahHotels = hotels.filter(h => h.city === 'La Mecque');
      const madinahHotels = hotels.filter(h => h.city === 'Médine');

      // Sort Pilgrims by Age DESC (Seniors > 65 first) to give them priority for RDC / low floors and best hotels!
      const sortedPilgrims = [...unassignedPilgrims].sort((a, b) => {
        const ageA = parseInt(a.age || 45);
        const ageB = parseInt(b.age || 45);
        return ageB - ageA; // Older first
      });

      let roomCounterMale = 101;
      let roomCounterFemale = 201;

      for (const p of sortedPilgrims) {
        const age = parseInt(p.age || 45);
        const isSenior = age >= 65;
        const gender = (p.gender || p.sexe || (p.fullName && (p.fullName.includes('Mme') || p.fullName.includes('Diariatou') || p.fullName.includes('Awa') || p.fullName.includes('Fatou'))) ? 'F' : 'M');
        const isPrivate = p.regSector === 'private' || p.sector === 'private' || p.selectedAgencyId;

        // Pick Makkah Hotel
        const bestMakkah = makkahHotels.find(h => isPrivate ? h.sector.includes('Privé') : h.sector.includes('État')) || makkahHotels[0] || { name: 'Hôtel Clock Tower Makkah' };
        
        // Pick Madinah Hotel
        const bestMadinah = madinahHotels.find(h => isPrivate ? h.sector.includes('Privé') : h.sector.includes('État')) || madinahHotels[0] || { name: 'Hôtel Oberoi Madinah' };

        // Room assignment logic based on Gender and Age
        let roomNum = '';
        if (gender === 'F') {
          const floorText = isSenior ? '1er Étage (Priorité Senior PMR)' : `${Math.floor(roomCounterFemale / 50) + 2}ème Étage`;
          roomNum = `Chambre F-${roomCounterFemale} (Aile Femmes • ${floorText})`;
          roomCounterFemale += 1;
        } else {
          const floorText = isSenior ? 'RDC (Priorité Senior PMR)' : `${Math.floor(roomCounterMale / 50) + 2}ème Étage`;
          roomNum = `Chambre H-${roomCounterMale} (Aile Hommes • ${floorText})`;
          roomCounterMale += 1;
        }

        const logisticsData = {
          hotelMakkah: bestMakkah.name,
          hotelMadinah: bestMadinah.name,
          roomNumber: roomNum,
          visaStatus: p.visaStatus || 'issued'
        };

        if (onUpdateLogistics) {
          await onUpdateLogistics(p.id, logisticsData);
        }

        // Update local storage
        const idx = updatedMockList.findIndex(m => m && (m.id === p.id || String(m.id) === String(p.id) || m.passportNumber === p.passportNumber));
        if (idx !== -1) {
          updatedMockList[idx] = {
            ...updatedMockList[idx],
            ...logisticsData
          };
        }

        assignedCount += 1;
      }

      localStorage.setItem('mock_pilgrims', JSON.stringify(updatedMockList));
      setIsDispatching(false);

      alert(`🎉 Dispatching Hôtelier Terminé !\n\n✅ ${assignedCount} pèlerin(s) ont été affectés par Sexe (Ailes Hommes/Femmes) et par Âge (Priorité Seniors >65 ans sur les bas étages).`);
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

      {/* MODAL 2: View Assigned Pilgrims for a Hotel */}
      {selectedHotelForDetails && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '800px', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                  Manifeste d'Hébergement — {selectedHotelForDetails.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedHotelForDetails.city} • {selectedHotelForDetails.distanceHaram}
                </span>
              </div>
              <button onClick={() => setSelectedHotelForDetails(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {(() => {
              const list = getAssignedPilgrimsForHotel(selectedHotelForDetails.name);
              if (list.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                    <Hotel size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Aucun pèlerin affecté à cet hôtel pour le moment</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Cliquez sur <strong>« ⚡ Dispatching Hôtelier (Sexe & Âge) »</strong> pour répartir automatiquement les pèlerins dans cet hôtel.
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', padding: '0 8px' }}>
                    <span>PÈLERIN</span>
                    <span>CHAMBRE & PRIORITÉ ÂGE</span>
                  </div>

                  {list.map((p, idx) => {
                    const age = parseInt(p.age || 45);
                    const isSenior = age >= 65;

                    return (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                            {idx + 1}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.98rem', color: 'var(--primary-dark)', display: 'block' }}>{p.fullName || p.name}</strong>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Passeport : {p.passportNumber || 'SN9283741'}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text)', display: 'block' }}>
                            {p.roomNumber || 'Chambre attribuée'}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', backgroundColor: isSenior ? 'rgba(212,175,55,0.2)' : 'rgba(10,92,54,0.1)', color: isSenior ? '#8A6D1B' : '#0A5C36' }}>
                            {isSenior ? `👵 Senior (${age} ans) • RDC` : ` Standard (${age} ans)`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedHotelForDetails(null)}
                style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#0A5C36', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer' }}
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

export default HotelsTab;
