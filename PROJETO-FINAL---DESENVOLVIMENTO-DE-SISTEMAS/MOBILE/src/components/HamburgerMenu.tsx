import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HamburgerMenu({ onNavigate, visible, onClose }: { onNavigate: (route: string) => void; visible: boolean; onClose: () => void }) {
  const menuItems = [
    { label: 'Início', route: 'ChooseTable' },
    { label: 'Minha conta', route: 'Account' },
    { label: 'Meus pedidos', route: 'Orders' },
    { label: 'Meus pagamentos', route: 'Payments' },
    { label: 'Sair', route: 'Logout' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
      hardwareAccelerated={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View pointerEvents="box-none" style={styles.menuWrapper}>
          <View style={styles.menuContainer}>
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  onNavigate(item.route);
                }}
              >
                <Text style={styles.menuText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuWrapper: {
    paddingTop: 50,
    paddingLeft: 8,
    width: '100%',
  },
  menuContainer: {
    backgroundColor: '#B72F14',
    borderRadius: 12,
    marginTop: 60,
    marginLeft: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    minWidth: 180,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '500',
  },
});
