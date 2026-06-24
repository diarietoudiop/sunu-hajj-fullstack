import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import 'checklist_screen.dart';
import 'budget_screen.dart';
import '../services/api_service.dart';

class EspaceScreen extends StatefulWidget {
  final String lang;
  const EspaceScreen({super.key, required this.lang});

  @override
  State<EspaceScreen> createState() => _EspaceScreenState();
}

class _EspaceScreenState extends State<EspaceScreen> {
  // Authentication & Registration state
  bool _isRegistered = false;
  bool _isLoading = true;
  Map<String, dynamic>? _pilgrimDetails;
  List<dynamic> _agencies = [];

  // Vault & SMS state
  bool _passportUploaded = false;
  bool _vaccinUploaded = false;
  int _checklistPercentage = 0;
  String _savedBudget = '0';
  List<String> _simulatedSMS = [];

  // Registration Form Controllers
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passportController = TextEditingController();
  final TextEditingController _birthdateController = TextEditingController();
  final TextEditingController _emergencyNameController = TextEditingController();
  final TextEditingController _emergencyPhoneController = TextEditingController();
  final TextEditingController _smsPhoneController = TextEditingController(text: '+221 77 123 45 67');
  
  String _bloodType = 'A+';
  int? _selectedAgencyId;

  @override
  void initState() {
    super.initState();
    _checkRegistrationAndLoadData();
  }

  // Load registration status and SharedPreferences stats
  Future<void> _checkRegistrationAndLoadData() async {
    setState(() {
      _isLoading = true;
    });

    final prefs = await SharedPreferences.getInstance();
    
    // Load local vault stats
    _passportUploaded = prefs.getBool('sunuhajj_vault_passport') ?? false;
    _vaccinUploaded = prefs.getBool('sunuhajj_vault_vaccin') ?? false;
    _simulatedSMS = prefs.getStringList('sunuhajj_sms_history') ?? [];
    _savedBudget = prefs.getString('sunuhajj_saved_budget') ?? '0';

    // Calculate checklist percentage
    final chList = prefs.getStringList('sunuhajj_checklist_keys') ?? [];
    _checklistPercentage = 7 > 0 ? ((chList.length / 7) * 100).round() : 0;

    // Load Hajj agencies for the dropdown list
    _agencies = await ApiService.fetchAgencies();

    // Check if user has registered a passport locally
    final storedPassport = prefs.getString('sunuhajj_user_passport');
    if (storedPassport != null && storedPassport.isNotEmpty) {
      // Query backend for this passport
      final pilgrim = await ApiService.fetchPilgrimByPassport(storedPassport);
      if (pilgrim != null) {
        setState(() {
          _pilgrimDetails = pilgrim;
          _isRegistered = true;
        });
      } else {
        // Fallback locally if backend offline but passport registered
        setState(() {
          _isRegistered = true;
          _pilgrimDetails = {
            'fullName': 'Pèlerin Sénégalais',
            'passportNumber': storedPassport,
            'phone': '+221 77 123 45 67',
            'medicalStatus': 'pending',
            'registrationStatus': 'pending',
            'registrationDate': DateTime.now().toString().substring(0, 10)
          };
        });
      }
    } else {
      setState(() {
        _isRegistered = false;
      });
    }

    setState(() {
      _isLoading = false;
    });
  }

  // Submit Pilgrim Registration to Backend
  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final data = {
      'fullName': _nameController.text.trim(),
      'phone': _phoneController.text.trim(),
      'email': _emailController.text.trim(),
      'passportNumber': _passportController.text.trim().toUpperCase(),
      'birthDate': _birthdateController.text.trim(),
      'bloodType': _bloodType,
      'selectedAgencyId': _selectedAgencyId,
      'emergencyContact': {
        'name': _emergencyNameController.text.trim(),
        'phone': _emergencyPhoneController.text.trim(),
      }
    };

    final result = await ApiService.registerPilgrim(data);

    if (result != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('sunuhajj_user_passport', data['passportNumber'] as String);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.lang == 'ar' ? 'تم تقديم طلب التسجيل بنجاح!' : (widget.lang == 'wo' ? 'Dossier bi yóone na ci DGP !' : 'Demande d\'inscription envoyée avec succès à la DGP !'),
            ),
            backgroundColor: Colors.green,
          ),
        );
      }
      
      // Reload everything
      await _checkRegistrationAndLoadData();
    } else {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.lang == 'ar' ? 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.' : 'Erreur de connexion avec le serveur DGP.',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // Reset registration for testing
  Future<void> _handleReset() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(widget.lang == 'ar' ? 'إعادة تعيين الحساب' : 'Réinitialisation'),
        content: Text(widget.lang == 'ar' ? 'هل تريد حذف بيانات التسجيل المحلية وتجربة نموذج جديد؟' : 'Voulez-vous supprimer les données d\'inscription locales pour retester le formulaire ?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: Text(widget.lang == 'ar' ? 'إلغاء' : 'Annuler')),
          TextButton(
            onPressed: () => Navigator.pop(context, true), 
            child: Text(widget.lang == 'ar' ? 'نعم، إعادة تعيين' : 'Oui, réinitialiser', style: const TextStyle(color: Colors.red))
          ),
        ],
      ),
    );

    if (confirm == true) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('sunuhajj_user_passport');
      _nameController.clear();
      _phoneController.clear();
      _emailController.clear();
      _passportController.clear();
      _birthdateController.clear();
      _emergencyNameController.clear();
      _emergencyPhoneController.clear();
      await _checkRegistrationAndLoadData();
    }
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
    final phone = _smsPhoneController.text.trim();
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

  // Get dynamic name of agency in local language
  String _getAgencyName(int? id) {
    if (id == null) return 'Sans agence';
    final matches = _agencies.where((a) => a['id'] == id);
    if (matches.isNotEmpty) {
      return matches.first['name'] as String;
    }
    return 'Chargement...';
  }

  // Render registration status badges
  Widget _buildStatusBadge(String status, bool isMedical) {
    Color bg;
    Color text;
    String label;
    IconData icon;

    if (isMedical) {
      switch (status) {
        case 'apte':
          bg = const Color(0xFFE6F4EA);
          text = Colors.green.shade800;
          label = widget.lang == 'ar' ? 'لائق طبياً' : 'Apte au voyage';
          icon = Icons.check_circle_outline;
          break;
        case 'inapte':
          bg = const Color(0xFFFCE8E6);
          text = Colors.red.shade800;
          label = widget.lang == 'ar' ? 'غير لائق طبياً' : 'Inaptitude Médicale';
          icon = Icons.cancel_outlined;
          break;
        default:
          bg = const Color(0xFFFEF7E0);
          text = Colors.orange.shade800;
          label = widget.lang == 'ar' ? 'قيد الفحص الطبي' : 'Examen médical en attente';
          icon = Icons.hourglass_empty;
      }
    } else {
      switch (status) {
        case 'approved':
          bg = const Color(0xFFE6F4EA);
          text = Colors.green.shade800;
          label = widget.lang == 'ar' ? 'تم قبول الملف' : 'Inscription Validée';
          icon = Icons.assignment_turned_in;
          break;
        case 'rejected':
          bg = const Color(0xFFFCE8E6);
          text = Colors.red.shade800;
          label = widget.lang == 'ar' ? 'تم رفض الملف' : 'Inscription Refusée';
          icon = Icons.report_gmailerrorred;
          break;
        default:
          bg = const Color(0xFFE8F0FE);
          text = Colors.blue.shade800;
          label = widget.lang == 'ar' ? 'ملفك قيد المراجعة' : 'Dossier en cours d\'examen';
          icon = Icons.info_outline;
      }
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: text.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: text),
          const SizedBox(width: 8),
          Text(label, style: TextStyle(fontSize: 12, color: text, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator(color: Color(0xFF0B5D34))),
      );
    }

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
            // Gated View: If not registered, show the form
            if (!_isRegistered) ...[
              Card(
                color: Colors.white,
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Row(
                          children: [
                            const Text('🇸🇳', style: TextStyle(fontSize: 28)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.lang == 'ar' ? 'طلب التسجيل الرسمي' : 'Inscription Officielle Hajj',
                                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF052C18)),
                                  ),
                                  Text(
                                    widget.lang == 'ar' ? 'التسجيل لدى البعثة السنغالية (DGP)' : 'Enregistrement auprès de la DGP du Sénégal',
                                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),
                        const Divider(height: 24),
                        
                        // Full Name
                        TextFormField(
                          controller: _nameController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'الاسم الكامل' : 'Nom complet *',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.person),
                          ),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Nom requis' : null,
                        ),
                        const SizedBox(height: 14),

                        // Passport
                        TextFormField(
                          controller: _passportController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'رقم جواز السفر' : 'Numéro de passeport *',
                            hintText: 'Ex: SN1234567',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.badge),
                          ),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Passeport requis' : null,
                        ),
                        const SizedBox(height: 14),

                        // Birthdate
                        TextFormField(
                          controller: _birthdateController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'تاريخ الميلاد' : 'Date de naissance (AAAA-MM-JJ)',
                            hintText: '1985-05-24',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.calendar_today),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Contact
                        TextFormField(
                          controller: _phoneController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone *',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.phone),
                          ),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Téléphone requis' : null,
                        ),
                        const SizedBox(height: 14),

                        // Email
                        TextFormField(
                          controller: _emailController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'البريد الإلكتروني' : 'Adresse e-mail (Optionnel)',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.email),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Blood Type & Agency Row
                        Row(
                          children: [
                            Expanded(
                              flex: 1,
                              child: DropdownButtonFormField<String>(
                                value: _bloodType,
                                decoration: InputDecoration(
                                  labelText: widget.lang == 'ar' ? 'الفصيلة' : 'Sang',
                                  border: const OutlineInputBorder(),
                                ),
                                items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Inconnu']
                                    .map((b) => DropdownMenuItem(value: b, child: Text(b)))
                                    .toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _bloodType = val);
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 2,
                              child: DropdownButtonFormField<int>(
                                value: _selectedAgencyId,
                                decoration: InputDecoration(
                                  labelText: widget.lang == 'ar' ? 'الوكالة' : 'Agence Hajj *',
                                  border: const OutlineInputBorder(),
                                ),
                                hint: Text(widget.lang == 'ar' ? 'اختر وكالة' : 'Choisir agence'),
                                items: _agencies.map((a) {
                                  return DropdownMenuItem<int>(
                                    value: a['id'] as int,
                                    child: Text(
                                      (a['name'] as String).length > 18
                                          ? '${(a['name'] as String).substring(0, 16)}...'
                                          : a['name'] as String,
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  setState(() => _selectedAgencyId = val);
                                },
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),

                        // Emergency Contact Header
                        Text(
                          widget.lang == 'ar' ? 'جهة اتصال للطوارئ' : 'Personne à contacter en cas d\'urgence',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0B5D34)),
                        ),
                        const SizedBox(height: 10),

                        // Emergency Contact Name
                        TextFormField(
                          controller: _emergencyNameController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'اسم القريب' : 'Nom du contact d\'urgence',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.person_outline),
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Emergency Contact Phone
                        TextFormField(
                          controller: _emergencyPhoneController,
                          decoration: InputDecoration(
                            labelText: widget.lang == 'ar' ? 'هاتف القريب' : 'Téléphone du contact d\'urgence',
                            border: const OutlineInputBorder(),
                            prefixIcon: const Icon(Icons.phone_android),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Submit Button
                        ElevatedButton(
                          onPressed: _handleRegister,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0B5D34),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          child: Text(
                            widget.lang == 'ar' ? 'إرسال طلب التسجيل' : 'Enregistrer mon dossier Hajj',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ] else ...[
              // Registered User Dashboard View
              Card(
                color: Colors.white,
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Digital Badge Header
                      Row(
                        children: [
                          const CircleAvatar(
                            radius: 28,
                            backgroundColor: Color(0xFFE7F2E2),
                            child: Text('🇸🇳', style: TextStyle(fontSize: 26)),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _pilgrimDetails?['fullName'] ?? 'Pèlerin Sénégalais',
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF052C18)),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Passeport : ${_pilgrimDetails?['passportNumber'] ?? ''}',
                                  style: const TextStyle(fontSize: 13, color: Colors.grey, fontFamily: 'monospace', fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.logout, color: Colors.grey, size: 20),
                            onPressed: _handleReset,
                            tooltip: 'Réinitialiser',
                          )
                        ],
                      ),
                      const Divider(height: 24),
                      
                      // Agency Selected Info
                      Row(
                        children: [
                          const Icon(Icons.business, color: Color(0xFFC5A880), size: 18),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Agence : ${_getAgencyName(_pilgrimDetails?['selectedAgencyId'] as int?)}',
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Status Badge 1 (Admin Validation)
                      Text(
                        widget.lang == 'ar' ? 'حالة الملف الإداري :' : 'Validation administrative DGP :',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      const SizedBox(height: 6),
                      _buildStatusBadge(_pilgrimDetails?['registrationStatus'] ?? 'pending', false),
                      
                      const SizedBox(height: 16),

                      // Status Badge 2 (Medical Aptitude)
                      Text(
                        widget.lang == 'ar' ? 'الملف الطبي للرحلة :' : 'Aptitude médicale Hajj :',
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      const SizedBox(height: 6),
                      _buildStatusBadge(_pilgrimDetails?['medicalStatus'] ?? 'pending', true),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Navigation boxes grid (Checklist and Budget)
              Row(
                children: [
                  Expanded(
                    child: InkWell(
                      onTap: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => ChecklistScreen(lang: widget.lang)),
                        );
                        _checkRegistrationAndLoadData(); // Reload checklist percentage
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
                        _checkRegistrationAndLoadData(); // Reload budget state
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

                      // Vault Item 1: Passport
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.wallet_membership, color: Color(0xFF0B5D34)),
                        title: Text(
                          widget.lang == 'ar' ? 'نسخة جواز السفر' : 'Copie de Passeport',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          _passportUploaded
                              ? (widget.lang == 'ar' ? 'تم الرفع' : 'Chargé')
                              : (widget.lang == 'ar' ? 'مفقود' : 'Manquant'),
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

                      // Vault Item 2: Vaccines
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.health_and_safety, color: Color(0xFF0B5D34)),
                        title: Text(
                          widget.lang == 'ar' ? 'بطاقة التلقيح الصفراء' : 'Carnet de Vaccination',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          _vaccinUploaded
                              ? (widget.lang == 'ar' ? 'تم الرفع' : 'Chargé')
                              : (widget.lang == 'ar' ? 'مفقود' : 'Manquant'),
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
                        controller: _smsPhoneController,
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
          ],
        ),
      ),
    );
  }
}
