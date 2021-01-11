const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    name: 'play',
    description: 'Plays a track from youtube/soundcloud!',
    usage: '_play <track_name>/<url>',
    category: 'music',
    aliases: ['p', 'pp'],
  },
  execute: async (bot, message, args) => {
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

    if (!args[0])
      return message.channel.send(
        'Please provide a song name or link to search.'
      );

    const search = args.join(' ');
    let res;

    try {
      // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
      res = await bot.manager.search(search, message.author);
      // Check the load type as this command is not that advanced for basics
      if (res.loadType === 'LOAD_FAILED') throw res.exception;
      else if (res.loadType === 'PLAYLIST_LOADED')
        throw { message: 'Playlists are not supported with this command.' };

      const player = bot.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
      });

      const tracks = res.tracks.slice(0, 5);
      const embed = new MessageEmbed()
        .setAuthor('Song Selection.', message.author.displayAvatarURL)
        .setDescription(
          tracks.map((video, index) => {
            return `**${++index} -** ${video.title} - ${video.uri}`;
          })
        )
        .setFooter(
          "Your response time closes within the next 30 seconds. Type 'cancel' to cancel the selection"
        );

      message.channel.send(embed).then((msg) => msg.delete({ timeout: 35000 }));

      const collector = message.channel.createMessageCollector(
        (m) => {
          return (
            m.author.id === message.author.id &&
            new RegExp(`^([1-5]|cancel)$`, 'i').test(m.content)
          );
        },
        { time: 30000, max: 1 }
      );

      collector.on('collect', (m) => {
        if (/cancel/i.test(m.content)) return collector.stop('cancelled');

        const track = tracks[Number(m.content) - 1];
        player.connect();
        player.queue.add(track);

        message
          .reply(`enqueuing ${track.title}.`)
          .then((msg) => msg.delete({ timeout: 15000 }));

        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
      });

      collector.on('end', (_, reason) => {
        if (['time', 'cancelled'].includes(reason))
          return message.channel
            .send('Cancelled selection.')
            .then((msg) => msg.delete({ timeout: 15000 }));
      });
    } catch (err) {
      return message
        .reply(`there was an error while searching: ${err.message}`)
        .then((msg) => msg.delete({ timeout: 15000 }));
    }

    // Create the player

    // Connect to the voice channel and add the track to the queue
    // player.connect();
    // player.queue.add(res.tracks[0]);

    // Checks if the client should play the track if it's the first one added
    // if (!player.playing && !player.paused && !player.queue.size) player.play();
  },
};
