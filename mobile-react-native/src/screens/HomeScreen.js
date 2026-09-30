import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ pilgrim, onNavigate, onTriggerSOS }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      {/* Pilgrim Profile Banner */}
      <View style={styles.profileBanner}>
        <View style={styles.bannerHeader}>
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 24 }}>🇸🇳</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pilgrimName}>{pilgrim.fullName}</Text>
            <Text style={styles.passportText}>Passeport : {pilgrim.passportNumber}</Text>
          </View>
          <View style={styles.approvedPill}>
            <Text style={styles.approvedText}>🟢 VALIDÉ</Text>
          </View>
        </View>

        {/* Action Buttons Row inside Banner */}
        <View style={styles.bannerActions}>
          <TouchableOpacity 
            style={styles.badgeBtn}
            onPress={() => onNavigate('badge')}
          >
            <Text style={styles.badgeBtnText}>🪪 Badge & Pass Nusuk</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.sosBtn}
            onPress={onTriggerSOS}
          >
            <Text style={styles.sosBtnText}>🚨 ALERTE SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5-Step Preparation Roadmap */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🗺️ Mon Avancement de Préparation</Text>
        <Text style={styles.cardSub}>Suivi en temps réel de votre dossier Sunu Hajj</Text>

        <View style={styles.stepsContainer}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <Text style={styles.stepCircleText}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Inscription</Text>
            <Text style={styles.stepStatus}>Validée</Text>
          </View>

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <Text style={styles.stepCircleText}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Médical</Text>
            <Text style={styles.stepStatus}>APTE ({pilgrim.bloodType})</Text>
          </View>

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <Text style={styles.stepCircleText}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Nusuk 🇸🇦</Text>
            <Text style={styles.stepStatus}>Synchro</Text>
          </View>

          {/* Step 4 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <Text style={styles.stepCircleText}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Visa Hajj</Text>
            <Text style={styles.stepStatus}>Émis</Text>
          </View>

          {/* Step 5 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <Text style={styles.stepCircleText}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Vol & Hôtel</Text>
            <Text style={styles.stepStatus}>Assignés</Text>
          </View>
        </View>
      </View>

      {/* Quick Access Menu Cards */}
      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuCard} onPress={() => onNavigate('map')}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>🗺️</Text>
          <Text style={styles.menuCardTitle}>Carte GPS & SOS</Text>
          <Text style={styles.menuCardSub}>Mina, Makkah & Arafat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => onNavigate('logistics')}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>✈️</Text>
          <Text style={styles.menuCardTitle}>Vols & Hôtels</Text>
          <Text style={styles.menuCardSub}>Chambre & Voisins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => onNavigate('badge')}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>🪪</Text>
          <Text style={styles.menuCardTitle}>Pass Voyage</Text>
          <Text style={styles.menuCardSub}>QR Code Saoudien</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => onNavigate('vault')}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>🔐</Text>
          <Text style={styles.menuCardTitle}>Coffre-fort</Text>
          <Text style={styles.menuCardSub}>SMS Famille & Pièces</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Contact Card */}
      <View style={[styles.card, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
        <Text style={[styles.cardTitle, { color: '#166534' }]}>📞 Proche à contacter au Sénégal</Text>
        <Text style={{ fontSize: 13, color: '#15803d', marginTop: 4 }}>
          {pilgrim.emergencyContact.name} ({pilgrim.emergencyContact.relation})
        </Text>
        <Text style={{ fontSize: 15, fontWeight: '900', color: '#166534', marginTop: 2 }}>
          {pilgrim.emergencyContact.phone}
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  profileBanner: {
    backgroundColor: '#042F1A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pilgrimName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900'
  },
  passportText: {
    color: '#D4AF37',
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700'
  },
  approvedPill: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22c55e'
  },
  approvedText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '800'
  },
  bannerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16
  },
  badgeBtn: {
    flex: 1,
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  badgeBtnText: {
    color: '#042F1A',
    fontSize: 12,
    fontWeight: '900'
  },
  sosBtn: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  sosBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a'
  },
  cardSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepItem: {
    alignItems: 'center',
    flex: 1
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  stepDone: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#22c55e'
  },
  stepCircleText: {
    color: '#15803d',
    fontWeight: '900',
    fontSize: 14
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155'
  },
  stepStatus: {
    fontSize: 9,
    color: '#16a34a',
    fontWeight: '800',
    marginTop: 1
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center'
  },
  menuCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  menuCardSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center'
  }
});
