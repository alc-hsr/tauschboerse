'use strict';

const registrationValidator = require('../../shared/validations/registration');
const usersStore = require('../services/usersStorage');

const useDataCache = require('../useDataCache').useDataCache;
const dataCache = require('../services/DataCache').dataCache;

async function validate(theUser) {
    const validationError = checkCredentials(theUser);
    if (validationError) {
        return {
            success: false,
            status: validationError.status,
            errors: validationError.errors
        };
    }

    let existingUser;
    if (useDataCache) {
        existingUser = dataCache.getUserByEmail(theUser.email);
    }
    else {
        existingUser = await usersStore.getUserByEmail(theUser.email);
    }
    if (existingUser) {
        return {
            success: false,
            status: 400,
            errors: {
                email: 'Diese E-Mail existiert bereits'
            }
        };
    }

    return {
        success: true
    };
}

function checkCredentials(theUser) {
    const validation = registrationValidator.validate(theUser);
    if (!validation.isValid) {
        return {
            status: 400,
            errors: validation.errors
        };
    }
    return null;
}

module.exports = { validate };