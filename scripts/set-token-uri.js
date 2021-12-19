const RPGCharacter = artifacts.require('RPGCharacter')
const { create, globSource } = require('ipfs-http-client')
const regExp = /\(([^)]+)\)/

module.exports = async (callback) => {
  /* Create an instance of the client */
  const filesUploaded = []
  const client = create('https://ipfs.infura.io:5001/api/v0')

  for await (const file of client.addAll(globSource('./metadata', '**/*'))) {
    filesUploaded.push(file)
  }

  const rpg = await RPGCharacter.deployed()
  console.log("Let's set the tokenURI of your characters")
  length = await rpg.getNumberOfCharacters()
  index = 0
  while (index < length) {
    const character = await rpg.characters(index)
    console.log(character)
    fileName = character['name'].toLowerCase().replace(/\s/g, '-') + '.json'
    curr = filesUploaded.filter((fl) => fl.path == fileName)[0]
    fileHash = curr['cid'].toString()
    url = `https://ipfs.io/ipfs/${fileHash}?filename=${curr.path}`
    const tx = await rpg.setTokenURI(index, url)
    index++
  }
  console.log("URI's set")
  callback(rpg)
}
