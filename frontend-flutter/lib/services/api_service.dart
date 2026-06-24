import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiService {
  // Auto-detect backend port based on platform
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api';
    }
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:3000/api'; // Android Emulator Loopback
      }
    } catch (_) {}
    return 'http://localhost:3000/api';
  }

  // Fetch all announcements from Node backend
  static Future<List<dynamic>> fetchAnnouncements() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/announcements'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error fetching announcements: $e');
    }
    return []; // Return empty on failure
  }

  // Fetch accredited travel agencies
  static Future<List<dynamic>> fetchAgencies() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/agencies'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error fetching agencies: $e');
    }
    return [];
  }

  // Submit agency contact form request
  static Future<bool> submitAgencyInquiry(int agencyId, String name, String phone) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/agencies/$agencyId/inquiry'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'name': name, 'phone': phone}),
      );
      return response.statusCode == 201;
    } catch (e) {
      print('Error submitting inquiry: $e');
    }
    return false;
  }

  // Calculate budget and receive customized recommendations
  static Future<Map<String, dynamic>?> calculateBudget(
      int package, int pocket, int sacrifice, int shopping, String lang) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/budget/calculate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'packagePrice': package,
          'pocketMoney': pocket,
          'sacrificePrice': sacrifice,
          'shoppingPrice': shopping,
          'lang': lang
        }),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error calculating budget: $e');
    }
    return null;
  }

  // Register a new pilgrim
  static Future<Map<String, dynamic>?> registerPilgrim(Map<String, dynamic> pilgrimData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/pilgrims'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(pilgrimData),
      );
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error registering pilgrim: $e');
    }
    return null;
  }

  // Fetch pilgrim details by passport number
  static Future<Map<String, dynamic>?> fetchPilgrimByPassport(String passportNumber) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/pilgrims/passport/$passportNumber'),
      );
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Error fetching pilgrim by passport: $e');
    }
    return null;
  }
}
