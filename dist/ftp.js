"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const sdz_agent_common_1 = require("sdz-agent-common");
const cli_progress_1 = __importDefault(require("cli-progress"));
const chalk_1 = __importDefault(require("chalk"));
class FTP {
    constructor(config) {
        this.config = config;
        if (process.env.DEBUG) {
            (msg) => sdz_agent_common_1.Logger.info(msg);
        }
        this.client = new ssh2_sftp_client_1.default();
    }
    async connect() {
        try {
            await this.client
                .connect(this.config)
                .then(() => {
                return true;
            })
                .catch((e) => {
                throw new Error();
            });
            return true;
        }
        catch (e) {
            sdz_agent_common_1.Logger.error("CONFIGURAÇÕES FTP INVÁLIDAS.");
            process.exit(1);
        }
    }
    async disconnect() {
        await this.client.end();
    }
    async sendFile(localFileName, remoteFileName) {
        let complete = false;
        try {
            const barProgress = new cli_progress_1.default.SingleBar({
                format: chalk_1.default.green("{bar}") + "| {percentage}% || {value}/{total} Kb",
            }, cli_progress_1.default.Presets.shades_classic);
            await this.client
                .fastPut(localFileName, remoteFileName, {
                step: function (total_transferred, chunk, total) {
                    barProgress.start(total, 0);
                    barProgress.increment();
                    barProgress.update(total_transferred);
                },
            })
                .then(() => {
                barProgress.stop();
                this.client.end();
            })
                .catch((err) => {
                console.log(err);
                sdz_agent_common_1.Logger.error(`ERRO AO ENVIAR ${remoteFileName} FTP.`);
                process.exit(1);
            });
            complete = true;
        }
        catch (e) {
            throw new Error();
        }
        return complete;
    }
    async getFile(remoteFileName, localFileName) {
        let complete = false;
        try {
            await this.client
                .fastGet(remoteFileName, localFileName)
                .then(() => {
                return this.disconnect();
            })
                .catch((err) => {
                console.error(err.message);
            });
            complete = true;
        }
        catch (e) {
            throw new Error();
        }
        return complete;
    }
}
exports.default = FTP;
