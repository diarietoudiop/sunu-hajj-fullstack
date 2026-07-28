import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../widgets/scanner_dialog.dart';
import 'auth_screen.dart';

class HomeScreen extends StatefulWidget {
  final String lang;
  final Map<String, dynamic> pilgrim;

  const HomeScreen({super.key, required this.lang, required this.pilgrim});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> _announcements = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAnnouncements();
  }

  void _loadAnnouncements() async {
    setState(() => _isLoading = true);
    final data = await ApiService.fetchAnnouncements();
    setState(() {
      _announcements = data.isNotEmpty ? data : [
        {
          'id': 1,
          'date': '23 Juin 2026',
          'category': 'admin',
          'title_fr': 'Ouverture des visites médicales',
          'desc_fr': 'Les visites médicales d\'aptitude ont débuté dans les hôpitaux régionaux agréés.',
          'title_wo': 'Tambali wér-gi-yaram seet gi',
          'desc_wo': 'Njiitu Hajj bi (Sunu Hajj) ngi xamal pèlerin yi ne faj gi door na.',
          'title_ar': 'بدء الفحوصات الطبية للحجاج',
          'desc_ar': 'تعلن البعثة الرسمية للحجاج عن بدء الفحوصات الطبية للتأكد من القدرة البدنية.'
        }
      ];
      _isLoading = false;
    });
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
        content: const Text('Êtes-vous sûr de vouloir vous déconnecter de votre Espace Pèlerin ?'),
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
                  MaterialPageRoute(builder: (context) => AuthScreen(lang: widget.lang)),
                  (route) => false,
                );
              }
            },
            child: const Text('Déconnexion'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final bool isAr = widget.lang == 'ar';
    final String name = widget.pilgrim['fullName'] ?? 'El Hadj';

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(50),
              child: Image.asset(
                'assets/sunu_hajj_logo.png',
                width: 32,
                height: 32,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => const Icon(Icons.stars, color: Colors.amber),
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              'Sunu Hajj',
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF042F1A),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner, color: Colors.white),
            onPressed: () => ScannerDialog.show(context, widget.lang),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white70),
            tooltip: 'Déconnexion',
            onPressed: () => _confirmLogout(context),
          ),
          const SizedBox(width: 4),
          // Profile Photo Avatar
          Container(
            margin: const EdgeInsets.only(right: 12),
            child: CircleAvatar(
              radius: 16,
              backgroundColor: const Color(0xFFD4AF37),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(50),
                child: Image.network(
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                  width: 28,
                  height: 28,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Icon(Icons.person, size: 18, color: Colors.white),
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Welcome Header Card
            _buildWelcomeHeader(name, isAr),
            const SizedBox(height: 16),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Quick Summary Grid (Logistics Cards)
                  _buildQuickLogisticsGrid(isAr),
                  const SizedBox(height: 18),

                  // Senegal Hajj Ecosystem Stats
                  _buildEcosystemCard(isAr),
                  const SizedBox(height: 18),

                  // Checklist Documents Status Card
                  _buildDocumentsStatusCard(isAr),
                  const SizedBox(height: 18),

                  // Nusuk sync banner
                  _buildNusukSyncBanner(isAr),
                  const SizedBox(height: 24),

                  // Announcements title
                  Text(
                    widget.lang == 'ar'
                        ? 'بيانات بعثة الحج السنغالية'
                        : (widget.lang == 'wo' ? 'Xibaari Sunu Hajj bi' : 'Communiqués officiels Sunu Hajj'),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF042F1A),
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Announcements List
                  _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _announcements.length,
                          itemBuilder: (context, index) {
                            final ann = _announcements[index];
                            final annTitle = widget.lang == 'ar'
                                ? ann['title_ar']
                                : (widget.lang == 'wo' ? ann['title_wo'] : ann['title_fr']);
                            final annDesc = widget.lang == 'ar'
                                ? ann['desc_ar']
                                : (widget.lang == 'wo' ? ann['desc_wo'] : ann['desc_fr']);

                            return Card(
                              margin: const EdgeInsets.only(bottom: 14),
                              color: Colors.white,
                              surfaceTintColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                                side: BorderSide(color: Colors.grey.shade200, width: 1),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(18.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      crossAxisAlignment: CrossAxisAlignment.center,
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFE2F0D9),
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(
                                            ann['category'].toString().toUpperCase(),
                                            style: const TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFF042F1A),
                                              letterSpacing: 0.5,
                                            ),
                                          ),
                                        ),
                                        Text(
                                          ann['date'] ?? '',
                                          style: TextStyle(fontSize: 11, color: Colors.grey.shade500, fontWeight: FontWeight.w500),
                                        )
                                      ],
                                    ),
                                    const SizedBox(height: 14),
                                    Text(
                                      annTitle ?? '',
                                      style: const TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF042F1A),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      annDesc ?? '',
                                      style: TextStyle(fontSize: 13, color: Colors.grey.shade800, height: 1.5),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWelcomeHeader(String name, bool isAr) {
    return Stack(
      children: [
        Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF021B0F), Color(0xFF042F1A)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'بسم الله الرحمن الرحيم',
                style: TextStyle(fontSize: 11, color: Colors.white54, fontStyle: FontStyle.italic, letterSpacing: 0.5),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                isAr ? 'مرحباً بك، يا حاج' : 'Bienvenue,',
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: Colors.white70),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 2),
              Text(
                name,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFD4AF37), letterSpacing: -0.5),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildHeaderBadge('ID NUSUK', widget.pilgrim['passportNumber'] == 'INVITÉ' ? 'NON SYNCHRO' : 'NG-SN-2026-084721'),
                  const SizedBox(width: 12),
                  _buildHeaderBadge(
                    isAr ? 'الوضع' : 'STATUT',
                    widget.pilgrim['passportNumber'] == 'INVITÉ'
                        ? (isAr ? 'زائر' : 'MODE INVITÉ')
                        : (isAr ? 'مؤكد' : 'CONFIRMÉ'),
                  ),
                ],
              )
            ],
          ),
        ),
        Positioned(
          right: -30,
          top: -20,
          child: Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFFD4AF37).withOpacity(0.04),
            ),
          ),
        ),
        Positioned(
          left: -40,
          bottom: -30,
          child: Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.02),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeaderBadge(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.white.withOpacity(0.12)),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(fontSize: 8, color: Colors.white70, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 10, color: Colors.white, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildQuickLogisticsGrid(bool isAr) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: [
        _buildLogisticsCard(
          icon: Icons.flight_takeoff,
          title: isAr ? 'رحلة الذهاب' : 'Vol aller',
          value: widget.pilgrim['flightNumber'] ?? 'TX-201',
          date: '01 Jun 2026',
        ),
        _buildLogisticsCard(
          icon: Icons.hotel,
          title: isAr ? 'السكن' : 'Hébergement',
          value: widget.pilgrim['hotelMakkah'] ?? 'Makkah Accommodation',
          date: 'Chambre 1408',
        ),
        _buildLogisticsCard(
          icon: Icons.tour,
          title: isAr ? 'الموقع الحالي' : 'Étape actuelle',
          value: 'Mina',
          date: 'Zone B - Tente 14',
        ),
        _buildLogisticsCard(
          icon: Icons.group,
          title: isAr ? 'المجموعة' : 'Groupe',
          value: '42 pèlerins',
          date: 'Cheikh Ibrahima Tall',
        ),
      ],
    );
  }

  Widget _buildLogisticsCard({required IconData icon, required String title, required String value, required String date}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.015),
            blurRadius: 6,
            offset: const Offset(0, 2),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(
                  color: Color(0xFFE2F0D9),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: const Color(0xFF042F1A), size: 14),
              ),
              Text(date, style: TextStyle(fontSize: 8, color: Colors.grey.shade500, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 4),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: TextStyle(fontSize: 8, color: Colors.grey.shade500, fontWeight: FontWeight.w800, letterSpacing: 0.2)),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildEcosystemCard(bool isAr) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.015),
            blurRadius: 8,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: const BoxDecoration(color: Color(0xFFE2F0D9), shape: BoxShape.circle),
                child: const Icon(Icons.language, color: Color(0xFF042F1A), size: 14),
              ),
              const SizedBox(width: 8),
              Text(
                isAr ? 'إحصائيات موسم الحج بالسنغال' : 'Écosystème Hajj Sénégal',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
              )
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildEcosystemStatCol('87', isAr ? 'الوكالات' : 'AGENCES'),
              Container(width: 1, height: 30, color: Colors.grey.shade200),
              _buildEcosystemStatCol('11 847', isAr ? 'الحجاج' : 'PÈLERINS'),
              Container(width: 1, height: 30, color: Colors.grey.shade200),
              _buildEcosystemStatCol('12 000', isAr ? 'الحصة' : 'QUOTA'),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildEcosystemStatCol(String val, String label) {
    return Expanded(
      child: Column(
        children: [
          Text(val, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF042F1A))),
          const SizedBox(height: 2),
          Text(label, style: TextStyle(fontSize: 9, color: Colors.grey.shade500, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildDocumentsStatusCard(bool isAr) {
    return Card(
      color: Colors.white,
      surfaceTintColor: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Icon(Icons.folder_open_outlined, color: Color(0xFF042F1A), size: 20),
                const SizedBox(width: 8),
                Text(
                  isAr ? 'ملف الوثائق الرسمية' : 'Documents Officiels',
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                )
              ],
            ),
            const SizedBox(height: 12),
            _buildDocStatusRow(isAr ? 'جواز السفر' : 'Passeport', true),
            const Divider(height: 1),
            _buildDocStatusRow(isAr ? 'تأشيرة الحج' : 'Visa Hajj', true),
            const Divider(height: 1),
            _buildDocStatusRow(isAr ? 'اللقاحات' : 'Vaccins', true),
            const Divider(height: 1),
            _buildDocStatusRow(isAr ? 'عقد الوكالة' : 'Contrat voyagiste', true),
            const Divider(height: 1),
            _buildDocStatusRow(isAr ? 'التأمين الصحي' : 'Assurance voyage', false),
          ],
        ),
      ),
    );
  }

  Widget _buildDocStatusRow(String label, bool completed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 13)),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: completed ? const Color(0xFFE2F0D9) : Colors.amber.shade50,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              completed ? (widget.lang == 'ar' ? 'مقبول' : 'VALIDE') : (widget.lang == 'ar' ? 'معلق' : 'EN ATTENTE'),
              style: TextStyle(
                fontSize: 9, 
                fontWeight: FontWeight.bold, 
                color: completed ? Colors.green : Colors.amber.shade800
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildNusukSyncBanner(bool isAr) {
    final String passport = widget.pilgrim['passportNumber'] ?? 'SN9876543';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFE2F0D9),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.green.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.sync, color: Colors.green, size: 18),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isAr ? 'مزامنة بوابة نسك' : 'Interface Nusuk',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                  ),
                  Text(
                    isAr ? 'تمت المزامنة بنجاح' : 'Sync : Aujourd\'hui à 10h32',
                    style: TextStyle(fontSize: 9, color: Colors.grey.shade700),
                  ),
                ],
              )
            ],
          ),
          Text(
            isAr ? 'متصل' : 'SYNCHRONISÉ',
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.green, letterSpacing: 0.5),
          )
        ],
      ),
    );
  }
}
