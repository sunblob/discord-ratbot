const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'nowplaying',
    description: 'Get the song that is playing.',
    usage: '_nowplaying',
    category: 'music',
    aliases: ['np'],
  },
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player || !player.queue.current)
      return message.channel
        .send('No song/s currently playing within this guild.')
        .then((msg) => msg.delete({ timeout: 15000 }));
    const { title, author, thumbnail, uri } = player.queue.current;

    const embed = new MessageEmbed()
      .setAuthor('Current Song Playing.', message.author.displayAvatarURL)
      .setThumbnail(thumbnail)
      .setDescription(
        `
            ${player.playing ? '▶️' : '⏸️'} **${title}** - ${uri} by ${author}
            `
      )
      .setTimestamp();

    return message.channel
      .send(embed)
      .then((msg) => msg.delete({ timeout: 30000 }));
  },
};
