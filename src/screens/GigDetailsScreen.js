import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import AppButton from '../components/AppButton';
import StarRating from '../components/StarRating';
import { colors } from '../constants/colors';

const GigDetailsScreen = ({ route, navigation }) => {
    const { gigId } = route.params;
    const { gigs, applyToGig, myApplications, currentUser, ratings, getWorkerRating } = useApp();

    const gig = gigs.find(g => g.id === gigId);
    const myApps = myApplications();
    const existingApp = myApps.find(a => a.gigId === gigId);

    // Check if I am hired
    const isHired = existingApp && existingApp.status === 'accepted';

    // Check if this gig is completed and has a rating for the worker
    const gigRating = ratings.find(r => r.gigId === gigId && r.workerId === currentUser?.id);
    const myRatingInfo = getWorkerRating(currentUser?.id);

    const handleApply = () => {
        applyToGig(gigId);
        Alert.alert('Applied!', 'Application sent to the provider.');
        navigation.goBack();
    };

    if (!gig) return null;

    return (
        <ScreenWrapper>
            <ScrollView>
                <Text style={styles.title}>{gig.title}</Text>
                <Text style={styles.pay}>${gig.pay}</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.value}>{gig.location}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{gig.date}</Text>
                </View>

                {gig.phoneNumber && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Provider Contact</Text>
                        <Text style={styles.valuePhone}>{gig.phoneNumber}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.description}>{gig.description}</Text>
                </View>

                {isHired && (
                    <AppButton
                        title="Chat with Provider"
                        variant="secondary"
                        onPress={() => navigation.navigate('Chat', { gigId: gig.id })}
                        style={{ marginBottom: 10 }}
                    />
                )}

                {existingApp ? (
                    <View style={styles.statusBox}>
                        <Text style={styles.statusText}>Application Status: {existingApp.status.toUpperCase()}</Text>

                        {/* Show rating if gig is completed and worker was rated */}
                        {gig.status === 'completed' && gigRating && (
                            <View style={styles.ratingSection}>
                                <Text style={styles.ratingLabel}>You received a rating:</Text>
                                <StarRating rating={gigRating.rating} size={28} />
                                <Text style={styles.ratingValue}>{gigRating.rating} / 5 stars</Text>
                            </View>
                        )}

                        {/* Show overall rating stats */}
                        {myRatingInfo.count > 0 && (
                            <View style={styles.overallRating}>
                                <Text style={styles.overallLabel}>Your overall rating:</Text>
                                <View style={styles.overallRow}>
                                    <StarRating rating={Math.round(myRatingInfo.average)} size={20} />
                                    <Text style={styles.overallText}>
                                        {myRatingInfo.average} ({myRatingInfo.count} reviews)
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                ) : (
                    currentUser?.role === 'worker' && (
                        <AppButton title="Apply Now" onPress={handleApply} />
                    )
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 10,
    },
    pay: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.success,
        marginVertical: 10,
    },
    section: {
        marginVertical: 12,
    },
    label: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    valuePhone: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    statusBox: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    statusText: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    ratingSection: {
        marginTop: 16,
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        width: '100%',
    },
    ratingLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    ratingValue: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.success,
    },
    overallRating: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        width: '100%',
        alignItems: 'center',
    },
    overallLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    overallRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    overallText: {
        marginLeft: 8,
        fontSize: 14,
        color: colors.text,
    }
});

export default GigDetailsScreen;
