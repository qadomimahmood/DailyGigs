import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, style, multiline, numberOfLines }) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, multiline && styles.multiline]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 6,
        color: colors.textSecondary,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
        backgroundColor: '#fff',
    },
    multiline: {
        minHeight: 100,
    },
});

export default Input;
