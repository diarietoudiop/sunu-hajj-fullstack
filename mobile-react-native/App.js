import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Modal, ScrollView } from 'react-native';
import Header from './src/components/Header';
import SOSModal from './src/components/SOSModal';
import HomeScreen from './src/screens/HomeScreen';
import BadgeScreen from './src/screens/BadgeScreen';
import MapScreen from './src/screens/MapScreen';
import LogisticsScreen from './src/screens/LogisticsScreen';
import VaultScreen from './src/screens/VaultScreen';
import { CURRENT_PILGRIM, NOTIFICATIONS } from './src/services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'badge' | 'map' | 'logistics' | 'vault'
  const [lang, setLang] = useState('fr'); // 'fr' | 'wo' | 'ar'
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notificationsList, setNotificationsList] = useState(NOTIFICATIONS);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const handleMarkNotifRead = (id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#042F1A" />

      {/* App Header Bar */}
      <Header
        pilgrim={CURRENT_PILGRIM}
        onOpenNotifications={() => setShowNotifModal(true)}
        unreadCount={unreadCount}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Active Screen Body */}
      <View style={styles.bodyContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            pilgrim={CURRENT_PILGRIM}
            onNavigate={(screen) => setActiveTab(screen)}
            onTriggerSOS={() => setShowSOSModal(true)}
          />
        )}
        {activeTab === 'badge' && (
          <BadgeScreen pilgrim={CURRENT_PILGRIM} />
        )}
        {activeTab === 'map' && (
          <MapScreen
            pilgrim={CURRENT_PILGRIM}
            onTriggerSOS={() => setShowSOSModal(true)}
          />
        )}
        {activeTab === 'logistics' && (
          <LogisticsScreen pilgrim={CURRENT_PILGRIM} />
        )}
        {activeTab === 'vault' && (
          <VaultScreen pilgrim={CURRENT_PILGRIM} />
        )}
      </View>

      {/* Bottom Navigation Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('home')}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('badge')}
        >
          <Text style={[styles.tabIcon, activeTab === 'badge' && styles.tabIconActive]}>🪪</Text>
          <Text style={[styles.tabLabel, activeTab === 'badge' && styles.tabLabelActive]}>Badge</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabIcon, activeTab === 'map' && styles.tabIconActive]}>🗺️</Text>
          <Text style={[styles.tabLabel, activeTab === 'map' && styles.tabLabelActive]}>Carte GPS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('logistics')}
        >
          <Text style={[styles.tabIcon, activeTab === 'logistics' && styles.tabIconActive]}>✈️</Text>
          <Text style={[styles.tabLabel, activeTab === 'logistics' && styles.tabLabelActive]}>Logistique</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('vault')}
        >
          <Text style={[styles.tabIcon, activeTab === 'vault' && styles.tabIconActive]}>🔐</Text>
          <Text style={[styles.tabLabel, activeTab === 'vault' && styles.tabLabelActive]}>Coffre</Text>
        </TouchableOpacity>
      </View>

      {/* SOS Emergency Modal */}
      <SOSModal
        visible={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        pilgrim={CURRENT_PILGRIM}
      />

      {/* Notification List Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNotifModal}
        onRequestClose={() => setShowNotifModal(false)}
      >
        <View style={styles.notifOverlay}>
          <View style={styles.notifCard}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>📱 Notifications SMS & WhatsApp</Text>
              <TouchableOpacity onPress={() => setShowNotifModal(false)}>
                <Text style={{ color: '#ffffff', fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 16 }}>
              {notificationsList.map(n => (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.notifRow, !n.read && styles.unreadNotifRow]}
                  onPress={() => handleMarkNotifRead(n.id)}
                >
                  <Text style={{ fontSize: 18, marginRight: 10 }}>{n.channel === 'WhatsApp' ? '💬' : '📱'}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                      <Text style={styles.notifItemTitle}>{n.title}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                    <Text style={styles.notifMsg}>{n.message}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#042F1A'
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6
  },
  tabIconActive: {
    opacity: 1
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2
  },
  tabLabelActive: {
    color: '#042F1A',
    fontWeight: '900'
  },
  notifOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end'
  },
  notifCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    overflow: 'hidden'
  },
  notifHeader: {
    backgroundColor: '#042F1A',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notifTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900'
  },
  notifRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  unreadNotifRow: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0'
  },
  notifItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a'
  },
  notifTime: {
    fontSize: 10,
    color: '#94a3b8'
  },
  notifMsg: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15
  }
});
