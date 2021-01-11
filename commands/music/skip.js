module.exports = {
  config: {
    name: 'skip',
    description: 'Skip a song!',
    usage: '_skip',
    category: 'music',
    aliases: ['sk'],
  },
  execute(bot, message, args) {
    // const serverQueue = message.client.queue.get(message.guild.id);
    // if (!message.member.voice.channel)
    //   return message.channel
    //     .send('You have to be in a voice channel to stop the music!')
    //     .then((msg) => msg.delete({ timeout: 30000 }));
    // if (!serverQueue)
    //   return message.channel
    //     .send('There is no song that I could skip!')
    //     .then((msg) => msg.delete({ timeout: 30000 }));
    // serverQueue.connection.dispatcher.end();

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
