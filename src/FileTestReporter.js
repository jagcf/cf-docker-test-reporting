'use strict';

const BasicTestReporter = require('./BasicTestReporter');
const config = require('../config');

class FileTestReporter extends BasicTestReporter {
    async start() {
        console.log('Start upload custom test report (without generating visualization of test report)');
        console.log('UPLOAD_DIR: ', this.dirForUpload);
        console.log('UPLOAD_DIR_INDEX_FILE: ', this.uploadIndexFile);

        await this.setExportVariable('TEST_REPORT_UPLOAD_INDEX_FILE', this.uploadIndexFile);

        const missingVars = this.findMissingVars(config.requiredVarsForUploadMode);
        if (missingVars.length) {
            throw new Error(`For upload custom test report you must specify ${missingVars.join(', ')} variable${missingVars.length > 1 ? 's' : ''}`);
        }

        await this.validateUploadDir(this.dirForUpload);

        await this.uploadFiles({ srcDir: this.dirForUpload, bucket: this.bucket, buildId: this.buildId });
    }
}

module.exports = FileTestReporter;
