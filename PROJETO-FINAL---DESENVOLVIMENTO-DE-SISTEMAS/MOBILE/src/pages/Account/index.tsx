import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';
import { AuthContext } from '../../contexts/AuthContext';

export default function Account() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();
  const { user, isGuest } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Tal de Tal');
  const [email, setEmail] = useState(user?.email || 'tal@talmail.com');
  const [phone, setPhone] = useState('99 99999-9999');
  const [password, setPassword] = useState('************');

  useEffect(() => {
    if (isGuest) {
      Alert.alert('Acesso Restrito', 'Você deve estar logado para acessar sua conta.');
      navigation.goBack();
      return;
    }
  }, [isGuest, navigation]);

  return (
    <View style={styles.bgContainer}>
      <View style={styles.cardContainer}>
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logoImage} 
        />
        <Text style={styles.title}>Minha conta</Text>
        <View style={styles.avatarRow}>
          <View style={styles.avatar} />
          <TouchableOpacity style={styles.editAvatar}><Text style={styles.editIcon}>✎</Text></TouchableOpacity>
        </View>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.editBox}>
          <Text style={styles.editTitle}>Editar dados:</Text>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>Nome:</Text><TextInput style={styles.input} value={name} onChangeText={setName} editable={editing} /></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>E-mail:</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} editable={editing} /></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>Telefone:</Text><TextInput style={styles.input} value={phone} onChangeText={setPhone} editable={editing} /></View>
          <View style={styles.inputRow}><Text style={styles.inputLabel}>Senha:</Text><TextInput style={styles.input} value={password} onChangeText={setPassword} editable={editing} secureTextEntry /></View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={() => setEditing(!editing)}>
          <Text style={styles.saveText}>{editing ? 'Salvar alterações' : 'Editar'}</Text>
        </TouchableOpacity>
          <Image 
            source={require('../../../assets/sac.png')} 
            style={styles.sacImage} 
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: { flex: 1, backgroundColor: '#911F09', justifyContent: 'center', alignItems: 'center' },
  cardContainer: { backgroundColor: '#F5F5F5', borderRadius: 30, padding: 20, width: '90%', maxWidth: 420, alignItems: 'stretch', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 8, position: 'relative' },
  backButton: { position: 'absolute', top: 10, left: 10, padding: 10, zIndex: 1 },
  backText: { color: '#911F09', fontSize: 16, fontWeight: 'bold' },
  logoImage: { 
    width: 100, 
    height: 50, 
    resizeMode: 'contain', 
    alignSelf: 'center', 
    marginTop: 20, 
    marginBottom: 10 
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A3A6B', marginBottom: 18, marginTop: 10, textAlign: 'center', width: '100%' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#DDD', marginRight: 8 },
  editAvatar: { backgroundColor: '#FFF', borderRadius: 16, padding: 4, borderWidth: 1, borderColor: '#BBB' },
  editIcon: { fontSize: 18, color: '#911F09' },
  userName: { fontWeight: 'bold', fontSize: 18, color: '#1A3A6B', marginBottom: 12 },
  editBox: { borderWidth: 2, borderColor: '#F5F5F5', borderRadius: 8, padding: 10, width: '100%', marginBottom: 12 },
  editTitle: { fontWeight: 'bold', fontSize: 15, color: '#1A3A6B', marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputLabel: { width: 70, color: '#555', fontWeight: 'bold' },
  input: { flex: 1, backgroundColor: '#EEE', borderRadius: 6, padding: 8, fontSize: 15, borderWidth: 1, borderColor: '#DDD', color: '#1A3A6B' },
  saveButton: { backgroundColor: '#F2CA85', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 8 },
  saveText: { color: '#911F09', fontWeight: 'bold', fontSize: 16 },
  sacImage: { color: '#911F09', fontWeight: 'bold', fontSize: 14, marginTop: 10, alignSelf: 'flex-end' },
});
