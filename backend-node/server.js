import express from 'express';
import cors from 'cors';
import { DbManager } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Initialize Database on startup
try {
  await DbManager.initialize();
  console.log("========================================");
  console.log("💾 [DATABASE INIT] Dual SQLite databases initialized.");
  console.log("========================================");
} catch (err) {
  console.error("❌ [DATABASE ERROR] Failed to initialize databases:", err.message);
}

// Static default checklist
const defaultChecklist = [
  { id: 1, cat: "admin", text_fr: "Vérifier la validité de mon passeport (min 6 mois)", text_wo: "Seet lane passeport bi am na 6 mois laata mu reer", text_ar: "التحقق من صلاحية جواز السفر (6 أشهر كحد أدنى)", checked: false },
  { id: 2, cat: "admin", text_fr: "Faire les photos d'identité aux normes saoudiennes", text_wo: "Defal photo identité yu Maka nangu", text_ar: "إعداد الصور الشخصية بالمواصفات السعودية المطلوبة", checked: false },
  { id: 3, cat: "health", text_fr: "Faire le vaccin obligatoire (Méningite & Fièvre jaune)", text_wo: "Def vaccins obligatoires yi (Méningite, Fièvre Jaune)", text_ar: "أخذ اللقاحات الإلزامية (الحمى الشوكية والصفراء)", checked: false },
  { id: 4, cat: "health", text_fr: "Préparer une trousse médicale (pansements, paracétamol)", text_wo: "Defal sa boite pharmacie (pansements, médicaments)", text_ar: "تجهيز حقيبة طبية شخصية (مسكنات، مطهر، ضمادات)", checked: false },
  { id: 5, cat: "luggage", text_fr: "Acheter deux pagnes d'Ihram blancs (pour les hommes)", text_wo: "Jënd 2 pagnes Ihram yu weex (ngir goor yi)", text_ar: "شراء ملابس الإحرام البيضاء (للرجال)", checked: false },
  { id: 6, cat: "luggage", text_fr: "Préparer une valise solide identifiée avec nom et adresse", text_wo: "Waajal valise bu dëggër and ak sa tour ak sa adresse", text_ar: "تجهيز حقيبة متينة وكتابة الاسم والعنوان عليها بوضوح", checked: false },
  { id: 7, cat: "spiritual", text_fr: "Apprendre les invocations de base et l'intention du Hajj", text_wo: "Jàng ñaan u Hajj yi ak intention u Hajj bi", text_ar: "حفظ الأدعية الأساسية ونية أداء مناسك الحج", checked: false }
];

// API ENDPOINTS

// 1. Announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const rows = await DbManager.all("SELECT * FROM announcements ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  const { category, title_fr, desc_fr, title_wo, desc_wo, title_ar, desc_ar } = req.body;
  if (!title_fr || !desc_fr) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  try {
    const result = await DbManager.run(
      `INSERT INTO announcements (date, category, title_fr, desc_fr, title_wo, desc_wo, title_ar, desc_ar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        category || 'admin',
        title_fr,
        desc_fr,
        title_wo || title_fr,
        desc_wo || desc_fr,
        title_ar || title_fr,
        desc_ar || desc_fr
      ]
    );
    res.status(201).json({
      id: result.id,
      date,
      category: category || 'admin',
      title_fr,
      desc_fr
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Agencies
app.get('/api/agencies', async (req, res) => {
  try {
    const rows = await DbManager.all("SELECT * FROM agencies");
    const parsed = rows.map(r => ({
      ...r,
      features: JSON.parse(r.features || '[]')
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/agencies', async (req, res) => {
  const { name, price, type, rating, address, phone, email, desc_fr, desc_wo, desc_ar, features, username, password } = req.body;
  if (!name || !price || !type) {
    return res.status(400).json({ error: "Champs obligatoires manquants (nom, prix, type)" });
  }

  const featuresJson = JSON.stringify(features || ["Assistance médicale", "Encadrement religieux"]);

  try {
    const result = await DbManager.run(
      `INSERT INTO agencies (name, price, type, rating, address, phone, email, desc_fr, desc_wo, desc_ar, features, username, password)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        parseInt(price),
        type,
        parseFloat(rating) || 4.5,
        address || "Dakar, Sénégal",
        phone || "+221 ",
        email || "",
        desc_fr || name,
        desc_wo || desc_fr || name,
        desc_ar || desc_fr || name,
        featuresJson,
        username || "",
        password || ""
      ]
    );
    res.status(201).json({
      id: result.id,
      name,
      price: parseInt(price),
      type,
      features: features || [],
      username: username || "",
      password: password || ""
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/agencies/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await DbManager.run("DELETE FROM agencies WHERE id = ?", [id]);
    res.json({ message: "Agence retirée avec succès", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/agencies/:id/pilgrims', async (req, res) => {
  const agencyId = parseInt(req.params.id);
  try {
    const rows = await DbManager.all("SELECT * FROM pilgrims WHERE selectedAgencyId = ?", [agencyId]);
    const parsed = rows.map(r => ({
      id: r.id,
      fullName: r.fullName,
      phone: r.phone,
      email: r.email,
      passportNumber: r.passportNumber,
      birthDate: r.birthDate,
      bloodType: r.bloodType,
      medicalStatus: r.medicalStatus,
      registrationStatus: r.registrationStatus,
      selectedAgencyId: r.selectedAgencyId,
      emergencyContact: {
        name: r.emergencyContactName,
        phone: r.emergencyContactPhone
      },
      registrationDate: r.registrationDate,
      nusukSyncStatus: r.nusukSyncStatus,
      flightNumber: r.flightNumber,
      hotelMakkah: r.hotelMakkah,
      hotelMadinah: r.hotelMadinah,
      roomNumber: r.roomNumber,
      visaStatus: r.visaStatus,
      paymentStatus: r.paymentStatus || 'pending'
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Pilgrim Registrations
app.get('/api/pilgrims', async (req, res) => {
  try {
    const rows = await DbManager.all("SELECT * FROM pilgrims");
    const parsed = rows.map(r => ({
      id: r.id,
      fullName: r.fullName,
      phone: r.phone,
      email: r.email,
      passportNumber: r.passportNumber,
      birthDate: r.birthDate,
      bloodType: r.bloodType,
      medicalStatus: r.medicalStatus,
      registrationStatus: r.registrationStatus,
      selectedAgencyId: r.selectedAgencyId,
      emergencyContact: {
        name: r.emergencyContactName,
        phone: r.emergencyContactPhone
      },
      registrationDate: r.registrationDate,
      nusukSyncStatus: r.nusukSyncStatus,
      flightNumber: r.flightNumber,
      hotelMakkah: r.hotelMakkah,
      hotelMadinah: r.hotelMadinah,
      roomNumber: r.roomNumber,
      visaStatus: r.visaStatus,
      paymentStatus: r.paymentStatus || 'pending'
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pilgrims/passport/:passportNumber', async (req, res) => {
  const passport = req.params.passportNumber;
  try {
    const row = await DbManager.get("SELECT * FROM pilgrims WHERE passportNumber = ?", [passport]);
    if (!row) {
      return res.status(404).json({ error: "Pèlerin introuvable" });
    }
    res.json({
      id: row.id,
      fullName: row.fullName,
      phone: row.phone,
      email: row.email,
      passportNumber: row.passportNumber,
      birthDate: row.birthDate,
      bloodType: row.bloodType,
      medicalStatus: row.medicalStatus,
      registrationStatus: row.registrationStatus,
      selectedAgencyId: row.selectedAgencyId,
      emergencyContact: {
        name: row.emergencyContactName,
        phone: row.emergencyContactPhone
      },
      registrationDate: row.registrationDate,
      nusukSyncStatus: row.nusukSyncStatus,
      flightNumber: row.flightNumber,
      hotelMakkah: row.hotelMakkah,
      hotelMadinah: row.hotelMadinah,
      roomNumber: row.roomNumber,
      visaStatus: row.visaStatus,
      paymentStatus: row.paymentStatus || 'pending'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pilgrims', async (req, res) => {
  const { fullName, phone, email, passportNumber, birthDate, bloodType, selectedAgencyId, emergencyContact } = req.body;
  if (!fullName || !phone || !passportNumber) {
    return res.status(400).json({ error: "Champs obligatoires manquants (nom complet, téléphone, passeport)" });
  }
  const registrationDate = new Date().toISOString().split('T')[0];

  try {
    const result = await DbManager.run(
      `INSERT INTO pilgrims (fullName, phone, email, passportNumber, birthDate, bloodType, medicalStatus, registrationStatus, selectedAgencyId, emergencyContactName, emergencyContactPhone, registrationDate, nusukSyncStatus, flightNumber, hotelMakkah, hotelMadinah, roomNumber, visaStatus, paymentStatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'Non assigné', 'Non assigné', 'Non assigné', 'Non assigné', 'pending', 'pending')`,
      [
        fullName,
        phone,
        email || "",
        passportNumber,
        birthDate || "",
        bloodType || "Inconnu",
        'pending',
        'pending',
        selectedAgencyId ? parseInt(selectedAgencyId) : null,
        emergencyContact?.name || "",
        emergencyContact?.phone || "",
        registrationDate
      ]
    );
    const newPilgrim = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [result.id]);
    res.status(201).json({
      id: newPilgrim.id,
      fullName: newPilgrim.fullName,
      phone: newPilgrim.phone,
      email: newPilgrim.email,
      passportNumber: newPilgrim.passportNumber,
      birthDate: newPilgrim.birthDate,
      bloodType: newPilgrim.bloodType,
      medicalStatus: newPilgrim.medicalStatus,
      registrationStatus: newPilgrim.registrationStatus,
      selectedAgencyId: newPilgrim.selectedAgencyId,
      emergencyContact: {
        name: newPilgrim.emergencyContactName,
        phone: newPilgrim.emergencyContactPhone
      },
      registrationDate: newPilgrim.registrationDate,
      nusukSyncStatus: newPilgrim.nusukSyncStatus,
      flightNumber: newPilgrim.flightNumber,
      hotelMakkah: newPilgrim.hotelMakkah,
      hotelMadinah: newPilgrim.hotelMadinah,
      roomNumber: newPilgrim.roomNumber,
      visaStatus: newPilgrim.visaStatus,
      paymentStatus: newPilgrim.paymentStatus || 'pending'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pilgrims/:id/status', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Statut invalide" });
  }

  try {
    await DbManager.run("UPDATE pilgrims SET registrationStatus = ? WHERE id = ?", [status, id]);
    const updated = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pilgrims/:id/medical', async (req, res) => {
  const id = parseInt(req.params.id);
  const { medicalStatus } = req.body;
  if (!['pending', 'apte', 'inapte'].includes(medicalStatus)) {
    return res.status(400).json({ error: "Statut médical invalide" });
  }

  try {
    await DbManager.run("UPDATE pilgrims SET medicalStatus = ? WHERE id = ?", [medicalStatus, id]);
    const updated = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pilgrims/:id/payment', async (req, res) => {
  const id = parseInt(req.params.id);
  const { paymentStatus } = req.body;
  if (!['pending', 'paid', 'refunded'].includes(paymentStatus)) {
    return res.status(400).json({ error: "Statut de paiement invalide" });
  }

  try {
    await DbManager.run("UPDATE pilgrims SET paymentStatus = ? WHERE id = ?", [paymentStatus, id]);
    const updated = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [id]);
    res.json({
      id: updated.id,
      fullName: updated.fullName,
      phone: updated.phone,
      email: updated.email,
      passportNumber: updated.passportNumber,
      birthDate: updated.birthDate,
      bloodType: updated.bloodType,
      medicalStatus: updated.medicalStatus,
      registrationStatus: updated.registrationStatus,
      selectedAgencyId: updated.selectedAgencyId,
      emergencyContact: {
        name: updated.emergencyContactName,
        phone: updated.emergencyContactPhone
      },
      registrationDate: updated.registrationDate,
      nusukSyncStatus: updated.nusukSyncStatus,
      flightNumber: updated.flightNumber,
      hotelMakkah: updated.hotelMakkah,
      hotelMadinah: updated.hotelMadinah,
      roomNumber: updated.roomNumber,
      visaStatus: updated.visaStatus,
      paymentStatus: updated.paymentStatus || 'pending'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pilgrims/:id/logistics', async (req, res) => {
  const id = parseInt(req.params.id);
  const { flightNumber, hotelMakkah, hotelMadinah, roomNumber, visaStatus } = req.body;

  try {
    await DbManager.run(
      `UPDATE pilgrims 
       SET flightNumber = ?, hotelMakkah = ?, hotelMadinah = ?, roomNumber = ?, visaStatus = ?
       WHERE id = ?`,
      [flightNumber || "Non assigné", hotelMakkah || "Non assigné", hotelMadinah || "Non assigné", roomNumber || "Non assigné", visaStatus || "pending", id]
    );
    const updated = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/pilgrims/:id/profile', async (req, res) => {
  const id = parseInt(req.params.id);
  const { fullName, phone, email, bloodType, selectedAgencyId, emergencyContactName, emergencyContactPhone } = req.body;

  try {
    await DbManager.run(
      `UPDATE pilgrims 
       SET fullName = ?, phone = ?, email = ?, bloodType = ?, selectedAgencyId = ?, emergencyContactName = ?, emergencyContactPhone = ?
       WHERE id = ?`,
      [
        fullName, 
        phone, 
        email, 
        bloodType || "Inconnu", 
        selectedAgencyId ? parseInt(selectedAgencyId) : null, 
        emergencyContactName, 
        emergencyContactPhone, 
        id
      ]
    );
    const updated = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pilgrims/:id/nusuk-sync', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nusukSyncStatus } = req.body;
  if (!['pending', 'synced', 'error'].includes(nusukSyncStatus)) {
    return res.status(400).json({ error: "Statut de synchro invalide" });
  }

  try {
    await DbManager.run("UPDATE pilgrims SET nusukSyncStatus = ? WHERE id = ?", [nusukSyncStatus, id]);
    const updated = await DbManager.get("SELECT * FROM pilgrims WHERE id = ?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pilgrims/nusuk-sync-all', async (req, res) => {
  try {
    await DbManager.run("UPDATE pilgrims SET nusukSyncStatus = 'synced' WHERE registrationStatus = 'approved'");
    res.json({ message: "Synchronisation Nusuk globale exécutée avec succès." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agency Application Request
app.post('/api/agencies/apply', async (req, res) => {
  try {
    const { agencyName, contactName, phone } = req.body;
    if (!agencyName || !contactName || !phone) {
      return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
    }
    const timestamp = new Date().toISOString();
    const result = await DbManager.run(
      `INSERT INTO inquiries (agencyId, agencyName, clientName, clientPhone, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [0, "Agrément : " + agencyName, contactName, phone, timestamp]
    );
    res.status(201).json({ 
      message: "Votre demande d'agrément a été enregistrée avec succès.",
      id: result.id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Inquiries
app.post('/api/agencies/:id/inquiry', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const agency = await DbManager.get("SELECT * FROM agencies WHERE id = ?", [id]);
    if (!agency) {
      return res.status(404).json({ error: "Agence introuvable" });
    }
    const { name, phone } = req.body;
    const timestamp = new Date().toISOString();
    const result = await DbManager.run(
      `INSERT INTO inquiries (agencyId, agencyName, clientName, clientPhone, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [id, agency.name, name, phone, timestamp]
    );
    res.status(201).json({
      message: "Demande reçue",
      inquiry: {
        id: result.id,
        agencyId: id,
        agencyName: agency.name,
        clientName: name,
        clientPhone: phone,
        timestamp
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Default Checklist
app.get('/api/checklist', (req, res) => {
  res.json(defaultChecklist);
});

// 6. Budget Calculation
app.post('/api/budget/calculate', (req, res) => {
  const { packagePrice, pocketMoney, sacrificePrice, shoppingPrice, lang } = req.body;
  const total = parseInt(packagePrice || 0) + parseInt(pocketMoney || 0) + parseInt(sacrificePrice || 0) + parseInt(shoppingPrice || 0);
  
  let advice = "";
  const selectedLang = lang || 'fr';

  if (total > 8000000) {
    if (selectedLang === 'ar') {
      advice = "ميزانيتك ممتازة وتغطي الباقات الفاخرة (VIP). ننصحك بالتأكد من جودة الخدمات التعاقدية كالفنادق والمواصلات الخاصة.";
    } else if (selectedLang === 'wo') {
      advice = "Sa koppar fés na lool. Waajal say hôtel 5 étoiles ak auto transport yu VIP.";
    } else {
      advice = "Votre budget correspond à un forfait haut de gamme (VIP). Assurez-vous d'avoir des garanties contractuelles solides sur les hôtels 5 étoiles et les transports privatifs.";
    }
  } else if (total < 4200000) {
    if (selectedLang === 'ar') {
      advice = "ميزانيتك تقع ضمن الفئة الاقتصادية. تأكد من توفر حافلات مجانية لنقلك من الفندق إلى الحرم المكي الشريف لتجنب أعباء المشي الطويل.";
    } else if (selectedLang === 'wo') {
      advice = "Sa koppar dafa yomb. Seetal bu baax ndax am na auto transport di jogé hôtel ba Haram bi.";
    } else {
      advice = "Votre budget est dans la tranche économique. Vérifiez que l'agence agréée propose des navettes de transport régulières entre l'hôtel et le Haram.";
    }
  } else {
    if (selectedLang === 'ar') {
      advice = "ميزانيتك متوازنة جداً. نوصي دائماً بالاحتفاظ بنسبة 10% إضافية للحالات الطبية أو النفقات غير المتوقعة في الأراضي المقدسة.";
    } else if (selectedLang === 'wo') {
      advice = "Sa koppar ngi fés bu baax. Prévoyal say koppari emergency (10% li ci des) ngir wér-gi-yaram walla leneen lu jot ci Maka.";
    } else {
      advice = "Votre budget est bien équilibré. Prévoyez toujours une marge d'au moins 10% en cas d'urgence médicale ou de frais imprévus en Arabie Saoudite.";
    }
  }

  res.json({ total, advice });
});

// 7. Traffic Stats (Admin dashboard query)
app.get('/api/stats', async (req, res) => {
  try {
    const visitsCount = 1245;
    const pilgrimsCount = await DbManager.get("SELECT COUNT(*) as count FROM pilgrims");
    const inquiriesCount = await DbManager.get("SELECT COUNT(*) as count FROM inquiries");
    const announcementsCount = await DbManager.get("SELECT COUNT(*) as count FROM announcements");
    const agenciesCount = await DbManager.get("SELECT COUNT(*) as count FROM agencies");
    const recentInquiries = await DbManager.all("SELECT * FROM inquiries ORDER BY id DESC LIMIT 5");

    res.json({
      totalVisits: visitsCount,
      activePilgrims: pilgrimsCount?.count || 0,
      registeredInquiries: inquiriesCount?.count || 0,
      announcementsCount: announcementsCount?.count || 0,
      agenciesCount: agenciesCount?.count || 0,
      inquiriesHistory: recentInquiries,
      totalPilgrims: pilgrimsCount?.count || 0,
      pendingPilgrimsCount: (await DbManager.get("SELECT COUNT(*) as count FROM pilgrims WHERE registrationStatus = 'pending'"))?.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7.5. DGP Agents (Admins) Management
app.get('/api/admins', async (req, res) => {
  try {
    const rows = await DbManager.all("SELECT id, username, fullName, email, department, phone, avatar FROM admins");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admins', async (req, res) => {
  const { username, password, fullName, email, department, phone, avatar } = req.body;
  if (!username || !password || !fullName || !email) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  try {
    const existing = await DbManager.get("SELECT * FROM admins WHERE username = ?", [username.trim()]);
    if (existing) {
      return res.status(400).json({ error: "Cet identifiant existe déjà." });
    }

    const result = await DbManager.run(
      `INSERT INTO admins (username, password, fullName, email, department, phone, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username.trim(),
        password,
        fullName.trim(),
        email.trim(),
        department || 'Direction Générale',
        phone || '',
        avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      ]
    );

    res.status(201).json({
      id: result.id,
      username: username.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      department: department || 'Direction Générale',
      phone: phone || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admins/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
    return res.status(400).json({ error: "Impossible de supprimer le compte de l'administrateur principal." });
  }

  try {
    await DbManager.run("DELETE FROM admins WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin Authentication
app.post('/api/auth/register', async (req, res) => {
  const { username, password, fullName, email, department, phone, avatar } = req.body;
  if (!username || !password || !fullName || !email) {
    return res.status(400).json({ error: "Champs obligatoires manquants (identifiant, mot de passe, nom, email)" });
  }

  try {
    const existing = await DbManager.get("SELECT * FROM admins WHERE username = ?", [username.trim()]);
    if (existing) {
      return res.status(400).json({ error: "Cet identifiant existe déjà." });
    }

    const result = await DbManager.run(
      `INSERT INTO admins (username, password, fullName, email, department, phone, avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username.trim(),
        password,
        fullName.trim(),
        email.trim(),
        department ? department.trim() : 'Direction Générale',
        phone ? phone.trim() : '',
        avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      ]
    );

    const user = {
      id: result.id,
      username: username.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      department: department || 'Direction Générale',
      phone: phone || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    };
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  try {
    if (role === 'agency') {
      const agency = await DbManager.get("SELECT * FROM agencies WHERE username = ? AND password = ?", [username.trim(), password]);
      if (agency) {
        res.json({
          id: agency.id,
          username: agency.username,
          fullName: agency.name,
          email: agency.email,
          role: 'agency',
          agencyId: agency.id
        });
      } else {
        res.status(401).json({ error: "Identifiant ou mot de passe d'agence incorrect." });
      }
    } else {
      const user = await DbManager.get("SELECT * FROM admins WHERE username = ? AND password = ?", [username.trim(), password]);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        res.json({ ...userWithoutPassword, role: 'admin' });
      } else {
        res.status(401).json({ error: "Identifiant ou mot de passe administratif incorrect." });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/profile', async (req, res) => {
  const { id, fullName, email, department, phone, avatar, password } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Identifiant administrateur manquant" });
  }

  try {
    let sql = `UPDATE admins SET fullName = ?, email = ?, department = ?, phone = ?, avatar = ?`;
    const params = [fullName, email, department, phone, avatar];

    if (password) {
      sql += `, password = ?`;
      params.push(password);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    await DbManager.run(sql, params);
    
    const updatedUser = await DbManager.get("SELECT * FROM admins WHERE id = ?", [id]);
    if (updatedUser) {
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ error: "Administrateur non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Sunu Hajj Server running on http://localhost:${PORT}`);
  console.log(`========================================`);
});
