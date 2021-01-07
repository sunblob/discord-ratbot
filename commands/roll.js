const _ = require('lodash');

module.exports = {
  name: 'roll',
  description: 'rolls a random number between 0 and 100',
  execute(message, args) {
    if (!args[0] && !args[1]) {
      const number = _.random(0, 100);
      return message.reply(`Your number is: ${number}`);
    } else if (args.length === 1 && args[0]) {
      const number = _.random(0, args[0]);
      return message.reply(`Your number is: ${number}`);
    } else {
      const number = _.random(args[0], args[1]);
      return message.reply(`Your number is: ${number}`);
    }
  },
};
