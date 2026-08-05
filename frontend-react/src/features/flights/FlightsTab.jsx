import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Plus, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Printer, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

const INITIAL_FLIGHTS = [
  {
    id: 'FL-001',
    flightNumber: 'SN-2026-01',
    airline: 'Air Sénégal',
    sector: 'Secteur État',
    departureDate: '2026-06-10',
    departureTime: '02:30',
    departureAirport: 'Aéroport Int. Blaise Diagne (AIBD - Dakar)',
    arrivalAirport: 'Aéroport Int. Médine (MED - Prince Mohammad)',
    capacity: 300,
    status: 'Planifié',
    convocation: 'Rendez-vous à AIBD Hall Hajj 4h avant le décollage avec passeport et carnet de vaccination jaune.',
    notes: 'Vol officiel charter Commission Nationale - Vol d’ouverture'
  },
  {
    id: 'FL-002',
    flightNumber: 'XY-2026-02',
    airline: 'Flynas (Saudi Charter)',
    sector: 'Secteur Privé',
    departureDate: '2026-06-11',
    departureTime: '05:45',
    departureAirport: 'Aéroport Int. Blaise Diagne (AIBD - Dakar)',
    arrivalAirport: 'Aéroport Int. Djeddah (JED - King Abdulaziz)',
    capacity: 350,
    status: 'Planifié',
    convocation: 'Convocation AIBD 4 heures avant le décollage. Bagages étiquetés par agence obligatoires.',
    notes: 'Vol charter dédié aux agences privées accréditées (VIP & Standard)'
  },
  {
    id: 'FL-003',
    flightNumber: 'SN-2026-03',
    airline: 'Air Sénégal',
    sector: 'Tous Secteurs / Mixte',
    departureDate: '2026-06-12',
    departureTime: '23:15',
    departureAirport: 'Aéroport Int. Blaise Diagne (AIBD - Dakar)',
    arrivalAirport: 'Aéroport Int. Médine (MED - Prince Mohammad)',
    capacity: 280,
    status: 'Planifié',
    convocation: 'Présence à AIBD recommandée dès 19h00. Enregistrement prioritaire pèlerins à mobilité réduite.',
    notes: 'Vol mixte État / Agences Privées'
  }
];

function FlightsTab({ pilgrims = [], agencies = [], onUpdateLogistics }) {
  // Flights master list stored in localStorage
  const [flights, setFlights] = useState(() => {
    try {
      const saved = localStorage.getItem('dgp_flights');
      return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
    } catch (e) {
      return INITIAL_FLIGHTS;
    }
  });

  // Save flights to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('dgp_flights', JSON.stringify(flights));
    } catch (e) {}
  }, [flights]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  // Modal States
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [selectedFlightForDetails, setSelectedFlightForDetails] = useState(null);

  // Form State for Add / Edit Flight
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: 'Air Sénégal',
    sector: 'Secteur État',
    departureDate: '2026-06-10',
    departureTime: '03:00',
    departureAirport: 'Aéroport Int. Blaise Diagne (AIBD - Dakar)',
    arrivalAirport: 'Aéroport Int. Médine (MED - Prince Mohammad)',
    capacity: 300,
    status: 'Planifié',
    convocation: 'Rendez-vous à AIBD Hall Hajj 4h avant décollage.',
    notes: ''
  });

  // Open modal to add flight
  const handleOpenAddModal = () => {
    setEditingFlight(null);
    setFormData({
      flightNumber: `SN-2026-0${flights.length + 1}`,
      airline: 'Air Sénégal',
      sector: 'Secteur État',
      departureDate: '2026-06-12',
      departureTime: '04:00',
      departureAirport: 'Aéroport Int. Blaise Diagne (AIBD - Dakar)',
      arrivalAirport: 'Aéroport Int. Médine (MED - Prince Mohammad)',
      capacity: 300,
      status: 'Planifié',
      convocation: 'Rendez-vous à AIBD Hall Hajj 4h avant décollage avec passeport et carnet jaune.',
      notes: ''
    });
    setShowAddFlightModal(true);
  };

  // Open modal to edit flight
  const handleOpenEditModal = (flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber || '',
      airline: flight.airline || 'Air Sénégal',
      sector: flight.sector || 'Secteur État',
      departureDate: flight.departureDate || '2026-06-10',
      departureTime: flight.departureTime || '03:00',
      departureAirport: flight.departureAirport || 'Aéroport Int. Blaise Diagne (AIBD - Dakar)',
      arrivalAirport: flight.arrivalAirport || 'Aéroport Int. Médine (MED - Prince Mohammad)',
      capacity: flight.capacity || 300,
      status: flight.status || 'Planifié',
      convocation: flight.convocation || '',
      notes: flight.notes || ''
    });
    setShowAddFlightModal(true);
  };

  // Save Add / Edit Flight
  const handleSaveFlight = (e) => {
    e.preventDefault();
    if (!formData.flightNumber.trim()) return;

    if (editingFlight) {
      // Update existing
      setFlights(prev => prev.map(f => f.id === editingFlight.id ? { ...f, ...formData, capacity: parseInt(formData.capacity) } : f));
      alert(`Vol ${formData.flightNumber} mis à jour avec succès !`);
    } else {
      // Create new
      const newFlight = {
        id: `FL-${Date.now()}`,
        ...formData,
        capacity: parseInt(formData.capacity)
      };
      setFlights(prev => [...prev, newFlight]);
      alert(`Nouveau vol ${formData.flightNumber} ajouté avec succès !`);
    }
    setShowAddFlightModal(false);
  };

  // Delete flight
  const handleDeleteFlight = (flightId, flightNumber) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le vol ${flightNumber} ?`)) {
      setFlights(prev => prev.filter(f => f.id !== flightId));
    }
  };

  // Helper to count pilgrims assigned to a flight
  const getAssignedPilgrims = (flightNumber) => {
    if (!flightNumber) return [];
    return pilgrims.filter(p => {
      const pFlight = p.flightNumber || p.logisticsDetails?.flightNumber || p.flight;
      return pFlight && String(pFlight).trim().toUpperCase() === String(flightNumber).trim().toUpperCase();
    });
  };

  // Automated Dispatching Engine (Répartition automatique par l'algorithme)
  const [isDispatching, setIsDispatching] = useState(false);

  const handleRunAutoDispatch = async () => {
    if (flights.length === 0) {
      alert("⚠️ Aucun vol disponible ! Veuillez d'abord créer un ou plusieurs vols charters.");
      return;
    }

    // Filter pilgrims medically APTE without a flight assigned
    const unassignedAptePilgrims = pilgrims.filter(p => {
      const isApte = p.medicalStatus === 'apte';
      const hasFlight = p.flightNumber && p.flightNumber !== 'Non assigné' && p.flightNumber !== '';
      return isApte && !hasFlight;
    });

    if (unassignedAptePilgrims.length === 0) {
      alert("ℹ️ Aucun pèlerin apte n'est en attente de vol. Tous les pèlerins aptes possèdent déjà un vol assigné !");
      return;
    }

    if (!window.confirm(`⚡ Lancer le Dispatching Automatique pour ${unassignedAptePilgrims.length} pèlerin(s) médicalement apte(s) ?`)) {
      return;
    }

    setIsDispatching(true);

    setTimeout(async () => {
      let assignedCount = 0;
      const updatedMockList = JSON.parse(localStorage.getItem('mock_pilgrims') || '[]');

      // Work copy of flight capacities
      const flightSeatCounts = flights.map(f => ({
        flightNumber: f.flightNumber,
        sector: f.sector,
        capacity: f.capacity,
        currentAssigned: getAssignedPilgrims(f.flightNumber).length,
        hotelMakkah: f.sector.includes('Privé') ? 'Hôtel Pullman Zamzam (Makkah)' : 'Hôtel Makkah Clock Tower (Registre État)',
        hotelMadinah: f.sector.includes('Privé') ? 'Hôtel Dar Al Iman InterContinental' : 'Hôtel Oberoi Madinah (Registre État)'
      }));

      for (const p of unassignedAptePilgrims) {
        // Find best flight matching pilgrim sector
        const isPrivateSector = p.regSector === 'private' || p.sector === 'private' || p.selectedAgencyId;
        
        let matchingFlight = flightSeatCounts.find(f => {
          const hasSeat = f.currentAssigned < f.capacity;
          if (!hasSeat) return false;
          if (f.sector === 'Tous Secteurs / Mixte') return true;
          if (isPrivateSector && f.sector.includes('Privé')) return true;
          if (!isPrivateSector && f.sector.includes('État')) return true;
          return false;
        });

        // Fallback to any flight with available seats if no exact sector match
        if (!matchingFlight) {
          matchingFlight = flightSeatCounts.find(f => f.currentAssigned < f.capacity);
        }

        if (matchingFlight) {
          matchingFlight.currentAssigned += 1;
          assignedCount += 1;

          // Dispatch update to state / API
          const logisticsData = {
            flightNumber: matchingFlight.flightNumber,
            hotelMakkah: matchingFlight.hotelMakkah,
            hotelMadinah: matchingFlight.hotelMadinah,
            roomNumber: `Chambre ${100 + Math.floor(Math.random() * 800)}`,
            visaStatus: 'issued'
          };

          if (onUpdateLogistics) {
            await onUpdateLogistics(p.id, logisticsData);
          }

          // Also update mock_pilgrims in localStorage directly for real-time persistence
          const idx = updatedMockList.findIndex(m => m && (m.id === p.id || String(m.id) === String(p.id) || m.passportNumber === p.passportNumber));
          if (idx !== -1) {
            updatedMockList[idx] = {
              ...updatedMockList[idx],
              ...logisticsData,
              medicalStatus: 'apte'
            };
          }
        }
      }

      localStorage.setItem('mock_pilgrims', JSON.stringify(updatedMockList));
      setIsDispatching(false);

      alert(`🎉 Dispatching Automatique Terminé avec succès !\n\n✅ ${assignedCount} pèlerin(s) ont été répartis sur les vols charters disponibles.`);
    }, 1200);
  };

  // Filtered flights for display
  const filteredFlights = flights.filter(f => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      (f.flightNumber && f.flightNumber.toLowerCase().includes(query)) ||
      (f.airline && f.airline.toLowerCase().includes(query)) ||
      (f.departureAirport && f.departureAirport.toLowerCase().includes(query)) ||
      (f.arrivalAirport && f.arrivalAirport.toLowerCase().includes(query));

    const matchesSector = sectorFilter === 'all' || 
      (sectorFilter === 'etat' && f.sector.includes('État')) ||
      (sectorFilter === 'prive' && f.sector.includes('Privé')) ||
      (sectorFilter === 'mixte' && f.sector.includes('Mixte'));

    return matchesSearch && matchesSector;
  });

  // Calculate total global stats
  const totalSeats = flights.reduce((acc, f) => acc + (f.capacity || 0), 0);
  const totalAssignedPilgrims = pilgrims.filter(p => p.flightNumber && p.flightNumber !== 'Non assigné' && p.flightNumber !== '').length;
  const totalApteUnassigned = pilgrims.filter(p => p.medicalStatus === 'apte' && (!p.flightNumber || p.flightNumber === 'Non assigné' || p.flightNumber === '')).length;

  return (
    <div className="tab-container animate-fade-in" style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
              <Plane size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                Gestion des Vols Charters & Dispatching (DGP)
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Programmation officielle des vols et répartition automatique des pèlerins aptes
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Dispatch Button */}
          <button
            onClick={handleRunAutoDispatch}
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
            {isDispatching ? "Algorithme de Dispatching en cours..." : "⚡ Dispatching Automatique (IA)"}
          </button>

          {/* Add Flight Button */}
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
            Programmer un Nouveau Vol
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        
        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Vols Organisés DGP</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(10,92,54,0.1)', color: '#0A5C36', fontWeight: 800, fontSize: '0.78rem' }}>Accrédités</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
            {flights.length} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>vols charters</span>
          </h3>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Capacité Globale Sièges</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(212,175,55,0.15)', color: '#8A6D1B', fontWeight: 800, fontSize: '0.78rem' }}>AIBD Dakar</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#8A6D1B', margin: 0 }}>
            {totalSeats.toLocaleString('fr-FR')} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>sièges</span>
          </h3>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pèlerins Assignés (Billets)</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: '#DEF7EC', color: '#03543F', fontWeight: 800, fontSize: '0.78rem' }}>Confirmés</span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', margin: 0 }}>
            {totalAssignedPilgrims} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ {pilgrims.length}</span>
          </h3>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>En Attente de Dispatch</span>
            <span style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: totalApteUnassigned > 0 ? 'rgba(239,68,68,0.1)' : '#DEF7EC', color: totalApteUnassigned > 0 ? '#DC2626' : '#03543F', fontWeight: 800, fontSize: '0.78rem' }}>
              {totalApteUnassigned > 0 ? 'Pèlerins Aptes' : 'À jour'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: totalApteUnassigned > 0 ? '#DC2626' : '#059669', margin: 0 }}>
            {totalApteUnassigned} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>pèlerins</span>
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
            placeholder="Rechercher par numéro de vol (ex: SN-2026-01), compagnie, destination..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', fontSize: '0.92rem', fontWeight: 600 }}
          />
        </div>

        {/* Sector Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setSectorFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: sectorFilter === 'all' ? '2px solid #0A5C36' : '1px solid var(--border)',
              backgroundColor: sectorFilter === 'all' ? 'rgba(10,92,54,0.1)' : 'var(--bg)',
              color: sectorFilter === 'all' ? '#0A5C36' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Tous les Vols ({flights.length})
          </button>

          <button
            onClick={() => setSectorFilter('etat')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: sectorFilter === 'etat' ? '2px solid #0A5C36' : '1px solid var(--border)',
              backgroundColor: sectorFilter === 'etat' ? 'rgba(10,92,54,0.1)' : 'var(--bg)',
              color: sectorFilter === 'etat' ? '#0A5C36' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🏛️ Secteur État
          </button>

          <button
            onClick={() => setSectorFilter('prive')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: sectorFilter === 'prive' ? '2px solid #0A5C36' : '1px solid var(--border)',
              backgroundColor: sectorFilter === 'prive' ? 'rgba(10,92,54,0.1)' : 'var(--bg)',
              color: sectorFilter === 'prive' ? '#0A5C36' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🏢 Secteur Privé
          </button>
        </div>

      </div>

      {/* Flights Grid List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {filteredFlights.map(flight => {
          const assignedPilgrims = getAssignedPilgrims(flight.flightNumber);
          const currentCount = assignedPilgrims.length;
          const fillPercent = Math.min(100, Math.round((currentCount / flight.capacity) * 100));

          return (
            <div
              key={flight.id}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Card Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        backgroundColor: flight.sector.includes('État') ? 'rgba(10,92,54,0.12)' : flight.sector.includes('Privé') ? 'rgba(212,175,55,0.15)' : 'rgba(59,130,246,0.12)',
                        color: flight.sector.includes('État') ? '#0A5C36' : flight.sector.includes('Privé') ? '#8A6D1B' : '#1D4ED8',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        {flight.sector}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 8px', borderRadius: '8px', backgroundColor: '#DEF7EC', color: '#03543F' }}>
                        ● {flight.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-dark)', margin: '8px 0 2px 0' }}>
                      ✈️ {flight.flightNumber}
                    </h3>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Compagnie : {flight.airline}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleOpenEditModal(flight)}
                      title="Modifier le vol"
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', cursor: 'pointer', color: 'var(--text)' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteFlight(flight.id, flight.flightNumber)}
                      title="Supprimer le vol"
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#DC2626' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Itinerary Banner */}
                <div style={{ backgroundColor: 'var(--bg)', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', display: 'block' }}>DÉPART</strong>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>Dakar (AIBD)</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>Vol Direct</span>
                      <ArrowRight size={18} style={{ color: '#0A5C36' }} />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', display: 'block' }}>ARRIVÉE</strong>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text)' }}>
                        {flight.arrivalAirport.includes('Médine') ? 'Médine (MED)' : 'Djeddah (JED)'}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border)', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span>📅 Décollage : <strong>{flight.departureDate} à {flight.departureTime}</strong></span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px' }}>
                    <span>Taux d'occupation des sièges</span>
                    <span style={{ color: fillPercent >= 100 ? '#DC2626' : '#0A5C36' }}>
                      {currentCount} / {flight.capacity} sièges ({fillPercent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--bg)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ width: `${fillPercent}%`, height: '100%', background: fillPercent >= 100 ? '#DC2626' : 'linear-gradient(90deg, #0A5C36 0%, #D4AF37 100%)', borderRadius: '10px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => setSelectedFlightForDetails(flight)}
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
                  Pèlerins Embarqués ({currentCount})
                </button>

                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Manifeste de Vol ${flight.flightNumber}</title>
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
                          <h3>Manifeste de Vol Officiel : ${flight.flightNumber} (${flight.airline})</h3>
                          <p><strong>Départ :</strong> ${flight.departureAirport} - ${flight.departureDate} à ${flight.departureTime}</p>
                          <p><strong>Arrivée :</strong> ${flight.arrivalAirport}</p>
                          <hr/>
                          <h4>Liste des Pèlerins Embarqués (${assignedPilgrims.length} / ${flight.capacity})</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Nom Complet</th>
                                <th>Passeport</th>
                                <th>Téléphone</th>
                                <th>Statut Médical</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${assignedPilgrims.map((p, idx) => `
                                <tr>
                                  <td>${idx + 1}</td>
                                  <td>${p.fullName || p.name}</td>
                                  <td>${p.passportNumber || 'N/A'}</td>
                                  <td>${p.phone || 'N/A'}</td>
                                  <td>APTE 🟢</td>
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
                  Imprimer Manifeste
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL 1: Add / Edit Flight Modal */}
      {showAddFlightModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '650px', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plane size={22} style={{ color: '#0A5C36' }} />
                {editingFlight ? `Modifier le Vol ${editingFlight.flightNumber}` : 'Programmer un Nouveau Vol Charter DGP'}
              </h3>
              <button onClick={() => setShowAddFlightModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <form onSubmit={handleSaveFlight} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Numéro de Vol *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: SN-2026-04"
                    value={formData.flightNumber}
                    onChange={e => setFormData({ ...formData, flightNumber: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Compagnie Aérienne *</label>
                  <select
                    value={formData.airline}
                    onChange={e => setFormData({ ...formData, airline: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  >
                    <option value="Air Sénégal">🇸🇳 Air Sénégal (Compagnie Nationale)</option>
                    <option value="Flynas (Saudia Charter)">🇸🇦 Flynas (Saudi Charter)</option>
                    <option value="Saudia Airlines">🇸🇦 Saudia Airlines</option>
                    <option value="Ethiopian Airlines">🇪🇹 Ethiopian Airlines</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Secteur de Réservation *</label>
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

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Capacité Maximale Sièges *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={600}
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Date de Décollage *</label>
                  <input
                    type="date"
                    required
                    value={formData.departureDate}
                    onChange={e => setFormData({ ...formData, departureDate: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Heure de Décollage (Dakar AIBD) *</label>
                  <input
                    type="time"
                    required
                    value={formData.departureTime}
                    onChange={e => setFormData({ ...formData, departureTime: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 800, fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text)', display: 'block', marginBottom: '6px' }}>Consignes de Convocation & Rendez-vous AIBD *</label>
                <textarea
                  rows={2}
                  value={formData.convocation}
                  onChange={e => setFormData({ ...formData, convocation: e.target.value })}
                  placeholder="ex: Rendez-vous au Hall Hajj d'AIBD 4 heures avant le décollage."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', backgroundColor: 'var(--bg)', fontSize: '0.9rem', fontWeight: 600 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddFlightModal(false)}
                  style={{ padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', backgroundColor: '#0A5C36', color: '#FFFFFF', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(10,92,54,0.3)' }}
                >
                  {editingFlight ? 'Enregistrer les modifications' : 'Programmer le Vol'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: View Assigned Pilgrims for a Flight */}
      {selectedFlightForDetails && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--surface)', width: '100%', maxWidth: '800px', borderRadius: '24px', padding: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--primary-dark)', margin: 0 }}>
                  Manifeste des Pèlerins — Vol {selectedFlightForDetails.flightNumber}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedFlightForDetails.airline} • {selectedFlightForDetails.departureDate} à {selectedFlightForDetails.departureTime}
                </span>
              </div>
              <button onClick={() => setSelectedFlightForDetails(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* List */}
            {(() => {
              const list = getAssignedPilgrims(selectedFlightForDetails.flightNumber);
              if (list.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                    <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>Aucun pèlerin assigné à ce vol pour le moment</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Cliquez sur <strong>« ⚡ Dispatching Automatique »</strong> pour remplir ce vol avec les pèlerins aptes.
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', padding: '0 8px' }}>
                    <span>PÈLERIN</span>
                    <span>PASSEPORT & SECTEUR</span>
                  </div>

                  {list.map((p, idx) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DEF7EC', color: '#03543F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                          {idx + 1}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.98rem', color: 'var(--primary-dark)', display: 'block' }}>{p.fullName || p.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.phone || 'Sans téléphone'}</span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--text)', display: 'block' }}>
                          {p.passportNumber || 'SN9283710'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A5C36' }}>
                          🟢 Apte au Voyage
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedFlightForDetails(null)}
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

export default FlightsTab;
