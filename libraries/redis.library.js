'use strict';
require('dotenv').config();
const chalk = require('chalk');

const { redisClient } = require('../app/helpers/redis');
const log = console.log;

redisClient.connect().catch((err)=> {
    log(chalk.white.bgRed.bold('✘ Redis client setup process failed!'));
});


module.exports = {
    set: async (key, value, timeout = '5m') => {
        try {
            await redisClient.set(key, value, redisClient.print);
            await redisClient.expire(key, getExpiresInTime(timeout));
            return true;
        } catch (ex) {
            throw new baseError(ex);
        }
    },
    get: async (key) => {
        try {
            return await redisClient.get(key, function (err, result) {
                if (err) throw new baseError(err);
                return result;
            });
        } catch (ex) {
            console.log(ex);
        }
    },
    delete: async (key) => {
        try {
            return await redisClient.del(key, function(err, response) {
                if (err) throw new baseError(err);
                return response;
             });
        } catch (ex) {
            throw new baseError(ex);
        }
    },
}

function getExpiresInTime(expiresIn) {
    (expiresIn) ? expiresIn : process.env.JWT_EXPIRES_IN;
    const expiresInInt = parseInt(expiresIn);
    const expiresInString = expiresIn.split(expiresInInt)[1];
    let expiresInTime = expiresInInt
    switch (expiresInString) {
        case 'm':
            expiresInTime = expiresInInt * 60;
            break;
        case 'h':
            expiresInTime = expiresInInt * 60 * 60;
            break;
        case 'd':
            expiresInTime = expiresInInt * 60 * 60 * 24;
            break;

        default:
            expiresInTime = expiresInInt;
            break;
    }
    return expiresInTime;
  }