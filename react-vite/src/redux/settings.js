// // settings action types
// const SET_SETTINGS = 'settings/setSettings';
// const CLEAR_SETTINGS = 'settings/clearSettings';
// const UPDATE_SETTING = 'settings/updateSetting';
// const REMOVE_SETTING = 'settings/removeSetting';

// // action creators
// export const setSettings = (settings) => ({
//     type: SET_SETTINGS,
//     payload: settings // object of settings
// });

// export const clearSettings = () => ({
//     type: CLEAR_SETTINGS
// });

// export const updateSetting = (key, value) => ({
//     type: UPDATE_SETTING,
//     payload: { key, value }
// });

// export const removeSetting = (key) => ({
//     type: REMOVE_SETTING,
//     payload: key
// });

// export const setSettingsError = (error) => ({
//     type: 'settings/setError',
//     payload: error
// });


// // Thunks
// // GET settings
// export const thunkGetSettings = () => async (dispatch) => {
//     const response = await fetch('/api/settings');
//     if (response.ok) {
//         const settings = await response.json();
//         dispatch(setSettings(settings));
//         return settings;
//     } else {
//         // handle error
//         return { error: "Failed to fetch settings" };
//     }
// }

// // POST new settings
// export const thunkCreateSettings = (settingsData) => async (dispatch) => {
//     const response = await fetch('/api/settings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(settingsData)
//     });
//     if (response.ok) {
//         const settings = await response.json();
//         dispatch(setSettings(settings));
//         return settings;
//     } else {
//         // handle error
//         return { error: "Failed to create settings" };
//     }
// }

// // PUT update settings
// export const thunkUpdateSettings = (settingsData) => async (dispatch) => {
//     const response = await fetch('/api/settings', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(settingsData)
//     });
//     if (response.ok) {
//         const settings = await response.json();
//         dispatch(setSettings(settings));
//         return settings;
//     } else {
//         // handle error
//         return { error: "Failed to update settings" };
//     }
// }

// // DELETE a setting
// export const thunkDeleteSetting = (key) => async (dispatch) => {
//     const response = await fetch(`/api/settings/${key}`, {
//         method: 'DELETE'
//     });
//     if (response.ok) {
//         dispatch(removeSetting(key));
//         return { success: true };
//     } else {
//         // handle error
//         return { error: "Failed to delete setting" };
//     }
// }

// // initial state
// const initialState = {
//     byId: {}, // stores settings by their key
//     allKeys: [] // stores all setting keys
// };

// // reducer
// export default function settingsReducer(state = initialState, action) {
//     switch (action.type) {
//         case SET_SETTINGS: {
//             const settings = action.payload;
//             const newById = {};
//             const newAllKeys = [];
//             Object.keys(settings).forEach(key => {
//                 newById[key] = settings[key];
//                 newAllKeys.push(key);
//             });
//             return {
//                 byId: newById,
//                 allKeys: newAllKeys
//             };
//         }
//         case CLEAR_SETTINGS:
//             return { ...initialState };
//         case UPDATE_SETTING: {
//             const { key, value } = action.payload;
//             return {
//                 ...state,
//                 byId: { ...state.byId, [key]: value },
//                 allKeys: state.allKeys.includes(key) ? state.allKeys : [...state.allKeys, key]
//             };
//         }
//         case REMOVE_SETTING: {
//             const key = action.payload;
//             const { [key]: _, ...byId } = state.byId; // remove the setting from byId
//             return {
//                 byId,
//                 allKeys: state.allKeys.filter(k => k !== key)
//             };
//         }
//         default:
//             return state;
//     }
// }