import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api_service.dart';
import '../main.dart';

class BudgetScreen extends StatefulWidget {
  final String lang;
  const BudgetScreen({super.key, required this.lang});

  @override
  State<BudgetScreen> createState() => _BudgetScreenState();
}

class _BudgetScreenState extends State<BudgetScreen> {
  double _packagePrice = 4500000;
  double _pocketMoney = 500000;
  double _sacrificePrice = 120000;
  double _shoppingPrice = 250000;

  int _totalBudget = 0;
  String _advice = '';
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadSavedBudget();
  }

  void _loadSavedBudget() async {
    final prefs = await SharedPreferences.getInstance();
    // Pre-populate with default if not found
    final packageSaved = prefs.getDouble('sunuhajj_budget_package') ?? 4500000;
    final pocketSaved = prefs.getDouble('sunuhajj_budget_pocket') ?? 500000;
    final sacrificeSaved = prefs.getDouble('sunuhajj_budget_sacrifice') ?? 120000;
    final shoppingSaved = prefs.getDouble('sunuhajj_budget_shopping') ?? 250000;

    setState(() {
      _packagePrice = packageSaved;
      _pocketMoney = pocketSaved;
      _sacrificePrice = sacrificeSaved;
      _shoppingPrice = shoppingSaved;
    });
    _triggerCalculation();
  }

  void _triggerCalculation() async {
    setState(() => _isLoading = true);

    // Call REST api calculate budget
    final result = await ApiService.calculateBudget(
      _packagePrice.round(),
      _pocketMoney.round(),
      _sacrificePrice.round(),
      _shoppingPrice.round(),
      widget.lang,
    );

    if (result != null) {
      setState(() {
        _totalBudget = result['total'] as int;
        _advice = result['advice'] as String;
      });
    } else {
      // Local fallback calculation if server is offline
      final total = _packagePrice.round() + _pocketMoney.round() + _sacrificePrice.round() + _shoppingPrice.round();
      String localAdvice = '';
      if (total > 8000000) {
        localAdvice = widget.lang == 'ar'
            ? 'ميزانيتك ممتازة وتغطي الباقات الفاخرة (VIP). ننصحك بالتأكد من جودة الخدمات التعاقدية.'
            : (widget.lang == 'wo' ? 'Sa koppar fés na lool. Waajal say hôtel 5 étoiles yu VIP.' : 'Votre budget correspond à un forfait haut de gamme (VIP). Assurez-vous d\'avoir des garanties contractuelles solides.');
      } else if (total < 4200000) {
        localAdvice = widget.lang == 'ar'
            ? 'ميزانيتك تقع ضمن الفئة الاقتصادية. تأكد من توفر حافلات مجانية لنقلك من الفندق إلى الحرم.'
            : (widget.lang == 'wo' ? 'Sa koppar dafa yomb. Seetal bu baax ndax am na auto transport.' : 'Votre budget est économique. Vérifiez les navettes entre l\'hôtel et le Haram.');
      } else {
        localAdvice = widget.lang == 'ar'
            ? 'ميزانيتك متوازنة جداً. نوصي بالاحتفاظ بنسبة 10% إضافية للحالات الطارئة.'
            : (widget.lang == 'wo' ? 'Sa koppar ngi fés bu baax. Prévoyal say koppari emergency.' : 'Votre budget est bien équilibré. Prévoyez toujours une marge de 10% pour les imprévus.');
      }

      setState(() {
        _totalBudget = total;
        _advice = localAdvice;
      });
    }
    setState(() => _isLoading = false);
  }

  void _saveBudgetToStorage() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('sunuhajj_budget_package', _packagePrice);
    await prefs.setDouble('sunuhajj_budget_pocket', _pocketMoney);
    await prefs.setDouble('sunuhajj_budget_sacrifice', _sacrificePrice);
    await prefs.setDouble('sunuhajj_budget_shopping', _shoppingPrice);
    await prefs.setString('sunuhajj_saved_budget', _totalBudget.toString());

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.lang == 'ar' ? 'تم حفظ الميزانية في لوحة التحكم!' : (widget.lang == 'wo' ? 'Koppar bi denc na !' : 'Budget enregistré sur le tableau de bord !'),
          ),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = L10n.get('budget_title', widget.lang);
    final totalLabel = L10n.get('total_est', widget.lang);
    final saveButtonText = L10n.get('btn_save_budget', widget.lang);

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF042F1A),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Total budget display
            Card(
              color: const Color(0xFF042F1A),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 24),
                child: Column(
                  children: [
                    Text(
                      totalLabel.toUpperCase(),
                      style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : Text(
                            '$_totalBudget FCFA',
                            style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Sliders list
            Card(
              color: Colors.white,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Slider 1
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(widget.lang == 'ar' ? 'باقة الوكالة' : 'Forfait agence', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('${_packagePrice.round()} F', style: const TextStyle(color: Color(0xFF042F1A), fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Slider(
                          value: _packagePrice,
                          min: 3000000,
                          max: 10000000,
                          divisions: 70,
                          activeColor: const Color(0xFFD4AF37),
                          onChanged: (val) {
                            setState(() => _packagePrice = val);
                          },
                          onChangeEnd: (val) => _triggerCalculation(),
                        )
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Slider 2
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(widget.lang == 'ar' ? 'مصروف الجيب' : 'Argent de poche', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('${_pocketMoney.round()} F', style: const TextStyle(color: Color(0xFF042F1A), fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Slider(
                          value: _pocketMoney,
                          min: 100000,
                          max: 2000000,
                          divisions: 38,
                          activeColor: const Color(0xFFD4AF37),
                          onChanged: (val) {
                            setState(() => _pocketMoney = val);
                          },
                          onChangeEnd: (val) => _triggerCalculation(),
                        )
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Slider 3
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(widget.lang == 'ar' ? 'الهدي (الموتون)' : 'Sacrifice (Hady)', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('${_sacrificePrice.round()} F', style: const TextStyle(color: Color(0xFF042F1A), fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Slider(
                          value: _sacrificePrice,
                          min: 100000,
                          max: 300000,
                          divisions: 20,
                          activeColor: const Color(0xFFD4AF37),
                          onChanged: (val) {
                            setState(() => _sacrificePrice = val);
                          },
                          onChangeEnd: (val) => _triggerCalculation(),
                        )
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Slider 4
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(widget.lang == 'ar' ? 'المشتريات والهدايا' : 'Shopping / Cadeaux', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            Text('${_shoppingPrice.round()} F', style: const TextStyle(color: Color(0xFF042F1A), fontSize: 12, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Slider(
                          value: _shoppingPrice,
                          min: 50000,
                          max: 1000000,
                          divisions: 38,
                          activeColor: const Color(0xFFD4AF37),
                          onChanged: (val) {
                            setState(() => _shoppingPrice = val);
                          },
                          onChangeEnd: (val) => _triggerCalculation(),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Financial Advice Card
            if (_advice.isNotEmpty)
              Card(
                color: const Color(0xFFFAF4EB),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: const BorderSide(color: Color(0xFFFAF4EB)),
                ),
                elevation: 0,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.info_outline, color: Color(0xFFD4AF37)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              L10n.get('budget_advice_title', widget.lang),
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFFD4AF37)),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _advice,
                              style: const TextStyle(fontSize: 12, color: Colors.black87),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 24),

            ElevatedButton(
              onPressed: _saveBudgetToStorage,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF042F1A),
                minimumSize: const Size.fromHeight(50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: Text(
                saveButtonText,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
