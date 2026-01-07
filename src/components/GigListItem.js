import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '../constants/colors';

const GigListItem = ({ gig, onPress, showStatus = false }) => {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{gig.title}</Text>
                <Text style={styles.pay}>${gig.pay}</Text>
            </View>
            <Text style={styles.details}>{gig.location} • {gig.date}</Text>
            {showStatus && (
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Status: {gig.status}</Text>
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 16,
    },
    pressed: {
        backgroundColor: colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    pay: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.success,
    },
    details: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    statusBadge: {
        marginTop: 8,
        alignSelf: 'flex-start',
        backgroundColor: colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: colors.textSecondary,
    }
});

export default GigListItem;
