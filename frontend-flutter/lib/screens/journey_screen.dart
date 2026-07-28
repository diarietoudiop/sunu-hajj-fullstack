import 'package:flutter/material.dart';

class JourneyScreen extends StatelessWidget {
  final String lang;
  const JourneyScreen({super.key, required this.lang});

  @override
  Widget build(BuildContext context) {
    final bool isAr = lang == 'ar';
    final String title = isAr ? 'برنامج المناسك' : 'Programme des Rites';

    final List<Map<String, dynamic>> rites = [
      {
        'id': 1,
        'title_fr': 'Ihram & Tawaf d\'arrivée',
        'title_ar': 'الإحرام وطواف القدوم',
        'date': '05 Juin',
        'completed': true,
        'active': false,
      },
      {
        'id': 2,
        'title_fr': 'Médine - Ziyarat',
        'title_ar': 'المدينة المنورة - الزيارة',
        'date': '06-10 Juin',
        'completed': true,
        'active': false,
      },
      {
        'id': 3,
        'title_fr': 'Retour La Mecque',
        'title_ar': 'العودة إلى مكة المكرمة',
        'date': '11 Juin',
        'completed': true,
        'active': false,
      },
      {
        'id': 4,
        'title_fr': 'Yawm at-Tarwiya - Mina',
        'title_ar': 'يوم التروية - مشعر منى',
        'date': '14 Juin',
        'completed': false,
        'active': true,
      },
      {
        'id': 5,
        'title_fr': 'Wuquf Arafat',
        'title_ar': 'الوقوف بعرفة',
        'date': '15 Juin',
        'completed': false,
        'active': false,
      },
      {
        'id': 6,
        'title_fr': 'Muzdalifa - Nuit',
        'title_ar': 'المبيت بمزدلفة',
        'date': '15/16 Juin',
        'completed': false,
        'active': false,
      },
      {
        'id': 7,
        'title_fr': 'Ramy Jamarat + Sacrifice',
        'title_ar': 'رمي الجمرات والهدي',
        'date': '16 Juin',
        'completed': false,
        'active': false,
      },
      {
        'id': 8,
        'title_fr': 'Tawaf al-Ifada + Sa\'i',
        'title_ar': 'طواف الإفاضة والسعي',
        'date': '17 Juin',
        'completed': false,
        'active': false,
      },
      {
        'id': 9,
        'title_fr': 'Tawaf al-Wada\'',
        'title_ar': 'طواف الوداع',
        'date': '27 Juin',
        'completed': false,
        'active': false,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF042F1A),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Active Step Banner
            _buildActiveRiteHeader(isAr),
            
            // Timeline list
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: rites.length,
                    itemBuilder: (context, index) {
                      final rite = rites[index];
                      final String riteTitle = isAr ? rite['title_ar'] : rite['title_fr'];
                      return _buildTimelineItem(rite, riteTitle, index == rites.length - 1);
                    },
                  ),
                  const SizedBox(height: 20),

                  // Talbiyah Card
                  _buildTalbiyahCard(isAr),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildActiveRiteHeader(bool isAr) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: const BoxDecoration(
        color: Color(0xFFB48A31), // Golden/bronze background
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Text(
            'Hajj 1447 H',
            style: TextStyle(fontSize: 12, color: Colors.white70, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 6),
          Text(
            isAr ? 'برنامج المناسك' : 'Programme des Rites',
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 4),
          Text(
            isAr ? 'المرحلة النشطة : منى - أيام التشريق' : 'Étape active : Mina - Jours de Tashrik',
            style: const TextStyle(fontSize: 13, color: Colors.white, fontWeight: FontWeight.w500),
          )
        ],
      ),
    );
  }

  Widget _buildTimelineItem(Map<String, dynamic> rite, String title, bool isLast) {
    final bool completed = rite['completed'];
    final bool active = rite['active'];

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Dot & Line Column
          Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: active
                      ? const Color(0xFFB48A31)
                      : (completed ? const Color(0xFF042F1A) : Colors.white),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: active
                        ? const Color(0xFFB48A31)
                        : (completed ? const Color(0xFF042F1A) : Colors.grey.shade300),
                    width: 2,
                  ),
                ),
                child: Center(
                  child: active
                      ? const Icon(Icons.circle, color: Colors.white, size: 8)
                      : (completed
                          ? const Icon(Icons.check, color: Colors.white, size: 12)
                          : Text(
                              rite['id'].toString(),
                              style: TextStyle(fontSize: 10, color: Colors.grey.shade600, fontWeight: FontWeight.bold),
                            )),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: completed ? const Color(0xFF042F1A) : Colors.grey.shade300,
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14),

          // Content Column
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 16.0),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: active ? const Color(0xFFFFFDF5) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: active ? const Color(0xFFF3E8C4) : Colors.grey.shade200,
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.01),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    )
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: active ? FontWeight.bold : FontWeight.w500,
                          color: active ? const Color(0xFF042F1A) : Colors.black87,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    if (active)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3E8C4),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'ACTIF',
                          style: TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFFB48A31)),
                        ),
                      )
                    else
                      Text(
                        rite['date'] ?? '',
                        style: TextStyle(fontSize: 11, color: Colors.grey.shade500, fontWeight: FontWeight.bold),
                      )
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildTalbiyahCard(bool isAr) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              const Icon(Icons.menu_book, color: Color(0xFF042F1A), size: 18),
              const SizedBox(width: 8),
              Text(
                isAr ? 'التلبية' : 'Talbiyah',
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
              )
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFE2F0D9),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Column(
              children: [
                Text(
                  'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 6),
                Text(
                  'Labbayka Allahumma labbayk...',
                  style: TextStyle(fontSize: 12, color: Colors.black54, fontStyle: FontStyle.italic),
                  textAlign: TextAlign.center,
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
