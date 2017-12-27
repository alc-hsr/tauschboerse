const TradeState = require('../../shared/constants/TradeState');
const OfferState = require('../../shared/constants/OfferState');
const Gender = require('../../shared/constants/Gender');

function resetData(dataCache) {
    const articles = [
        {ownerId: 0, title: 'Tisch', description: 'Antiker Tisch aus dem Jahr 1900', photos: [], categoryIds: [0]},
        {ownerId: 0, title: 'PC', description: 'Computer mit super Grafikkarte', photos: [], categoryIds: [1]},
        {ownerId: 0, title: 'Fussballschuhe', description: 'Fussballschuhe, fast neu...', photos: [], categoryIds: [2, 3]},
        {ownerId: 1, title: 'Kinderwagen', description: 'Kind ist schon zu gross dafür', photos: [], categoryIds: [4]},
    ];
    const categories = [
        {name: 'Möbel'},
        {name: 'Technik'},
        {name: 'Fussball'},
        {name: 'Sport'},
        {name: 'Kindersachen'}
    ];
    const trades = [
        { user1Id: 1, user2Id: 0, state: TradeState.TRADE_STATE_INIT, offers: [{ senderId: 1, state: OfferState.OFFER_STATE_INIT, articleIds: [0, 3] }], user1HasDelivered: false, user2HasDelivered: false }
    ];
    const users = [
        {gender: Gender.MALE, email: 'calbiez@hsr.ch', name: 'Christian Albiez', newPassword: 'c', registration: new Date()},
        {gender: Gender.MALE, email: 'stephen.atchison@hsr.ch', name: 'Stephen Atchison', newPassword: 'stephen', registration: new Date()},
        {gender: Gender.MALE, email: 'max@mustermann.com', name: 'Max Mustermann', newPassword: 'max', registration: new Date()},
        {gender: Gender.MALE, email: 'jamesbond007@agent.com', name: 'James Bond', newPassword: 'james', registration: new Date()}
    ];

    function insertUsers() {
        console.log('inserting users...');

        for(let i = 0, ii = users.length; i < ii; i++) {
            users[i] = dataCache.prepareUser(users[i]);
        }

        return Promise.all(users.map(
            user => dataCache.saveUser(user)
        ));
    }

    function insertCategories() {
        console.log('inserting categories...');

        for(let i = 0, ii = categories.length; i < ii; i++) {
            categories[i] = dataCache.prepareCategory(categories[i]);
        }

        return Promise.all(categories.map(
            category => dataCache.saveCategory(category)
        ));
    }

    function insertArticles() {
        console.log('inserting articles...');

        for(let i = 0, ii = articles.length; i < ii; i++) {
            let article = articles[i];
            article.owner = users[article.ownerId];
            article.categories = article.categoryIds.map(id => categories[id]);
            articles[i] = dataCache.prepareArticle(article);
        }

        return Promise.all(articles.map(article => {
            return dataCache.saveArticle(article);
        }));
    }

    function insertTrades() {
        console.log('inserting trades...');

        for(let i = 0, ii = trades.length; i < ii; i++) {
            let trade = trades[i];
            trade.user1 = users[trade.user1Id];
            trade.user2 = users[trade.user2Id];
            trade.offers = trade.offers.map(offer => ({ sender: users[offer.senderId], state: offer.state, createDate: new Date(), articles: offer.articleIds.map(id => articles[id]) }));
            trades[i] = dataCache.prepareTrade(trade);
        }

        return Promise.all(trades.map(trade => {
            return dataCache.saveTrade(trade);
        }));
    }

    return dataCache.clear()
        .then(() => insertUsers())
        .then(() => insertCategories())
        .then(() => insertArticles())
        .then(() => insertTrades());
}

module.exports = resetData;
