const fs = require('fs');

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Plays a quiz'),
    async execute(client, interaction) {
        const json = JSON.parse(fs.readFileSync('quiz.json'));
        const quizNum = 2; // Math.floor(Math.random() * 2);
        const { answer, choices, code, difficulty, statement,
                title } = json['questions'][quizNum];

        const colors = ['🟥', '🟨', '🟩', '🟦'];

        const embed = new MessageEmbed()
            .setColor('#FFAA00')
            .setTitle(`[Q${quizNum + 1}] - ${title}`)
            .setDescription([
                codeBlock('py', code),
                statement,
                codeBlock('ansi',
                    colors.map((c, i) => `${c} - [1;37m${choices[i]}[0m`)
                        .join('\n')
                )
            ].join('\n'))
            .setFooter({ text: `Difficulty: ${difficulty}` });

        const message = await interaction.reply(
            { embeds: [embed], fetchReply: true });
        message.react(colors[0])
            .then(() => message.react(colors[1]))
            .then(() => message.react(colors[2]))
            .then(() => message.react(colors[3]));

        const filter = (reaction, user) =>
            colors.includes(reaction.emoji.name) &&
            user.id === interaction.user.id;
        message.awaitReactions({ filter, max: 1, time: 10000, errors: ['time'] })
            .then((collected) => {
                const reaction = collected.first();
                // remove user's reaction immediately after
                message.reactions.cache
                    .find(r => r.emoji.name == reaction.emoji.name)
                    .users.remove(user.id);

                if (colors.indexOf(reaction.emoji.name) == answer)
                    message.reply('**Correct!**');
                else
                    message.reply(`**Incorrect!**`);
            })
            .catch((collected) => {
                message.reply(`WTF why didn't you pick anything?`);
            });
    }
};
