import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import AppButton from '../components/AppButton';
import Input from '../components/Input';

const RequesterCreateScreen = ({ navigation }) => {
    const { postGig } = useApp();

    const [title, setTitle] = useState('');
    const [pay, setPay] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!title || !pay || !location || !date || !phone) {
            Alert.alert('Error', 'Please fill all required fields (including Phone)');
            return;
        }

        postGig({
            title,
            pay,
            location,
            date,
            phoneNumber: phone,
            description
        });

        Alert.alert('Success', 'Gig posted successfully!');
        navigation.goBack();
    };

    return (
        <ScreenWrapper>
            <ScrollView>
                <Input label="Job Title" placeholder="e.g. Move Helper" value={title} onChangeText={setTitle} />
                <Input label="Payment Amount" placeholder="50" keyboardType="numeric" value={pay} onChangeText={setPay} />
                <Input label="Location" placeholder="Downtown / Remote" value={location} onChangeText={setLocation} />
                <Input label="Date" placeholder="YYYY-MM-DD" value={date} onChangeText={setDate} />
                <Input label="Phone Number" placeholder="+1 234 567 8900" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

                <Input
                    label="Description"
                    placeholder="Describe the task..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />

                <AppButton title="Post Gig" onPress={handleSubmit} />
                <AppButton title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
            </ScrollView>
        </ScreenWrapper>
    );
};

export default RequesterCreateScreen;
