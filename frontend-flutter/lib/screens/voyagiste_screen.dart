import 'package:flutter/material.dart';

class VoyagisteScreen extends StatelessWidget {
  final Map<String, dynamic> pilgrim;
  final String lang;

  const VoyagisteScreen({super.key, required this.pilgrim, required this.lang});

  @override
  Widget build(BuildContext context) {
    final bool isAr = lang == 'ar';
    final int agencyId = pilgrim['selectedAgencyId'] ?? 1;

    // Load agency specific mock details
    final String agencyName = agencyId == 1
        ? 'Voyages Teranga Hajj & Omra'
        : (agencyId == 2 ? 'Dakar Air Services Hajj' : 'Sahel Omra & Hajj Confort');
    final String agreementNum = agencyId == 1
        ? 'MTAES/AGR-2026-0042'
        : (agencyId == 2 ? 'MTAES/AGR-2026-0089' : 'MTAES/AGR-2026-0087');
    final String partnerId = agencyId == 1
        ? 'NP-SN-0145'
        : (agencyId == 2 ? 'NP-SN-0210' : 'NP-SN-0342');
    final String respName = agencyId == 1
        ? 'El Hadji Diop'
        : (agencyId == 2 ? 'Amadou Lamine Niang' : 'Oumar Diallo');
    final String quotaConfirm = agencyId == 1 ? '145' : (agencyId == 2 ? '287' : '88');
    final String quotaPending = agencyId == 1 ? '5' : (agencyId == 2 ? '33' : '12');
    final String quotaTotal = agencyId == 1 ? '150' : (agencyId == 2 ? '320' : '100');

    return Scaffold(
      appBar: AppBar(
        title: Text(isAr ? 'بيانات الوكالة' : 'Voyagiste', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF042F1A),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Agency Header Summary Card
            _buildAgencyHeader(agencyName, quotaConfirm, quotaPending, quotaTotal),
            const SizedBox(height: 16),

            // Informations Légales
            _buildSectionCard(
              title: isAr ? 'المعلومات القانونية' : 'Informations légales',
              icon: Icons.gavel_outlined,
              items: [
                _buildInfoRow(isAr ? 'رقم الترخيص' : 'N° Agrément', agreementNum),
                _buildInfoRow(isAr ? 'رمز شريك نسك' : 'Nusuk Partner ID', partnerId),
                _buildInfoRow(isAr ? 'المسؤول' : 'Responsable', respName),
              ],
            ),
            const SizedBox(height: 16),

            // Contacts
            _buildSectionCard(
              title: 'Contacts',
              icon: Icons.phone_outlined,
              items: [
                _buildInfoRow(isAr ? 'الهاتف' : 'Téléphone', '+221 33 821 45 67'),
                _buildInfoRow('WhatsApp', '+221 77 123 45 67'),
                _buildInfoRow('Email', 'contact@sunuvoyage.sn'),
                _buildInfoRow(isAr ? 'العنوان' : 'Adresse', 'Allées du Centenaire, Immeuble KHADIM, Dakar'),
              ],
            ),
            const SizedBox(height: 16),

            // Agents sur place
            _buildSectionCard(
              title: isAr ? 'المرشدون في البقاع المقدسة' : 'Agents sur place',
              icon: Icons.people_outline,
              items: [
                _buildAgentRow('Fatou Sarr', isAr ? 'منسقة المدينة المنورة' : 'Coordinatrice Médine', '+221 77 000 11 22'),
                const Divider(),
                _buildAgentRow('Mouhamed Sy', isAr ? 'منسق مكة المكرمة' : 'Coordinateur La Mecque', '+221 77 333 44 55'),
              ],
            ),
            const SizedBox(height: 16),

            // Transferts
            _buildSectionCard(
              title: isAr ? 'النقل والرحلات الداخلية' : 'Transferts',
              icon: Icons.directions_bus_filled_outlined,
              items: [
                _buildTransferRow('1', isAr ? 'حافلة المدينة ➔ مكة' : 'Bus Médine ➔ La Mecque', '08 Juin'),
                _buildTransferRow('2', isAr ? 'حافلة مكة ➔ عرفات' : 'Bus La Mecque ➔ Arafat', '14 Juin'),
                _buildTransferRow('3', isAr ? 'حافلة العودة' : 'Bus retour', '27 Juin'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAgencyHeader(String name, String confirm, String pending, String total) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF042F1A),
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
                  child: Icon(Icons.business, color: Colors.white, size: 24),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      lang == 'ar' ? 'شريك نسك معتمد' : 'Agréé MTAES - Nusuk Partner',
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
              _buildHeaderStatCol(lang == 'ar' ? 'مؤكد' : 'Confirmés', confirm),
              Container(width: 1, height: 30, color: Colors.white24),
              _buildHeaderStatCol(lang == 'ar' ? 'قيد الانتظار' : 'En attente', pending),
              Container(width: 1, height: 30, color: Colors.white24),
              _buildHeaderStatCol(lang == 'ar' ? 'الكل' : 'Quota total', total),
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

  Widget _buildAgentRow(String name, String role, String phone) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 2),
              Text(role, style: TextStyle(fontSize: 11, color: Colors.grey.shade500)),
            ],
          ),
          Text(phone, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF042F1A))),
        ],
      ),
    );
  }

  Widget _buildTransferRow(String step, String label, String date) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: const BoxDecoration(color: Color(0xFFE2F0D9), shape: BoxShape.circle),
            child: Center(
              child: Text(
                step,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
          ),
          Text(
            date,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
          )
        ],
      ),
    );
  }
}
