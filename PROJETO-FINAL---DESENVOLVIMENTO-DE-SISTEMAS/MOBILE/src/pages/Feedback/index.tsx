import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParamsList } from '../../routes/app.routes';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const handleSend = () => {
  // Aqui você pode enviar o feedback para o backend se quiser
  navigation.navigate('CreateComanda');
  };
  const handleSkip = () => {
  navigation.navigate('CreateComanda');
  };

  return (
    <SafeAreaView style={styles.bgContainer}>
      <View style={styles.cardContainer}>
  <TouchableOpacity style={styles.topBack} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Avalie seu atendimento</Text>
        <View style={styles.starsRow}>
          {[1,2,3,4,5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, rating >= star ? styles.starSelected : styles.starUnselected]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Descreva sua experiência:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder=""
          value={comment}
          onChangeText={setComment}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={rating === 0 && comment.trim() === ''}>
            <Text style={styles.sendText}>Enviar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sacText}>SAC</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    backgroundColor: '#911F09',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A3A6B',
    marginBottom: 18,
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
    textDecorationLine: 'underline',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 6,
  },
  starUnselected: {
    color: '#BBB',
    opacity: 1,
  },
  starSelected: {
    color: '#FFD700',
    opacity: 1,
  },
  label: {
    fontSize: 17,
    color: '#101026',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  textArea: {
    width: '100%',
    backgroundColor: '#F8F6F6',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    color: '#101026',
    marginBottom: 18,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    marginBottom: 8,
  },
  skipButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  skipText: {
    color: '#101026',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#F2CA85',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  sendText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  sacText: {
    color: '#911F09',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  topBack: {
    position: 'absolute',
    top: 12,
    left: 12,
    padding: 8,
    backgroundColor: '#B72F14',
    borderRadius: 8,
    zIndex: 10,
  },
});
