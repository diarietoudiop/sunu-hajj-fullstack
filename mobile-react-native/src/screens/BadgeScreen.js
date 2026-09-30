import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function BadgeScreen({ pilgrim }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      {/* Official Pass Voyage Badge Card */}
      <View style={styles.badgeCard}>
        
        {/* Header Ribbon */}
        <View style={styles.badgeHeader}>
          <Text style={{ fontSize: 24 }}>🇸🇳</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeHeaderTitle}>RÉPUBLIQUE DU SÉNÉGAL</Text>
            <Text style={styles.badgeHeaderSub}>Délégation Générale au Pèlerinage (DGP)</Text>
          </View>
        </View>

        {/* Badge Photo & Main Details */}
        <View style={styles.badgeBody}>
          <View style={styles.photoBox}>
            <Text style={{ fontSize: 40 }}>👳‍♂️</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.pilgrimLabel}>PÈLERIN OFFICIEL SÉNÉGAL 2026</Text>
            <Text style={styles.pilgrimName}>{pilgrim.fullName}</Text>
            <Text style={styles.passportNum}>Passeport : {pilgrim.passportNumber}</Text>
            <Text style={styles.agencyText}>🏢 {pilgrim.agencyName}</Text>
          </View>
        </View>

        {/* Status Pills */}
        <View style={styles.pillsGrid}>
          <View style={styles.pillItem}>
            <Text style={styles.pillLabel}>Aptitude Médicale</Text>
            <Text style={[styles.pillVal, { color: '#16a34a' }]}>🟢 APTE ({pilgrim.bloodType})</Text>
          </View>
          <View style={styles.pillItem}>
            <Text style={styles.pillLabel}>Visa Nusuk Saoudite</Text>
            <Text style={[styles.pillVal, { color: '#16a34a' }]}>🟢 ÉMIS</Text>
          </View>
        </View>

        {/* Scannable QR Code Nusuk Section */}
        <View style={styles.qrSection}>
          <View style={styles.qrBox}>
            <Text style={styles.qrTextPlaceholder}>[QR CODE NUSUK]</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.qrTitle}>CODE NUSUK OFFICIEL</Text>
            <Text style={styles.qrCodeNum}>{pilgrim.nusukVisaId}</Text>
            <Text style={styles.qrSub}>Valide à Makkah, Mina, Arafat & Médine</Text>
          </View>
        </View>

        <View style={styles.badgeFooter}>
          <Text style={styles.footerText}>📞 Urgence DGP Sénégal sur place : +966 800 123 456</Text>
        </View>

      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>💡 Conseil d'utilisation du Pass Mobile :</Text>
        <Text style={styles.infoCardText}>
          Présentez cet écran aux agents de contrôle saoudiens et au personnel de bord. Ce Pass numérique contient la signature électronique certifiée de la Délégation Générale.
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
  badgeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16
  },
  badgeHeader: {
    backgroundColor: '#042F1A',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#D4AF37'
  },
  badgeHeaderTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  badgeHeaderSub: {
    color: '#D4AF37',
    fontSize: 10,
    fontWeight: '700'
  },
  badgeBody: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  photoBox: {
    width: 64,
    height: 74,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pilgrimLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D4AF37',
    letterSpacing: 0.5
  },
  pilgrimName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0f172a',
    marginVertical: 2
  },
  passportNum: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#475569',
    fontWeight: '700'
  },
  agencyText: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '700',
    marginTop: 2
  },
  pillsGrid: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 10
  },
  pillItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  pillLabel: {
    fontSize: 9,
    color: '#64748b'
  },
  pillVal: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2
  },
  qrSection: {
    backgroundColor: '#042F1A',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  qrBox: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4
  },
  qrTextPlaceholder: {
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center'
  },
  qrTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D4AF37'
  },
  qrCodeNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    fontFamily: 'monospace',
    marginVertical: 1
  },
  qrSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)'
  },
  badgeFooter: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569'
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4
  },
  infoCardText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17
  }
});
