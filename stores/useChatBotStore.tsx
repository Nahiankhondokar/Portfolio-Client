import { create } from 'zustand';
import { apiFetch } from '@/lib/api'; // Assuming your api helper

interface Conversation {
    id: number;
    guest_id: string;
    guest_name: string | null;
    last_message_at: string;
    created_at: string;
    updated_at: string;
    messages: Message[]
}

interface Message {
    id: number;
    conversation_id: number;
    sender: "guest" | "admin";
    body: string;
    created_at: string;
}

interface ChatState {
    conversations: Conversation[];
    messages: Message[];
    setMessages: (message: Message) => void;
    loading: boolean;
    error: boolean;
    selectedConversation: Conversation | null;
    unreadCounts: Record<number, number>;

    // Actions
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId: number) => Promise<void>;
    fetchMessagesByGuestId: (guestId: string) => Promise<void>;
    // ✅ FIX 1: Allow null in the interface
    selectConversation: (conv: Conversation | null) => void;
    sendReply: (conversationId: number, body: string) => Promise<void>;
    addMessage: (message: Message) => void;
    deleteConversation: (id: number) => Promise<void>;
    incrementUnreadCount: (conversationId: number) => void;
    clearUnreadCount: (conversationId: number) => void;
}

export const useChatBotStore = create<ChatState>((set, get) => ({
    conversations: [],
    messages: [],
    loading: false,
    error: false,
    selectedConversation: null,
    unreadCounts: {},
    setMessages: (message:Message) => {
        set((state) => ({
            messages: [message, ...state.messages]
        }));

        console.log(get().messages)
    },
    incrementUnreadCount: (conversationId: number) => {
        set((state) => ({
            unreadCounts: {
                ...state.unreadCounts,
                [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
            },
        }));
    },
    clearUnreadCount: (conversationId: number) => {
        set((state) => {
            const nextCounts = { ...state.unreadCounts };
            delete nextCounts[conversationId];
            return { unreadCounts: nextCounts };
        });
    },

    fetchConversations: async () => {
        set({ loading: true });
        try {
            const data = await apiFetch('chatbot/conversations') as Conversation[];
            set({ conversations: data });

            // Automatically select the first conversation if it exists
            if (data.length > 0) {
                get().selectConversation(data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            set({ loading: false });
        }
    },

    fetchMessages: async (conversationId: number) => {
        // No need to set global loading here if you want smooth transitions
        try {
            const data = await apiFetch(`chatbot/conversations/${conversationId}/messages`) as Message[];
            set({ messages: data });
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    },

    fetchMessagesByGuestId: async (guestId: string) => {
        // No need to set global loading here if you want smooth transitions
        try {
            const data = await apiFetch(`v1/public/chatbot/conversations/${guestId}/messages`) as Message[];
            set({ messages: data });
            console.log(get().messages)
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    },

    sendReply: async (conversationId, body: string) => {
        try {
            const newMessage = await apiFetch(`chatbot/conversations/${conversationId}/reply`, {
                method: 'POST',
                body: JSON.stringify({body})
            }) as Message;

            await get().fetchConversations();
            // console.log('old-msg-',get().messages);
            // console.log('new-msg-',newMessage);

            // Append the new admin message to the thread
            // set((state) => ({ messages: [...state.messages, newMessage] }));
        } catch (error) {
            console.error("Reply failed", error);
        }
    },

    addMessage: (message) =>
        set((state) => {
            const exists = state.messages.some(m => m.id === message.id);

            if (exists) return state;

            return {
                messages: [...state.messages, message]
            };
        }),
    selectConversation: async (conv) => {
        // ✅ FIX 2: Guard Clause
        // If we pass null (e.g., after a delete), reset state and STOP.
        if (!conv) {
            set({ selectedConversation: null, messages: [] });
            return;
        }

        set({ selectedConversation: conv });
        // Clear unread count when selected
        get().clearUnreadCount(conv.id);

        // Only fetch if we actually have a conversation object
        await get().fetchMessages(conv.id);
    },

    deleteConversation: async (id: number) => {
        set({ loading: true, error: false });

        try {
            await apiFetch(`chatbot/conversations/${id}`, {
                method: "DELETE",
            });

            // ✅ FIX 3: Automatic Cleanup
            // Check if the conversation being deleted is the one currently viewed
            const currentSelected = get().selectedConversation;

            set((state) => ({
                conversations: state.conversations.filter((c) => c.id !== id),
                loading: false,
                // If the IDs match, reset selectedConversation and messages instantly
                ...(currentSelected?.id === id ? { selectedConversation: null, messages: [] } : {})
            }));

        } catch (err: unknown) {
            set({ loading: false, error: true });
            throw err;
        }
    },
}));