const { create } = require('ipfs-http-client');

class Ipfs {
  constructor(options) {
    this.ipfsClient = create({
      host: options.host,
      port: options.port,
      protocol: options.protocol,
      headers: {
        authorization: `Basic ${Buffer.from(`${options.IPFSProjectId}:${options.IPFSProjectSecret}`).toString('base64')}`,
      },
    });
  }

  async addFile(body) {
    const itsBuffer = Buffer.from(body.content);

    const data = await this.ipfsClient.add({
      content: itsBuffer,
      path: body.path,
    });

    return data.cid.toString().replace('CID([^)]*)', '');
  }
}

module.exports = Ipfs;
