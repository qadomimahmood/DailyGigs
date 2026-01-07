import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import AppButton from '../components/AppButton';
import StarRating from '../components/StarRating';
import { colors } from '../constants/colors';

const RequesterManageGigScreen = ({ route, navigation }) => {
    const { gigId } = route.params;
    const { assignWorker, getGigApplications, gigs, completeGig, rateWorker, getWorkerRating, isGigRated, ratings } = useApp();
    const [selectedRating, setSelectedRating] = useState(0);

    // Get the existing rating for this gig if it exists
    const existingGigRating = ratings.find(r => r.gigId === gigId);

    const gig = gigs.find(g => g.id === gigId);

    // Safety check if gig is not found (e.g. deleted async)
    if (!gig) {
        navigation.goBack();
        return null;
    }

    const applications = getGigApplications(gigId);

    // Find the assigned worker name if exists
    const assignedApp = applications.find(a => a.status === 'accepted');

    const handleAssign = (workerId) => {
        // Immediate execution for Web compatibility (Alert with custom buttons is flaky on RN Web)
        assignWorker(gigId, workerId);
        navigation.goBack();
    };

    const handleComplete = () => {
        // Use window.confirm for web compatibility (Alert with buttons is flaky on RN Web)
        const confirmed = window.confirm('Mark this job as finished?');
        if (confirmed) {
            completeGig(gigId);
            // Don't navigate back - stay on page to show rating UI
        }
    }

    const renderCandidate = ({ item }) => {
        const workerRating = getWorkerRating(item.workerId);

        return (
            <View style={styles.card}>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.workerName}</Text>
                    {workerRating.count > 0 && (
                        <View style={styles.workerRatingRow}>
                            <StarRating rating={Math.round(workerRating.average)} size={16} />
                            <Text style={styles.ratingCount}>({workerRating.count})</Text>
                        </View>
                    )}
                    <Text style={styles.status}>Status: {item.status}</Text>
                </View>
                {gig.status === 'open' && item.status === 'pending' && (
                    <AppButton
                        title="Accept"
                        onPress={() => handleAssign(item.workerId)}
                        style={styles.selectBtn}
                    />
                )}
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <Text style={styles.title}>Manage: {gig.title}</Text>
            <Text style={styles.statusHeader}>Current Status: <Text style={{ color: colors.primary }}>{gig.status.toUpperCase()}</Text></Text>

            {gig.status === 'assigned' && assignedApp && (
                <View style={styles.assignedBox}>
                    <Text style={styles.assignedText}>Assigned to: {assignedApp.workerName}</Text>
                    <Text style={styles.contactText}>Tel: {assignedApp.phoneNumber || 'N/A'}</Text>

                    <AppButton
                        title="Chat with Worker"
                        variant="secondary"
                        onPress={() => navigation.navigate('Chat', { gigId: gig.id })}
                        style={{ marginTop: 10, borderColor: colors.primary }}
                    />

                    <AppButton title="Mark Job Completed" onPress={handleComplete} style={{ marginTop: 10 }} />
                </View>
            )}

            {gig.status === 'open' ? (
                <>
                    <Text style={styles.subtitle}>Applicants</Text>
                    <FlatList
                        data={applications}
                        keyExtractor={item => item.workerId}
                        renderItem={renderCandidate}
                        ListEmptyComponent={<Text style={styles.empty}>No applications yet.</Text>}
                    />
                </>
            ) : gig.status === 'completed' ? (
                <View style={styles.completedBox}>
                    <Text style={styles.completedText}>This job is completed.</Text>

                    {assignedApp && (
                        <View style={styles.ratingSection}>
                            <Text style={styles.ratingLabel}>
                                {isGigRated(gigId) ? 'Your Rating:' : 'Rate this worker:'}
                            </Text>

                            {isGigRated(gigId) ? (
                                <StarRating
                                    rating={existingGigRating?.rating || 5}
                                    size={32}
                                />
                            ) : (
                                <>
                                    <StarRating
                                        rating={selectedRating}
                                        size={32}
                                        onRate={setSelectedRating}
                                    />
                                    {selectedRating > 0 && (
                                        <AppButton
                                            title="Submit Rating"
                                            onPress={() => {
                                                rateWorker(gigId, assignedApp.workerId, selectedRating);
                                                Alert.alert('Thank you!', 'Your rating has been submitted.');
                                            }}
                                            style={styles.submitRatingBtn}
                                        />
                                    )}
                                </>
                            )}
                        </View>
                    )}
                </View>
            ) : null}

        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
    },
    statusHeader: {
        fontSize: 16,
        marginBottom: 20,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    status: {
        fontSize: 12,
        marginTop: 4,
        color: colors.primary,
    },
    selectBtn: {
        height: 40,
        width: 80,
        marginVertical: 0,
        marginLeft: 10,
    },
    assignedBox: {
        padding: 20,
        backgroundColor: '#eff6ff',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    assignedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    contactText: {
        marginTop: 4,
        color: colors.textSecondary,
    },
    completedBox: {
        padding: 20,
        backgroundColor: '#f0fdf4',
        borderRadius: 10,
        alignItems: 'center',
    },
    completedText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.success,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: colors.textSecondary,
    },
    ratingSection: {
        marginTop: 16,
        alignItems: 'center',
    },
    ratingLabel: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
    },
    submitRatingBtn: {
        marginTop: 12,
        paddingHorizontal: 24,
    },
    workerRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingCount: {
        marginLeft: 4,
        fontSize: 12,
        color: colors.textSecondary,
    }
});

export default RequesterManageGigScreen;
