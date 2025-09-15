import React, { FC, useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert
} from "react-native";
import api from '../../services/api';

const SignUp: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignIn() {
        if (email === '' || password === '') {
            Alert.alert("Atenção", "Preencha todos os campos!");
            return;
        }

        try {
            const response = await api.post('/session', {
                email: email,
                password: password
            });
            
            console.log("Login bem-sucedido!", response.data);
            
        } catch (err) {
            console.log("Erro ao fazer login:", err);
            Alert.alert("Erro", "E-mail ou senha incorretos.");
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Login</Text>
                        <View style={styles.titleUnderline} />
                    </View>

                    {/* Inputs Funcionais */}
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail ou Telefone"
                        placeholderTextColor="#FFF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#FFF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry 
                    />

                    {/* Botão Funcional */}
                    <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                        <Text style={styles.buttonText}>ACESSAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.registerText}>
                            Não tem uma conta?{"\n"}Cadastre-se
                        </Text>
                        <View style={styles.registerUnderline} />
                    </TouchableOpacity>
                    
                    <View style={styles.footer}>
                        <Image
                            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/6ih3zy1i_expires_30_days.png" }}
                            resizeMode={"stretch"}
                            style={styles.footerIcon}
                        />
                        <Text style={styles.footerText}>SAC</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: "#911F09",
        padding: 6,
    },
    card: {
        backgroundColor: "#D9D9D9",
        borderRadius: 44,
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        color: "#4F5476",
        fontSize: 28,
        fontWeight: "bold",
    },
    titleUnderline: {
        width: 60,
        height: 2,
        backgroundColor: "#4F5476",
        borderRadius: 10,
        marginTop: 4,
    },
    input: {
        width: '100%',
        backgroundColor: "#B72F14",
        color: '#FFF',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        backgroundColor: "#F2CA85",
        borderRadius: 20,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "#4F5476",
        fontSize: 14,
        fontWeight: "bold",
    },
    registerText: {
        color: "#B3AAAA",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    registerUnderline: {
        width: 72,
        height: 1,
        backgroundColor: "#B3AAAA",
        alignSelf: 'center',
        marginTop: 2,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 80,
    },
    footerIcon: {
        width: 18,
        height: 27,
        marginRight: 5,
    },
    footerText: {
        color: "#000000",
        fontSize: 12,
        fontWeight: "bold",
    }
});

export default SignUp;