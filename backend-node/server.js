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
  const { name, price, type, rating, address, phone, email, desc_fr, desc_wo, desc_ar, features } = req.body;
  if (!name || !price || !type) {
    return res.status(400).json({ error: "Champs obligatoires manquants (nom, prix, type)" });
  }

  const featuresJson = JSON.stringify(features || ["Assistance médicale", "Encadrement religieux"]);

  try {
    const result = await DbManager.run(
      `INSERT INTO agencies (name, price, type, rating, address, phone, email, desc_fr, desc_wo, desc_ar, features)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        featuresJson
      ]
    );
    res.status(201).json({
      id: result.id,
      name,
      price: parseInt(price),
      type,
      features: features || []
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
      registrationDate: r.registrationDate
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
      registrationDate: row.registrationDate
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
      `INSERT INTO pilgrims (fullName, phone, email, passportNumber, birthDate, bloodType, medicalStatus, registrationStatus, selectedAgencyId, emergencyContactName, emergencyContactPhone, registrationDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    res.status(201).json({
      id: result.id,
      fullName,
      passportNumber,
      registrationStatus: 'pending'
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

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Sunu Hajj Server running on http://localhost:${PORT}`);
  console.log(`========================================`);
});
