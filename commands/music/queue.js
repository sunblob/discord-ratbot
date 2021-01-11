const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'queue',
    description: 'Show all songs in the queue!',
    usage: '_queue',
    category: 'music',
    aliases: ['q'],
  },
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player || !player.queue.current) {
      return message.channel.send('No songs currently playing in this guild.');
    }

    if (!message.member.voice.channel) {
      return message.channel
        .send('You have to be in a voice channel to see the queue!')
        .then((msg) => msg.delete({ timeout: 30000 }));
    }

    let string = '';

    if (player.queue.current) {
      string += `__**Currently Playing**__\n ▶️ ${player.queue.current.title} - **Requested by ${player.queue.current.requester.username}**. \n`;
    }

    if (player.queue[0]) {
      string += `__**Rest of queue:**__\n ${player.queue
        .slice(0, 10)
        .map(
          (x, index) =>
            `**${++index})** ${x.title} - **Requested by ${
              x.requester.username
            }**.`
        )
        .join('\n')}`;
    }

    const embed = new MessageEmbed()
      .setAuthor(
        `Current Queue for ${message.guild.name}`,
        message.guild.iconURL()
      )
      .setThumbnail(player.queue.current.thumbnail)
      .setDescription(string)
      .setTimestamp();

    return message.channel
      .send(embed)
      .then((msg) => msg.delete({ timeout: 30000 }));
  },
};
