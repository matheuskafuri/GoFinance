import React from 'react';

import { View, Text, Button, TextInput } from 'react-native';

export function Profile() {
  return (
    <View>
      <Text testID="text-title">
        Perfil
      </Text>

      <TextInput 
        testID="input-name"
        placeholder="Nome"
        autoCorrect={false}
        value="Matheus"
      />

      <TextInput 
        testID="input-surname"
        placeholder="Sobrenome"
        autoCorrect={false}
        value="Kafuri"
      />

      <Button 
        title="Salvar" 
        onPress={() => {}}
      />

    </View>
  );
}