const GraphemeSplitter = require('grapheme-splitter');

const splitter = new GraphemeSplitter();
// Robot avatar is reserved for AI
const emojis = "🙂😊😀😁😃😄😆😍☹️🙁😠😡😞😟😣😖😢😭😂😨😧😦😱😫😩😮😯😲😗😙😚😘😍😉😜😘😛😝😜🤑🤔😕😟😐😑😳😞😖🤐😶😇👼😈😎😪😏😒😵😕🤕🤒😷🤢🤨😬🎅😣😖👶😅😳😓😥😴😉😜😕😶😵🙄😀😅😆😃😄🙇😒😩😑😞😔😫😩😪😺😸😹😻😼😽🙀😿😾🐱🙍😔🤭😕😵🤦👽👾😙😚😎🤓😲😮😯😁😨😱😮😲🤷";
const avatars = splitter.splitGraphemes(emojis);

module.exports = function(reservedAvatars = []) {
  while (true) {
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    if (!reservedAvatars.includes(avatar)) {
      return avatar;
    }
  }
}
