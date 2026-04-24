// screens/ContactsScreen.js
import React from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import { CONTACTS_SECTIONS } from '../data/contacts';

// Komponen untuk setiap item kontak
const ContactItem = ({ item }) => (
  <TouchableOpacity
    style={styles.contactItem}
    onPress={() => Alert.alert(item.name, `📞 ${item.phone}`)}
    activeOpacity={0.7}
  >
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarEmoji}>{item.avatar}</Text>
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactPhone}>{item.phone}</Text>
    </View>
    <Text style={styles.callIcon}>📞</Text>
  </TouchableOpacity>
);

// Komponen untuk header setiap section (huruf abjad)
const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export default function ContactsScreen() {
  // Hitung total kontak dari semua section
  const totalContacts = CONTACTS_SECTIONS.reduce(
    (total, section) => total + section.data.length, 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📇 Kontak</Text>
        <Text style={styles.headerSubtitle}>{totalContacts} kontak</Text>
      </View>

      {/* ===== SECTION LIST ===== */}
      <SectionList
        sections={CONTACTS_SECTIONS}          // array of sections
        renderItem={({ item }) => (            // render tiap item
          <ContactItem item={item} />
        )}
        renderSectionHeader={({ section }) => (  // render header section
          <SectionHeader title={section.title} />
        )}
        keyExtractor={(item) => item.id}      // key unik
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}    // header nempel saat scroll (ala Contacts app)
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={styles.divider} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  headerSubtitle: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  listContent: { paddingBottom: 32 },
  sectionHeader: {
    backgroundColor: '#f9fafb',         // background untuk sticky header
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarEmoji: { fontSize: 22 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 2 },
  contactPhone: { fontSize: 13, color: '#6b7280' },
  callIcon: { fontSize: 18 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginLeft: 74 },
});