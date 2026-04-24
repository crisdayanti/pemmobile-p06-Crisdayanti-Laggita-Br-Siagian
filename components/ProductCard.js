// components/ProductCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Destructuring props langsung di parameter — lebih clean
const ProductCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}  // kirim data item ke parent
      activeOpacity={0.85}
    >
      {/* Emoji sebagai pengganti gambar */}
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{item.image}</Text>
      </View>

      {/* Info produk */}
      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        {/* Rating dan sold */}
        <View style={styles.metaRow}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.sold}>{item.sold.toLocaleString('id-ID')} terjual</Text>
        </View>

        {/* Harga */}
        <Text style={styles.price}>
          Rp {item.price.toLocaleString('id-ID')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',          // horizontal layout
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    shadowColor: '#000',           // shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,                  // shadow Android
  },
  imageContainer: {
    width: 72,
    height: 72,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,                 // jangan menyusut saat ruang sempit
  },
  emoji: {
    fontSize: 36,
  },
  info: {
    flex: 1,                       // ambil sisa ruang horizontal
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  rating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  sold: {
    fontSize: 11,
    color: '#9ca3af',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
});

export default ProductCard;