import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../constants/colors';

const AppButton = ({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) => {
    const isPrimary = variant === 'primary';

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                isPrimary ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                pressed && styles.pressed,
                style
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
            ) : (
                <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        borderWidth: 1,
    },
    primary: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderColor: colors.border,
    },
    disabled: {
        opacity: 0.6,
    },
    pressed: {
        opacity: 0.8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    textPrimary: {
        color: '#ffffff',
    },
    textSecondary: {
        color: colors.text,
    },
});

export default AppButton;
