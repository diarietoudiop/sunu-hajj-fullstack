import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import 'checklist_screen.dart';
import 'budget_screen.dart';

class EspaceScreen extends StatefulWidget {
  final String lang;
  const EspaceScreen({super.key, required this.lang});

  @override
  State<EspaceScreen> createState() => _EspaceScreenState();
}

class _EspaceScreenState extends State<EspaceScreen> {
  bool _passportUploaded = false;
  bool _vaccinUploaded = false;
  int _checklistPercentage = 0;
  String _savedBudget = '0';
  List<String> _simulatedSMS = [];

  final TextEditingController _phoneController = TextEditingController(text: '+221 77 123 45 67');

  @override
  void initState() {
    super.initState();
    _loadLocalStats();
  }

  void _loadLocalStats() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Load vault docs
    setState(() {
      _passportUploaded = prefs.getBool('sunuhajj_vault_passport') ?? false;
      _vaccinUploaded = prefs.getBool('sunuhajj_vault_vaccin') ?? false;
      _simulatedSMS = prefs.getStringList('sunuhajj_sms_history') ?? [];
    });

    // Load budget
    final budgetStr = prefs.getString('sunuhajj_saved_budget') ?? '0';
    setState(() {
      _savedBudget = budgetStr;
    });

    // Compute checklist percent
    // Fallback default checklist state
    final chList = prefs.getStringList('sunuhajj_checklist_keys') ?? [];
    // Standard list items count is 7
    final total = 7;
    final checked = chList.length;
    setState(() {
      _checklistPercentage = total > 0 ? ((checked / total) * 100).round() : 0;
    });
  }

  void _uploadDocument(String docType) async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      if (docType == 'passport') _passportUploaded = true;
      if (docType == 'vaccin') _vaccinUploaded = true;
    });
    await prefs.setBool('sunuhajj_vault_$docType', true);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.lang == 'ar' ? 'تم تشفير المستند وحفظه!' : (widget.lang == 'wo' ? 'Kayit bi denc na !' : 'Document chiffré et enregistré !'),
          ),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _sendSimulatedAlert(String type) async {
    final phone = _phoneController.text.trim();
    if (phone.isEmpty) return;

    final smsMap = {
      'fr': {
        'depart': 'Sunu Hajj: Cher proche, je viens d\'enregistrer mes bagages à l\'aéroport de Dakar. Prêt pour l\'embarquement. Priez pour moi !',
        'arrivee': 'Sunu Hajj: Alhamdoulillah, je suis bien arrivé à Djeddah. Le voyage s\'est bien passé. Je me dirige vers La Mecque.',
        'arafat': 'Sunu Hajj: Je suis actuellement sur le mont Arafat. Je prie pour toute la famille. Que Dieu accepte nos prières.',
        'retour': 'Sunu Hajj: Alhamdoulillah, je viens de décoller de Djeddah. Retour imminent à Dakar. À très bientôt !'
      },
      'wo': {
        'depart': 'Sunu Hajj: Sama njaboot, ma ngi aéroport Dakar di enregistrer bagages yi. Ñaanal-leen ma jàmm !',
        'arrivee': 'Sunu Hajj: Alhamdoulillah, aksi naa Djeddah ci jàmm. Maka laa jëm legui.',
        'arafat': 'Sunu Hajj: Ma ngi Arafat tey di ñaanal ñépp. Yalla nangu nanu ñaan yi.',
        'retour': 'Sunu Hajj: Alhamdoulillah, vol bi dellusi na. Ma ngi dellu Dakar. Ci jàmm !'
      },
      'ar': {
        'depart': 'سنو الحج: أهلي الأعزاء، أنا الآن في مطار دكار أنهي إجراءات سفري. دعواتكم لي بالسلامة والتيسير.',
        'arrivee': 'سنو الحج: الحمد لله، وصلت إلى جدة بسلامة الله. الرحلة كانت ميسرة وأنا الآن أتوجه لمكة المكرمة.',
        'arafat': 'سنو الحج: أنا الآن واقف على جبل عرفات المبارك. أدعو لكم جميعاً بالخير والبركة. تقبل الله منا ومنكم.',
        'retour': 'سنو الحج: الحمد لله، طائرتنا تستعد للمغادرة من مطار جدة في طريق العودة لدكار. أراكم قريباً!'
      }
    };

    final message = smsMap[widget.lang]?[type] ?? '';
    final timestamp = DateTime.now().toLocal().toString().substring(11, 16);
    final historyEntry = '[$timestamp] 📲 $phone\n"$message"';

    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _simulatedSMS.insert(0, historyEntry);
    });
    await prefs.setStringList('sunuhajj_sms_history', _simulatedSMS);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.lang == 'ar' ? 'تم إرسال التنبيه لعائلتك!' : (widget.lang == 'wo' ? 'SMS alerte bi dem na !' : 'Alerte SMS simulée envoyée !'),
          ),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _showSMSHistoryDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text(widget.lang == 'ar' ? 'سجل التنبيهات المرسلة' : 'Historique SMS'),
          content: _simulatedSMS.isEmpty
              ? Text(widget.lang == 'ar' ? 'لا يوجد تنبيهات مرسلة.' : 'Aucun SMS envoyé pour le moment.')
              : SizedBox(
                  width: double.maxFinite,
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: _simulatedSMS.length,
                    itemBuilder: (context, index) {
                      return Card(
                        color: Colors.grey.shade50,
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Text(
                            _simulatedSMS[index],
                            style: const TextStyle(fontSize: 12, height: 1.4),
                          ),
                        ),
                      );
                    },
                  ),
                ),
          actions: [
            TextButton(
              onPressed: () async {
                final prefs = await SharedPreferences.getInstance();
                await prefs.remove('sunuhajj_sms_history');
                setState(() {
                  _simulatedSMS = [];
                });
                if (context.mounted) Navigator.pop(context);
              },
              child: Text(
                widget.lang == 'ar' ? 'مسح السجل' : 'Effacer',
                style: const TextStyle(color: Colors.red),
              ),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(widget.lang == 'ar' ? 'إغلاق' : 'Fermer'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final vaultTitle = L10n.get('vault_title', widget.lang);
    final vaultDesc = L10n.get('vault_desc', widget.lang);
    final smsTitle = L10n.get('sms_title', widget.lang);
    final progressTitle = L10n.get('progress_title', widget.lang);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          L10n.get('app_title', widget.lang),
          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        backgroundColor: const Color(0xFF0B5D34),
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: Colors.white),
            onPressed: _showSMSHistoryDialog,
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Card
            Card(
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 26,
                      backgroundColor: Color(0xFFE7F2E2),
                      child: Text('🇸🇳', style: TextStyle(fontSize: 22)),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Pèlerin Sénégalais',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          widget.lang == 'ar' ? 'الحالة: قيد الاستعداد' : 'Statut: En préparation',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Navigation boxes grid
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => ChecklistScreen(lang: widget.lang)),
                      );
                      _loadLocalStats(); // Reload checklist percentage
                    },
                    child: Card(
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            Text(
                              '$_checklistPercentage%',
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0B5D34)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              progressTitle,
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => BudgetScreen(lang: widget.lang)),
                      );
                      _loadLocalStats(); // Reload budget state
                    },
                    child: Card(
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            Text(
                              _savedBudget != '0' ? '${_savedBudget.substring(0, 3)}M F' : '0 F',
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF0B5D34)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              L10n.get('budget_title', widget.lang),
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Document Vault Section
            Text(
              vaultTitle,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF052C18)),
            ),
            const SizedBox(height: 8),
            Card(
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      vaultDesc,
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    const SizedBox(height: 14),

                    // Vault Item 1
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.wallet_membership, color: Color(0xFF0B5D34)),
                      title: Text(
                        L10n.get('vault_doc_passport', widget.lang),
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        _passportUploaded
                            ? L10n.get('vault_status_uploaded', widget.lang)
                            : L10n.get('vault_status_missing', widget.lang),
                        style: TextStyle(fontSize: 11, color: _passportUploaded ? Colors.green : Colors.grey),
                      ),
                      trailing: ElevatedButton(
                        onPressed: () => _uploadDocument('passport'),
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE7F2E2), elevation: 0),
                        child: Text(
                          widget.lang == 'ar' ? 'إضافة' : 'Ajouter',
                          style: const TextStyle(color: Color(0xFF0B5D34), fontSize: 11),
                        ),
                      ),
                    ),
                    const Divider(height: 1),

                    // Vault Item 2
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: const Icon(Icons.health_and_safety, color: Color(0xFF0B5D34)),
                      title: Text(
                        L10n.get('vault_doc_health', widget.lang),
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        _vaccinUploaded
                            ? L10n.get('vault_status_uploaded', widget.lang)
                            : L10n.get('vault_status_missing', widget.lang),
                        style: TextStyle(fontSize: 11, color: _vaccinUploaded ? Colors.green : Colors.grey),
                      ),
                      trailing: ElevatedButton(
                        onPressed: () => _uploadDocument('vaccin'),
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE7F2E2), elevation: 0),
                        child: Text(
                          widget.lang == 'ar' ? 'إضافة' : 'Ajouter',
                          style: const TextStyle(color: Color(0xFF0B5D34), fontSize: 11),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // SMS Simulator Section
            Text(
              smsTitle,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF052C18)),
            ),
            const SizedBox(height: 8),
            Card(
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    TextField(
                      controller: _phoneController,
                      decoration: InputDecoration(
                        labelText: widget.lang == 'ar' ? 'رقم هاتف القريب' : 'Téléphone du proche',
                        border: const OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Alert Triggers
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      alignment: WrapAlignment.center,
                      children: [
                        ElevatedButton(
                          onPressed: () => _sendSimulatedAlert('depart'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade100, elevation: 0),
                          child: Text(widget.lang == 'ar' ? 'المطار' : 'Aéroport', style: const TextStyle(color: Colors.black87, fontSize: 11)),
                        ),
                        ElevatedButton(
                          onPressed: () => _sendSimulatedAlert('arrivee'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade100, elevation: 0),
                          child: Text(widget.lang == 'ar' ? 'جدة' : 'Djeddah', style: const TextStyle(color: Colors.black87, fontSize: 11)),
                        ),
                        ElevatedButton(
                          onPressed: () => _sendSimulatedAlert('arafat'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade100, elevation: 0),
                          child: Text(widget.lang == 'ar' ? 'عرفة' : 'Arafat', style: const TextStyle(color: Colors.black87, fontSize: 11)),
                        ),
                        ElevatedButton(
                          onPressed: () => _sendSimulatedAlert('retour'),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.grey.shade100, elevation: 0),
                          child: Text(widget.lang == 'ar' ? 'العودة' : 'Retour', style: const TextStyle(color: Colors.black87, fontSize: 11)),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
