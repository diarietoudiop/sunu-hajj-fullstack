import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SACRED_SITES } from '../services/mockData';

export default function MapScreen({ pilgrim, onTriggerSOS }) {
  const [selectedCity, setSelectedCity] = useState('Mina'); // 'Mina' | 'Makkah' | 'Arafat' | 'Madinah'
  const [selectedSite, setSelectedSite] = useState(SACRED_SITES[2]); // Default Mina tent

  const filteredSites = SACRED_SITES.filter(s => s.city === selectedCity);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>🗺️ Carte GPS & Lieux Saints</Text>
        <Text style={styles.headerSub}>Localisation de votre hôtel, tente à Mina et poste médical</Text>
      </View>

      {/* City Switcher Tabs */}
      <View style={styles.tabsRow}>
        {[
          { id: 'Mina', label: '🎪 Mina' },
          { id: 'Makkah', label: '🕋 Makkah' },
          { id: 'Arafat', label: '⛰️ Arafat' },
          { id: 'Madinah', label: '🕌 Madinah' }
        ].map((city) => (
          <TouchableOpacity
            key={city.id}
            style={[styles.cityTab, selectedCity === city.id && styles.cityTabActive]}
            onPress={() => {
              setSelectedCity(city.id);
              const firstInCity = SACRED_SITES.find(s => s.city === city.id);
              if (firstInCity) setSelectedSite(firstInCity);
            }}
          >
            <Text style={[styles.cityTabText, selectedCity === city.id && styles.cityTabTextActive]}>
              {city.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vector Vectorized Map Graphic Preview */}
      <View style={styles.mapGraphicCard}>
        <View style={styles.mapHeaderRow}>
          <Text style={styles.mapHeaderTitle}>📍 GPS Satellite • {selectedCity}</Text>
          <Text style={styles.gpsActivePill}>🟢 Précision 3m</Text>
        </View>

        <View style={styles.mapCanvasPlaceholder}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>{selectedSite.icon}</Text>
          <Text style={styles.siteCanvasName}>{selectedSite.name}</Text>
          <Text style={styles.siteCanvasSub}>{selectedSite.city} • {selectedSite.distance}</Text>
        </View>
      </View>

      {/* Sites List */}
      <Text style={styles.sectionTitle}>Points de Repère {selectedCity} :</Text>
      {filteredSites.map((site) => {
        const isSelected = selectedSite.id === site.id;
        return (
          <TouchableOpacity
            key={site.id}
            style={[styles.siteCard, isSelected && styles.siteCardSelected]}
            onPress={() => setSelectedSite(site)}
          >
            <Text style={{ fontSize: 26, marginRight: 12 }}>{site.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.siteName}>{site.name}</Text>
              <Text style={styles.siteDesc}>{site.desc}</Text>
              <Text style={styles.siteDist}>📏 {site.distance}</Text>
            </View>
            <Text style={{ fontSize: 16, color: '#94a3b8' }}>›</Text>
          </TouchableOpacity>
        );
      })}

      {/* Open Google Maps Button */}
      <TouchableOpacity
        style={styles.gmapsBtn}
        onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${selectedSite.lat},${selectedSite.lng}`)}
      >
        <Text style={styles.gmapsBtnText}>🌐 Ouvrir la position dans Google Maps</Text>
      </TouchableOpacity>

      {/* SOS Button inside Map */}
      <TouchableOpacity style={styles.sosCardBtn} onPress={onTriggerSOS}>
        <Text style={{ fontSize: 22, marginRight: 10 }}>🚨</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.sosCardTitle}>Alerte Pèlerin Égaré (SOS)</Text>
          <Text style={styles.sosCardSub}>Déclencher la géolocalisation pour la Brigade DGP</Text>
        </View>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  headerBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#042F1A'
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  cityTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center'
  },
  cityTabActive: {
    backgroundColor: '#042F1A',
    borderColor: '#042F1A'
  },
  cityTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155'
  },
  cityTabTextActive: {
    color: '#ffffff'
  },
  mapGraphicCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    overflow: 'hidden'
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  mapHeaderTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  gpsActivePill: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '700'
  },
  mapCanvasPlaceholder: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)'
  },
  siteCanvasName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  },
  siteCanvasSub: {
    color: '#D4AF37',
    fontSize: 11,
    marginTop: 2
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10
  },
  siteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  siteCardSelected: {
    borderColor: '#D4AF37',
    borderWidth: 2,
    backgroundColor: '#fffdf5'
  },
  siteName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  siteDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  siteDist: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 4
  },
  gmapsBtn: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
    alignItems: 'center',
    marginBottom: 14
  },
  gmapsBtnText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '800'
  },
  sosCardBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  sosCardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900'
  },
  sosCardSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2
  }
});
