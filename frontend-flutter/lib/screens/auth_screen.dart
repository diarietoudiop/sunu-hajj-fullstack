import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';
import '../services/api_service.dart';

class AuthScreen extends StatefulWidget {
  final String lang;
  const AuthScreen({super.key, required this.lang});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _passportController = TextEditingController();
  bool _isLoading = false;
  String _errorMessage = '';

  // Localized Strings for AuthScreen
  final Map<String, Map<String, String>> _strings = {
    'fr': {
      'portal_title': 'Espace Pèlerin Sunu Hajj',
      'portal_sub': 'Commission Nationale Sunu Hajj aux Lieux Saints de l\'Islam',
      'passport_label': 'Numéro de passeport *',
      'passport_hint': 'Saisissez votre passeport (ex: SN1234567)',
      'btn_login': 'Se connecter à mon Espace',
      'btn_register': 'Créer un dossier Hajj (Inscription)',
      'btn_guest': 'Continuer en mode Invité',
      'err_empty': 'Veuillez saisir votre numéro de passeport',
      'err_not_found': 'Aucun dossier pèlerin trouvé avec ce numéro. Si vous n\'êtes pas inscrit, créez un nouveau dossier.',
      'err_network': 'Erreur de connexion avec le serveur Sunu Hajj.',
      'txt_or': 'OU',
    },
    'wo': {
      'portal_title': 'Espace Sunu Hajj bi',
      'portal_sub': 'Njiitu Hajj bi ci Sénégal (Commission Nationale Sunu Hajj)',
      'passport_label': 'Passeport *',
      'passport_hint': 'Defal sa passeport (ex: SN1234567)',
      'btn_login': 'Duggu ci sama Espace',
      'btn_register': 'Bindu ngir Hajj bi (S\'inscrire)',
      'btn_guest': 'Découvrir ci Mode Invité',
      'err_empty': 'Defal sa numéro passeport',
      'err_not_found': 'Gisunu benn dossier ak passeport bi. So bindu gul, dëjël bouton bindu bi.',
      'err_network': 'Erreur connexion ak serveur Sunu Hajj.',
      'txt_or': 'WALLA',
    },
    'ar': {
      'portal_title': 'بوابة بعثة الحج السنغالية',
      'portal_sub': 'المندوبية العامة السنغالية للحج إلى البقاع المقدسة (Sunu Hajj)',
      'passport_label': 'رقم جواز السفر *',
      'passport_hint': 'أدخل رقم جواز سفرك (مثال: SN1234567)',
      'btn_login': 'تسجيل الدخول إلى حسابي',
      'btn_register': 'طلب تسجيل جديد (إنشاء ملف)',
      'btn_guest': 'الدخول كزائر (بدون حساب)',
      'err_empty': 'الرجاء إدخال رقم جواز السfer الخاص بك',
      'err_not_found': 'لم يتم العثور على أي ملف بهذا الرقم. يرجى طلب تسجيل جديد.',
      'err_network': 'خطأ في الاتصال بخادم بعثة الحج.',
      'txt_or': 'أو',
    }
  };

  String _getStr(String key) {
    return _strings[widget.lang]?[key] ?? _strings['fr']![key]!;
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    final passport = _passportController.text.trim().toUpperCase();

    // Query backend to check if pilgrim exists
    final pilgrim = await ApiService.fetchPilgrimByPassport(passport);

    if (pilgrim != null) {
      // Save session passport
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('sunuhajj_user_passport', passport);

      if (mounted) {
        // Navigate to dashboard
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => AppNavigator(
              currentLocale: widget.lang,
              initialIndex: 0, // Land on Accueil (HomeScreen)
            ),
          ),
        );
      }
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = _getStr('err_not_found');
      });
    }
  }

  void _continueAsGuest() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => AppNavigator(
          currentLocale: widget.lang,
          initialIndex: 0, // Land on HomeScreen
        ),
      ),
    );
  }

  void _showRegistrationModal() {
    final nameCtrl = TextEditingController();
    final passportCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final emailCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (modalContext) {
        bool isSubmitting = false;
        String modalError = '';

        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
                left: 20,
                right: 20,
                top: 16,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
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
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFE2F0D9),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.person_add_alt_1, color: Color(0xFF042F1A), size: 20),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          widget.lang == 'ar' ? 'إنشاء ملف جديد' : 'Nouveau Dossier Pèlerin (Inscription)',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF042F1A)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: nameCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Nom et Prénom *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: passportCtrl,
                      textCapitalization: TextCapitalization.characters,
                      decoration: const InputDecoration(
                        labelText: 'N° de Passeport (ex: SN9876543) *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.badge_outlined),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'Téléphone Sénégal (+221) *',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.phone_outlined),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(
                        labelText: 'Adresse Email',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.email_outlined),
                      ),
                    ),
                    if (modalError.isNotEmpty) ...[
                      const SizedBox(height: 10),
                      Text(modalError, style: const TextStyle(color: Colors.red, fontSize: 12)),
                    ],
                    const SizedBox(height: 16),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF042F1A),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: isSubmitting
                          ? null
                          : () async {
                              if (nameCtrl.text.isEmpty || passportCtrl.text.isEmpty || phoneCtrl.text.isEmpty) {
                                setModalState(() => modalError = 'Veuillez remplir les champs obligatoires (*)');
                                return;
                              }
                              setModalState(() {
                                isSubmitting = true;
                                modalError = '';
                              });

                              final passport = passportCtrl.text.trim().toUpperCase();
                              final result = await ApiService.registerPilgrim({
                                'fullName': nameCtrl.text.trim(),
                                'passportNumber': passport,
                                'phone': phoneCtrl.text.trim(),
                                'email': emailCtrl.text.trim(),
                                'registrationStatus': 'approved',
                                'medicalStatus': 'apte',
                                'nusukSyncStatus': 'synced',
                              });

                              if (result != null) {
                                final prefs = await SharedPreferences.getInstance();
                                await prefs.setString('sunuhajj_user_passport', passport);
                                if (context.mounted) {
                                  Navigator.pop(modalContext);
                                  Navigator.pushReplacement(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => AppNavigator(
                                        currentLocale: widget.lang,
                                        initialIndex: 0,
                                      ),
                                    ),
                                  );
                                }
                              } else {
                                setModalState(() {
                                  isSubmitting = false;
                                  modalError = 'Erreur lors de la création du dossier. Vérifiez les informations.';
                                });
                              }
                            },
                      child: isSubmitting
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                          : Text(widget.lang == 'ar' ? 'تأكيد التسجيل' : 'Valider mon Inscription', style: const TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF021B0F), Color(0xFF042F1A)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo Badge (NEW premium circular logo)
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 15,
                            offset: const Offset(0, 5),
                          )
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(100),
                        child: Image.asset(
                          'assets/sunu_hajj_logo.png',
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const Icon(Icons.stars, color: Colors.amber, size: 60),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Portal Header
                  Text(
                    _getStr('portal_title'),
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getStr('portal_sub'),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.7),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Login Form Card (NEW premium shape)
                  Card(
                    color: Colors.white,
                    surfaceTintColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                      side: BorderSide(color: Colors.grey.shade100, width: 0.5),
                    ),
                    elevation: 8,
                    shadowColor: Colors.black.withOpacity(0.15),
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              _getStr('passport_label'),
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: Color(0xFF042F1A),
                                letterSpacing: 0.2,
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              controller: _passportController,
                              textCapitalization: TextCapitalization.characters,
                              style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF042F1A), fontFamily: 'monospace', letterSpacing: 1.2),
                              decoration: InputDecoration(
                                hintText: _getStr('passport_hint'),
                                hintStyle: TextStyle(fontSize: 12, color: Colors.grey.shade400, fontFamily: 'sans-serif', letterSpacing: 0),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: const BorderSide(color: Color(0xFFD4AF37), width: 2),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(color: Colors.grey.shade200, width: 1.5),
                                ),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
                                prefixIcon: const Icon(Icons.badge_outlined, size: 20, color: Color(0xFF042F1A)),
                              ),
                              validator: (v) => v == null || v.trim().isEmpty
                                  ? _getStr('err_empty')
                                  : null,
                            ),
                            if (_errorMessage.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Text(
                                _errorMessage,
                                style: const TextStyle(
                                  color: Colors.red,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                            const SizedBox(height: 24),
                            ElevatedButton(
                              onPressed: _isLoading ? null : _handleLogin,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF042F1A),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                elevation: 2,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 22,
                                      height: 22,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2.5,
                                      ),
                                    )
                                  : Text(
                                      _getStr('btn_login'),
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.5),
                                    ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Divider (OR)
                  Row(
                    children: [
                      Expanded(child: Divider(color: Colors.white.withOpacity(0.2))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          _getStr('txt_or'),
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.5),
                            fontWeight: FontWeight.w800,
                            fontSize: 12,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                      Expanded(child: Divider(color: Colors.white.withOpacity(0.2))),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Secondary Actions
                  OutlinedButton(
                    onPressed: _showRegistrationModal,
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFD4AF37), width: 1.8),
                      foregroundColor: const Color(0xFFD4AF37),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      _getStr('btn_register'),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 0.5),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextButton(
                    onPressed: _continueAsGuest,
                    child: Text(
                      _getStr('btn_guest'),
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        decoration: TextDecoration.underline,
                        decorationColor: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
