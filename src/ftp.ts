import SFTPClient from "ssh2-sftp-client";

import { ConfigAuthFTP, FTPInterface } from "sdz-agent-types";

import { Logger, ProgressBar } from "sdz-agent-common";

class FTP implements FTPInterface {
  private config: ConfigAuthFTP;
  constructor(config: ConfigAuthFTP) {
    this.config = config;
    if (process.env.DEBUG) {
      (msg: string) => Logger.info(msg);
    }
  }

  async connect() {
    try {
      const client = this.getClient();
      await client
        .connect(this.config)
        .then(() => {
          client.end();
          return true;
        })
        .catch((e: any) => {
          throw e;
        });
      return true;
    } catch (e) {
      Logger.error("CONFIGURAÇÕES FTP INVÁLIDAS.");
      throw e;
    }
  }

  getClient() {
    return new SFTPClient();
  }

  async sendFile(
    localFileName: string,
    remoteFileName: string
  ): Promise<boolean> {
    let complete = false;
    try {
      const client = this.getClient();
      await client.connect(this.config);
      await client
        .fastPut(localFileName, remoteFileName, {
          step: function (total_transferred, chunk, total) {
            if (total_transferred < total) {
              if (!process.env.COMMAND_LINE) {
                ProgressBar.update(localFileName, total_transferred, {
                  color: `\u001b[33m`,
                  event: "SENDING",
                  unit: "Kb",
                  count: `${Math.round(total_transferred / 8000)}/${Math.round(
                    total / 8000
                  )}`,
                });
              }
            } else {
              if (!process.env.COMMAND_LINE) {
                ProgressBar.update(localFileName, total_transferred, {
                  color: `\u001b[32m`,
                  event: "DONE",
                  value: total,
                  count: `${Math.round(total_transferred / 8000)}/${Math.round(
                    total / 8000
                  )}`,
                });
              }
            }
          },
        })
        .then(() => {
          client.end();
        })
        .catch((err: TypeError) => {
          Logger.error(`ERRO AO ENVIAR ${remoteFileName} FTP.`);
          throw err;
        });
      complete = true;
    } catch (e) {
      throw e;
    }
    return complete;
  }

  async getFile(
    remoteFileName: string,
    localFileName: string
  ): Promise<boolean> {
    let complete = false;
    try {
      const client = this.getClient();
      await client.connect(this.config);
      await client
        .fastGet(remoteFileName, localFileName, {
          step: function (total_transferred, chunk, total) {},
        })
        .then(() => {
          client.end();
        })
        .catch((err: TypeError) => {
          throw err;
        });
      complete = true;
    } catch (e) {
      throw e;
    }
    return complete;
  }

  async renameFile(
    remoteFileName: string,
    newRemoteFileName: string
  ): Promise<boolean> {
    let complete = false;
    try {
      const client = this.getClient();
      await client.connect(this.config);
      await client
        .rename(remoteFileName, newRemoteFileName)
        .then(() => {
          client.end();
        })
        .catch((err: TypeError) => {
          throw err;
        });
      complete = true;
    } catch (e) {
      throw e;
    }
    return complete;
  }
}
export default FTP;
