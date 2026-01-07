import React from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import GigListItem from '../components/GigListItem';
import { colors } from '../constants/colors';

const WorkerHomeScreen = ({ navigation }) => {
    const { gigs, currentUser, myApplications } = useApp();

    const myApps = myApplications();
    const myAppGigIds = myApps.map(a => a.gigId);

    // Gigs I applied to (any status)
    const myJobs = gigs.filter(g => myAppGigIds.includes(g.id));

    // Open gigs I haven't applied to
    const availableGigs = gigs.filter(g => g.status === 'open' && !myAppGigIds.includes(g.id));

    const renderGig = ({ item }) => (
        <GigListItem
            gig={item}
            onPress={() => navigation.navigate('GigDetails', { gigId: item.id })}
            showStatus={myAppGigIds.includes(item.id)} // Show status if it's my job
        />
    );

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.welcome}>Hello, {currentUser?.name}</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* My Jobs Section */}
                {myJobs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Jobs & Applications</Text>
                        {myJobs.map(item => (
                            <View key={item.id}>
                                {renderGig({ item })}
                            </View>
                        ))}
                    </View>
                )}

                {/* Available Gigs Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Gigs</Text>
                    {availableGigs.length > 0 ? (
                        availableGigs.map(item => (
                            <View key={item.id}>
                                {renderGig({ item })}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.empty}>No new gigs available.</Text>
                    )}
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        marginBottom: 20,
        marginTop: 10,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: colors.text,
    },
    empty: {
        marginTop: 10,
        color: colors.textSecondary,
        fontStyle: 'italic',
    }
});

export default WorkerHomeScreen;
