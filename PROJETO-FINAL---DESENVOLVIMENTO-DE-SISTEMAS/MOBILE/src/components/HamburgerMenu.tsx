import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HamburgerMenu({ onNavigate, visible, onClose, isGuest }: { onNavigate: (route: string) => void; visible: boolean; onClose: () => void; isGuest?: boolean }) {
  const menuItems = [
    { label: 'Início', route: 'Order' },
    { label: 'Minha conta', route: 'Account' },
    { label: 'Meus pedidos', route: 'Orders' },
    { label: 'Meus pagamentos', route: 'Payments' },
    { label: 'Sair', route: 'Logout' },
  ];

  const guestMenuItems = [
    { label: 'Início', route: null }, // Stay on same screen, just close menu
    { label: 'Fazer login', route: 'SignIn' },
    { label: 'Fazer cadastro', route: 'SignUp' },
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
            {(isGuest ? guestMenuItems : menuItems).map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (item.route) {
                    onNavigate(item.route);
                  }
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
    marginTop: 10,
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 170,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
