import 'package:flutter/material.dart';
import '../main.dart';
import '../services/api_service.dart';

class HomeScreen extends StatefulWidget {
  final String lang;
  const HomeScreen({super.key, required this.lang});

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

  @override
  void didUpdateWidget(HomeScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.lang != widget.lang) {
      _loadAnnouncements();
    }
  }

  void _loadAnnouncements() async {
    setState(() => _isLoading = true);
    final data = await ApiService.fetchAnnouncements();
    setState(() {
      _announcements = data.isNotEmpty
          ? data
          : [
              {
                'id': 1,
                'date': '23 Juin 2026',
                'category': 'admin',
                'title_fr': 'Ouverture des visites médicales',
                'desc_fr': 'Les visites médicales d\'aptitude ont débuté dans les hôpitaux régionaux agréés.',
                'title_wo': 'Tambali wér-gi-yaram seet gi',
                'desc_wo': 'Njiitu Hajj bi (DGP) ngi xamal pèlerin yi ne faj gi door na.',
                'title_ar': 'بدء الفحوصات الطبية للحجاج',
                'desc_ar': 'تعلن البعثة الرسمية للحجاج عن بدء الفحوصات الطبية للتأكد من القدرة البدنية.'
              }
            ];
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final title = L10n.get('welcome_title', widget.lang);
    final subtitle = L10n.get('welcome_sub', widget.lang);
    final scamTitle = L10n.get('scam_warning_title', widget.lang);
    final scamDesc = L10n.get('scam_warning_desc', widget.lang);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          L10n.get('app_title', widget.lang),
          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0B5D34),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.language, color: Colors.white),
            onSelected: (String lang) {
              SunuHajjApp.setLocale(context, lang);
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(value: 'fr', child: Text('Français')),
              const PopupMenuItem(value: 'wo', child: Text('Wolof')),
              const PopupMenuItem(value: 'ar', child: Text('العربية')),
            ],
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Hero Banner Banner
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF052C18), Color(0xFF0B5D34)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Anti-scam Warning Card
                  Card(
                    color: const Color(0xFFFFF5F5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: const BorderSide(color: Color(0xFFFEE2E2)),
                    ),
                    elevation: 0,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.warning_amber_rounded, color: Colors.red, size: 28),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  scamTitle,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF991B1B),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  scamDesc,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFFB91C1C),
                                  ),
                                ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Announcements title
                  Text(
                    widget.lang == 'ar'
                        ? 'بيانات بعثة الحج السنغالية'
                        : (widget.lang == 'wo' ? 'Xibaari DGP bi' : 'Communiqués officiels DGP'),
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF052C18),
                    ),
                  ),
                  const SizedBox(height: 10),

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
                              margin: const EdgeInsets.only(bottom: 12),
                              color: Colors.white,
                              elevation: 1,
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      alignment: Alignment.center,
                                      mainAxisAlignment: MainAxisAlignment.between,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFE7F2E2),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            ann['category'].toString().toUpperCase(),
                                            style: const TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: Color(0xFF0B5D34),
                                            ),
                                          ),
                                        ),
                                        Text(
                                          ann['date'] ?? '',
                                          style: const TextStyle(fontSize: 11, color: Colors.grey),
                                        )
                                      ],
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      annTitle ?? '',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF052C18),
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      annDesc ?? '',
                                      style: const TextStyle(fontSize: 12, color: Colors.black87),
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
}
