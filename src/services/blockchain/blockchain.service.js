const Web3 = require('web3');
const { ABI } = require('../../utils/constants');
const { OFFICIAL_PK, OFFICIAL_ADDRESS, RPC_URL } = require('../../config/config');

class Blockchain {
  constructor(_contractAddress) {
    this.rpcUrl = RPC_URL;
    this.pk = OFFICIAL_PK;
    this.contractAddress = _contractAddress;
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcUrl));
    this.account = this.web3.eth.accounts.privateKeyToAccount(this.pk);
    this.votergateContract = new this.web3.eth.Contract(ABI, this.contractAddress);
  }

  async addCandidate(name, candidateId) {
    const data = this.votergateContract.methods.addCandidate(name, candidateId).encodeABI();
    const tx = {
      from: OFFICIAL_ADDRESS,
      to: this.contractAddress,
      data,
      gas: 1000000,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('30', 'gwei')),
    };

    const signedTx = await this.account.signTransaction(tx);

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  async setQuota(size) {
    const data = this.votergateContract.methods.setQuota(size).encodeABI();
    const tx = {
      from: OFFICIAL_ADDRESS,
      to: this.contractAddress,
      data,
      gas: 1000000,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('30', 'gwei')),
    };

    const signedTx = await this.account.signTransaction(tx);

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  async vote(candidateId, voterId) {
    const data = this.votergateContract.methods.vote(candidateId, voterId).encodeABI();
    const tx = {
      from: OFFICIAL_ADDRESS,
      to: this.contractAddress,
      data,
      gas: 1000000,
      gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('30', 'gwei')),
    };

    const signedTx = await this.account.signTransaction(tx);

    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }

  async getCandidates() {
    const result = [];
    const datas = await this.votergateContract.methods.getCandidates().call();
    for (let i = 0; i < datas['0'].length; i += 1) {
      result[i] = {
        candidateId: datas['0'][i],
        name: datas['1'][i],
        voteCount: datas['2'][i],
      };
    }
    return result;
  }
}

module.exports = Blockchain;
