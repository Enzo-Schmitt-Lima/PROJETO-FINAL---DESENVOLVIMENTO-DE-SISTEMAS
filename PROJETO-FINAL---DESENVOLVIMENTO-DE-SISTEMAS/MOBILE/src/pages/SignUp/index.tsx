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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ChooseTable: undefined;
  CreateComanda: undefined;
};

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, "SignUp">;

export default function SignUp({ navigation }: SignUpScreenProps) {
  const { signUp, loadingAuth, isGuest } = useContext(AuthContext);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSignUp() {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const userData = await signUp({ name: nome, email, password: senha });

      if (userData) {
        Alert.alert("Sucesso!", "Cadastro realizado!");
        navigation.reset({
          index: 0,
          routes: [{ name: "CreateComanda" }],
        });
      }
    } catch (err) {
      console.log("Erro ao cadastrar:", err);
      Alert.alert("Erro", "Não foi possível realizar o cadastro.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isGuest && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#5D3A2F" />
          </TouchableOpacity>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.contentWrapper}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Cadastre-se</Text>
              <View style={styles.titleUnderlineWrapper}>
                <View style={styles.titleUnderline} />
              </View>
            </View>

            <TextInput
              placeholder="Nome completo"
              style={styles.input}
              placeholderTextColor="#FFFFFF80"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              placeholder="E-mail"
              style={styles.input}
              placeholderTextColor="#FFFFFF80"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Senha"
              style={styles.input}
              placeholderTextColor="#FFFFFF80"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSignUp}
              disabled={loadingAuth}
            >
              {loadingAuth ? (
                <ActivityIndicator size={25} color="#4F5476" />
              ) : (
                <Text style={styles.submitButtonText}>CADASTRAR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginPromptContainer}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={styles.loginPromptText}>
                Já tem uma conta? {"\n"}Entre
              </Text>
              <View style={styles.loginPromptUnderline} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.sacContainer}>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/h62poljs_expires_30_days.png",
                }}
                resizeMode={"stretch"}
                style={styles.sacIcon}
              />
              <Text style={styles.sacText}>SAC</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#911F09" },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9D9D9', paddingVertical: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  backButton: { padding: 8 },
  scrollContainer: { flexGrow: 1, justifyContent: "center" },
  mainContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 44,
    paddingVertical: 150,
    marginVertical: 42,
    marginHorizontal: 6,
    justifyContent: "space-between",
    minHeight: 600,
  },
  contentWrapper: { alignItems: "center", paddingTop: 50, paddingBottom: 20 },
  titleContainer: { alignItems: "center", marginBottom: 30 },
  titleText: { color: "#4F5476", fontSize: 28, fontWeight: "bold" },
  titleUnderlineWrapper: { alignItems: "center" },
  titleUnderline: {
    width: 120,
    height: 2,
    backgroundColor: "#4F5476",
    borderRadius: 10,
    marginTop: 4,
  },
  input: {
    width: 280,
    height: 50,
    backgroundColor: "#B72F14",
    marginBottom: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 16,
    elevation: 3.5,
  },
  submitButton: {
    width: 280,
    height: 50,
    backgroundColor: "#F2CA85",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3.5,
  },
  submitButtonText: { color: "#4F5476", fontSize: 14, fontWeight: "bold" },
  loginPromptContainer: { alignItems: "center", marginTop: 20 },
  loginPromptText: {
    color: "#B3AAAA",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginPromptUnderline: {
    width: 32,
    height: 1,
    backgroundColor: "#B3AAAA",
    marginTop: 2,
  },
  footer: { alignItems: "flex-end" },
  sacContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 2,
    marginRight: 32,
  },
  sacIcon: { width: 18, height: 27, marginRight: 5 },
  sacText: { color: "#000000", fontSize: 12, fontWeight: "bold" },
});
