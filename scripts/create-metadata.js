const RPGCharacter = artifacts.require('RPGCharacter')
const fs = require('fs')

image_uri = {
    "1": "https://ipfs.io/ipfs/QmVDpQ2M2MXYee48CbqUuUadjaU9yiveKkWSDXKWhiED4Z?filename=archer.jpg",
    "2": "https://ipfs.io/ipfs/QmPbojEVA8agCkWJkzVeMFWLE66K82QZZS1E7rV3Hj2Gxt?filename=warrior.jpg",
    "3": "https://ipfs.io/ipfs/QmTyB9J5dPPPAXdYNZxfD5A7eqJ81w1VawT3Xjxj681AUY?filename=mage.jpg"
}

const metadataTemple = {
    "name": "",
    "image": "",
    "attributes": [
        {
            "trait_type": "Level",
            "value": 0
        },
        {
            "trait_type": "Strength",
            "value": 0
        },
        {
            "trait_type": "Constitution",
            "value": 0
        },        
        {
            "trait_type": "Dexterity",
            "value": 0
        },        
        {
            "trait_type": "Intelligence",
            "value": 0
        }
    ]
}

module.exports = async callback => {
    const rpg = await RPGCharacter.deployed()
    length = await rpg.getNumberOfCharacters()
    console.log(this.length.toString())
    console.log(await rpg.address)
    index = 0
    while (index < length) {
        console.log('Let\'s get the overview of your character ' + index + ' of ' + length)
        let characterMetadata = metadataTemple
        let characterOverview = await rpg.characters(index)
        index++
        characterMetadata['name'] = characterOverview['name']
        characterMetadata['image'] = image_uri[characterOverview['class']]
        if (fs.existsSync('metadata/' + characterMetadata['name'].toLowerCase().replace(/\s/g, '-') + '.json')) {
            console.log('test')
            continue
        }
        characterMetadata['attributes'][0]['value'] = characterOverview['level'].toNumber()
        characterMetadata['attributes'][1]['value'] = characterOverview['strength'].toNumber()
        characterMetadata['attributes'][2]['value'] = characterOverview['constitution'].toNumber()
        characterMetadata['attributes'][3]['value'] = characterOverview['dexterity'].toNumber()
        characterMetadata['attributes'][4]['value'] = characterOverview['intelligence'].toNumber()
        console.log(characterMetadata)
        filename = 'metadata/' + characterMetadata['name'].toLowerCase().replace(/\s/g, '-')
        let data = JSON.stringify(characterMetadata)
        fs.writeFileSync(filename + '.json', data)
    }
    callback(rpg)
}
