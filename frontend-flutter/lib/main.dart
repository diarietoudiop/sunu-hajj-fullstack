import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/home_screen.dart';
import 'screens/journey_screen.dart';
import 'screens/agencies_screen.dart';
import 'screens/espace_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/auth_screen.dart';
import 'screens/pelerin_screen.dart';
import 'screens/voyagiste_screen.dart';
import 'screens/dgp_screen.dart';
import 'screens/nusuk_screen.dart';
import 'services/api_service.dart';

void main() {
  runApp(const SunuHajjApp());
}

class SunuHajjApp extends StatefulWidget {
  const SunuHajjApp({super.key});

  static void setLocale(BuildContext context, String newLocale) {
    _SunuHajjAppState? state = context.findAncestorStateOfType<_SunuHajjAppState>();
    state?.changeLanguage(newLocale);
  }

  @override
  State<SunuHajjApp> createState() => _SunuHajjAppState();
}

class _SunuHajjAppState extends State<SunuHajjApp> {
  String _locale = 'fr';
  Widget _homeScreen = const Scaffold(body: Center(child: CircularProgressIndicator(color: Color(0xFF042F1A))));

  @override
  void initState() {
    super.initState();
    _loadLanguage();
  }

  void _loadLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final String lang = prefs.getString('sunuhajj_lang') ?? 'fr';
    final bool onboarded = prefs.getBool('sunuhajj_onboarded') ?? false;
    final String? passport = prefs.getString('sunuhajj_user_passport');

    Widget target;
    if (passport != null && passport.isNotEmpty) {
      target = AppNavigator(currentLocale: lang, initialIndex: 0);
    } else if (!onboarded) {
      target = OnboardingScreen(lang: lang);
    } else {
      target = AuthScreen(lang: lang);
    }

    setState(() {
      _locale = lang;
      _homeScreen = target;
    });
  }

  void changeLanguage(String lang) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('sunuhajj_lang', lang);
    
    final bool onboarded = prefs.getBool('sunuhajj_onboarded') ?? false;
    final String? passport = prefs.getString('sunuhajj_user_passport');

    Widget target;
    if (passport != null && passport.isNotEmpty) {
      target = AppNavigator(currentLocale: lang, initialIndex: 0);
    } else if (!onboarded) {
      target = OnboardingScreen(lang: lang);
    } else {
      target = AuthScreen(lang: lang);
    }

    setState(() {
      _locale = lang;
      _homeScreen = target;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sunu Hajj',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF042F1A),
        scaffoldBackgroundColor: const Color(0xFFFAF9F5),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF042F1A),
          primary: const Color(0xFF042F1A),
          secondary: const Color(0xFFD4AF37),
        ),
        useMaterial3: true,
      ),
      // Set Text Direction based on locale (RTL for Arabic)
      home: Directionality(
        textDirection: _locale == 'ar' ? TextDirection.rtl : TextDirection.ltr,
        child: _homeScreen,
      ),
    );
  }
}

class AppNavigator extends StatefulWidget {
  final String currentLocale;
  final int initialIndex;
  const AppNavigator({super.key, required this.currentLocale, this.initialIndex = 0});

  @override
  State<AppNavigator> createState() => _AppNavigatorState();
}

class _AppNavigatorState extends State<AppNavigator> {
  int _currentIndex = 0;
  Map<String, dynamic>? _pilgrim;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _loadPilgrimDetails();
  }

  Future<void> _loadPilgrimDetails() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final passport = prefs.getString('sunuhajj_user_passport');

      if (passport == null || passport.isEmpty) {
        setState(() {
          _pilgrim = {
            'id': 0,
            'fullName': 'Pèlerin Invité (Mode Découverte)',
            'passportNumber': 'INVITÉ',
            'phone': 'Non connecté',
            'email': 'invitation@sunuhajj.sn',
            'birthDate': '--/--/----',
            'cin': 'Non renseigné',
            'selectedAgencyId': null,
            'medicalStatus': 'Non renseigné',
            'registrationStatus': 'invité',
            'nusukSyncStatus': 'non_synchro',
            'flightNumber': 'Non attribué',
            'hotelMakkah': 'Non attribué',
            'hotelMadinah': 'Non attribué',
          };
          _isLoading = false;
        });
        return;
      }

      final details = await ApiService.fetchPilgrimByPassport(passport);
      
      setState(() {
        _pilgrim = details ?? {
          'id': 1,
          'fullName': 'Moustapha Diop',
          'passportNumber': passport,
          'phone': '+221 77 123 45 67',
          'email': 'moustapha.diop@gmail.com',
          'birthDate': '12/05/1978',
          'cin': '5 1234567 8',
          'selectedAgencyId': 1,
          'medicalStatus': 'apte',
          'registrationStatus': 'approved',
          'nusukSyncStatus': 'synced',
          'flightNumber': 'SV 7423',
          'hotelMakkah': 'Makkah Tower',
          'hotelMadinah': 'Dar Al Taqwa',
        };
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _pilgrim = {
          'id': 1,
          'fullName': 'Moustapha Diop',
          'passportNumber': 'SN9876543',
          'phone': '+221 77 123 45 67',
          'email': 'moustapha.diop@gmail.com',
          'birthDate': '12/05/1978',
          'cin': '5 1234567 8',
          'selectedAgencyId': 1,
          'medicalStatus': 'apte',
          'registrationStatus': 'approved',
          'nusukSyncStatus': 'synced',
          'flightNumber': 'SV 7423',
          'hotelMakkah': 'Makkah Tower',
          'hotelMadinah': 'Dar Al Taqwa',
        };
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading || _pilgrim == null) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: Color(0xFF042F1A)),
        ),
      );
    }

    final List<Widget> screens = [
      HomeScreen(lang: widget.currentLocale, pilgrim: _pilgrim!),
      PelerinScreen(lang: widget.currentLocale, pilgrim: _pilgrim!),
      VoyagisteScreen(lang: widget.currentLocale, pilgrim: _pilgrim!),
      AgenciesScreen(lang: widget.currentLocale),
      DgpScreen(lang: widget.currentLocale),
      NusukScreen(lang: widget.currentLocale, pilgrim: _pilgrim!),
      JourneyScreen(lang: widget.currentLocale),
    ];

    final labels = {
      'fr': ['Accueil', 'Pèlerin', 'Voyagiste', 'Agences', 'DGP', 'Nusuk', 'Rituels'],
      'wo': ['Kër', 'Pèlerin', 'Voyage', 'Agences', 'DGP', 'Nusuk', 'Rituels'],
      'ar': ['الرئيسية', 'الحاج', 'الوكالة', 'الوكالات', 'البعثة', 'نسك', 'الشعائر']
    }[widget.currentLocale]!;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, -2),
            )
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: const Color(0xFF042F1A),
          unselectedItemColor: Colors.grey.shade500,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 8),
          unselectedLabelStyle: const TextStyle(fontSize: 8),
          elevation: 0,
          items: [
            BottomNavigationBarItem(
              icon: const Icon(Icons.home_outlined, size: 20),
              activeIcon: const Icon(Icons.home, size: 20),
              label: labels[0],
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.person_outline, size: 20),
              activeIcon: const Icon(Icons.person, size: 20),
              label: labels[1],
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.airplane_ticket_outlined, size: 20),
              activeIcon: const Icon(Icons.airplane_ticket, size: 20),
              label: labels[2],
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.business_outlined, size: 20),
              activeIcon: const Icon(Icons.business, size: 20),
              label: labels[3],
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.gavel_outlined, size: 20),
              activeIcon: const Icon(Icons.gavel, size: 20),
              label: labels[4],
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.sync_outlined, size: 20),
              activeIcon: const Icon(Icons.sync, size: 20),
              label: labels[5],
            ),
            BottomNavigationBarItem(
              icon: const Icon(Icons.menu_book_outlined, size: 20),
              activeIcon: const Icon(Icons.menu_book, size: 20),
              label: labels[6],
            ),
          ],
        ),
      ),
    );
  }
}

// Global Translations Helper
class L10n {
  static const Map<String, Map<String, String>> _strings = {
    'fr': {
      'app_title': 'Sunu Hajj',
      'welcome_title': 'Bienvenue sur Sunu Hajj',
      'welcome_sub': 'Votre compagnon spirituel et logistique.',
      'btn_start': 'Commencer mon parcours',
      'scam_warning_title': 'Alerte Arnaques !',
      'scam_warning_desc': 'Ne versez jamais d\'argent à une agence sans avoir vérifié son agrément Sunu Hajj.',
      'progress_title': 'Mon avancement',
      'budget_title': 'Simulateur de budget',
      'total_est': 'Estimation coût total',
      'btn_save_budget': 'Enregistrer le budget',
      'vault_title': 'Coffre-fort documents',
      'vault_desc': 'Sauvegardez vos documents de voyage sur votre téléphone.',
      'sms_title': 'Alerter ma famille (SMS)',
      'btn_send_sms': 'Envoyer alerte',
      'inquiry_success': 'Demande envoyée avec succès !',
      'checklist_title': 'Checklist interactive',
      'agencies_title': 'Agences Agréées Sunu Hajj',
      'agency_search_placeholder': 'Rechercher une agence...',
      'budget_advice_title': 'Recommandations Sunu Hajj',
    },
    'wo': {
      'app_title': 'Sunu Hajj',
      'welcome_title': 'Dalal jamm ci Sunu Hajj',
      'welcome_sub': 'Sa jëwriñ ci wàllu Hajj.',
      'btn_start': 'Tambali sama yoon wi',
      'scam_warning_title': 'Moytooleen Nax gi !',
      'scam_warning_desc': 'Bul jox mukk koppar benn agence te seetloo woo ne dëggër na.',
      'progress_title': 'Fi ma tollu ci waajal gi',
      'budget_title': 'Seet Koppar yi',
      'total_est': 'Koppar yëpp gu mu tollu',
      'btn_save_budget': 'Denc koppar bi',
      'vault_title': 'Dencukaay kayit yi',
      'vault_desc': 'Dencal say kayit ngir soxla bu Maka.',
      'sms_title': 'Alerter sa njaboot (SMS)',
      'btn_send_sms': 'Yóone alerte',
      'inquiry_success': 'Laaj bi yóone na !',
      'checklist_title': 'Limu waajal gi',
      'agencies_title': 'Agences yi Sunu Hajj dëggërël',
      'agency_search_placeholder': 'Seet benn agence...',
      'budget_advice_title': 'Xalaat yi Sunu Hajj joxe',
    },
    'ar': {
      'app_title': 'سنو الحج',
      'welcome_title': 'مرحباً بكم في سنو الحج',
      'welcome_sub': 'رفيقكم الروحي واللوجستي.',
      'btn_start': 'ابدأ مسار الحج',
      'scam_warning_title': 'تحذير من الاحتيال!',
      'scam_warning_desc': 'لا تدفع أي مبالغ مالية لأي وكالة دون التأكد من اعتمادها الرسمي.',
      'progress_title': 'مستوى تقدمي',
      'budget_title': 'محاكي الميزانية',
      'total_est': 'التكلفة الإجمالية التقديرية',
      'btn_save_budget': 'حفظ الميزانية',
      'vault_title': 'خزنة المستندات',
      'vault_desc': 'احتفظ بنسخة من وثائق سفرك على هاتفك.',
      'sms_title': 'إرسال تنبيهات للعائلة',
      'btn_send_sms': 'إرسال التنبيه',
      'inquiry_success': 'تم إرسال طلبك بنجاح!',
      'checklist_title': 'قائمة المهام',
      'agencies_title': 'الوكالات المعتمدة',
      'agency_search_placeholder': 'البحث عن وكالة...',
      'budget_advice_title': 'توصيات بعثة الحج',
    }
  };

  static String get(String key, String lang) {
    return _strings[lang]?[key] ?? key;
  }
}
