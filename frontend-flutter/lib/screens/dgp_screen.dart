import 'package:flutter/material.dart';

class DgpScreen extends StatelessWidget {
  final String lang;
  const DgpScreen({super.key, required this.lang});

  @override
  Widget build(BuildContext context) {
    final bool isAr = lang == 'ar';
    final String title = isAr ? 'إدارة الحج' : 'DGP Officiel';

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
            // DGP Banner
            _buildDgpHeader(isAr),
            const SizedBox(height: 16),

            // Official Info Card
            _buildSectionCard(
              title: isAr ? 'المعلومات الرسمية' : 'Informations officielles',
              icon: Icons.info_outline,
              items: [
                _buildInfoRow(isAr ? 'المدير العام' : 'Directeur', 'Mamadou Koné'),
                _buildInfoRow(isAr ? 'العنوان' : 'Adresse', '72, Rue Moussé Diop - Dakar Plateau'),
                _buildInfoRow(isAr ? 'الهاتف' : 'Téléphone', '+221 33 822 14 00'),
                _buildInfoRow('Fax', '+221 33 822 14 01'),
                _buildInfoRow('Email', 'dgp@mae.gouv.sn'),
                _buildInfoRow(isAr ? 'الموقع الإلكتروني' : 'Site web', 'www.hajj.gouv.sn'),
              ],
            ),
            const SizedBox(height: 16),

            // Quotas Distribution Card
            _buildSectionCard(
              title: isAr ? 'توزيع الحصص الوطنية' : 'Répartition quota national',
              icon: Icons.pie_chart_outline,
              items: [
                _buildInfoRow(isAr ? 'العدد الإجمالي للحجاج الكلي' : 'Quota total KSA', '12 000'),
                _buildInfoRow(isAr ? 'مخصص للوكالات الخاصة' : 'Attribué aux agences', '9 800'),
                _buildInfoRow(isAr ? 'مخصص للدولة' : 'Réserve État', '2 200'),
                _buildInfoRow(isAr ? 'الميزانية التقديرية' : 'Budget prévisionnel', '12,4 Milliards FCFA'),
              ],
            ),
            const SizedBox(height: 16),

            // Commissions DGP Card
            _buildSectionCard(
              title: isAr ? 'لجان بعثة الحج الرسمية' : 'Commissions DGP',
              icon: Icons.groups_outlined,
              items: [
                _buildCommissionRow(isAr ? 'اللجنة الطبية' : 'Commission médicale', 'Dr. Rokhaya Ba', true),
                const Divider(),
                _buildCommissionRow(isAr ? 'اللجنة اللوجستية' : 'Commission logistique', 'Ibrahima Fall', true),
                const Divider(),
                _buildCommissionRow(isAr ? 'اللجنة المالية' : 'Commission financière', 'Aminata Diallo', true),
                const Divider(),
                _buildCommissionRow(isAr ? 'اللجنة الدينية والإرشاد' : 'Commission religieuse', 'Imam Maguette Sarr', true),
              ],
            ),
            const SizedBox(height: 16),

            // Calendrier DGP Card
            _buildSectionCard(
              title: isAr ? 'الجدول الزمني للبعثة' : 'Calendrier DGP 2026',
              icon: Icons.calendar_month_outlined,
              items: [
                _buildCalendarRow(isAr ? 'افتتاح باب التسجيل' : 'Ouverture inscriptions', '15 Janvier 2026', true),
                _buildCalendarRow(isAr ? 'غلق باب التسجيل' : 'Clôture dossiers', '15 Mars 2026', true),
                _buildCalendarRow(isAr ? 'الاعتماد النهائي' : 'Validation finale DGP', '01 Avril 2026', true),
                _buildCalendarRow(isAr ? 'إرسال بيانات نسك' : 'Transmission Nusuk', '15 Avril 2026', true),
                _buildCalendarRow(isAr ? 'مغادرة الرحلة الأولى' : 'Départ premier convoi', '01 Juin 2026', false),
                _buildCalendarRow(isAr ? 'عودة الرحلة الأخيرة' : 'Retour dernier convoi', '05 Juillet 2026', false),
              ],
            ),
            const SizedBox(height: 16),

            // Supervision card
            _buildSectionCard(
              title: isAr ? 'الرقابة على الوكالات الخاصة' : 'Supervision des agences',
              icon: Icons.supervised_user_circle_outlined,
              items: [
                _buildInfoRow(isAr ? 'الوكالات المعتمدة' : 'Agréées', '87'),
                _buildInfoRow(isAr ? 'الوكالات الموقوفة' : 'Suspendues', '3'),
                _buildInfoRow(isAr ? 'الوكالات قيد الدراسة' : 'En cours', '84'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDgpHeader(bool isAr) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: const Center(
                  child: Icon(Icons.gavel, color: Colors.white, size: 24),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isAr ? 'المندوبية العامة للحج' : 'Direction Générale des Pèlerinages',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      isAr ? 'جمهورية السنغال' : 'République du Sénégal',
                      style: const TextStyle(fontSize: 11, color: Color(0xFFD4AF37), fontWeight: FontWeight.bold),
                    )
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              _buildHeaderStatCol(isAr ? 'الحصة' : 'Quota KSA', '12 000'),
              Container(width: 1, height: 30, color: Colors.white24),
              _buildHeaderStatCol(isAr ? 'الوكالات' : 'Agences', '87'),
              Container(width: 1, height: 30, color: Colors.white24),
              _buildHeaderStatCol(isAr ? 'الحجاج' : 'Pèlerins', '11 847'),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildHeaderStatCol(String label, String val) {
    return Expanded(
      child: Column(
        children: [
          Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.white70)),
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

  Widget _buildCommissionRow(String name, String leader, bool active) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 2),
              Text(leader, style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFE2F0D9),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              lang == 'ar' ? 'نشط' : 'ACTIVE',
              style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.green),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildCalendarRow(String title, String date, bool completed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(
            completed ? Icons.check_circle : Icons.radio_button_unchecked,
            color: completed ? Colors.green : Colors.amber.shade700,
            size: 18,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
          ),
          Text(
            date,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: completed ? Colors.grey.shade700 : Colors.amber.shade700,
            ),
          )
        ],
      ),
    );
  }
}
