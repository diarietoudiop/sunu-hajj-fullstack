import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_screen.dart';

class OnboardingScreen extends StatefulWidget {
  final String lang;
  const OnboardingScreen({super.key, required this.lang});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // Localized Onboarding Slides
  final Map<String, List<Map<String, String>>> _slides = {
    'fr': [
      {
        'title': 'Dossier DGP & Statut',
        'desc': 'Suivez en temps réel la validation administrative et l\'aptitude médicale de votre dossier Hajj par les autorités.',
        'icon': 'badge',
      },
      {
        'title': 'Simulateur de Budget',
        'desc': 'Estimez et gérez facilement vos dépenses globales : forfait agence, argent de poche, sacrifice (Hady) et shopping.',
        'icon': 'wallet',
      },
      {
        'title': 'Guide de Rites & Renseignements',
        'desc': 'Découvrez le parcours détaillé du pèlerin, étape par étape, de l\'aéroport de Dakar jusqu\'à La Mecque.',
        'icon': 'explore',
      },
      {
        'title': 'Alertez vos Proches',
        'desc': 'Envoyez des SMS d\'alerte pré-configurés en un clic pour rassurer votre famille à chaque étape clé du voyage.',
        'icon': 'sms',
      },
    ],
    'wo': [
      {
        'title': 'Fi say Kayit tollu',
        'desc': 'Seetloo ci sa téléphone ndax DGP nangu na sa dossier ak ndax wér-gi-yaram gi wér na ci jàmm.',
        'icon': 'badge',
      },
      {
        'title': 'Limu Koppar yi',
        'desc': 'Waajal say koppari Hajj : forfait agence, argent de poche, sacrifice (Hady) ak yeneen dépense yi.',
        'icon': 'wallet',
      },
      {
        'title': 'Yoonu pèlerin bi',
        'desc': 'Jàngal rite yi ak waajal yoonu Maka bi, tambali ko Dakar ba aksi Kaaba gu sell gi.',
        'icon': 'explore',
      },
      {
        'title': 'Xamal sa Njaboot',
        'desc': 'Yóone ay alerte SMS ci sa njaboot ngir rassurer leen ci yoon wi ci benn clic.',
        'icon': 'sms',
      },
    ],
    'ar': [
      {
        'title': 'ملف الحج والجاهزية',
        'desc': 'تابع في وقت حقيقي عملية التدقيق الإداري والتحقق الطبي لملفك من قبل البعثة السنغالية الرسمية.',
        'icon': 'badge',
      },
      {
        'title': 'محاكي الميزانية',
        'desc': 'احسب ورتب نفقات رحلتك بسهولة: رسوم الوكالة، مصروف الجيب، الهدي، ومشتريات الهدايا.',
        'icon': 'wallet',
      },
      {
        'title': 'دليل المناسك والخطوات',
        'desc': 'تعرف على المسار التفصيلي والتعليمات اللوجستية والروحية لرحلتك من دكار إلى المشاعر المقدسة.',
        'icon': 'explore',
      },
      {
        'title': 'تنبيه العائلة والأقارب',
        'desc': 'أرسل رسائل نصية قصيرة (SMS) تلقائية ومعدة مسبقاً لطمأنة عائلتك عند وصولك لكل محطة.',
        'icon': 'sms',
      },
    ]
  };

  IconData _getIcon(String iconName) {
    switch (iconName) {
      case 'badge':
        return Icons.assignment_turned_in;
      case 'wallet':
        return Icons.account_balance_wallet;
      case 'explore':
        return Icons.explore;
      case 'sms':
        return Icons.sms;
      default:
        return Icons.star;
    }
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('sunuhajj_onboarded', true);
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => AuthScreen(lang: widget.lang),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final slides = _slides[widget.lang] ?? _slides['fr']!;
    final isRTL = widget.lang == 'ar';

    return Scaffold(
      backgroundColor: const Color(0xFF052C18), // Dark emerald premium background
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (_currentPage < slides.length - 1)
            TextButton(
              onPressed: _completeOnboarding,
              child: Text(
                widget.lang == 'ar' ? 'تخطي' : (widget.lang == 'wo' ? 'Rombal' : 'Passer'),
                style: const TextStyle(
                  color: Color(0xFFC5A880), // Gold
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (int page) {
                setState(() {
                  _currentPage = page;
                });
              },
              itemCount: slides.length,
              itemBuilder: (context, index) {
                final slide = slides[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Animated premium icon background circle
                      Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF0B5D34), Color(0xFF052C18)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFC5A880).withOpacity(0.2),
                              blurRadius: 20,
                              spreadRadius: 5,
                            )
                          ],
                          border: Border.all(
                            color: const Color(0xFFC5A880),
                            width: 2,
                          ),
                        ),
                        child: Icon(
                          _getIcon(slide['icon']!),
                          size: 64,
                          color: const Color(0xFFC5A880),
                        ),
                      ),
                      const SizedBox(height: 48),
                      // Slide Title
                      Text(
                        slide['title']!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Slide Description
                      Text(
                        slide['desc']!,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.8),
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          
          // Navigation Dot indicators and buttons row
          Padding(
            padding: const EdgeInsets.all(32.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Page Indicator Dots
                Row(
                  children: List.generate(
                    slides.length,
                    (index) => Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: _currentPage == index ? 24 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _currentPage == index
                            ? const Color(0xFFC5A880) // Gold
                            : Colors.white.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  ),
                ),
                
                // Next / Get Started button
                ElevatedButton(
                  onPressed: () {
                    if (_currentPage < slides.length - 1) {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    } else {
                      _completeOnboarding();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC5A880),
                    foregroundColor: const Color(0xFF052C18),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    elevation: 5,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _currentPage == slides.length - 1
                            ? (widget.lang == 'ar' ? 'ابدأ الآن' : (widget.lang == 'wo' ? 'Tambali' : 'Commencer'))
                            : (widget.lang == 'ar' ? 'التالي' : (widget.lang == 'wo' ? 'Kanam' : 'Suivant')),
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      if (_currentPage < slides.length - 1) ...[
                        const SizedBox(width: 8),
                        Icon(
                          isRTL ? Icons.arrow_back : Icons.arrow_forward,
                          size: 16,
                        ),
                      ]
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
