import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';

export default function SOSModal({ visible, onClose, pilgrim }) {
  const [step, setStep] = useState('confirm'); // 'confirm' | 'sent'
  const [loading, setLoading] = useState(false);

  const handleConfirmSOS = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('sent');
    }, 1000);
  };

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerIconWrapper}>
              <Text style={{ fontSize: 24 }}>🚨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>
                {step === 'confirm' ? 'Alerte SOS Pèlerin Égaré' : '✅ Secours DGP Dépêchés !'}
              </Text>
              <Text style={styles.headerSub}>Urgence Médicale & Secours Sénégal</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.body}>
            {step === 'confirm' ? (
              <>
                <View style={styles.warningBox}>
                  <Text style={styles.warningTitle}>⚠️ Vous êtes égaré(e) ou malade ?</Text>
                  <Text style={styles.warningText}>
                    En confirmant, votre position GPS (Mina Zone 42 / Makkah) et votre N° Passeport ({pilgrim?.passportNumber || 'SN55555'}) seront immédiatement transmis à la brigade de secours DGP et au Dr. Babacar Ndiaye.
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Pèlerin :</Text>
                  <Text style={styles.infoValue}>{pilgrim?.fullName || 'Malick Ndiaye'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Position Estimée :</Text>
                  <Text style={[styles.infoValue, { color: '#dc2626' }]}>Mina Campement Zone 42</Text>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                    <Text style={styles.cancelBtnText}>Annuler</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sosConfirmBtn} onPress={handleConfirmSOS} disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.sosConfirmText}>🚨 CONFIRMER SOS</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.successIconBox}>
                  <Text style={{ fontSize: 32 }}>✅</Text>
                </View>

                <Text style={styles.sentTitle}>Position transmise à la DGP !</Text>
                <Text style={styles.sentDesc}>
                  La Brigade Médicale N° 3 (Dr. Babacar Ndiaye) a reçu vos coordonnées GPS. Arrivée estimée sous 5 minutes.
                </Text>

                <View style={styles.phoneGrid}>
                  <TouchableOpacity 
                    style={styles.callBtn}
                    onPress={() => Linking.openURL('tel:+966800123456')}
                  >
                    <Text style={styles.callBtnText}>📞 Urgence Saoudite</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.callBtn, { backgroundColor: '#042F1A' }]}
                    onPress={() => Linking.openURL('tel:+221338241234')}
                  >
                    <Text style={styles.callBtnText}>📞 Hotline DGP Sénégal</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={handleClose}>
                  <Text style={styles.doneBtnText}>Fermer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 420,
    overflow: 'hidden',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  modalHeader: {
    backgroundColor: '#dc2626',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900'
  },
  headerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11
  },
  closeBtn: {
    padding: 4
  },
  body: {
    padding: 20
  },
  warningBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16
  },
  warningTitle: {
    color: '#991b1b',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4
  },
  warningText: {
    color: '#7f1d1d',
    fontSize: 12,
    lineHeight: 17
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 13
  },
  infoValue: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800'
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center'
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700'
  },
  sosConfirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    alignItems: 'center'
  },
  sosConfirmText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900'
  },
  successIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12
  },
  sentTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 6
  },
  sentDesc: {
    textAlign: 'center',
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 16
  },
  phoneGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  callBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    alignItems: 'center'
  },
  callBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  doneBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center'
  },
  doneBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800'
  }
});
