import React, { useContext, useState } from "react";
import { 
    View, 
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthContext } from "../../contexts/AuthContext";

type RootStackParamList = {
    SignIn: undefined;
    ChooseTable: undefined;
    Dashboard: undefined;
    SignUp: undefined;
};

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignIn({ navigation }: SignInScreenProps){
    const { signIn, loadingAuth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(){
        if(email === '' || password === ''){
            return;
        }

        try {
            await signIn({ email, password });
        } catch (err) {
            console.log('Erro ao logar:', err);
        }
    }

    return(
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../../assets/logo.png')}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Digite o seu email"
                    style={styles.input}
                    placeholderTextColor="#F0F0F0"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    placeholder="Sua senha"
                    style={styles.input}
                    placeholderTextColor="#F0F0F0"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    {loadingAuth ? (
                        <ActivityIndicator size={25} color="#FFF"/>
                    ) : (
                        <Text style={styles.buttonText}>Acessar</Text>
                    )}
                </TouchableOpacity>

                {/* BOTÃO IR PARA CADASTRO */}
                <TouchableOpacity
                    style={styles.buttonRegister}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={styles.registerText}>Não tem uma conta? Cadastre-se já!</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#911F09'
    },
    logo:{
        marginBottom:18
    },
    inputContainer:{
        width: '95%',
        alignItems:'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 14
    },
    input:{
        width: '95%',
        height: 40,
        backgroundColor: '#B72F14',
        marginBottom: 12,
        borderRadius: 10,
        paddingHorizontal: 8,
        color: '#fff' 
    },
    button:{
        width:'95%',
        height: 40,
        backgroundColor: '#F2CA85', 
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 'bold',
        color:'#4F5476'
    },
    
    buttonRegister: {
        marginTop: 10,
    },
    registerText: {
        color: '#B3AAAA', 
        fontWeight: 'bold',
    }
});