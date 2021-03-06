
const BasicStorage = require('./basic.storage');
const _ = require('lodash');
const { azureBlob } = require('../storageTypes');

class AzureBlobStorage extends BasicStorage {
    constructor({ storageConfig }) {
        super(storageConfig);
    }

    extractStorageConfig() {
        this.extractedConfig = {
            type: 'json',
            integrationType: azureBlob,
            name: _.get(this.storageConfig, 'metadata.name'),
            storageConfig: _.get(this.storageConfig, 'spec.data.auth')
        };
    }

    validateConfig() {
        this.extractStorageConfig();

        this._validateStorageConfFields();
    }

    _validateStorageConfFields() {

        const { type, storageConfig } = this.extractedConfig;

        const requiredFields = ['accountName', 'accountKey'];
        const missingVars = [];

        requiredFields.forEach((reqVar) => {
            if (!storageConfig[reqVar]) {
                missingVars.push(reqVar);
            }
        });

        if (missingVars.length) {
            throw new Error(`Missing fields in ${type} config: ${missingVars.join(', ')} is required`);
        }
    }
}

module.exports = AzureBlobStorage;
