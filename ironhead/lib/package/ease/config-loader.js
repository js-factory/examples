/**
 * This module is used to load the config from the path
 * provided in fixtures.
 */
const fs = require('fs');
const path = require('path');
const R = require('ramda');
const util = require('util');

// Following folders should exist in the path folder
const SERVER_CONFIG_FOLDER = 'server';
const EASE_CONFIG_FOLDER = 'ease';
const HEADER_CONFIG_FOLDER = 'header';
const AB_CONFIG_FOLDER = 'abtest';

// Sort Function - Ascending Order
const sort = R.sort((a, b) => (a - b));

// Dynamic fetching of files
const fetch = (configPath, val) => require(path.join(configPath, val)); // eslint-disable-line

/**
 * Requiring an array of files
 */
const requireFile = (configPath) => R.map((val) => fetch(configPath, val));

/**
* Promisify the readDir function
*/
const readdirAsync = util.promisify(fs.readdir);

/**
 * This function is used to get Files Data obtained by reading the directory.
 * @param {*} files
 * @param {*} configPath
 */
const getFilesData = (configPath) =>
    R.pipe(
        sort,
        requireFile(configPath),
        R.mergeAll
    );

/**
 * This particular function is used to load configs from the path
 * given as a argument
 * @param {*} configPath Configs/Directory Path
 */
const loadConfigs = async (configPath, throwError) => {
    try {
        const files = await readdirAsync(configPath);
        return getFilesData(configPath)(files);
    } catch (err) {
        if (throwError) throw err;
    }
    return undefined;
};

/**
 * This function is used to get the configs from the fixtures parallely
 * config is the Config Folder
 * configsPath is the fixtures path
 */
const getConfigs = ((...config) =>
    (configsPath) => {
        const SERVER_CONFIG_PATH = path.join(configsPath, config[0]);
        const EASE_CONFIG_PATH = path.join(configsPath, config[1]);
        const HEADER_CONFIG_PATH = path.join(configsPath, config[2]);
        const AB_CONFIG_PATH = path.join(configsPath, config[3]);

        return Promise.all([
            loadConfigs(SERVER_CONFIG_PATH, true),
            loadConfigs(EASE_CONFIG_PATH, true),
            loadConfigs(HEADER_CONFIG_PATH),
            loadConfigs(AB_CONFIG_PATH)
        ]);
    }
)(SERVER_CONFIG_FOLDER, EASE_CONFIG_FOLDER, HEADER_CONFIG_FOLDER, AB_CONFIG_FOLDER);

module.exports = {
    getConfigs
};
