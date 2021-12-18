const RPGCharacter = artifacts.require('RPGCharacter')
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken')
const RINKEBY_VRF_COORDINATOR = '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B'
const RINKEBY_LINKTOKEN = '0x01be23585060835e02b77ef475b0cc51aa1e0709'
const RINKEBY_KEYHASH = '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311'

module.exports = async (deployer, network, [defaultAccount]) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  LinkToken.setProvider(deployer.provider)
  RPGCharacter.setProvider(deployer.provider)
  if (network.startsWith('rinkeby')) {
    try {
      await deployer.deploy(RPGCharacter, RINKEBY_VRF_COORDINATOR, RINKEBY_LINKTOKEN, RINKEBY_KEYHASH)
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log("This was hard coded to deploy to rinkeby")
  }
}
