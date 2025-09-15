import React, { FC, useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image
} from "react-native";

const SignUp: FC = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');

    const handleSignUp = async () => {
        if (!nome || !email || !telefone || !senha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await api.post('/users', {
                name: nome,
                email: email,
                password: senha
            });
            
            console.log('Dados para enviar:', { nome, email, telefone, senha });
            Alert.alert('Sucesso!', 'Cadastro realizado!');

        } catch (error) {
            console.log('Erro ao cadastrar:', error);
            Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
        }
    };

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
                        <Text style={styles.buttonText}>ACESSAR</Text>
                    </TouchableOpacity>

                    <Text style={styles.loginText}>Já tem uma conta? Entre</Text>

                    <View style={styles.footer}>
                        {<Image source={require("../SignIn/SAC.png")} style={styles.footerIcon} />}
                        <Text style={styles.footerText}>SAC</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

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

export default SignUp;