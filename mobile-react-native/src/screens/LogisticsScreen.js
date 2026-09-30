import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ROOMMATES } from '../services/mockData';

export default function LogisticsScreen({ pilgrim }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      {/* Flight Info Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={{ fontSize: 24 }}>✈️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTag}>VOL CHARTER OFFICIEL</Text>
            <Text style={styles.cardTitle}>{pilgrim.flightNumber}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date & Heure :</Text>
            <Text style={styles.detailVal}>{pilgrim.flightDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Aéroport de départ :</Text>
            <Text style={styles.detailVal}>Blaise Diagne (DSS) • Dakar</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Destination :</Text>
            <Text style={styles.detailVal}>Aéroport International Djeddah (JED)</Text>
          </View>
        </View>
      </View>

      {/* Hotel Makkah & Madinah Cards */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={{ fontSize: 24 }}>🏨</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTag}>HÉBERGEMENT LA MECQUE & MÉDINE</Text>
            <Text style={styles.cardTitle}>{pilgrim.hotelMakkah}</Text>
          </View>
        </View>

        <View style={styles.roomBadgeBox}>
          <Text style={styles.roomBadgeText}>🔑 {pilgrim.roomNumber}</Text>
          <Text style={styles.roomBadgeSub}>Chambre Quadruple Équilibrée (Assistance Seniors)</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 12, color: '#64748b' }}>Hôtel Médine :</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#0f172a' }}>{pilgrim.hotelMadinah}</Text>
        </View>
      </View>

      {/* Roommates Generational Assistance Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👥 Voisins de Chambre & Entraide (Trio)</Text>
        <Text style={styles.cardSub}>
          Répartition intergénérationnelle Sunu Hajj (1 Senior + 2 Adultes + 1 Jeune)
        </Text>

        {ROOMMATES.map((rm) => (
          <View key={rm.id} style={styles.rmRow}>
            <View style={styles.rmAvatar}>
              <Text style={{ fontSize: 18 }}>{rm.role === 'Senior' ? '👴' : rm.role === 'Jeune' ? '🛡️' : '👨'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rmName}>{rm.fullName}</Text>
              <Text style={styles.rmTag}>{rm.tag} • {rm.age} ans</Text>
              <Text style={styles.rmPhone}>📞 {rm.phone}</Text>
            </View>
            <View style={styles.bedBadge}>
              <Text style={styles.bedText}>{rm.bedNumber}</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  cardTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 0.5
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a'
  },
  detailsGrid: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    gap: 6
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b'
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a'
  },
  roomBadgeBox: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10
  },
  roomBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#166534'
  },
  roomBadgeSub: {
    fontSize: 10,
    color: '#15803d',
    marginTop: 2
  },
  cardSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12
  },
  rmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  rmAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rmName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  rmTag: {
    fontSize: 10,
    color: '#16a34a',
    fontWeight: '700',
    marginTop: 1
  },
  rmPhone: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2
  },
  bedBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe'
  },
  bedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1d4ed8'
  }
});
