import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PRIMARY_DB_PATH = path.join(__dirname, 'db_primary.sqlite');
const BACKUP_DB_PATH = path.join(__dirname, 'db_backup.sqlite');

console.log(`[DB INIT] Primary DB path: ${PRIMARY_DB_PATH}`);
console.log(`[DB INIT] Backup DB path: ${BACKUP_DB_PATH}`);

const dbPrimary = new sqlite3.Database(PRIMARY_DB_PATH);
const dbBackup = new sqlite3.Database(BACKUP_DB_PATH);

// Promise wrappers for sqlite3
const dbQuery = {
  all(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  get(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  run(db, sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

export const DbManager = {
  // Read all rows (with fallback)
  async all(sql, params = []) {
    try {
      return await dbQuery.all(dbPrimary, sql, params);
    } catch (err) {
      console.warn(`⚠️ [DATABASE FAILOVER] Primary read failed. Falling back to Backup DB. Error:`, err.message);
      return await dbQuery.all(dbBackup, sql, params);
    }
  },

  // Read single row (with fallback)
  async get(sql, params = []) {
    try {
      return await dbQuery.get(dbPrimary, sql, params);
    } catch (err) {
      console.warn(`⚠️ [DATABASE FAILOVER] Primary read failed. Falling back to Backup DB. Error:`, err.message);
      return await dbQuery.get(dbBackup, sql, params);
    }
  },

  // Write query (Dual Write to both DBs)
  async run(sql, params = []) {
    const primaryWrite = dbQuery.run(dbPrimary, sql, params).catch(err => {
      console.error(`❌ [DATABASE ERROR] Write to Primary DB failed:`, err.message);
      return null;
    });

    const backupWrite = dbQuery.run(dbBackup, sql, params).catch(err => {
      console.error(`❌ [DATABASE ERROR] Write to Backup DB failed:`, err.message);
      return null;
    });

    const [resPrimary, resBackup] = await Promise.all([primaryWrite, backupWrite]);

    if (!resPrimary && !resBackup) {
      throw new Error("Both Primary and Backup databases failed to write.");
    }

    return resPrimary || resBackup;
  },

  // Initialize databases
  async initialize() {
    const createTablesSql = [
      `CREATE TABLE IF NOT EXISTS agencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER,
        type TEXT,
        rating REAL,
        address TEXT,
        phone TEXT,
        email TEXT,
        desc_fr TEXT,
        desc_wo TEXT,
        desc_ar TEXT,
        features TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        category TEXT,
        title_fr TEXT,
        desc_fr TEXT,
        title_wo TEXT,
        desc_wo TEXT,
        title_ar TEXT,
        desc_ar TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS pilgrims (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        phone TEXT,
        email TEXT,
        passportNumber TEXT,
        birthDate TEXT,
        bloodType TEXT,
        medicalStatus TEXT,
        registrationStatus TEXT,
        selectedAgencyId INTEGER,
        emergencyContactName TEXT,
        emergencyContactPhone TEXT,
        registrationDate TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agencyId INTEGER,
        agencyName TEXT,
        clientName TEXT,
        clientPhone TEXT,
        timestamp TEXT
      )`
    ];

    // Initialize tables on both databases
    for (const sql of createTablesSql) {
      await dbQuery.run(dbPrimary, sql);
      await dbQuery.run(dbBackup, sql);
    }

    // Seed mock data if empty
    await this.seedIfEmpty();
  },

  async seedIfEmpty() {
    // Check if agencies table is empty
    const agenciesCount = await this.get("SELECT COUNT(*) as count FROM agencies");
    if (agenciesCount && agenciesCount.count > 0) {
      console.log("[DB SEED] Databases already seeded.");
      return;
    }

    console.log("[DB SEED] Seeding initial Hajj data into both databases...");

    // Seed Agencies
    const mockAgencies = [
      {
        name: "Voyages Teranga Hajj & Omra",
        price: 3600000,
        type: "economique",
        rating: 4.8,
        address: "Avenue Cheikh Anta Diop, Dakar",
        phone: "+221 33 824 12 34",
        email: "contact@terangahajj.sn",
        desc_fr: "Package économique comprenant le vol charter, l'hébergement en hôtel 3 étoiles à La Mecque à 1.5km du Haram (avec navettes gratuites 24h/24), et restauration sénégalaise.",
        desc_wo: "Forfait bu yomb ci ndaje, and ak plane bi, dëkk ci hôtel 3 étoiles (1.5km ci Haram) and ak auto transport, ak ñam u Sénégal.",
        desc_ar: "باقة اقتصادية متميزة تشمل الطيران العارض، السكن في فندق 3 نجوم على بعد 1.5 كم من الحرم مع حافلات نقل مجانية على مدار الساعة، ووجبات سنغالية يومية.",
        features: JSON.stringify(["Vol direct Dakar-Djeddah", "Hébergement 3★ avec navette", "Demi-pension (Plats sénégalais)", "Guide religieux dédié", "Assistance médicale incluse"])
      },
      {
        name: "Dakar Air Services Hajj",
        price: 4900000,
        type: "standard",
        rating: 4.5,
        address: "Immeuble Fahd, Place de l'Indépendance, Dakar",
        phone: "+221 33 889 45 45",
        email: "hajj@dakarair.sn",
        desc_fr: "Forfait standard de grande qualité. Hôtel 4 étoiles à Médine et La Mecque à 500m du Haram. Pension complète et encadrement spirituel par des oulémas réputés.",
        desc_wo: "Forfait standard bu am qualité. Hôtel 4 étoiles ci Médine ak Maka ci 500m ci Haram. Dunde bu mat ak ñaani oulémas yu rëy.",
        desc_ar: "باقة قياسية عالية الجودة. فندق 4 نجوم في المدينة ومكة على بعد 500 متر من الحرم. إقامة كاملة مع إرشاد ديني متميز من أشهر العلماء السنغاليين.",
        features: JSON.stringify(["Vol régulier Royal Air Maroc", "Hôtels 4★ proches des Harams", "Pension complète buffet", "Médecin sénégalais dans l'hôtel", "Séminaires préparatoires inclus"])
      },
      {
        name: "Sahel Omra & Hajj Confort",
        price: 8500000,
        type: "vip",
        rating: 4.9,
        address: "Almadies, Route du Méridien, Dakar",
        phone: "+221 33 869 90 00",
        email: "vip@sahelhajj.com",
        desc_fr: "L'excellence pour votre pèlerinage. Hôtels 5 étoiles situés directement sur l'esplanade du Haram (Makkah Clock Tower). Tentes VIP climatisées à Mina et Arafat avec lits.",
        desc_wo: "Forfait VIP bu gën a mag. Hôtel 5 étoiles ci Haram bi rekk (Clock Tower). Tente VIP and ak clim ak lal ci Mina ak Arafat.",
        desc_ar: "باقة النخبة الفاخرة. فندق 5 نجوم مطل مباشرة على ساحة الحرم (أبراج البيت). مخيمات مطورة لكبار الشخصيات مكيفة ومجهزة بأسرة في منى وعرفات.",
        features: JSON.stringify(["Vol Business Class Emirates", "Hôtels 5★ sur le Haram", "Pension complète gastronomique", "Tentes VIP privées à Mina", "Assistance personnalisée 24h/24"])
      }
    ];

    for (const a of mockAgencies) {
      await this.run(
        `INSERT INTO agencies (name, price, type, rating, address, phone, email, desc_fr, desc_wo, desc_ar, features)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [a.name, a.price, a.type, a.rating, a.address, a.phone, a.email, a.desc_fr, a.desc_wo, a.desc_ar, a.features]
      );
    }

    // Seed Announcements
    const mockAnnouncements = [
      {
        date: "23 Juin 2026",
        category: "admin",
        title_fr: "Ouverture des visites médicales",
        desc_fr: "La DGP informe les futurs pèlerins que les visites médicales d'aptitude ont débuté dans les hôpitaux régionaux agréés. Veuillez prendre rendez-vous rapidement.",
        title_wo: "Tambali wér-gi-yaram seet gi",
        desc_wo: "Njiitu Hajj bi (DGP) ngi xamal pèlerin yi ne faj gi door na ci fajukaay yu mag yi ci reew mi. Waajleen ko ci saasa.",
        title_ar: "بدء الفحوصات الطبية للحجاج",
        desc_ar: "تعلن البعثة الرسمية للحجاج عن بدء الفحوصات الطبية للتأكد من القدرة البدنية في المستشفيات الإقليمية. يرجى حجز موعد سريعاً."
      },
      {
        date: "15 Juin 2026",
        category: "security",
        title_fr: "Mise en garde contre les faux démarcheurs",
        desc_fr: "Attention aux intermédiaires non agréés qui proposent des visas ou forfaits Hajj parallèles. Seules les agences officielles ont l'autorisation.",
        title_wo: "Moytooleen naxkat yi",
        desc_wo: "Moytooleen ñiy jaay visa yu fake walla forfaits yu amul yoon. Agence yu dëggër yi rekk lañu nangu.",
        title_ar: "تحذير من سماسرة التأشيرات غير المرخصين",
        desc_ar: "تحذر بعثة الحج من التعامل مع الوسطاء غير المعتمدين الذين يعرضون تأشيرات أو باقات حج موازية. الوكالات المرخصة هي المصرح لها فقط."
      }
    ];

    for (const ann of mockAnnouncements) {
      await this.run(
        `INSERT INTO announcements (date, category, title_fr, desc_fr, title_wo, desc_wo, title_ar, desc_ar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [ann.date, ann.category, ann.title_fr, ann.desc_fr, ann.title_wo, ann.desc_wo, ann.title_ar, ann.desc_ar]
      );
    }

    // Seed Pilgrims
    const mockPilgrims = [
      {
        fullName: "Moustapha Diop",
        phone: "+221 77 567 89 12",
        email: "moustapha.diop@gmail.com",
        passportNumber: "SN9876543",
        birthDate: "1988-05-14",
        bloodType: "A+",
        medicalStatus: "apte",
        registrationStatus: "approved",
        selectedAgencyId: 1,
        emergencyContactName: "Awa Diop (Épouse)",
        emergencyContactPhone: "+221 76 112 34 56",
        registrationDate: "2026-06-10"
      },
      {
        fullName: "Khadidiatou Diallo",
        phone: "+221 78 123 45 67",
        email: "khadija.diallo@hotmail.fr",
        passportNumber: "SN1234567",
        birthDate: "1994-11-23",
        bloodType: "O-",
        medicalStatus: "pending",
        registrationStatus: "pending",
        selectedAgencyId: 2,
        emergencyContactName: "Ibrahima Diallo (Frère)",
        emergencyContactPhone: "+221 70 889 00 11",
        registrationDate: "2026-06-18"
      },
      {
        fullName: "Ousmane Ndiaye",
        phone: "+221 70 999 88 77",
        email: "ousmane.ndiaye@yahoo.sn",
        passportNumber: "SN4567890",
        birthDate: "1972-02-05",
        bloodType: "B+",
        medicalStatus: "apte",
        registrationStatus: "pending",
        selectedAgencyId: 1,
        emergencyContactName: "Fatoumata Ndiaye (Fille)",
        emergencyContactPhone: "+221 77 444 33 22",
        registrationDate: "2026-06-20"
      },
      {
        fullName: "Aïssatou Sow",
        phone: "+221 76 456 78 90",
        email: "aissatou.sow@live.fr",
        passportNumber: "SN3344556",
        birthDate: "1965-09-30",
        bloodType: "O+",
        medicalStatus: "inapte",
        registrationStatus: "rejected",
        selectedAgencyId: 3,
        emergencyContactName: "Abdou Sow (Fils)",
        emergencyContactPhone: "+221 77 888 99 99",
        registrationDate: "2026-06-22"
      }
    ];

    for (const p of mockPilgrims) {
      await this.run(
        `INSERT INTO pilgrims (fullName, phone, email, passportNumber, birthDate, bloodType, medicalStatus, registrationStatus, selectedAgencyId, emergencyContactName, emergencyContactPhone, registrationDate)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.fullName, p.phone, p.email, p.passportNumber, p.birthDate, p.bloodType, p.medicalStatus, p.registrationStatus, p.selectedAgencyId, p.emergencyContactName, p.emergencyContactPhone, p.registrationDate]
      );
    }

    console.log("[DB SEED] Database seeding completed successfully!");
  }
};
