'use strict';

const BasicTestReporter = require('./BasicTestReporter');
const config = require('../../config');
const allureCmd = require('../../cf-allure-commandline/index');
const validator = require('../validation');
const uploader = require('../uploader');

class AllureTestReporter extends BasicTestReporter {
    generateReport() {
        return allureCmd(['generate', config.env.sourceReportFolderName, '--clean']);
    }

    async start({ extractedStorageConfig, isUpload }) {
        await this.prepareForGenerateReport({
            extractedStorageConfig,
            isUpload,
            buildId: this.buildId
        });

        await validator.validateUploadDir(config.env.sourceReportFolderName);

        const extraData = await this.getExtraData();
        validator.validateExtraData(extraData);

        const generation = this.generateReport();
        return new Promise(async (res, rej) => {
            generation.on('exit', async (exitCode) => {
                if (exitCode !== 0) {
                    rej(new Error(`Report generation is fail, exit with code: ${exitCode}`));
                }

                console.log('Report generation is finished successfully');

                try {
                    const result = uploader.uploadFiles({
                        srcDir: config.resultReportFolderName,
                        buildId: this.buildId,
                        bucketName: config.env.bucketName,
                        extractedStorageConfig,
                        extraData
                    });
                    res(result);
                } catch (e) {
                    rej(e);
                }
            });
        });
    }
}

module.exports = AllureTestReporter;
