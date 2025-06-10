// API configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXVDUMU_GwEs3lMgYoF-oIt8Xv0a86nEvCU72m1WQ/dev';

/**
 * Sends form data to Google Apps Script
 * @param {Object} formData - The form data to send
 * @param {Array} testResults - Optional test results array
 * @returns {Promise<Object>} - Response from the server
 */
export async function sendDataToServer(formData, testResults = null) {
    try {
        const data = {
            ...formData,
            testResults: testResults || null
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Gets form data from localStorage
 * @returns {Object} - Form data object
 */
export function getFormDataFromStorage() {
    const formData = localStorage.getItem('mainFormData');
    return formData ? JSON.parse(formData) : null;
}

/**
 * Gets selected subjects from localStorage
 * @returns {Array} - Array of selected subjects
 */
export function getSelectedSubjects() {
    const subjects = localStorage.getItem('selectedSubjects');
    return subjects ? JSON.parse(subjects) : [];
}

/**
 * Clears all stored data from localStorage
 */
export function clearLocalStorage() {
    localStorage.removeItem('mainFormData');
    localStorage.removeItem('selectedSubjects');
    localStorage.removeItem('testResults');
}
