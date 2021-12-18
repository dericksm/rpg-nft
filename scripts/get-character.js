const RPGCharacter = artifacts.require('RPGCharacter')

module.exports = async callback => {
    const rpg = await RPGCharacter.deployed()
    console.log('Let\'s get the overview of your character')
    const overview = await rpg.characters(0)
    console.log(overview)
    callback(overview.tx)
}
