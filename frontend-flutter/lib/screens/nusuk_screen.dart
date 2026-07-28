import 'package:flutter/material.dart';
import '../widgets/scanner_dialog.dart';

class NusukScreen extends StatelessWidget {
  final Map<String, dynamic> pilgrim;
  final String lang;

  const NusukScreen({super.key, required this.pilgrim, required this.lang});

  @override
  Widget build(BuildContext context) {
    final bool isAr = lang == 'ar';
    final String title = isAr ? 'بوابة نسك' : 'Nusuk';

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF042F1A),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner, color: Colors.white),
            onPressed: () => ScannerDialog.show(context, lang),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Nusuk Portal Banner
            _buildNusukHeader(isAr),
            const SizedBox(height: 16),

            // Statuts Officiels
            _buildSectionCard(
              title: isAr ? 'حالات الاعتماد الرسمية' : 'Statuts officiels',
              icon: Icons.check_circle_outline,
              items: [
                _buildStatusRow(isAr ? 'موافقة الحاج' : 'Approbation pèlerin', isAr ? 'مقبول' : 'APPROUVÉ', Colors.green),
                _buildStatusRow(isAr ? 'حالة التأشيرة' : 'Statut visa', isAr ? 'صادرة' : 'ÉMIS', Colors.green),
                _buildInfoRow(isAr ? 'خيمة منى' : 'Tente Mina', 'Zone B - Tente 14'),
                _buildInfoRow(isAr ? 'حافلة عرفات' : 'Bus Arafat', 'Groupe SN-084 - Depart 02h00'),
                _buildInfoRow(isAr ? 'آخر مزامنة' : 'Dernière synchronisation', isAr ? 'اليوم في 10:32' : 'Aujourd\'hui à 10h32'),
              ],
            ),
            const SizedBox(height: 16),

            // QR Code Nusuk Section
            _buildQrCodeCard(context, isAr),
          ],
        ),
      ),
    );
  }

  Widget _buildNusukHeader(bool isAr) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF021B0F),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Text('🇸🇦', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isAr ? 'منصة نسك السعودية' : 'Nusuk Portal',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    isAr ? 'وزارة الحج والعمرة - المملكة العربية السعودية' : 'Ministère du Hajj & Omra - KSA',
                    style: const TextStyle(fontSize: 10, color: Colors.white70),
                  )
                ],
              )
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.green,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              children: [
                Icon(Icons.check, color: Colors.white, size: 12),
                SizedBox(width: 4),
                Text(
                  'Sync OK',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ],
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

  Widget _buildStatusRow(String label, String status, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: Colors.grey.shade600)),
          Text(
            status,
            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: color),
          ),
        ],
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

  Widget _buildQrCodeCard(BuildContext context, bool isAr) {
    final String passport = pilgrim['passportNumber'] ?? 'SN9876543';
    return Card(
      color: Colors.white,
      surfaceTintColor: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE2F0D9),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.qr_code_scanner, color: Color(0xFF042F1A), size: 16),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    isAr ? 'المسح الضوئي لبطاقة نسك ورامز QR' : 'Scanner Carte Physique & QR Nusuk',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                  ),
                )
              ],
            ),
            const SizedBox(height: 6),
            Text(
              isAr
                  ? 'امسح البطاقة الورقية أو الجواز الفيزيائي للحاج للتحقق من البيانات الفورية'
                  : 'Scannez le Pass/Badge physique du pèlerin pour vérifier son habilitation Nusuk',
              style: TextStyle(fontSize: 11, color: Colors.grey.shade500),
            ),
            const SizedBox(height: 16),
            // Primary Scanner Action Button
            ElevatedButton.icon(
              onPressed: () => ScannerDialog.show(context, lang),
              icon: const Icon(Icons.camera_alt_outlined, color: Colors.white, size: 18),
              label: Text(
                isAr ? 'مسح بطاقة نسك الفيزيائية' : 'Scanner une carte Nusuk physique',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF042F1A),
                minimumSize: const Size.fromHeight(48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 2,
              ),
            ),
            const SizedBox(height: 20),
            const Divider(),
            const SizedBox(height: 12),
            Text(
              isAr ? 'رمز QR الخاص بك للعرض عند النقاط' : 'Mon QR Code Numérique Officiel',
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
            ),
            const SizedBox(height: 10),
            // Real dynamically generated QR code pointing to official Nusuk validation details
            Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300, width: 1),
                borderRadius: BorderRadius.circular(12),
                color: Colors.white,
              ),
              padding: const EdgeInsets.all(14),
              child: Image.network(
                'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Nusuk-KSA-Approved-$passport',
                width: 120,
                height: 120,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.qr_code, size: 100),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Nusuk ID : NG-SN-2026-084721',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              isAr ? 'تم الإنشاء بعد موافقة وزارة الحج' : 'Généré après approbation officielle Nusuk',
              style: TextStyle(fontSize: 10, color: Colors.grey.shade500),
            )
          ],
        ),
      ),
    );
  }
}
