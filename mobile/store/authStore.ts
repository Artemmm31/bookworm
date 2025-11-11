import { API_URL } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand';

type AuthState = {
  user: any;               
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  register: (username: string, email: string, password: string) => Promise<{success: boolean, error?: string}>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    register: async (username, email, password) => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if(!res.ok) throw new Error(data.message || 'Something went wrong');

            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({token: data.token, user: data.user, isLoading: false});

            return  { success: true }
        } catch (error) {
            set({isLoading: false});
            if (error instanceof Error) {
                return { success: false, error: error.message };
            }

            return { success: false, error: 'Unknown error' };
        }
    },

    checkAuth: async () => {
        try {
        const token = await AsyncStorage.getItem("token");
        const userJson = await AsyncStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : null;
        set({ token, user });

        } catch (error) {
            console.log("Error", error);    
        } finally {
            set({isCheckingAuth: false});
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        set({ token: null, user: null});
    },
    login: async (email, password) => {
        set({isLoading: true});

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();
            if(!res.ok) throw new Error(data.message || 'Something went wrong');

            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            await AsyncStorage.setItem('token', data.token);

            set({token: data.token, user: data.user, isLoading: false});

            return  { success: true }

        } catch (error) {
            set({isLoading: false});
            if (error instanceof Error) {
                return { success: false, error: error.message };
            }

            return { success: false, error: 'Unknown error' };
        }
    }

}));