'use strict'

const bcrypt = require('bcrypt');
const Datastore = require('nedb');
const dataFiles = require('./dataFiles');

const db = dataFiles.dbUsers;

class UserCache {
    constructor() {
        this.users = [];
    }

    init() {
        return new Promise((resolve, reject) => {
            console.log('Loading users...');
            db.find({}, (err, recs) => {
                this.passwords = recs.map(user => { return { id: user._id, pwd: user.password}; });
                this.users = recs;
                this.users.forEach(user => {
                    delete user.password;
                });
                console.log('users loaded');
                resolve(this);
            });
        });
    }

    find(id) {
        return this.users.find(user => user._id === id);
    }

    authenticate(id, pwd) {
        let rec = this.passwords.find(r => r.id === id);
        return rec ? bcrypt.compareSync(pwd, user.pwd) : false;
    }
}

module.exports = {
    UserCache
};