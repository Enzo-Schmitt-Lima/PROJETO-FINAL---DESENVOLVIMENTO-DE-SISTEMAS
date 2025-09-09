import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function RoleSelection({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você é:</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignUp", { role: "client" })}
      >
        <Text style={styles.buttonText}>Cliente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn", { role: "employee" })}
      >
        <Text style={styles.buttonText}>Garçom</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  button: { backgroundColor: "#f5a623", padding: 15, marginVertical: 10, borderRadius: 8 },
  buttonText: { color: "#fff", fontSize: 18 }
});
