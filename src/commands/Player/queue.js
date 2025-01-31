const { SlashCommandBuilder, ButtonBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("queue").setDescription("Shows all tracks currently in the server queue."),
    async execute(interaction) {
        const queue = global.player.getQueue(interaction.guild.id);

        const embed = new EmbedBuilder();
        embed.setColor(global.config.embedColour);

        if (!queue) {
            embed.setDescription("There isn't currently any music playing.");
            return await interaction.reply({ embeds: [embed] });
        }

        if (!queue.tracks[0]) {
            embed.setDescription("There aren't any other tracks in the queue. Use **/nowplaying** to show information about the current track.");
            return await interaction.reply({ embeds: [embed] });
        }

        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setAuthor({ name: `Server Queue - ${interaction.guild.name}` });

        const tracks = queue.tracks.map((track, i) => `\`${i + 1}\` [${track.title}](${track.url}) by **${track.author}** (Requested by <@${track.requestedBy.id}>)`);
        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** other ${songs - 5 > 1 ? "tracks" : "track"} currently in queue.` : "";
        const progress = queue.createProgressBar();

        embed.setDescription(`**Current Track:** [${queue.current.title}](${queue.current.url}) by **${queue.current.author}**\n${progress}\n\n${tracks.slice(0, 5).join("\n")}\n\n${nextSongs}`);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`melody_back_song-${interaction.user.id}`)
                .setEmoji(global.config.backEmoji.length <= 3 ? { name: global.config.backEmoji.trim() } : { id: global.config.backEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_pause_song-${interaction.user.id}`)
                .setEmoji(global.config.pauseEmoji.length <= 3 ? { name: global.config.pauseEmoji.trim() } : { id: global.config.pauseEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_skip_song-${interaction.user.id}`)
                .setEmoji(global.config.pauseEmoji.length <= 3 ? { name: global.config.skipEmoji.trim() } : { id: global.config.skipEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_stop-${interaction.user.id}`)
                .setEmoji(global.config.stopEmoji.length <= 3 ? { name: global.config.stopEmoji.trim() } : { id: global.config.stopEmoji.trim() })
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`melody_song_lyrics-${interaction.user.id}`)
                .setEmoji(global.config.lyricsEmoji.length <= 3 ? { name: global.config.lyricsEmoji.trim() } : { id: global.config.lyricsEmoji.trim() })
                .setStyle(ButtonStyle.Secondary)
        );

        return await interaction.reply({ embeds: [embed], components: [row] });
    },
};
