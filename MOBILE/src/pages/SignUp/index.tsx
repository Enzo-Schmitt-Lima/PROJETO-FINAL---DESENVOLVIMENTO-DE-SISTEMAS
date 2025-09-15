import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from "react-native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from "../../contexts/AuthContext";

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ChooseTable: undefined;
  Dashboard: undefined;
};

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUp({ navigation }: SignUpScreenProps) {
  const { signUp, loadingAuth } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');

  async function handleSignUp() {
    if (!nome || !email || !telefone || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      await signUp({ name: nome, email, password: senha });
      Alert.alert('Sucesso!', 'Cadastro realizado!');
      navigation.navigate('SignIn'); // vai pra tela de login automaticamente
    } catch (err) {
      console.log('Erro ao cadastrar:', err);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Cadastre-se</Text>
          <View style={styles.titleLine} />

          <TextInput
            placeholder="Nome completo"
            style={styles.input}
            placeholderTextColor="#fff"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            placeholder="E-mail"
            style={styles.input}
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="(DD) Telefone"
            style={styles.input}
            placeholderTextColor="#fff"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Senha"
            style={styles.input}
            placeholderTextColor="#fff"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            {loadingAuth ? (
              <ActivityIndicator size={25} color="#FFF"/>
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginText}>Já tem uma conta? Entre</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Image source={require("../SignIn/SAC.png")} style={styles.footerIcon} />
            <Text style={styles.footerText}>SAC</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#911F09" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: 'center', padding: 16 },
  card: {
    width: '100%',
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#4F5476" },
  titleLine: { width: 172, height: 2, backgroundColor: "#4F5476", marginVertical: 20, borderRadius: 10 },
  input: {
    width: "100%",
    backgroundColor: "#B72F14",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#F2CA85",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginVertical: 16,
    alignItems: "center",
    width: '100%',
  },
  buttonText: { color: "#4F5476", fontSize: 14, fontWeight: "bold" },
  loginText: { color: "#B3AAAA", fontSize: 12, fontWeight: "bold", marginVertical: 8 },
  footer: { flexDirection: "row", alignItems: "center", marginTop: 24 },
  footerIcon: { width: 20, height: 30, marginRight: 8 },
  footerText: { color: "#000", fontWeight: 'bold' }
});
