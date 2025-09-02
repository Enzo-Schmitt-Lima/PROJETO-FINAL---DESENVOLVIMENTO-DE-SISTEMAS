import React, { useState, useContext } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";


export default function SignUp({ navigation }: any) {
  const { signUp, loadingAuth } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  async function handleRegister() {
    if (!name || !email || !password || !passwordConfirm) {
      alert("Preencha todos os campos!");
      return;
    }

    if (password !== passwordConfirm) {
      alert("As senhas não coincidem!");
      return;
    }

    await signUp({ name, email, password });
    navigation.navigate("SignIn");
    }

    return (
    <View style={styles.container}>
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />


      <TextInput
        placeholder="Nome"
        style={styles.input}
        placeholderTextColor={"#FFF"}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor={"#FFF"}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        style={styles.input}
        placeholderTextColor={"#FFF"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirme a senha"
        style={styles.input}
        placeholderTextColor={"#FFF"}
        secureTextEntry
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loadingAuth ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.textLink}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1d1d2e'
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain'
  },

  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#101026',
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#FFF'
  },

  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#3FFFa3',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101026'
  },

  textLink: {
    color: '#FFF',
    marginTop: 10
  }
});

