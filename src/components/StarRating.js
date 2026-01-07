import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';

const StarRating = ({ rating = 0, maxStars = 5, size = 24, onRate = null, showLabel = false }) => {
    const stars = [];

    const handlePress = (starIndex) => {
        if (onRate) {
            onRate(starIndex + 1);
        }
    };

    for (let i = 0; i < maxStars; i++) {
        const isFilled = i < rating;

        stars.push(
            <TouchableOpacity
                key={i}
                onPress={() => handlePress(i)}
                disabled={!onRate}
                activeOpacity={onRate ? 0.6 : 1}
                style={styles.starContainer}
            >
                <Text style={[
                    styles.star,
                    { fontSize: size },
                    isFilled ? styles.filledStar : styles.emptyStar
                ]}>
                    ★
                </Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.starsRow}>
                {stars}
            </View>
            {showLabel && rating > 0 && (
                <Text style={styles.ratingLabel}>{rating} / {maxStars}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starsRow: {
        flexDirection: 'row',
    },
    starContainer: {
        marginHorizontal: 2,
    },
    star: {
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    filledStar: {
        color: '#fbbf24', // Golden yellow
    },
    emptyStar: {
        color: '#d1d5db', // Light gray
    },
    ratingLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.textSecondary,
        fontWeight: '500',
    },
});

export default StarRating;
