const ytdl = require('ytdl-core-discord');
// const ytdl = require('ytdl-core');

module.exports = {
  // args: true,

  config: {
    name: 'play',
    description: 'plays youtube music',
    usage: '_play',
    category: 'music',
    aliases: ['p', 'pplay'],
  },
  async execute(message, args) {
    const queue = message.client.queue;
    const serverQueue = message.client.queue.get(message.guild.id);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel
        .send('You need to be in a voice channel to play music!')
        .then((msg) => msg.delete({ timeout: 30000 }));

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.channel
        .send('I need the permissions to join and speak in your voice channel!')
        .then((msg) => msg.delete({ timeout: 30000 }));
    }

    const songInfo = await ytdl.getInfo(args[0]);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    // console.log(serverQueue);

    if (!serverQueue) {
      const queueContract = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };

      queue.set(message.guild.id, queueContract);

      queueContract.songs.push(song);
      try {
        // console.log(queueContract);
        const connection = await voiceChannel.join();
        queueContract.connection = connection;
        await this.play(message, queueContract.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err.message);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel
        .send(`**${song.title}** has been added to the queue!`)
        .then((msg) => msg.delete({ timeout: 30000 }));
    }
  },
  async play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(await ytdl(song.url), { type: 'opus' })
      .on('finish', () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on('error', (error) => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    serverQueue.textChannel
      .send(`Start playing: **${song.title}**`)
      .then((msg) => msg.delete({ timeout: 30000 }));
  },
};
