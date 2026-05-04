export const getGuestId = () => {
    if (typeof window === 'undefined') return null;
    
    let guestId = localStorage.getItem('guest_id');
    if (!guestId) {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            guestId = crypto.randomUUID();
        } else {
            guestId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }
        localStorage.setItem('guest_id', guestId);
    }
    return guestId;
};
