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
                'desc_fr': 'Package économique avec hébergement 3 étoiles et restauration sénégalaise.',
                'desc_wo': 'Forfait yomb ci plane ak dëkk u 3 étoiles.',
                'desc_ar': 'باقة اقتصادية تشمل السكن في فندق 3 نجوم وإقامة مريحة.',
                'features': ['Vol direct', 'Hôtel 3★', 'Restauration']
              },
              {
                'id': 2,
                'name': 'Dakar Air Services Hajj',
                'price': 4900000,
                'type': 'standard',
                'rating': 4.5,
                'address': 'Immeuble Fahd, Dakar',
                'phone': '+221 33 889 45 45',
                'email': 'hajj@dakarair.sn',
                'desc_fr': 'Forfait standard de grande qualité. Hôtel 4 étoiles proche.',
                'desc_wo': 'Forfait standard bu am qualité u hôtel 4★.',
                'desc_ar': 'باقة قياسية عالية الجودة مع إقامة في فندق 4 نجوم.',
                'features': ['Hôtels 4★', 'Pension complète', 'Médecin']
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
    final price = agency['price'].toString();

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
            left: 16,
            right: 16,
            top: 24,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0B5D34)),
                ),
                const SizedBox(height: 4),
                Text(
                  '${agency['address']} • ${agency['phone']}',
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 12),
                Text(
                  desc ?? '',
                  style: const TextStyle(fontSize: 13, color: Colors.black87),
                ),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 10),

                // Inclusions
                Text(
                  widget.lang == 'ar' ? 'الخدمات المشمولة :' : (widget.lang == 'wo' ? 'Li ci biir :' : 'Ce qui est inclus :'),
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: features.map((feat) {
                    return Chip(
                      label: Text(feat, style: const TextStyle(fontSize: 11)),
                      backgroundColor: const Color(0xFFE7F2E2),
                      side: BorderSide.none,
                      padding: EdgeInsets.zero,
                    );
                  }).toList(),
                ),

                const SizedBox(height: 20),

                // Form
                Text(
                  widget.lang == 'ar' ? 'طلب معلومات :' : (widget.lang == 'wo' ? 'Laaj xibaar :' : 'Demande d\'informations :'),
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: nameController,
                  decoration: InputDecoration(
                    labelText: widget.lang == 'ar' ? 'الاسم بالكامل' : (widget.lang == 'wo' ? 'Sa tour' : 'Nom complet'),
                    border: const OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Téléphone (+221)',
                    border: OutlineInputBorder(),
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
                          backgroundColor: success ? Colors.green : Colors.red,
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0B5D34),
                    minimumSize: const Size.fromHeight(50),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: Text(
                    widget.lang == 'ar' ? 'إرسال الطلب' : (widget.lang == 'wo' ? 'Yóone laaj bi' : 'Envoyer ma demande'),
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
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

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF0B5D34),
      ),
      body: Column(
        children: [
          // Search & Filter controls
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val;
                      _applyFilters();
                    });
                  },
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.search),
                    hintText: L10n.get('agency_search_placeholder', widget.lang),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                    contentPadding: EdgeInsets.zero,
                  ),
                ),
                const SizedBox(height: 8),

                // Category selector
                DropdownButtonFormField<String>(
                  value: _filterType,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    contentPadding: EdgeInsets.symmetric(horizontal: 12),
                  ),
                  items: [
                    DropdownMenuItem(value: 'all', child: Text(widget.lang == 'ar' ? 'جميع الباقات' : (widget.lang == 'wo' ? 'Package yëpp' : 'Tous les Packages'))),
                    DropdownMenuItem(value: 'economique', child: Text(widget.lang == 'ar' ? 'اقتصادي' : (widget.lang == 'wo' ? 'Économique' : 'Économique'))),
                    DropdownMenuItem(value: 'standard', child: Text(widget.lang == 'ar' ? 'قياسي' : (widget.lang == 'wo' ? 'Standard' : 'Standard'))),
                    DropdownMenuItem(value: 'vip', child: Text(widget.lang == 'ar' ? 'كبار الشخصيات' : (widget.lang == 'wo' ? 'VIP' : 'VIP'))),
                  ],
                  onChanged: (val) {
                    setState(() {
                      _filterType = val!;
                      _applyFilters();
                    });
                  },
                ),
              ],
            ),
          ),

          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: _filteredAgencies.length,
                    itemBuilder: (context, index) {
                      final agency = _filteredAgencies[index];
                      final firstLetter = agency['name'].toString().substring(0, 1);
                      final price = agency['price'].toString();

                      return Card(
                        color: Colors.white,
                        elevation: 1,
                        margin: const EdgeInsets.only(bottom: 10),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: const Color(0xFFE7F2E2),
                            foregroundColor: const Color(0xFF0B5D34),
                            child: Text(firstLetter, style: const TextStyle(fontWeight: FontWeight.bold)),
                          ),
                          title: Text(
                            agency['name'],
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          subtitle: Text(
                            '${agency['address']}\n${price} F CFA',
                            style: const TextStyle(fontSize: 11, height: 1.3),
                          ),
                          isThreeLine: true,
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () => _showAgencyDetailModal(agency),
                        ),
                      );
                    },
                  ),
          )
        ],
      ),
    );
  }
}
