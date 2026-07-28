import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../services/api_service.dart';
import '../main.dart';

class ScannerDialog extends StatefulWidget {
  final String lang;
  const ScannerDialog({super.key, required this.lang});

  static void show(BuildContext context, String lang) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => ScannerDialog(lang: lang),
    );
  }

  @override
  State<ScannerDialog> createState() => _ScannerDialogState();
}

class _ScannerDialogState extends State<ScannerDialog> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  final MobileScannerController _scannerController = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );
  final TextEditingController _inputController = TextEditingController();
  bool _isScanning = true;
  bool _isLoading = false;
  Map<String, dynamic>? _scannedResult;
  String? _errorMsg;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _scannerController.dispose();
    _animController.dispose();
    _inputController.dispose();
    super.dispose();
  }

  String _extractPassport(String rawText) {
    final text = rawText.trim().toUpperCase();
    final reg = RegExp(r'SN\d+');
    final match = reg.firstMatch(text);
    if (match != null) {
      return match.group(0)!;
    }
    return text;
  }

  Future<void> _processScan(String rawText) async {
    setState(() {
      _isScanning = false;
      _isLoading = true;
      _errorMsg = null;
    });

    final passport = _extractPassport(rawText);
    final pilgrim = await ApiService.fetchPilgrimByPassport(passport);

    setState(() {
      _isLoading = false;
      if (pilgrim != null) {
        _scannedResult = pilgrim;
      } else {
        _errorMsg = widget.lang == 'ar' 
            ? 'لم يتم العثور على أي ملف للحاج' 
            : 'Aucun dossier pèlerin trouvé pour ce code ($passport).';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool isAr = widget.lang == 'ar';
    
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        padding: const EdgeInsets.all(20),
        constraints: const BoxConstraints(maxWidth: 400),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isAr ? 'قارئ بطاقة الحاج (QR)' : 'Scanner Badge Pèlerin',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF042F1A)),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),
              const Divider(),
              const SizedBox(height: 10),

              if (_isScanning) ...[
                // Simulated Camera Scanner View
                Center(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 220,
                        height: 220,
                        decoration: BoxDecoration(
                          color: Colors.black,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: const Color(0xFF042F1A), width: 2),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: MobileScanner(
                            controller: _scannerController,
                            onDetect: (capture) {
                              final List<Barcode> barcodes = capture.barcodes;
                              for (final barcode in barcodes) {
                                final String? code = barcode.rawValue;
                                if (code != null && code.isNotEmpty) {
                                  _processScan(code);
                                  break;
                                }
                              }
                            },
                            errorBuilder: (context, error, child) {
                              return Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: const [
                                    Icon(Icons.camera_alt, color: Colors.white54, size: 36),
                                    SizedBox(height: 6),
                                    Text(
                                      'Caméra active\n(Ou simulez ci-dessous)',
                                      textAlign: TextAlign.center,
                                      style: TextStyle(fontSize: 10, color: Colors.white70),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      // Animated scanning laser line
                      AnimatedBuilder(
                        animation: _animController,
                        builder: (context, child) {
                          return Positioned(
                            top: 10 + (_animController.value * 200),
                            child: Container(
                              width: 220,
                              height: 4,
                              decoration: BoxDecoration(
                                color: Colors.green,
                                borderRadius: BorderRadius.circular(2),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.green.withOpacity(0.5),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  )
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  isAr ? 'قم بمحاكاة المسح الضوئي باختيار ملف اختبار :' : 'Simulez le scan en choisissant un profil test :',
                  style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  alignment: WrapAlignment.center,
                  children: [
                    ElevatedButton(
                      onPressed: () => _processScan('SN9876543'),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE2F0D9), elevation: 0),
                      child: const Text('Moustapha Diop', style: TextStyle(fontSize: 11, color: Color(0xFF042F1A))),
                    ),
                    ElevatedButton(
                      onPressed: () => _processScan('SN1234567'),
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE2F0D9), elevation: 0),
                      child: const Text('Khadidiatou', style: TextStyle(fontSize: 11, color: Color(0xFF042F1A))),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _inputController,
                        decoration: InputDecoration(
                          hintText: isAr ? 'أدخل رقم جواز السفر' : 'Saisir passeport manuel',
                          border: const OutlineInputBorder(),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_inputController.text.isNotEmpty) {
                          _processScan(_inputController.text);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF042F1A),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                      ),
                      child: const Icon(Icons.arrow_forward, color: Colors.white),
                    )
                  ],
                )
              ] else if (_isLoading) ...[
                const SizedBox(height: 40),
                const Center(child: CircularProgressIndicator(color: Color(0xFF042F1A))),
                const SizedBox(height: 40),
              ] else if (_errorMsg != null) ...[
                const SizedBox(height: 20),
                const Icon(Icons.error_outline, color: Colors.red, size: 48),
                const SizedBox(height: 12),
                Text(_errorMsg!, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _isScanning = true;
                      _scannedResult = null;
                      _errorMsg = null;
                    });
                  },
                  child: Text(isAr ? 'إعادة المحاولة' : 'Réessayer'),
                )
              ] else if (_scannedResult != null) ...[
                // Profile Scanned successfully
                _buildScannedProfileCard(isAr),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _isScanning = true;
                      _scannedResult = null;
                    });
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF042F1A)),
                  child: Text(
                    isAr ? 'مسح رمز آخر' : 'Scanner un autre badge',
                    style: const TextStyle(color: Colors.white),
                  ),
                )
              ]
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScannedProfileCard(bool isAr) {
    final res = _scannedResult!;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFAF9F5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.green.shade200, width: 1.5),
      ),
      child: Column(
        children: [
          const Icon(Icons.verified_user, color: Colors.green, size: 40),
          const SizedBox(height: 8),
          Text(
            isAr ? 'بوابة التحقق : معتمد' : 'VERIFICATION : VALIDÉ',
            style: const TextStyle(fontWeight: FontWeight.w900, color: Colors.green, fontSize: 11, letterSpacing: 0.5),
          ),
          const SizedBox(height: 14),
          Text(
            res['fullName'] ?? '',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF042F1A)),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            'Passeport : ${res['passportNumber']}',
            style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 14),
          const Divider(),
          _buildResultRow(isAr ? 'الوضع الطبي' : 'Aptitude médicale', isAr ? 'لائق' : 'APTE', true),
          _buildResultRow(isAr ? 'تأشيرة الحج' : 'Visa Hajj', isAr ? 'صادرة' : 'ÉMIS', true),
          _buildResultRow(isAr ? 'رحلة الطيران' : 'Vol assigné', res['flightNumber'] ?? 'SV 7423', true),
          _buildResultRow(isAr ? 'السكن بمكة' : 'Hôtel Makkah', res['hotelMakkah'] ?? 'Makkah Tower', true),
          const SizedBox(height: 14),
          ElevatedButton.icon(
            onPressed: () async {
              final passport = res['passportNumber'];
              if (passport != null) {
                final prefs = await SharedPreferences.getInstance();
                await prefs.setString('sunuhajj_user_passport', passport);
                if (mounted) {
                  Navigator.pop(context);
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
              }
            },
            icon: const Icon(Icons.login, color: Colors.white, size: 16),
            label: Text(
              isAr ? 'فتح حساب هذا الحاج' : 'Ouvrir cet Espace Pèlerin',
              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF042F1A),
              minimumSize: const Size.fromHeight(42),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildResultRow(String label, String value, bool ok) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF042F1A))),
        ],
      ),
    );
  }
}
