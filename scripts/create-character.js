const RPGCharacter = artifacts.require('RPGCharacter')

module.exports = async callback => {
  const rpg = await RPGCharacter.deployed()
  console.log('Creating requests on contract:', rpg.address)
  const tx = await rpg.createRandomWarrior("Tadela")
  console.log(tx)
  callback(tx.tx)
}
