module.exports = {
  config: {
    name: 'nowplaying',
    description: 'Get the song that is playing.',
    usage: '_nowplaying',
    category: 'music',
    aliases: ['np'],
  },
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send('There is nothing playing.');
    return message.channel
      .send(`Now playing: **${serverQueue.songs[0].title}**`)
      .then((msg) => msg.delete({ timeout: 30000 }));
  },
};
