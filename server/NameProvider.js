const { uniqueNamesGenerator, Config, starWars, adjectives, colors, names, animals } = require ('unique-names-generator');

const config = [
  [starWars],
  [adjectives,animals],
  [colors,animals],
  [adjectives,colors, animals]
]

module.exports = class NameProvider {
  generateName(){
    let randomInt = Math.floor(Math.random() * config.length);
    return uniqueNamesGenerator({
      dictionaries: config[randomInt],
      style: 'capital',
      separator: ' '
    });
  }
}

