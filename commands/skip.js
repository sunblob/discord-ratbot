module.exports = {
  name: 'skip',
  description: 'Skip a song!',
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel
        .send('You have to be in a voice channel to stop the music!')
        .then((msg) => msg.delete({ timeout: 30000 }));
    if (!serverQueue)
      return message.channel
        .send('There is no song that I could skip!')
        .then((msg) => msg.delete({ timeout: 30000 }));
    serverQueue.connection.dispatcher.end();
  },
};
