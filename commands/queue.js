module.exports = {
  name: 'queue',
  description: 'Show all songs in the queue!',
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel
        .send('You have to be in a voice channel to see the queue!')
        .then((msg) => msg.delete({ timeout: 30000 }));

    if (!serverQueue)
      return message.channel
        .send('There is no queue that I could show!')
        .then((msg) => msg.delete({ timeout: 30000 }));

    return message.channel
      .send(`${serverQueue.songs}`)
      .then((msg) => msg.delete({ timeout: 30000 }));
  },
};
