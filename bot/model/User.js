
class User {
    constructor(torus_id) {
      this.torus_id = torus_id;
      console.log("create a user with id", torus_id)
    }
    addTokenToTransfer(token) {
      this.tokenToTransfer.push(token);
    }
    getTokenToTransfer() {
      return this.tokenToTransfer.pop();
    }
    getEthAddress() {
      return "0x000000000"
    }
  }

module.exports = {User}