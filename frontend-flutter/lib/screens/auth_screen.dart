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
      'portal_title': 'Portail Officiel DGP',
      'portal_sub': 'Délégation Générale au Pèlerinage aux Lieux Saints de l\'Islam',
      'passport_label': 'Numéro de passeport *',
      'passport_hint': 'Saisissez votre passeport (ex: SN1234567)',
      'btn_login': 'Se connecter à mon Espace',
      'btn_register': 'Créer un dossier Hajj (Inscription)',
      'btn_guest': 'Continuer en mode Invité',
      'err_empty': 'Veuillez saisir votre numéro de passeport',
      'err_not_found': 'Aucun dossier pèlerin trouvé avec ce numéro. Si vous n\'êtes pas inscrit, créez un nouveau dossier.',
      'err_network': 'Erreur de connexion avec le serveur DGP.',
      'txt_or': 'OU',
    },
    'wo': {
      'portal_title': 'Espace DGP bi',
      'portal_sub': 'Njiitu Hajj bi ci Sénégal (Délégation Générale au Pèlerinage)',
      'passport_label': 'Passeport *',
      'passport_hint': 'Defal sa passeport (ex: SN1234567)',
      'btn_login': 'Duggu ci sama Espace',
      'btn_register': 'Bindu ngir Hajj bi (S\'inscrire)',
      'btn_guest': 'Découvrir ci Mode Invité',
      'err_empty': 'Defal sa numéro passeport',
      'err_not_found': 'Gisunu benn dossier ak passeport bi. So bindu gul, dëjël bouton bindu bi.',
      'err_network': 'Erreur connexion ak serveur DGP.',
      'txt_or': 'WALLA',
    },
    'ar': {
      'portal_title': 'بوابة بعثة الحج السنغالية',
      'portal_sub': 'المندوبية العامة السنغالية للحج إلى البقاع المقدسة (DGP)',
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
              initialIndex: 3, // Open "Mon Espace" tab directly
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

  void _navigateToRegister() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => AppNavigator(
          currentLocale: widget.lang,
          initialIndex: 3, // Force landing on EspaceScreen to show registration form
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF052C18), Color(0xFF0B5D34)],
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
                  // Logo/Flag Badge
                  Center(
                    child: Container(
                      padding: const EdgeInsets.all(16),
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
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(width: 12, height: 24, color: const Color(0xFF0B5D34)), // Green
                              Container(
                                width: 12, 
                                height: 24, 
                                color: const Color(0xFFFEE23E), // Yellow
                                child: const Center(
                                  child: Icon(Icons.star, size: 8, color: Color(0xFF0B5D34)),
                                ),
                              ),
                              Container(width: 12, height: 24, color: const Color(0xFFE11D48)), // Red
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Portal Header
                  Text(
                    _getStr('portal_title'),
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getStr('portal_sub'),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.8),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Login Form Card
                  Card(
                    color: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    elevation: 4,
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
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
                                color: Color(0xFF052C18),
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              controller: _passportController,
                              textCapitalization: TextCapitalization.characters,
                              decoration: InputDecoration(
                                hintText: _getStr('passport_hint'),
                                hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                                prefixIcon: const Icon(Icons.badge_outlined, size: 20),
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
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                            const SizedBox(height: 20),
                            ElevatedButton(
                              onPressed: _isLoading ? null : _handleLogin,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF0B5D34),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8),
                                ),
                              ),
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : Text(
                                      _getStr('btn_login'),
                                      style: const TextStyle(fontWeight: FontWeight.bold),
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
                      Expanded(child: Divider(color: Colors.white.withOpacity(0.3))),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Text(
                          _getStr('txt_or'),
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.6),
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      ),
                      Expanded(child: Divider(color: Colors.white.withOpacity(0.3))),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Secondary Actions
                  OutlinedButton(
                    onPressed: _navigateToRegister,
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFC5A880), width: 1.5),
                      foregroundColor: const Color(0xFFC5A880),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      _getStr('btn_register'),
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextButton(
                    onPressed: _continueAsGuest,
                    child: Text(
                      _getStr('btn_guest'),
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.9),
                        fontWeight: FontWeight.bold,
                        decoration: TextDecoration.underline,
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
