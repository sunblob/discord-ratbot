module.exports = {
  config: {
    name: 'skip',
    description: 'Skip a song!',
    usage: '_skip',
    category: 'music',
    aliases: ['sk'],
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

    player.stop();
    return message.channel.send('Skipped the current song!');
  },
};
