import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import ScreenWrapper from '../components/ScreenWrapper';
import { colors } from '../constants/colors';

const ChatScreen = ({ route, navigation }) => {
    const { gigId } = route.params;
    const { messages, sendMessage, currentUser, socket } = useApp();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    // Filter messages for this gig
    const gigMessages = messages.filter(m => m.gigId === gigId);

    const handleSend = () => {
        if (!inputText.trim()) return;
        sendMessage(gigId, inputText);
        setInputText('');
    };

    // Join room on mount
    useEffect(() => {
        if (socket) {
            socket.emit('join_gig', gigId);
        }
    }, [socket, gigId]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (gigMessages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [gigMessages.length]);

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === currentUser.id;
        return (
            <View style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.theirBubbleWrapper]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.theirTimeText]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Simulated Chat</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={gigMessages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.listContent}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={10}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        multiline
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backBtn: {
        paddingRight: 10,
    },
    backText: {
        fontSize: 16,
        color: colors.primary,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginRight: 20, // Balance back btn
    },
    listContent: {
        paddingBottom: 20,
    },
    bubbleWrapper: {
        marginVertical: 4,
        flexDirection: 'row',
    },
    myBubbleWrapper: {
        justifyContent: 'flex-end',
    },
    theirBubbleWrapper: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    theirBubble: {
        backgroundColor: '#f3f4f6',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: '#000',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255,255,255,0.7)',
    },
    theirTimeText: {
        color: '#666',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        minHeight: 40,
        backgroundColor: '#f9fafb',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    sendBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: colors.primary,
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});

export default ChatScreen;
