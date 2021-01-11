const _ = require('lodash');

module.exports = {
  config: {
    name: 'roll',
    description: 'Rolls a random number.',
    usage: '_roll',
    category: 'misc',
    aliases: ['r'],
  },
  execute(bot, message, args) {
    if (
      (args[0] && !_.isFinite(_.parseInt(args[0]))) ||
      (args[1] && !_.isFinite(_.parseInt(args[1])))
    ) {
      return message.reply(`You must provide numberic arguments`);
    }

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
