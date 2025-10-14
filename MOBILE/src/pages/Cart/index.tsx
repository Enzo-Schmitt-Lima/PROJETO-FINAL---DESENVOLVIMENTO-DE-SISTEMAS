// Carrinho.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type Produto = {
  id: string;
  nome: string;
  preco: string;
  imagem: string;
};

type FavoritosState = Record<string, boolean>;
type AvaliacoesState = Record<string, number>;

export default function Carrinho(props: { navigation?: any }) {
  // fallback para quando navigation não vier por props
  const navigation = props.navigation ?? useNavigation<NavigationProp<any>>();

  const produtos: Produto[] = [
    {
      id: "calabresa",
      nome: "PIZZA DE CALABRESA",
      preco: "R$ 50,00",
      imagem:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/ieqapf32_expires_30_days.png",
    },
    {
      id: "chocolate",
      nome: "PIZZA DE CHOCOLATE",
      preco: "R$ 65,00",
      imagem:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/mx5rctos_expires_30_days.png",
    },
    {
      id: "coca",
      nome: "COCA-COLA 1L",
      preco: "R$ 7,00",
      imagem:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/zsm1ls3q_expires_30_days.png",
    },
    {
      id: "sorvete",
      nome: "SORVETE DE FLOCOS",
      preco: "R$ 12,00",
      imagem:
        "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/qih7tr3j_expires_30_days.png",
    },
  ];

  // --- inicializa favoritos com tipo explícito (evita TS7053) ---
  const initFavoritos: FavoritosState = {};
  produtos.forEach((p) => {
    initFavoritos[p.id] = false;
  });
  const [favoritos, setFavoritos] = useState<FavoritosState>(initFavoritos);

  // --- inicializa avaliações com tipo explícito ---
  const initAvaliacoes: AvaliacoesState = {};
  produtos.forEach((p) => {
    initAvaliacoes[p.id] = 0;
  });
  const [avaliacoes, setAvaliacoes] = useState<AvaliacoesState>(initAvaliacoes);

  // toggle recebe id: string
  const toggleFavorito = (id: string) => {
    // prev está corretamente tipado como FavoritosState -> prev[id] é boolean
    setFavoritos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // avaliar recebe id e número de estrelas
  const avaliarProduto = (id: string, estrelas: number) => {
    setAvaliacoes((prev) => ({ ...prev, [id]: estrelas }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView style={{ flex: 1, backgroundColor: "#911F09" }}>
        <View
          style={{
            backgroundColor: "#D9D9D9",
            borderRadius: 44,
            paddingTop: 24,
            paddingBottom: 12,
            marginTop: 57,
            marginBottom: 22,
            marginHorizontal: 6,
          }}
        >
          <Image
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/rhfn0706_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={{
              width: 30,
              height: 30,
              marginBottom: 6,
              marginLeft: 22,
            }}
          />

          <ImageBackground
            source={{
              uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/v16ig8vt_expires_30_days.png",
            }}
            resizeMode="stretch"
            style={{
              alignSelf: "center",
              paddingVertical: 18,
              paddingHorizontal: 80,
              marginBottom: 24,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "bold" }}>
              CARRINHO
            </Text>
          </ImageBackground>

          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginHorizontal: 12 }}>
            {produtos.map((produto) => {
              const isFavorito = !!favoritos[produto.id];
              const nota = avaliacoes[produto.id] ?? 0;
              return (
                <View
                  key={produto.id}
                  style={{
                    width: "45%",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                    paddingVertical: 10,
                    marginBottom: 15,
                    marginHorizontal: 6,
                  }}
                >
                  <TouchableOpacity onPress={() => toggleFavorito(produto.id)} style={{ alignItems: "flex-end", marginBottom: 7, paddingRight: 12 }}>
                    <Image
                      source={{
                        uri: isFavorito
                          ? "https://cdn-icons-png.flaticon.com/512/833/833472.png"
                          : "https://cdn-icons-png.flaticon.com/512/1077/1077035.png",
                      }}
                      style={{ width: 25, height: 27 }}
                    />
                  </TouchableOpacity>

                  <Image source={{ uri: produto.imagem }} resizeMode="stretch" style={{ height: 120, alignSelf: "center", marginBottom: 12 }} />

                  <Text style={{ color: "#4F5476", fontSize: 12, fontWeight: "bold", marginBottom: 6, textAlign: "center" }}>{produto.nome}</Text>
                  <Text style={{ color: "#4F5476", fontSize: 12, marginBottom: 6, textAlign: "center" }}>{produto.preco}</Text>

                  <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <TouchableOpacity key={estrela} onPress={() => avaliarProduto(produto.id, estrela)}>
                        <Image
                          source={{
                            uri: nota >= estrela
                              ? "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                              : "https://cdn-icons-png.flaticon.com/512/1828/1828970.png",
                          }}
                          style={{ width: 22, height: 22 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Order")} style={{ backgroundColor: "#F7C873", borderRadius: 40, paddingVertical: 12, paddingHorizontal: 22 }}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>VOLTAR AO PEDIDO</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Pagamento")} style={{ backgroundColor: "#F7C873", borderRadius: 40, paddingVertical: 12, paddingHorizontal: 22 }}>
              <Text style={{ color: "#000", fontWeight: "bold" }}>REVISAR O PAGAMENTO</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ textAlign: "right", marginTop: 12, marginRight: 25, color: "#000000", fontSize: 10 }}>SAC</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
