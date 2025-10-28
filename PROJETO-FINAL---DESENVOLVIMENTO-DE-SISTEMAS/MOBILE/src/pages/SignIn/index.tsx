import React, { FC, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthContext } from "../../contexts/AuthContext";

type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ChooseTable: undefined;
  CreateComanda: undefined;
  AssignTable: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "SignIn">;

const SignIn: FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn, loadingAuth, enterAsGuest } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    const userData = await signIn({ email, password });
    if (userData) {
      navigation.navigate("AssignTable");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.contentWrapper}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Login</Text>
              <View style={styles.titleUnderlineWrapper}>
                <View style={styles.titleUnderline} />
              </View>
            </View>

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
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogin}
              disabled={loadingAuth}
            >
              {loadingAuth ? (
                <ActivityIndicator size={25} color="#4F5476" />
              ) : (
                <Text style={styles.submitButtonText}>ACESSAR</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupPromptContainer}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.signupText}>
                Não tem uma conta? {"\n"}Cadastre-se
              </Text>
              <View style={styles.signupUnderline} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: "#B72F14", marginTop: 10 }]}
              onPress={() => {
                enterAsGuest();
                navigation.navigate("AssignTable");
              }}
            >
              <Text style={[styles.submitButtonText, { color: "#FFFFFF" }]}>ENTRAR COMO VISITANTE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.sacContainer}>
              <Image
                source={{
                  uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/J6j03k7Kyp/h62poljs_expires_30_days.png",
                }}
                resizeMode="stretch"
                style={styles.sacIcon}
              />
              <Text style={styles.sacText}>SAC</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#911F09" },
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
  contentWrapper: { alignItems: "center", paddingTop: 80, paddingBottom: 20 },
  titleContainer: { alignItems: "center", marginBottom: 30 },
  titleText: { color: "#4F5476", fontSize: 28, fontWeight: "bold" },
  titleUnderlineWrapper: { alignItems: "center" },
  titleUnderline: {
    width: 40,
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
  signupPromptContainer: { alignItems: "center", marginTop: 20 },
  signupText: {
    color: "#B3AAAA",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupUnderline: {
    width: 72,
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

export default SignIn;
