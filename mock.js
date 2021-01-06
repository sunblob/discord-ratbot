const { google } = require('googleapis')
const ytdl = require('ytdl-core')
// Initialise Google API
const youtube = google.youtube({
    version: 'v3',
    auth: MyAuth,
})
musicQueue = [] // Queue for playing music
dispatcher = null // Transmits voice packets from stream

module.exports = {
    name: 'play',

    async execute(msg, args) {
        // msg is a Discord Message
        // Play music and music queued after
        async function playAndQueue(stream) {
            // Join voice channel
            voiceChannel = client.channels.cache.find(
                (channel) =>
                    channel.type === 'voice' && channel.name === 'music-channel'
            )
            voiceConnection = voiceChannel.join()

            dispatcher = await voiceConnection.play(stream, { volume: 0.3 }) // Decrease volume to prevent clipping

            // When music stops
            dispatcher.on('finish', async (reason) => {
                if (musicQueue[0]) {
                    // Still have music queued
                    const nextVideoLink = musicQueue[0] // Next video to play
                    const stream = ytdl(nextVideoLink, { filter: 'audioonly' })

                    playAndQueue(stream)
                    dispatcherInfo = await ytdl.getInfo(nextVideoLink)
                    musicQueue.shift()
                } else {
                    // No music to play
                    dispatcher = null
                    dispatcherInfo = null
                }
            })

            dispatcher.on('error', console.log)
            dispatcher.on('debug', console.log)
        }

        // Search Youtube using args
        const youtubeSearchResult = await youtube.search.list({
            part: 'snippet',
            type: 'video', // We do not want channels or playlists
            q: args.join(' '),
            maxResults: 1, // We only need first search result
        })
        const youtubeVideo = youtubeSearchResult.data.items[0]
        if (!youtubeVideo) {
            msg.channel.send('Error: Could not find any music matching search.')
            return
        }

        const videoLink = `https://www.youtube.com/watch?v=${youtubeVideo.id.videoId}` // Link to video

        const stream = ytdl(videoLink, { filter: 'audioonly' })
        const videoInfo = await ytdl.getInfo(videoLink)

        if (dispatcher) {
            // Currently playing music
            musicQueue.push(videoLink)
            msg.channel.send(
                `**${videoInfo.title}** has been added into the queue!`
            )
        } else {
            playAndQueue(stream)
            dispatcherInfo = videoInfo
            msg.channel.send(`Currently playing **${videoInfo.title}**!`)
        }
    },
}
