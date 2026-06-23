import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'screens/home_screen.dart';
import 'screens/journey_screen.dart';
import 'screens/checklist_screen.dart';
import 'screens/agencies_screen.dart';
import 'screens/espace_screen.dart';

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

  @override
  void initState() {
    super.initState();
    _loadLanguage();
  }

  void _loadLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _locale = prefs.getString('sunuhajj_lang') ?? 'fr';
    });
  }

  void changeLanguage(String lang) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('sunuhajj_lang', lang);
    setState(() {
      _locale = lang;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sunu Hajj',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFF0B5D34),
        scaffoldBackgroundColor: const Color(0xFFFAFAF7),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0B5D34),
          primary: const Color(0xFF0B5D34),
          secondary: const Color(0xFFC5A880),
        ),
        useMaterial3: true,
      ),
      // Set Text Direction based on locale (RTL for Arabic)
      home: Directionality(
        textDirection: _locale == 'ar' ? TextDirection.rtl : TextDirection.ltr,
        child: AppNavigator(currentLocale: _locale),
      ),
    );
  }
}

class AppNavigator extends StatefulWidget {
  final String currentLocale;
  const AppNavigator({super.key, required this.currentLocale});

  @override
  State<AppNavigator> createState() => _AppNavigatorState();
}

class _AppNavigatorState extends State<AppNavigator> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      HomeScreen(lang: widget.currentLocale),
      JourneyScreen(lang: widget.currentLocale),
      AgenciesScreen(lang: widget.currentLocale),
      EspaceScreen(lang: widget.currentLocale),
    ];

    final isRtl = widget.currentLocale == 'ar';

    // Simple bottom navigation translated tabs
    final labels = {
      'fr': ['Accueil', 'Parcours', 'Agences', 'Mon Espace'],
      'wo': ['Kër', 'Yoon wi', 'Agence yi', 'Sama Espace'],
      'ar': ['الرئيسية', 'الرحلة', 'الوكالات', 'حسابي']
    }[widget.currentLocale]!;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF0B5D34),
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home_outlined),
            activeIcon: const Icon(Icons.home),
            label: labels[0],
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.timeline_outlined),
            activeIcon: const Icon(Icons.timeline),
            label: labels[1],
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.business_outlined),
            activeIcon: const Icon(Icons.business),
            label: labels[2],
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            activeIcon: const Icon(Icons.person),
            label: labels[3],
          ),
        ],
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
      'scam_warning_desc': 'Ne versez jamais d\'argent à une agence sans avoir vérifié son agrément DGP.',
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
    }
  };

  static String get(String key, String lang) {
    return _strings[lang]?[key] ?? key;
  }
}
