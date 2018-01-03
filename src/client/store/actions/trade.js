import axios from 'axios';

import { handleError } from './common';
import TradeState from '../../../shared/constants/TradeState';
import TradeModel from '../../model/TradeModel';

/*
 * Action Type Constants
 */

export const TRADE_FETCHED = 'TRADE_FETCHED';
export const TRADE_NOT_FOUND = 'TRADE_NOT_FOUND';
export const TRADE_SAVED = 'TRADE_SAVED';
export const TRADE_STATE_CHANGED = 'TRADE_STATE_CHANGED';

export const TRADE_USER_ARTICLES_FETCHED = 'TRADE_USER_ARTICLES_FETCHED';
export const TRADE_PARTNER_ARTICLES_FETCHED = 'TRADE_PARTNER_ARTICLES_FETCHED';

export const TRADE_EDITING_USER_ARTICLES_STARTED = 'TRADE_EDITING_USER_ARTICLES_STARTED';
export const TRADE_EDITING_PARTNER_ARTICLES_STARTED = 'TRADE_EDITING_PARTNER_ARTICLES_STARTED';
export const TRADE_EDITING_USER_ARTICLES_CANCELED = 'TRADE_EDITING_USER_ARTICLES_CANCELED';
export const TRADE_EDITING_PARTNER_ARTICLES_CANCELED = 'TRADE_EDITING_PARTNER_ARTICLES_CANCELED';
export const TRADE_PARTNER_ARTICLE_TOGGLED = 'TRADE_PARTNER_ARTICLE_TOGGLED';
export const TRADE_USER_ARTICLE_TOGGLED = 'TRADE_USER_ARTICLE_TOGGLED';
export const TRADE_ARTICLES_SAVED = 'TRADE_ARTICLES_SAVED';

/*
 * Action Creators
 */

const tradeFetched = (theTrade) => ({
    type: TRADE_FETCHED,
    trade: theTrade,
});

const tradeNotFound = () => ({
    type: TRADE_NOT_FOUND
});

const tradeSaved = (theTrade) => ({
    type: TRADE_SAVED,
    trade: theTrade,
});

const tradeStateChanged = (theTrade) => ({
    type: TRADE_STATE_CHANGED,
    trade: theTrade
});

const userArticlesFetched = (theArticles) => ({
    type: TRADE_USER_ARTICLES_FETCHED,
    articles: theArticles
});

const partnerArticlesFetched = (theArticles) => ({
    type: TRADE_PARTNER_ARTICLES_FETCHED,
    articles: theArticles
});

const userArticleToggled = (theArticle) => ({
    type: TRADE_USER_ARTICLE_TOGGLED,
    article: theArticle
});

const partnerArticleToggled = (theArticle) => ({
    type: TRADE_PARTNER_ARTICLE_TOGGLED,
    article: theArticle
});

const editingUserArticlesStarted = () => ({
    type: TRADE_EDITING_USER_ARTICLES_STARTED
});

const editingPartnerArticlesStarted = () => ({
    type: TRADE_EDITING_PARTNER_ARTICLES_STARTED
});

const editingUserArticlesCanceled = () => ({
    type: TRADE_EDITING_USER_ARTICLES_CANCELED
});

const editingPartnerArticlesCanceled = () => ({
    type: TRADE_EDITING_PARTNER_ARTICLES_CANCELED
});

const articlesSaved = (theTrade) => ({
    type: TRADE_ARTICLES_SAVED
});

/*
 * Thunk Actions
 */

export const loadTrade = (theTradeId, theUser) => dispatch => {
    return axios.get(`/api/trades/${theTradeId}`)
        .then(response => dispatch(tradeFetched(new TradeModel(response.data.trade, theUser))))
        .catch(err => {
            handleError(err, dispatch);
            dispatch(tradeNotFound());
        });
};

export const loadUserArticles = (theUserId) => dispatch => {
    return loadArticlesByUserId(theUserId, userArticlesFetched, dispatch);
};

export const loadPartnerArticles = (theUserId) => dispatch => {
    return loadArticlesByUserId(theUserId, partnerArticlesFetched, dispatch);
};

export const saveTrade = (theTrade) => dispatch => {
    // dispatch(lastSearchCleared());
};

export const saveArticles = (theTradeId, theArticles) => dispatch => {
    return axios.put(`/api/trades/${theTradeId}`, theArticles.map(a => a._id))
        .then(response => dispatch(articlesSaved(new TradeModel(response.data))))
        .catch(err => handleError(err, dispatch));
};

export const startEditingUserArticles = (theUserId, loadArticles) => dispatch => {
    dispatch(editingUserArticlesStarted());
};

export const startEditingPartnerArticles = (theUserId, loadArticles) => dispatch => {
    dispatch(editingPartnerArticlesStarted());
};

export const cancelEditingUserArticles = () => dispatch => {
    dispatch(editingUserArticlesCanceled());
};

export const cancelEditingPartnerArticles = () => dispatch => {
    dispatch(editingPartnerArticlesCanceled());
};

export const toggleUserArticle = (theArticle) => dispatch => {
    dispatch(userArticleToggled(theArticle));
};

export const togglePartnerArticle = (theArticle) => dispatch => {
    dispatch(partnerArticleToggled(theArticle));
};

export const submitTrade = (theTrade) => dispatch => {
    return setTradeState(theTrade, 'REQUESTED', dispatch);
};

export const withdrawTrade = (theTrade) => dispatch => {
    
};

export const acceptTrade = (theTrade) => dispatch => {
    return setTradeState(theTrade, 'ACCEPTED', dispatch);
};

export const declineTrade = (theTrade) => dispatch => {
    return setTradeState(theTrade, 'DECLINED', dispatch);
};

function setTradeState(theTrade, theNewState, dispatch) {
    return axios.put(`/api/trades/${theTrade._id}/state`, { newState: theNewState })
        .then(response => dispatch(tradeStateChanged(response.data.trade)))
        .catch(err => handleError(err, dispatch));
}

function loadArticlesByUserId(theUserId, actionCreator, dispatch) {
    return axios.get(`/api/users/${theUserId}/articles`)
        .then(response => dispatch(actionCreator(response.data.articles)))
        .catch(err => handleError(err, dispatch));
}

function startEditingArticles(theUserId, loadArticles, actionCreator, dispatch) {
    if (loadArticles) {
        return loadArticlesByUserId(theUserId, actionCreator, dispatch);
    } else {
        dispatch(actionCreator(null));
        return Promise.resolve(null);
    }
};
