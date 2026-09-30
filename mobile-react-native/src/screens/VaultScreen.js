import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function VaultScreen({ pilgrim }) {
  const [phone, setPhone] = useState(pilgrim.emergencyContact.phone);
  const [sentAlerts, setSentAlerts] = useState([]);

  const handleSendSMS = (stageTitle, text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const log = `[${time}] SMS à ${phone} : "${text}"`;
    setSentAlerts([log, ...sentAlerts]);
    Alert.alert('✅ SMS Envoyé !', `Le SMS d'étape "${stageTitle}" a été transmis à votre proche (${phone}).`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      
      {/* Encrypted Vault Card */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={{ fontSize: 24 }}>🔐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTag}>SÉCURITÉ INFRASTRUCTURE</Text>
            <Text style={styles.cardTitle}>Coffre-fort Numérique Chiffré</Text>
          </View>
        </View>

        <Text style={styles.cardSub}>
          Sauvegarde sécurisée de vos pièces officielles sur les serveurs de la Sunu Hajj.
        </Text>

        {/* Documents Items */}
        <View style={styles.docItem}>
          <Text style={{ fontSize: 20 }}>🛂</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>Copie du Passeport Sénégalais</Text>
            <Text style={styles.docStatus}>🟢 Téléversé & Certifié DGP</Text>
          </View>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Voir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docItem}>
          <Text style={{ fontSize: 20 }}>💉</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>Carnet de Vaccination (Fièvre Jaune / Méningite)</Text>
            <Text style={styles.docStatus}>🟢 Conforme & Validé</Text>
          </View>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Voir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.docItem}>
          <Text style={{ fontSize: 20 }}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>Certificat d'Aptitude Médicale Officiel</Text>
            <Text style={styles.docStatus}>🟢 Validé par le Dr. Babacar Ndiaye</Text>
          </View>
          <TouchableOpacity style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Voir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Relative SMS Alert Simulator */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Alerte Famille par SMS au Sénégal</Text>
        <Text style={styles.cardSub}>
          Prévenez vos proches en un clic lors des grandes étapes du voyage
        </Text>

        <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569', marginBottom: 4 }}>
          Numéro de votre proche ({pilgrim.emergencyContact.name}) :
        </Text>
        <View style={styles.phoneInputBox}>
          <Text style={styles.phoneInputText}>{phone}</Text>
        </View>

        {/* Quick SMS Trigger Buttons */}
        <View style={styles.smsBtnsGrid}>
          <TouchableOpacity 
            style={styles.smsBtn}
            onPress={() => handleSendSMS('Aéroport DSS', `Assalamou Alaykoum ! Je suis bien arrivé à l'aéroport Blaise Diagne (DSS). Enregistrement du vol ${pilgrim.flightNumber} en cours.`)}
          >
            <Text style={styles.smsBtnText}>✈️ Décollage Dakar (DSS)</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.smsBtn}
            onPress={() => handleSendSMS('Arrivée Djeddah', `Alhamdulillah ! Mon vol est bien arrivé en Arabie Saoudite (Djeddah/Médine). En route vers l'hôtel.`)}
          >
            <Text style={styles.smsBtnText}>🇸🇦 Arrivée Saoudite</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.smsBtn}
            onPress={() => handleSendSMS('Station Arafat', `Alhamdulillah ! Je suis bien installé au campement d'Arafat. Je prie pour toute la famille.`)}
          >
            <Text style={styles.smsBtnText}>⛰️ Station Arafat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.smsBtn}
            onPress={() => handleSendSMS('Vol Retour', `Alhamdulillah ! Le Hajj est accompli. Embarquement pour le vol retour vers Dakar.`)}
          >
            <Text style={styles.smsBtnText}>🔄 Vol Retour Dakar</Text>
          </TouchableOpacity>
        </View>

        {/* Sent SMS Log */}
        {sentAlerts.length > 0 && (
          <View style={styles.smsLogBox}>
            <Text style={styles.smsLogHeader}>Historique des SMS envoyés :</Text>
            {sentAlerts.map((log, idx) => (
              <Text key={idx} style={styles.smsLogText}>{log}</Text>
            ))}
          </View>
        )}
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
  cardSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  docName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a'
  },
  docStatus: {
    fontSize: 10,
    color: '#16a34a',
    marginTop: 2,
    fontWeight: '700'
  },
  viewBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb'
  },
  phoneInputBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 14
  },
  phoneInputText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a'
  },
  smsBtnsGrid: {
    gap: 8
  },
  smsBtn: {
    backgroundColor: '#042F1A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  smsBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  smsLogBox: {
    marginTop: 14,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  smsLogHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    marginBottom: 4
  },
  smsLogText: {
    fontSize: 10,
    color: '#334155',
    marginVertical: 2
  }
});
