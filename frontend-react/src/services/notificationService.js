// Notification Service for Sunu Hajj Platform
// Handles SMS, WhatsApp, and In-App notification simulation

const STORAGE_KEY = 'sunuhajj_notifications_v1';

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    recipientName: 'Malick Ndiaye',
    recipientPhone: '+221 78 591 07 67',
    passportNumber: 'SN55555',
    channel: 'whatsapp', // 'sms' | 'whatsapp' | 'system'
    type: 'medical', // 'medical' | 'visa' | 'flight' | 'hotel' | 'info'
    title: 'Visite Médicale Validée',
    message: '🇸🇳 Sunu Hajj : Félicitations Malick ! Votre visite médicale d’aptitude au Hajj 2026 a été validée par le Dr. Babacar Ndiaye. Vous êtes déclaré APTE au voyage.',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: false,
    status: 'delivered', // 'sent' | 'delivered' | 'read'
    sender: 'Commission Médicale Hajj'
  },
  {
    id: 'notif-2',
    recipientName: 'Awa Diop',
    recipientPhone: '+221 77 345 67 89',
    passportNumber: 'SN12345',
    channel: 'sms',
    type: 'visa',
    title: 'Visa Nusuk Délivré',
    message: '🕋 Sunu Hajj : Votre Visa Nusuk officiel N° NSK-2026-88492 a été émis avec succès par la Délégation Générale. Téléchargez votre pass sur le portail.',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: true,
    status: 'delivered',
    sender: 'DGP Sénégal'
  },
  {
    id: 'notif-3',
    recipientName: 'Moussa Ndiaye',
    recipientPhone: '+221 76 987 65 43',
    passportNumber: 'SN67890',
    channel: 'whatsapp',
    type: 'flight',
    title: 'Confirmation de Vol Air Sénégal',
    message: '✈️ Sunu Hajj : Votre vol Air Sénégal N° HC-2026-DKR pour Djeddah est confirmé pour le 15 Juin 2026 à 02h30 GMT. Présence à l\'aéroport Blaise Diagne (DSS) 4h avant.',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: false,
    status: 'delivered',
    sender: 'Module Vols DGP'
  }
];

class NotificationService {
  getNotifications() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading notifications", e);
    }
    return DEFAULT_NOTIFICATIONS;
  }

  saveNotifications(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('sunuhajj_notification_update', { detail: list }));
    } catch (e) {
      console.error("Error saving notifications", e);
    }
  }

  sendNotification({ recipientName, recipientPhone, passportNumber, channel = 'sms', type = 'info', title, message, sender = 'DGP Sunu Hajj' }) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientName: recipientName || 'Pèlerin',
      recipientPhone: recipientPhone || '+221 77 000 00 00',
      passportNumber: passportNumber || '',
      channel, // 'sms' or 'whatsapp' or 'system'
      type,
      title: title || (channel === 'whatsapp' ? 'Message WhatsApp Sunu Hajj' : 'SMS Sunu Hajj'),
      message,
      timestamp: new Date().toISOString(),
      read: false,
      status: 'delivered',
      sender
    };

    const current = this.getNotifications();
    const updated = [newNotif, ...current];
    this.saveNotifications(updated);

    // Trigger floating phone toast event
    window.dispatchEvent(new CustomEvent('sunuhajj_live_sms_received', { detail: newNotif }));

    return newNotif;
  }

  markAsRead(id) {
    const current = this.getNotifications();
    const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
    this.saveNotifications(updated);
  }

  markAllAsRead() {
    const current = this.getNotifications();
    const updated = current.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  deleteNotification(id) {
    const current = this.getNotifications();
    const updated = current.filter(n => n.id !== id);
    this.saveNotifications(updated);
  }

  clearAll() {
    this.saveNotifications([]);
  }
}

export const notificationService = new NotificationService();
