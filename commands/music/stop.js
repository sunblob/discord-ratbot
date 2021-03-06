module.exports = {
  config: {
    name: 'stop',
    description: 'Stop all songs in the queue!',
    usage: '_stop',
    category: 'music',
    aliases: ['st'],
  },
  execute(bot, message, args) {
    const player = bot.manager.get(message.guild.id);

    if (!player)
      return message.channel.send('No songs currently playing in this guild.');

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel
        .send('You need to be in a voice channel to pause music.')
        .then((msg) => msg.delete({ timeout: 15000 }));

    try {
      player.disconnect();
      player.destroy();
    } catch (error) {
      message.channel
        .send(`Error!`)
        .then((msg) => msg.delete({ timeout: 15000 }));
    }

    message.channel
      .send(`The musisc was stopped!`)
      .then((msg) => msg.delete({ timeout: 15000 }));
  },
};
