module.exports = {
  config: {
    name: 'pause',
    description: 'Pauses the music.',
    usage: '_pause',
    category: 'music',
    aliases: ['pause'],
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

    player.pause(player.playing);
    return message.channel
      .send(`Player is now ${player.playing ? 'resumed' : 'paused'}.`)
      .then((msg) => msg.delete({ timeout: 15000 }));
  },
};
