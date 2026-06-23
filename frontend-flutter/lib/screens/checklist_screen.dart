import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../main.dart';

class ChecklistScreen extends StatefulWidget {
  final String lang;
  const ChecklistScreen({super.key, required this.lang});

  @override
  State<ChecklistScreen> createState() => _ChecklistScreenState();
}

class _ChecklistScreenState extends State<ChecklistScreen> {
  List<Map<String, dynamic>> _checklistItems = [
    { 'id': '1', 'cat': 'admin', 'text_fr': 'Vérifier la validité de mon passeport (min 6 mois)', 'text_wo': 'Seet lane passeport bi am na 6 mois laata mu reer', 'text_ar': 'التحقق من صلاحية جواز السفر (6 أشهر كحد أدنى)' },
    { 'id': '2', 'cat': 'admin', 'text_fr': 'Faire les photos d\'identité aux normes saoudiennes', 'text_wo': 'Defal photo identité yu Maka nangu', 'text_ar': 'إعداد الصور الشخصية بالمواصفات السعودية المطلوبة' },
    { 'id': '3', 'cat': 'health', 'text_fr': 'Faire le vaccin obligatoire (Méningite & Fièvre jaune)', 'text_wo': 'Def vaccins obligatoires yi (Méningite, Fièvre Jaune)', 'text_ar': 'أخذ اللقاحات الإلزامية (الحمى الشوكية والصفراء)' },
    { 'id': '4', 'cat': 'health', 'text_fr': 'Préparer une trousse médicale (pansements, paracétamol)', 'text_wo': 'Defal sa boite pharmacie', 'text_ar': 'تجهيز حقيبة طبية شخصية (مسكنات، مطهر، ضمادات)' },
    { 'id': '5', 'cat': 'luggage', 'text_fr': 'Acheter deux pagnes d\'Ihram blancs (pour les hommes)', 'text_wo': 'Jënd 2 pagnes Ihram yu weex', 'text_ar': 'شراء ملابس الإحرام البيضاء (للرجال)' },
    { 'id': '6', 'cat': 'luggage', 'text_fr': 'Préparer une valise solide identifiée avec nom et adresse', 'text_wo': 'Waajal valise bu dëggër and ak sa tour', 'text_ar': 'تجهيز حقيبة متينة وكتابة الاسم والعنوان عليها بوضوح' },
    { 'id': '7', 'cat': 'spiritual', 'text_fr': 'Apprendre les invocations de base et l\'intention du Hajj', 'text_wo': 'Jàng ñaan u Hajj yi ak intention u Hajj bi', 'text_ar': 'حفظ الأدعية الأساسية ونية أداء مناسك الحج' }
  ];

  List<String> _checkedIds = [];

  @override
  void initState() {
    super.initState();
    _loadChecklistState();
  }

  void _loadChecklistState() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _checkedIds = prefs.getStringList('sunuhajj_checklist_keys') ?? [];
    });
  }

  void _toggleItem(String id) async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      if (_checkedIds.contains(id)) {
        _checkedIds.remove(id);
      } else {
        _checkedIds.add(id);
      }
    });
    await prefs.setStringList('sunuhajj_checklist_keys', _checkedIds);
  }

  @override
  Widget build(BuildContext context) {
    final title = L10n.get('checklist_title', widget.lang);

    return Scaffold(
      appBar: AppBar(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF0B5D34),
        foregroundColor: Colors.white,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _checklistItems.length,
        itemBuilder: (context, index) {
          final item = _checklistItems[index];
          final id = item['id'] as String;
          final isChecked = _checkedIds.contains(id);

          final text = widget.lang == 'ar'
              ? item['text_ar']
              : (widget.lang == 'wo' ? item['text_wo'] : item['text_fr']);

          return Card(
            color: Colors.white,
            margin: const EdgeInsets.only(bottom: 10),
            child: CheckboxListTile(
              value: isChecked,
              onChanged: (val) => _toggleItem(id),
              title: Text(
                text!,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  decoration: isChecked ? TextDecoration.lineThrough : null,
                  color: isChecked ? Colors.grey : Colors.black87,
                ),
              ),
              subtitle: Text(
                item['cat'].toString().toUpperCase(),
                style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
              ),
              activeColor: const Color(0xFF0B5D34),
            ),
          );
        },
      ),
    );
  }
}
