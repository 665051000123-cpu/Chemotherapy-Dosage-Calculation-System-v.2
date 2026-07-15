// Utility for managing offline print history in localStorage
const STORAGE_KEY = 'oncology_offline_print_history';
const MAX_HISTORY_ITEMS = 20;

export const getOfflinePrintHistory = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data);
    } catch (err) {
        console.error('Failed to parse offline print history', err);
        return [];
    }
};

export const addOfflinePrintHistory = (printJob) => {
    try {
        const history = getOfflinePrintHistory();
        const newJob = {
            id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: new Date().toISOString(),
            ...printJob
        };
        // Add to beginning and limit to MAX_HISTORY_ITEMS
        const updatedHistory = [newJob, ...history].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
    } catch (err) {
        console.error('Failed to add offline print history', err);
        return getOfflinePrintHistory();
    }
};

export const clearOfflinePrintHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};
