import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Make sure this matches server port

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [gigs, setGigs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    // Initialize Socket
    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Listen for incoming messages
        newSocket.on('receive_message', (data) => {
            console.log("Socket received:", data);
            setMessages(prev => {
                // Prevent duplicates (important since sender adds optimistically)
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        return () => newSocket.close();
    }, []);

    // Load from Storage on Mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedUsers = await AsyncStorage.getItem('users');
                const storedGigs = await AsyncStorage.getItem('gigs');
                const storedApps = await AsyncStorage.getItem('applications');
                const storedMsgs = await AsyncStorage.getItem('messages');
                const storedRatings = await AsyncStorage.getItem('ratings');

                if (storedUsers) setUsers(JSON.parse(storedUsers));
                if (storedGigs) setGigs(JSON.parse(storedGigs));
                if (storedApps) setApplications(JSON.parse(storedApps));
                if (storedMsgs) setMessages(JSON.parse(storedMsgs));
                if (storedRatings) setRatings(JSON.parse(storedRatings));

            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Save to Storage Effect
    useEffect(() => {
        if (!loading) {
            AsyncStorage.setItem('users', JSON.stringify(users));
            AsyncStorage.setItem('gigs', JSON.stringify(gigs));
            AsyncStorage.setItem('applications', JSON.stringify(applications));
            AsyncStorage.setItem('messages', JSON.stringify(messages));
            AsyncStorage.setItem('ratings', JSON.stringify(ratings));
        }
    }, [users, gigs, applications, messages, ratings, loading]);


    const login = (role, extraData = {}) => {
        const existingUser = users.find(u => u.name === extraData.name && u.role === role);
        if (existingUser) {
            setCurrentUser(existingUser);
            return true;
        }

        const user = {
            id: `user-${Date.now()}`,
            role,
            name: extraData.name || 'New User',
            nationalId: extraData.nationalId || null,
            isVerified: !!extraData.nationalId,
            idImage: extraData.idImage || null,
        };

        setUsers((prev) => [...prev, user]);
        setCurrentUser(user);
        return true;
    };

    const logout = () => setCurrentUser(null);

    const postGig = (gigData) => {
        const newGig = {
            ...gigData,
            id: `g-${Date.now()}`,
            requesterId: currentUser?.id,
            status: 'open',
            assignedTo: null,
        };
        setGigs((prev) => [newGig, ...prev]);
    };

    const applyToGig = (gigId) => {
        if (!currentUser || currentUser.role !== 'worker') return;
        const exists = applications.find(app => app.gigId === gigId && app.workerId === currentUser.id);
        if (exists) return;

        setApplications((prev) => [...prev, { gigId, workerId: currentUser.id, status: 'pending' }]);
    };

    const assignWorker = (gigId, workerId) => {
        setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'assigned', assignedTo: workerId } : g));
        setApplications(prev => prev.map(app => {
            if (app.gigId !== gigId) return app;
            return { ...app, status: app.workerId === workerId ? 'accepted' : 'rejected' };
        }));
    };

    const completeGig = (gigId) => {
        setGigs(prev => prev.map(g => g.id === gigId ? { ...g, status: 'completed' } : g));
    };

    const sendMessage = (gigId, text) => {
        if (!currentUser) return;
        const newMessage = {
            id: `msg-${Date.now()}`,
            gigId,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toISOString()
        };

        // Optimistically add to local state immediately so sender sees it
        setMessages(prev => [...prev, newMessage]);

        // Emit to server for others
        if (socket) {
            socket.emit('join_gig', gigId);
            socket.emit('send_message', newMessage);
        }
    };

    const getGigApplications = (gigId) => {
        return applications.filter(app => app.gigId === gigId).map(app => {
            const worker = users.find(u => u.id === app.workerId);
            return {
                ...app,
                workerName: worker?.name || 'Unknown Worker',
                workerId: app.workerId,
                nationalId: worker?.nationalId,
                status: app.status
            };
        });
    };

    const myApplications = () => {
        if (!currentUser) return [];
        return applications.filter(app => app.workerId === currentUser.id);
    }

    // Rate a worker for a completed gig
    const rateWorker = (gigId, workerId, rating) => {
        if (!currentUser || rating < 1 || rating > 5) return;

        // Check if already rated this gig
        const existingRating = ratings.find(r => r.gigId === gigId);
        if (existingRating) return;

        const newRating = {
            id: `rating-${Date.now()}`,
            gigId,
            workerId,
            raterId: currentUser.id,
            rating,
            timestamp: new Date().toISOString()
        };
        setRatings(prev => [...prev, newRating]);
    };

    // Get average rating for a worker
    const getWorkerRating = (workerId) => {
        const workerRatings = ratings.filter(r => r.workerId === workerId);
        if (workerRatings.length === 0) return { average: 0, count: 0 };

        const total = workerRatings.reduce((sum, r) => sum + r.rating, 0);
        return {
            average: Math.round((total / workerRatings.length) * 10) / 10,
            count: workerRatings.length
        };
    };

    // Check if a gig has been rated
    const isGigRated = (gigId) => {
        return ratings.some(r => r.gigId === gigId);
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            users,
            gigs,
            applications,
            messages,
            ratings,
            loading,
            login,
            logout,
            postGig,
            applyToGig,
            assignWorker,
            completeGig,
            sendMessage,
            getGigApplications,
            myApplications,
            rateWorker,
            getWorkerRating,
            isGigRated
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
