import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type ProfileProps = {
  route: {
    params?: {
      name?: string;
      email?: string;
    };
  };
};

export default function Profile({ route }: ProfileProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const { name = "Usuário", email = "usuario@email.com" } =
    route?.params || {};

  function handleClose() {
    navigation.navigate("ChooseTable");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#911F09" }}>
        <View style={{ marginTop: 56, marginBottom: 21, marginHorizontal: 6 }}>
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 52,
              paddingTop: 60,
              paddingBottom: 18,
            }}
          >
            {/* botão de fechar */}
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                marginBottom: 24,
                marginLeft: 24,
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                }}
                resizeMode={"cover"}
                style={{
                  width: 90,
                  height: 90,
                  marginRight: 20,
                  borderRadius: 45,
                }}
              />
              <View>
                <Text
                  style={{
                    color: "#4F5476",
                    fontSize: 22,
                    fontWeight: "bold",
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    color: "#4F5476",
                    fontSize: 16,
                    marginTop: 6,
                  }}
                >
                  {email}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 65, marginLeft: 33 }}>
              <Text
                style={{
                  color: "#4F5476",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 23,
                }}
              >
                Editar dados:
              </Text>

              <Text
                style={{
                  color: "#4F5476",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginLeft: 4,
                }}
              >
                Senha
              </Text>

              <View style={{ alignItems: "flex-end", marginTop: 8 }}>
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 12,
                    marginRight: 7,
                  }}
                >
                  Esqueci minha senha
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#F2CA85",
                  borderRadius: 10,
                  paddingVertical: 16,
                  paddingHorizontal: 32,
                  marginRight: 41,
                }}
                onPress={() => alert("Alterações salvas!")}
              >
                <Text
                  style={{
                    color: "#4F5476",
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Salvar alterações
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF3F4B",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});