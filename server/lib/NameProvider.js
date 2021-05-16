const { uniqueNamesGenerator, Config, starWars, adjectives, colors, names, animals } = require('unique-names-generator');

const config = [
  [starWars],
  [adjectives, animals],
  [colors, animals],
  [adjectives, colors, animals]
]

module.exports = function generateName(reservedNames = []) {
  while (true) {
    const randomInt = Math.floor(Math.random() * config.length);
    const name = uniqueNamesGenerator({
      dictionaries: config[randomInt],
      style: 'capital',
      separator: ' '
    });
    if (!reservedNames.includes(name)) return name;
  }
}

