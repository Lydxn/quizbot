const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Tests the latency'),
    async execute(client, interaction) {
        const embed = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`Ping in **${client.ws.ping}ms**.`);
        await interaction.reply({ embeds: [embed] });
    }
};
