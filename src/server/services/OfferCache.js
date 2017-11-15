'use strict';

const db = require('./dataFiles').dbOffers;

class OfferCache {
    constructor(transactions, articles, users) {
        this.transactions = transactions;
        this.articles = articles;
        this.users = users;

        this.offers = [];
    }

    init() {
        let load = function(resolve, reject) {
            console.log('Loading offers...');
            db.find({}, (function(err, recs) {
                if (err) {
                    reject(err);
                } else {
                    this.offers = recs.map(rec => this.toLogicalRecord(rec));
                    console.log('offers loaded');
                    resolve(this);
                }
            }).bind(this));
        };
                    
        return new Promise(load.bind(this));
    }

    clear() {
        let clearOp = function(resolve, reject) {
            console.log('Clearing offers...');
            db.remove({}, { multi: true }, (function(err, numRemoved) {
                if (err) {
                    console.log('Error clearing offers: ' + err);
                    reject(err);
                } else {
                    console.log('Offers cleared');
                    this.offers = [];
                    resolve(numRemoved);
                }
            }).bind(this));
        };

        let compactOp = function(resolve, reject) {
            console.log('Compacting offers datafile...');
            db.on('compaction.done', () => {
                console.log('Offers datafile compacted');
                resolve(null);
            });
            db.persistence.compactDatafile();
        };

        return new Promise(clearOp.bind(this)).then(() => new Promise(compactOp));
    }

    save(offer) {
        let rec;
        let saveOp;

        if (offer.hasOwnProperty('_id')) {
            rec = this.find(offer._id);
        }

        if (!rec) {
            saveOp = (function(resolve, reject) {
                db.insert(OfferCache.toPhysicalRecord(offer), (function(err, newRec) {
                    if (err) {
                        reject(err);
                    } else {
                        let newOffer = this.toLogicalRecord(newRec);
                        this.offers.push(newOffer);
                        resolve(newOffer);
                    }
                }).bind(this));
            });
        } else {
            saveOp = (function(resolve, reject) {
                if (rec.update(offer)) {
                    db.update({_id: rec._id}, OfferCache.toPhysicalRecord(rec), {}, function(err, newRec) {
                        resolve(rec);
                    });
                } else {
                    resolve(rec);
                }
            });
        }

        return new Promise(saveOp.bind(this));
    }

    delete(id) {
        deleteOp = function(resolve, reject) {
            let offer = this.find(id);
            if (offer) {
                this.offers.remove(offer);
                db.remove({ _id: offer._id }, function(err, numRemoved) {
                    err ? reject(err) : resolve(true);
                });
            } else {
                resolve(true);
            }
        }
        
        return new Promise(deleteOp.bind(this));
    }

    prepare(obj, user) {
        let offer = new Offer(obj);
        if (obj.hasOwnProperty('_id')) {
            offer._id = obj._id;
        }

        return offer;
    }

    static toPhysicalRecord(offer) {
        let rec = {};

        if (offer.hasOwnProperty('_id')) {
            rec._id = offer._id;
        }

        rec.transactionId = offer.transaction._id;
        rec.senderId = offer.sneder._id;
        rec.receiverId = offer.reveiver._id;
        rec.articleIds = offer.articles.map(article => article._id);

        return rec;
    }

    toLogicalRecord(rec) {
        let offer = new Offer(null);
        offer._id = rec._id;

        offer.transaction = this.transactions.find(rec.transactionId);
        offer.sender = this.users.find(rec.senderId);
        offer.receiver = this.users.find(rec.receiverId);
        offer.articles = rec.articleIds ? rec.articleIds.map(id => this.articles.findById(id)) : [];
        
        return offer;
    }

    find(id) {
        return this.offers.find(offer => offer._id === id);
    }
}

module.exports = {
    OfferCache
};
