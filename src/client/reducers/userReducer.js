import {
    USER_LOGGED_IN,
    USER_LOGGED_OUT,
    USER_ARTICLES_FETCHED
} from './../actions/actions';

const initialState = null;

export default function user(theState = initialState, theAction) {
    switch (theAction.type) {
        case USER_LOGGED_IN:
            return {
                ...theState,
                user: theAction.user
            };
        case USER_LOGGED_OUT:
            return {};
        case USER_ARTICLES_FETCHED:
            return {
                ...theState,
                articles: theAction.articles
            };
        default:
            return theState;
    }
}