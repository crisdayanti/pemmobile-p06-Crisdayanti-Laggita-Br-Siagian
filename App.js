import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, FlatList, SectionList, TextInput, Alert, StatusBar,
  StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl
} from 'react-native';

// Import Data & Komponen
import { PRODUCTS } from './data/products';
import { CONTACTS_SECTIONS } from './data/contacts';
import ProductCard from './components/ProductCard'; 

export default function App() {
  const [currentView, setCurrentView] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('default'); 

  // R6: Pull to Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // R5, E1, E4: Filter & Sorting Logic
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    if (currentView === 'products') {
      let result = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
      );

      // Logika Sorting
      if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price); 
      if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price); 
      if (sortBy === 'rating-high') result.sort((a, b) => b.rating - a.rating);
      
      return result;
    } else {
      return CONTACTS_SECTIONS.map(section => {
        const filteredContacts = section.data.filter(c => 
          c.name.toLowerCase().includes(query)
        );
        return filteredContacts.length > 0 ? { ...section, data: filteredContacts } : null;
      }).filter(Boolean);
    }
  }, [searchQuery, currentView, sortBy]);

  // R4: Dynamic Empty State
  const renderEmpty = () => (
    <View style={styles.emptyBox}>
      <Text style={{ fontSize: 60, marginBottom: 10 }}>
        {currentView === 'products' ? '🛍️' : '👥'}
      </Text>
      <Text style={styles.emptyText}>
        {currentView === 'products' ? 'Produk Fashion Tidak Ditemukan' : 'Kontak Tidak Ditemukan'}
      </Text>
      <Text style={styles.emptyHint}>Coba gunakan kata kunci lain yang lebih umum.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Text style={styles.title}>CRIS FASHION STORE</Text>
        
        <Text style={styles.countInfo}>
          {currentView === 'products' 
            ? `Menampilkan ${filteredData.length} Produk` 
            : `Menampilkan ${filteredData.reduce((acc, s) => acc + s.data.length, 0)} Kontak`}
        </Text>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, currentView === 'products' && styles.activeTab]}
            onPress={() => { setCurrentView('products'); setSearchQuery(''); setSortBy('default'); }}
          >
            <Text style={currentView === 'products' ? styles.activeTabText : styles.tabText}>🛍️ Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, currentView === 'contacts' && styles.activeTab]}
            onPress={() => { setCurrentView('contacts'); setSearchQuery(''); }}
          >
            <Text style={currentView === 'contacts' ? styles.activeTabText : styles.tabText}>📇 Kontak</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <Text style={{marginRight: 8}}>🔍</Text>
          <TextInput 
            style={styles.searchBar}
            placeholder={currentView === 'products' ? "Cari fashion..." : "Cari kontak..."}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- TOMBOL SORTING SESUAI PERMINTAAN --- */}
        {currentView === 'products' && (
          <View style={styles.sortRow}>
            <TouchableOpacity 
              onPress={() => setSortBy('price-low')} 
              style={[styles.sortBtn, sortBy === 'price-low' && styles.activeSortBtn]}
            >
              <Text style={[styles.sortText, sortBy === 'price-low' && styles.activeSortText]}>Harga Termurah</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setSortBy('price-high')} 
              style={[styles.sortBtn, sortBy === 'price-high' && styles.activeSortBtn]}
            >
              <Text style={[styles.sortText, sortBy === 'price-high' && styles.activeSortText]}>Harga Tertinggi</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setSortBy('rating-high')} 
              style={[styles.sortBtn, sortBy === 'rating-high' && styles.activeSortBtn]}
            >
              <Text style={[styles.sortText, sortBy === 'rating-high' && styles.activeSortText]}>Rating Tertinggi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {currentView === 'products' ? (
        <FlatList 
          data={filteredData}
          renderItem={({ item }) => (
            <ProductCard item={item} onPress={(p) => Alert.alert(p.name, 'Ditambahkan ke keranjang!')} />
          )}
          keyExtractor={(item) => item.id} 
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={renderEmpty} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} 
        />
      ) : (
        <SectionList 
          sections={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <Text style={styles.contactAvatar}>{item.avatar}</Text>
              <View>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
              </View>
            </View>
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{section.title}</Text></View>
          )}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#6366f1' },
  countInfo: { fontSize: 12, textAlign: 'center', color: '#64748b', marginBottom: 12, fontWeight: '500' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#6366f1' },
  tabText: { color: '#64748b', fontWeight: '600' },
  activeTabText: { color: '#fff', fontWeight: 'bold' },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 12 },
  searchBar: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#1e293b' },
  clearButton: { padding: 5 },
  clearText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 18 },
  sortRow: { flexDirection: 'row', gap: 6, marginTop: 12 },
  sortBtn: { flex: 1, paddingVertical: 8, paddingHorizontal: 4, backgroundColor: '#f1f5f9', borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  activeSortBtn: { backgroundColor: '#e0e7ff', borderColor: '#6366f1' },
  sortText: { fontSize: 10, color: '#64748b', fontWeight: 'bold', textAlign: 'center' },
  activeSortText: { color: '#4338ca' },
  emptyBox: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { color: '#1e293b', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  emptyHint: { color: '#94a3b8', marginTop: 8, fontSize: 14, textAlign: 'center' },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
  contactAvatar: { fontSize: 28, marginRight: 15 },
  contactName: { fontWeight: 'bold', color: '#1e293b' },
  contactPhone: { color: '#64748b', fontSize: 13 },
  sectionHeader: { backgroundColor: '#f8f9fa', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontWeight: 'bold', color: '#6366f1' }
});