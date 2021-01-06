// const ytdl = require('ytdl-core-discord')
const ytdl = require('ytdl-core')

let musicQueue = [] // Queue for playing music
let dispatcher = null // Transmits voice packets from stream

module.exports = {
    name: 'play',
    args: true,
    description: 'plays youtube music',
    async execute(message, args) {
        if (!message.guild) return

        async function playAndQueue(stream) {
            // Join voice channel
            const connection = await message.member.voice.channel.join()
            dispatcher = await connection.play(stream, { volume: 0.3 }) // Decrease volume to prevent clipping

            // When music stops
            dispatcher.on('finish', async (reason) => {
                if (musicQueue[0]) {
                    // Still have music queued
                    const nextVideoLink = musicQueue[0] // Next video to play
                    const stream = ytdl(nextVideoLink, {
                        quality: 'highestaudio',
                    })

                    playAndQueue(stream)
                    info = await ytdl.getInfo(nextVideoLink)
                    message.channel.send(`Currently playing **${info.title}**!`)
                    musicQueue.shift()
                } else {
                    // No music to play
                    connection.disconnect()
                    dispatcher = null
                }
            })
        }

        if (message.member.voice.channel) {
            const stream = ytdl(args[0], {
                quality: 'highestaudio',
            })
            const musicInfo = await ytdl.getInfo(args[0])

            if (dispatcher) {
                // Currently playing music
                musicQueue.push(args[0])
                message.channel.send(
                    `**${musicInfo.title}** has been added into the queue!`
                )
            } else {
                playAndQueue(stream)
                message.channel.send(
                    `Currently playing **${musicInfo.title}**!`
                )
            }
        } else {
            message.reply('You need to join a voice channel first!')
        }

        // dispatcher.on('error', console.log)
        // dispatcher.on('debug', console.log)
    },
}
