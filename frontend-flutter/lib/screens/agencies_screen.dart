import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart';

class AgenciesScreen extends StatefulWidget {
  final String lang;
  const AgenciesScreen({super.key, required this.lang});

  @override
  State<AgenciesScreen> createState() => _AgenciesScreenState();
}

class _AgenciesScreenState extends State<AgenciesScreen> {
  List<dynamic> _agencies = [];
  List<dynamic> _filteredAgencies = [];
  bool _isLoading = true;
  String _searchQuery = '';
  String _filterType = 'all';

  final TextEditingController _searchController = TextEditingController();

  String _formatPrice(dynamic price) {
    if (price == null) return '';
    final str = price.toString();
    final buffer = StringBuffer();
    for (int i = 0; i < str.length; i++) {
      if (i > 0 && (str.length - i) % 3 == 0) {
        buffer.write(' ');
      }
      buffer.write(str[i]);
    }
    return buffer.toString();
  }

  @override
  void initState() {
    super.initState();
    _loadAgencies();
  }

  void _loadAgencies() async {
    setState(() => _isLoading = true);
    final data = await ApiService.fetchAgencies();
    setState(() {
      _agencies = data.isNotEmpty
          ? data
          : [
              {
                'id': 1,
                'name': 'Voyages Teranga Hajj & Omra',
                'price': 3600000,
                'type': 'economique',
                'rating': 4.8,
                'address': 'Avenue Cheikh Anta Diop, Dakar',
                'phone': '+221 33 824 12 34',
                'email': 'contact@terangahajj.sn',
                'desc_fr': 'Package économique avec hébergement 3 étoiles et restauration sénégalaise complète.',
                'desc_wo': 'Forfait yomb ci plane ak dëkk u 3 étoiles ak ñam u Sénégal.',
                'desc_ar': 'باقة اقتصادية تشمل السكن في فندق 3 نجوم وإقامة مريحة وطعام سنغالي.',
                'features': ['Vol direct Dakar-Médine', 'Hôtel 3★', 'Restauration complète', 'Guide religieux']
              },
              {
                'id': 2,
                'name': 'Dakar Air Services Hajj',
                'price': 4900000,
                'type': 'standard',
                'rating': 4.6,
                'address': 'Immeuble Fahd, Dakar',
                'phone': '+221 33 889 45 45',
                'email': 'hajj@dakarair.sn',
                'desc_fr': 'Forfait standard de grande qualité. Hôtel 4 étoiles proche du Haram à La Mecque.',
                'desc_wo': 'Forfait standard bu am qualité u hôtel 4★ jege Haram bi.',
                'desc_ar': 'باقة قياسية عالية الجودة مع إقامة في فندق 4 نجوم قريب من الحرم.',
                'features': ['Hôtels 4★ Haram', 'Pension complète', 'Suivi Médical 24h', 'Transports VIP']
              },
              {
                'id': 3,
                'name': 'Sahel Prestige Voyage Hajj',
                'price': 6500000,
                'type': 'vip',
                'rating': 4.9,
                'address': 'Almadies, Dakar',
                'phone': '+221 33 869 90 90',
                'email': 'vip@sahelprestige.sn',
                'desc_fr': 'Service VIP 5 étoiles sur-mesure. Tentes VIP climatisées à Mina et suite en face du Haram.',
                'desc_wo': 'Service VIP 5 étoiles. Tente VIP climatisé ci Mina ak hôtel 5★.',
                'desc_ar': 'خدمة VIP فاخرة 5 نجوم. مخيمات مكيفة بمخيم منى وأجنحة مطلة على الحرم.',
                'features': ['Vol Business Class', 'Hôtel 5★ Vue Kaaba', 'Tentes VIP Mina', 'Assistance personnalisée']
              },
              {
                'id': 4,
                'name': 'Touba Transports & Hajj',
                'price': 3800000,
                'type': 'economique',
                'rating': 4.7,
                'address': 'Grand Yoff, Dakar',
                'phone': '+221 33 827 33 11',
                'email': 'contact@toubahajj.sn',
                'desc_fr': 'Encadrement spirituel chaleureux et accompagnement par des guides chevronnés.',
                'desc_wo': 'Encadrement bu reuy ak serigne yi lay waajal ci rituels yi.',
                'desc_ar': 'تأطير ديني ممتاز ومرافقة دقيقة طوال رحلة الحج.',
                'features': ['Encadrement religieux', 'Hôtel 3★', 'Transferts inclus']
              }
            ];
      _applyFilters();
      _isLoading = false;
    });
  }

  void _applyFilters() {
    setState(() {
      _filteredAgencies = _agencies.where((agency) {
        final matchesSearch = agency['name'].toString().toLowerCase().contains(_searchQuery.toLowerCase()) ||
            agency['address'].toString().toLowerCase().contains(_searchQuery.toLowerCase());
        final matchesType = _filterType == 'all' || agency['type'].toString() == _filterType;
        return matchesSearch && matchesType;
      }).toList();
    });
  }

  void _showAgencyDetailModal(dynamic agency) {
    final title = agency['name'];
    final desc = widget.lang == 'ar'
        ? agency['desc_ar']
        : (widget.lang == 'wo' ? agency['desc_wo'] : agency['desc_fr']);

    final features = List<String>.from(agency['features'] ?? []);
    final nameController = TextEditingController();
    final phoneController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            left: 20,
            right: 20,
            top: 16,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                // Modal Handle Bar
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Agency Title & Accreditation Tag
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(
                        color: Color(0xFFE2F0D9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.business_center, color: Color(0xFF042F1A), size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF7E6),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.5)),
                            ),
                            child: Text(
                              widget.lang == 'ar' ? 'معتمدة من البعثة الرسمية' : 'Agréée par la Délégation Hajj',
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFB27D1B)),
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
                const SizedBox(height: 16),
                
                // Address & Phone
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 14, color: Colors.grey),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        '${agency['address']}',
                        style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.phone_outlined, size: 14, color: Colors.grey),
                    const SizedBox(width: 6),
                    Text(
                      '${agency['phone']}',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade700, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Price & Category Banner
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFAF9F5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.lang == 'ar' ? 'سعر الباقة' : 'Tarif Forfait Tout Compris',
                            style: TextStyle(fontSize: 10, color: Colors.grey.shade600, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${_formatPrice(agency['price'])} F CFA',
                            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: agency['type'] == 'vip'
                              ? const Color(0xFFFFF7E6)
                              : (agency['type'] == 'standard' ? const Color(0xFFE8F0FE) : const Color(0xFFE7F2E2)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          agency['type'].toString().toUpperCase(),
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: agency['type'] == 'vip'
                                ? const Color(0xFFB27D1B)
                                : (agency['type'] == 'standard' ? Colors.blue.shade800 : const Color(0xFF042F1A)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),

                Text(
                  desc ?? '',
                  style: TextStyle(fontSize: 13, color: Colors.grey.shade800, height: 1.4),
                ),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 10),

                // Inclusions Chips
                Text(
                  widget.lang == 'ar' ? 'الخدمات المشمولة في الباقة :' : (widget.lang == 'wo' ? 'Li ci biir package bi :' : 'Services inclus dans le forfait :'),
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: features.map((feat) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: const Color(0xFFE2F0D9),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.check_circle, size: 12, color: Color(0xFF042F1A)),
                          const SizedBox(width: 4),
                          Text(feat, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF042F1A))),
                        ],
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 20),

                // Contact Inquiry Form
                Text(
                  widget.lang == 'ar' ? 'طلب معلومات أو pré-inscription :' : (widget.lang == 'wo' ? 'Laaj xibaar wala bindu :' : 'Demande d\'informations ou pré-inscription :'),
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: nameController,
                  decoration: InputDecoration(
                    labelText: widget.lang == 'ar' ? 'الاسم بالكامل' : (widget.lang == 'wo' ? 'Sa tour ak sant' : 'Nom et Prénom'),
                    prefixIcon: const Icon(Icons.person_outline, size: 20, color: Color(0xFF042F1A)),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    labelText: 'Téléphone WhatsApp (+221)',
                    prefixIcon: const Icon(Icons.phone_android_outlined, size: 20, color: Color(0xFF042F1A)),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
                const SizedBox(height: 16),

                ElevatedButton(
                  onPressed: () async {
                    if (nameController.text.isEmpty || phoneController.text.isEmpty) return;
                    
                    Navigator.pop(context); // Close modal
                    final success = await ApiService.submitAgencyInquiry(
                      agency['id'],
                      nameController.text,
                      phoneController.text,
                    );

                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            success
                                ? L10n.get('inquiry_success', widget.lang)
                                : 'Erreur de connexion avec le serveur API.',
                          ),
                          backgroundColor: success ? const Color(0xFF042F1A) : Colors.red,
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF042F1A),
                    minimumSize: const Size.fromHeight(48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 2,
                  ),
                  child: Text(
                    widget.lang == 'ar' ? 'إرسال الطلب الآن' : (widget.lang == 'wo' ? 'Yóone laaj bi légui' : 'Envoyer ma demande à l\'agence'),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final title = L10n.get('agencies_title', widget.lang);
    final isAr = widget.lang == 'ar';

    return Scaffold(
      backgroundColor: const Color(0xFFFAF9F5),
      body: SafeArea(
        child: Column(
          children: [
            // Top Gradient Banner Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF021B0F), Color(0xFF042F1A)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFD4AF37).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0xFFD4AF37)),
                        ),
                        child: Text(
                          isAr ? '87 وكالة معتمدة' : '87 Agences Agréées',
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFD4AF37)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    isAr
                        ? 'تصفح قائمة الوكالات الخاصة المعتمدة رسمياً لموسم الحج 2026'
                        : 'Guide officiel des voyagistes privés accrédités par l\'État du Sénégal',
                    style: const TextStyle(fontSize: 11, color: Colors.white70),
                  ),
                  const SizedBox(height: 16),

                  // Search Bar Input inside Header
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ],
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                          _applyFilters();
                        });
                      },
                      style: const TextStyle(fontSize: 13, color: Color(0xFF042F1A)),
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.search, color: Color(0xFF042F1A), size: 20),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, size: 18, color: Colors.grey),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() {
                                    _searchQuery = '';
                                    _applyFilters();
                                  });
                                },
                              )
                            : null,
                        hintText: L10n.get('agency_search_placeholder', widget.lang),
                        hintStyle: TextStyle(fontSize: 12, color: Colors.grey.shade400),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Horizontal Filter Chips Row
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  _buildFilterChip('all', isAr ? 'الكل (87)' : 'Tous les Packages'),
                  const SizedBox(width: 8),
                  _buildFilterChip('vip', isAr ? '⭐ كبار الشخصيات' : '⭐ VIP Prestige'),
                  const SizedBox(width: 8),
                  _buildFilterChip('standard', isAr ? '✈️ قياسي' : '✈️ Standard'),
                  const SizedBox(width: 8),
                  _buildFilterChip('economique', isAr ? '🏷️ اقتصادي' : '🏷️ Économique'),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Agency List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator(color: Color(0xFF042F1A)))
                  : _filteredAgencies.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.search_off, size: 48, color: Colors.grey.shade400),
                              const SizedBox(height: 10),
                              Text(
                                isAr ? 'لم يتم العثور على أي وكالة مطابقة' : 'Aucune agence ne correspond à votre recherche.',
                                style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
                              )
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                          itemCount: _filteredAgencies.length,
                          itemBuilder: (context, index) {
                            final agency = _filteredAgencies[index];
                            return _buildAgencyCard(agency, isAr);
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String typeKey, String label) {
    final bool isSelected = _filterType == typeKey;
    return InkWell(
      onTap: () {
        setState(() {
          _filterType = typeKey;
          _applyFilters();
        });
      },
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF042F1A) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFFD4AF37) : Colors.grey.shade300,
            width: isSelected ? 1.5 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF042F1A).withOpacity(0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ]
              : [],
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected ? Colors.white : Colors.grey.shade700,
          ),
        ),
      ),
    );
  }

  Widget _buildAgencyCard(dynamic agency, bool isAr) {
    final firstLetter = agency['name'].toString().substring(0, 1);
    final features = List<String>.from(agency['features'] ?? []).take(2).toList();

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          )
        ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: () => _showAgencyDetailModal(agency),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Avatar Badge
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE2F0D9),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFF042F1A).withOpacity(0.2), width: 1.5),
                      ),
                      child: Center(
                        child: Text(
                          firstLetter,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF042F1A)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  agency['name'],
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF042F1A)),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFFF7E6),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: const Color(0xFFD4AF37).withOpacity(0.4)),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.star, color: Color(0xFFD4AF37), size: 12),
                                    const SizedBox(width: 2),
                                    Text(
                                      agency['rating']?.toString() ?? '4.5',
                                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFB27D1B)),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.location_on_outlined, size: 12, color: Colors.grey),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  agency['address'] ?? '',
                                  style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Features Chips
                if (features.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: Wrap(
                      spacing: 6,
                      children: features.map((feat) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '✓ $feat',
                            style: TextStyle(fontSize: 10, color: Colors.grey.shade800, fontWeight: FontWeight.w600),
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                const Divider(height: 1),
                const SizedBox(height: 10),

                // Price & Action Button Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isAr ? 'Forfait à partir de' : 'À partir de',
                          style: TextStyle(fontSize: 9, color: Colors.grey.shade500, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          '${_formatPrice(agency['price'])} FCFA',
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: agency['type'] == 'vip'
                                ? const Color(0xFFFFF7E6)
                                : (agency['type'] == 'standard' ? const Color(0xFFE8F0FE) : const Color(0xFFE7F2E2)),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            agency['type'].toString().toUpperCase(),
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                              color: agency['type'] == 'vip'
                                  ? const Color(0xFFB27D1B)
                                  : (agency['type'] == 'standard' ? Colors.blue.shade800 : const Color(0xFF042F1A)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.arrow_forward_ios, size: 12, color: Color(0xFF042F1A)),
                      ],
                    )
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
