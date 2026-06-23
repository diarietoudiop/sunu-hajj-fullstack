import 'package:flutter/material.dart';

class JourneyScreen extends StatefulWidget {
  final String lang;
  const JourneyScreen({super.key, required this.lang});

  @override
  State<JourneyScreen> createState() => _JourneyScreenState();
}

class _JourneyScreenState extends State<JourneyScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final Map<String, Map<String, List<Map<String, String>>>> _timelineData = {
    'fr': {
      'before': [
        { 'step': 'Étape 1', 'title': 'Visite médicale obligatoire', 'desc': 'Passage devant le médecin conseil désigné par la DGP pour obtenir le certificat d\'aptitude.', 'tip': 'Rendez-vous à l\'hôpital régional muni de votre carte d\'identité.' },
        { 'step': 'Étape 2', 'title': 'Dossier & Validation passeport', 'desc': 'Vérification des pièces justificatives et dépôt du passeport biométrique officiel.', 'tip': 'Vérifiez la validité (min 6 mois).' },
        { 'step': 'Étape 3', 'title': 'Paiement du forfait de voyage', 'desc': 'Versement des frais du package auprès de la banque agréée ou de votre agence.', 'tip': 'Conservez précieusement vos reçus.' },
      ],
      'during': [
        { 'step': 'Jour 1', 'title': 'Vol Dakar - Djeddah / Médine', 'desc': 'Départ de l\'AIBD. Prise d\'intention d\'Ihram dans l\'avion.', 'tip': 'Gardez l\'Ihram dans votre bagage à main.' },
        { 'step': 'Rite 1', 'title': 'Mina - Tentes & Prières', 'desc': 'Installation dans les tentes de Mina le 8 Dhou al-hijja.', 'tip': 'Buvez beaucoup d\'eau.' },
        { 'step': 'Rite 2', 'title': 'Journée de Arafat', 'desc': 'Station debout sur le mont Arafat le 9 Dhou al-hijja. Prières et invocations.', 'tip': 'C\'est le pilier majeur du Hajj.' },
      ],
      'after': [
        { 'step': 'Étape 1', 'title': 'Tawaf d\'Adieu (Al-Wadaa)', 'desc': 'Dernière circumambulation autour de la Kaaba.', 'tip': 'C\'est le dernier acte obligatoire.' },
        { 'step': 'Étape 2', 'title': 'Retour au Sénégal', 'desc': 'Enregistrement à Djeddah et retour vers Dakar AIBD.', 'tip': 'Étiquetez votre bouteille d\'eau de Zamzam.' },
      ]
    },
    'wo': {
      'before': [
        { 'step': 'Étape 1', 'title': 'Wér-gi-yaram seet gi', 'desc': 'Dem ci docteur bi DGP tëral ngir certificat.', 'tip': 'Demal ak sa carte d\'identité.' },
        { 'step': 'Étape 2', 'title': 'Kayit yi ak Passeport bi', 'desc': 'Seet say kayit yu wér ak denc passeport bi.', 'tip': 'Passeport bi na am 6 mois.' },
        { 'step': 'Étape 3', 'title': 'Fay forfait u Hajj bi', 'desc': 'Denc sa koppari Hajj ci banque walla agence.', 'tip': 'Dencal say reçu.' },
      ],
      'during': [
        { 'step': 'Jour 1', 'title': 'Vol Dakar - Djeddah', 'desc': 'Décollage ci AIBD. Sol sa Ihram ci plane bi.', 'tip': 'Defal sa Ihram ci bagage u loxó bi.' },
        { 'step': 'Rite 1', 'title': 'Mina - Tente yi', 'desc': 'Aksi ci tente u Mina ci 8 Dhou al-hijja.', 'tip': 'Nanal ndox bu baax.' },
        { 'step': 'Rite 2', 'title': 'Bësu Arafat', 'desc': 'Taxaw ci mont Arafat ci 9 Dhou al-hijja di ñaan.', 'tip': 'Gën a wóolu ñaan yi.' },
      ],
      'after': [
        { 'step': 'Étape 1', 'title': 'Tawaf u Taggoo', 'desc': 'Tawaf bu mujj bi ci Kaaba laata nga guèn Maka.', 'tip': 'Lii moy taggoo bi.' },
        { 'step': 'Étape 2', 'title': 'Dellusi ci Sénégal', 'desc': 'Dem aéroportu Djeddah di dellu Dakar.', 'tip': 'Defal sa tour ci Zamzam bi.' },
      ]
    },
    'ar': {
      'before': [
        { 'step': 'الخطوة الأولى', 'title': 'الفحص الطبي الإلزامي', 'desc': 'زيارة الطبيب المعتمد للحصول على شهادة اللياقة البدنية.', 'tip': 'توجه إلى المستشفى برفقة بطاقتك الشخصية.' },
        { 'step': 'الخطوة الثانية', 'title': 'تدقيق المستندات والجواز', 'desc': 'تقديم جواز السفر البيومتري الرسمي وتدقيق الأوراق.', 'tip': 'تأكد من صلاحية الجواز لـ 6 أشهر.' },
        { 'step': 'الخطوة الثالثة', 'title': 'دفع رسوم باقة السفر', 'desc': 'سداد تكلفة الباقة لدى البنوك المعتمدة أو الوكالة.', 'tip': 'احتفظ بسندات الدفع الورقية.' },
      ],
      'during': [
        { 'step': 'اليوم الأول', 'title': 'رحلة الطيران دكار - جدة', 'desc': 'المغادرة من مطار دكار وعقد نية الإحرام في الطائرة.', 'tip': 'ضع لباس الإحرام في حقيبتك اليدوية.' },
        { 'step': 'المشعر الأول', 'title': 'منى - الاستقرار والصلوات', 'desc': 'النزول بمخيمات منى في يوم التروية (8 ذي الحجة).', 'tip': 'شرب المياه لتفادي ضربات الشمس.' },
        { 'step': 'المشعر الثاني', 'title': 'يوم عرفة - الوقوف الأكبر', 'desc': 'الوقوف بصعيد عرفات في 9 ذي الحجة للدعاء والتضرع.', 'tip': 'هو أعظم أركان الحج.' },
      ],
      'after': [
        { 'step': 'الخطوة الأولى', 'title': 'طواف الوداع', 'desc': 'أداء الطواف الأخير حول الكعبة المشرفة.', 'tip': 'آخر واجبات الحج قبل السفر.' },
        { 'step': 'الخطوة الثانية', 'title': 'العودة إلى السنغال', 'desc': 'التوجه للمطار والعودة إلى دكار بسلامة الله.', 'tip': 'تأكد من شحن عبوة ماء زمزم الرسمية.' },
      ]
    }
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Widget _buildTimeline(String phase) {
    final List<Map<String, String>> steps = _timelineData[widget.lang]?[phase] ?? [];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: steps.length,
      itemBuilder: (context, index) {
        final step = steps[index];
        final isFirst = index == 0;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Vertical timeline markers
            Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: isFirst ? const Color(0xFF0B5D34) : Colors.white,
                    border: Border.all(
                      color: isFirst ? const Color(0xFF0B5D34) : Colors.grey.shade400,
                      width: 3,
                    ),
                    shape: BoxShape.circle,
                  ),
                ),
                if (index < steps.length - 1)
                  Container(
                    width: 2,
                    height: 120,
                    color: Colors.grey.shade300,
                  ),
              ],
            ),
            const SizedBox(width: 16),

            // Card details
            Expanded(
              child: Card(
                color: Colors.white,
                elevation: 1,
                margin: const EdgeInsets.only(bottom: 16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isFirst ? const Color(0xFFE7F2E2) : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              step['step']!,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: isFirst ? const Color(0xFF0B5D34) : Colors.grey.shade700,
                              ),
                            ),
                          ),
                          if (isFirst)
                            Text(
                              widget.lang == 'ar' ? 'قيد التنفيذ' : (widget.lang == 'wo' ? 'Ya ngi ci' : 'En cours'),
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0B5D34),
                              ),
                            )
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        step['title']!,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF052C18),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        step['desc']!,
                        style: const TextStyle(fontSize: 12, color: Colors.black87),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFAF4EB),
                          borderRadius: BorderRadius.circular(6),
                          border: const Border(
                            left: BorderSide(color: Color(0xFFC5A880), width: 3),
                          ),
                        ),
                        child: Text(
                          '${widget.lang == 'ar' ? 'نصيحة عملية' : (widget.lang == 'wo' ? 'Xelal' : 'Conseil pratique')} : ${step['tip']}',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF8C6D40)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.lang == 'ar'
        ? 'مسار الحجاج'
        : (widget.lang == 'wo' ? 'Yoonu pèlerin bi' : 'Parcours du pèlerin');
        
    final tabLabels = {
      'fr': ['Avant le Hajj', 'Pendant (Rites)', 'Après le retour'],
      'wo': ['Laata dem gi', 'Maka (Rite yi)', 'Dellusi gi'],
      'ar': ['قبل المغادرة', 'المشاعر المقدسة', 'بعد العودة']
    }[widget.lang]!;

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF0B5D34),
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: const Color(0xFFC5A880),
          tabs: [
            Tab(text: tabLabels[0]),
            Tab(text: tabLabels[1]),
            Tab(text: tabLabels[2]),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildTimeline('before'),
          _buildTimeline('during'),
          _buildTimeline('after'),
        ],
      ),
    );
  }
}
