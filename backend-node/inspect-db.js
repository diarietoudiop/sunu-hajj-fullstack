const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db_primary.sqlite');
console.log(`🔍 Connexion à la base de données : ${dbPath}\n`);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Erreur de connexion:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  // 1. Lire les Administrateurs
  console.log('========================================');
  console.log('👥 COMPTES ADMINISTRATEURS (Table: admins)');
  console.log('========================================');
  db.all('SELECT id, username, fullName, email, department FROM admins', [], (err, rows) => {
    if (err) {
      console.error('Erreur:', err.message);
      return;
    }
    console.table(rows);

    // 2. Lire les Pèlerins
    console.log('\n========================================');
    console.log('🕋 REGISTRE DES PÈLERINS (Table: pilgrims)');
    console.log('========================================');
    db.all('SELECT id, fullName, passportNumber, phone, registrationStatus, medicalStatus, visaStatus, flightNumber FROM pilgrims', [], (err, rows) => {
      if (err) {
        console.error('Erreur:', err.message);
        return;
      }
      console.table(rows);

      // 3. Lire les Demandes de contact
      console.log('\n========================================');
      console.log('📞 DEMANDES DE CONTACT (Table: inquiries)');
      console.log('========================================');
      db.all('SELECT * FROM inquiries', [], (err, rows) => {
        if (err) {
          console.error('Erreur:', err.message);
          return;
        }
        console.table(rows);
        db.close();
      });
    });
  });
});
