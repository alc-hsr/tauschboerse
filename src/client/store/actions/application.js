/*
 * Action Type Constants
 */

export const GLOBAL_MESSAGE_RECEIVED = 'GLOBAL_MESSAGE_RECEIVED';
export const GLOBAL_MESSAGE_REMOVED = 'GLOBAL_MESSAGE_REMOVED';
export const LOADING_STATE_RECEIVED = 'LOADING_STATE_RECEIVED';
export const GLOBAL_PAGE_SIZE_CHANGED = 'GLOBAL_SET_PAGE_SIZE';
export const GLOBAL_POLLING_INTERVAL_CHANGED = 'GLOBAL_POLLING_INTERVAL_CHANGED';

/*
 * Global Message Types
 */

export const OK_MESSAGE = 'OK_MESSAGE';
export const WARNING_MESSAGE = 'WARNING_MESSAGE';
export const ERROR_MESSAGE = 'ERROR_MESSAGE';

/*
 * Follow-up Action Type Constants from within the global message snackbar
 */

export const GO_TO_LOGIN = 'GO_TO_LOGIN';

/*
 * Action Creators
 */

export const globalMessageReceived = (theGlobalMessage) => ({
    type: GLOBAL_MESSAGE_RECEIVED,
    globalMessage: theGlobalMessage
});

export const globalMessageRemoved = () => ({
    type: GLOBAL_MESSAGE_REMOVED
});

export const loadingStateReceived = (isLoading) => ({
    type: LOADING_STATE_RECEIVED,
    isLoading: isLoading
});

export const pageSizeChanged = (pageSize) => ({
    type: GLOBAL_PAGE_SIZE_CHANGED,
    pageSize: pageSize
});

export const pollingIntervalChanged = (interval) => ({
    type: GLOBAL_POLLING_INTERVAL_CHANGED,
    interval: interval
});

/*
 * Thunk Actions
 */

export const setGlobalMessage = (theGlobalMessage) => dispatch =>
    dispatch(globalMessageReceived(theGlobalMessage));

export const removeGlobalMessage = () => dispatch =>
    dispatch(globalMessageRemoved());

export const setLoading = (isLoading) => dispatch =>
    dispatch(loadingStateReceived(isLoading));

export const setPageSize = (pageSize) => dispatch =>
    dispatch(pageSizeChanged(pageSize));

export const setPollingInterval = (milliseconds) => dispatch =>
    dispatch(pollingIntervalChanged(milliseconds));
