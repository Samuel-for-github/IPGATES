import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from './Input.jsx';
import { hp, wp } from '../helper/common.js';
import { theme } from '../constants/theme.js';

const FormInput = ({ label, value, onChangeText, keyboardType, error }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Input
        color="black"
        fontSize={hp(3)}
        value={value}
        onChangeText={onChangeText}
        containerStyles={styles.input}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp(2),
    color: theme.colors.textDark,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: theme.radius.sm,
    width: wp(90),
  },
  error: {
    color: 'red',
    fontSize: hp(1.8),
    marginTop: 2,
  },
});

export default FormInput;
