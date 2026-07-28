import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_screen.dart';

class PelerinScreen extends StatelessWidget {
  final Map<String, dynamic> pilgrim;
  final String lang;

  const PelerinScreen({super.key, required this.pilgrim, required this.lang});

  @override
  Widget build(BuildContext context) {
    final bool isAr = lang == 'ar';
    final String title = isAr ? 'ملف الحاج' : (lang == 'wo' ? 'Dossier Pèlerin' : 'Fiche Pèlerin');

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF042F1A),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Profile Card
            _buildProfileHeader(context),
            const SizedBox(height: 16),

            // Identité Section
            _buildSectionCard(
              title: isAr ? 'الهوية' : 'Identité',
              icon: Icons.badge_outlined,
              items: [
                _buildInfoRow(isAr ? 'رقم التعريف الوطني' : 'CIN', pilgrim['cin'] ?? '5 1234567 8'),
                _buildInfoRow(isAr ? 'جواز السفر' : 'Passeport', pilgrim['passportNumber'] ?? 'SN1234567'),
                _buildInfoRow(isAr ? 'تاريخ انتهاء الصلاحية' : 'Expiration passeport', '2030-08-14'),
                _buildInfoRow(isAr ? 'تاريخ الميلاد' : 'Date de naissance', pilgrim['birthDate'] ?? '12/05/1978'),
                _buildInfoRow(isAr ? 'الجنس' : 'Sexe', isAr ? 'ذكر' : 'Masculin'),
              ],
            ),
            const SizedBox(height: 16),

            // Contacts Section
            _buildSectionCard(
              title: 'Contacts',
              icon: Icons.phone_outlined,
              items: [
                _buildInfoRow(isAr ? 'الهاتف' : 'Téléphone', pilgrim['phone'] ?? '+221 77 123 45 67'),
                _buildInfoRow('Email', pilgrim['email'] ?? 'moustapha.diop@gmail.com'),
                _buildInfoRow(isAr ? 'العنوان' : 'Adresse', 'Cité Keur Gorgui, Dakar'),
              ],
            ),
            const SizedBox(height: 16),

            // Voyage Section
            _buildSectionCard(
              title: isAr ? 'الرحلة' : 'Voyage',
              icon: Icons.flight_takeoff_outlined,
              items: [
                _buildVoyageCard(
                  title: isAr ? 'رحلة الذهاب' : 'Vol aller',
                  flight: pilgrim['flightNumber'] ?? 'TX-201',
                  route: 'DSS ➔ JED',
                  time: '01 Juin 2026 à 23:45',
                ),
                const SizedBox(height: 10),
                _buildVoyageCard(
                  title: isAr ? 'رحلة العودة' : 'Vol retour',
                  flight: 'SV 7424',
                  route: 'JED ➔ DSS',
                  time: '28 Juin 2026 à 04:30',
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Hébergement Section
            _buildSectionCard(
              title: isAr ? 'السكن والمجموعة' : 'Hébergement & Groupe',
              icon: Icons.hotel_outlined,
              items: [
                _buildInfoRow(isAr ? 'الفندق' : 'Hôtel', pilgrim['hotelMakkah'] ?? 'Makkah Accommodation'),
                _buildInfoRow(isAr ? 'المجموعة' : 'Groupe', 'Groupe Médine A - 42 pèlerins'),
                _buildInfoRow(isAr ? 'المرشد' : 'Guide', 'Cheikh Ibrahima Tall'),
              ],
            ),
            const SizedBox(height: 16),

            // Vaccins Section
            _buildSectionCard(
              title: isAr ? 'اللقاحات' : 'Vaccins',
              icon: Icons.vaccines_outlined,
              items: [
                _buildVaccinRow(isAr ? 'التهاب السحايا' : 'Méningite', true),
                _buildVaccinRow('COVID-19', true),
                _buildVaccinRow(isAr ? 'الأنفلونزا الموسمية' : 'Grippe saisonnière', true),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: const [
            Icon(Icons.logout, color: Colors.red),
            SizedBox(width: 8),
            Text('Déconnexion', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const Text('Voulez-vous vraiment vous déconnecter de votre Espace Pèlerin ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFE11D48),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              Navigator.pop(context);
              final prefs = await SharedPreferences.getInstance();
              await prefs.remove('sunuhajj_user_passport');
              if (context.mounted) {
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => AuthScreen(lang: lang)),
                  (route) => false,
                );
              }
            },
            child: const Text('Se déconnecter'),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200, width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: Row(
        children: [
          // Profile Photo Avatar
          Stack(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFD4AF37), width: 2),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(50),
                  child: Image.network(
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => CircleAvatar(
                      backgroundColor: const Color(0xFFE2F0D9),
                      child: Text(
                        (pilgrim['fullName'] ?? 'P').substring(0, 1),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 22, color: Color(0xFF042F1A)),
                      ),
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFF042F1A),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt, color: Colors.white, size: 10),
                ),
              )
            ],
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  pilgrim['fullName'] ?? 'Pèlerin Sénégalais',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Text('El Hadj', style: TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE2F0D9),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Text(
                        'CONFIRMÉ',
                        style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF042F1A)),
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'ID NUSUK : NG-SN-2026-084721',
                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                  ),
                )
              ],
            ),
          ),
          // Logout Button
          IconButton(
            onPressed: () => _confirmLogout(context),
            tooltip: 'Se déconnecter',
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F2),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFFECDD3)),
              ),
              child: const Icon(Icons.logout_rounded, color: Color(0xFFE11D48), size: 18),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildSectionCard({required String title, required IconData icon, required List<Widget> items}) {
    return Card(
      color: Colors.white,
      surfaceTintColor: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200, width: 1),
      ),
      child: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.01),
              blurRadius: 8,
              offset: const Offset(0, 3),
            )
          ],
        ),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE2F0D9),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: const Color(0xFF042F1A), size: 14),
                ),
                const SizedBox(width: 10),
                Text(
                  title,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...items,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF111827))),
        ],
      ),
    );
  }

  Widget _buildVoyageCard({required String title, required String flight, required String route, required String time}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF9F5),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF042F1A))),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('$flight ➔ $route', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              Text(time, style: TextStyle(fontSize: 11, color: Colors.grey.shade600)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildVaccinRow(String label, bool active) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.green, size: 16),
              const SizedBox(width: 8),
              Text(label, style: const TextStyle(fontSize: 13)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFE2F0D9),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Text(
              'VALIDE',
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.green),
            ),
          )
        ],
      ),
    );
  }
}
