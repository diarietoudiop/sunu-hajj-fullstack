import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Header({ pilgrim, onOpenNotifications, unreadCount = 1, lang, setLang }) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftRow}>
        <View style={styles.flagBadge}>
          <Text style={styles.flagText}>🇸🇳</Text>
        </View>
        <View>
          <Text style={styles.appTitle}>SUNU HAJJ</text>
          <Text style={styles.appSubtitle}>République du Sénégal</Text>
        </View>
      </View>

      <View style={styles.rightRow}>
        {/* Language Switcher Button */}
        <TouchableOpacity 
          style={styles.langBtn} 
          onPress={() => setLang(lang === 'fr' ? 'wo' : lang === 'wo' ? 'ar' : 'fr')}
        >
          <Text style={styles.langText}>{lang.toUpperCase()}</Text>
        </TouchableOpacity>

        {/* Notification Bell with Badge */}
        <TouchableOpacity style={styles.bellBtn} onPress={onOpenNotifications}>
          <Text style={{ fontSize: 18 }}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#042F1A',
    paddingTop: 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
    borderBottomColor: '#D4AF37'
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  flagBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flagText: {
    fontSize: 20
  },
  appTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  appSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600'
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  langBtn: {
    backgroundColor: 'rgba(212,175,55,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D4AF37'
  },
  langText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '800'
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  notifBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800'
  }
});
