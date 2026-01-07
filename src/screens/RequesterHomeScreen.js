import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import GigListItem from '../components/GigListItem';
import AppButton from '../components/AppButton';
import { colors } from '../constants/colors';

const RequesterHomeScreen = ({ navigation }) => {
    const { gigs, currentUser } = useApp();

    const myGigs = gigs.filter(g => g.requesterId === currentUser?.id);

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {currentUser?.name}</Text>
                <AppButton title="+ Post New Gig" onPress={() => navigation.navigate('RequesterCreate')} />
            </View>

            <Text style={styles.sectionTitle}>My Posted Gigs</Text>

            <FlatList
                data={myGigs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <GigListItem
                        gig={item}
                        showStatus
                        onPress={() => navigation.navigate('RequesterManageGig', { gigId: item.id })}
                    />
                )}
                ListEmptyComponent={<Text style={styles.empty}>You haven't posted any gigs yet.</Text>}
            />
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
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: colors.text,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: colors.textSecondary,
    }
});

export default RequesterHomeScreen;
