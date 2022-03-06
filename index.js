const fs = require('node:fs');

const { Client, Collection, Intents } = require('discord.js');
const { BOT_TOKEN } = require('./config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.commands = new Collection();

/* Bot ready message */
client.on('ready', () => console.log(`${client.user.username} is ready!`));

/* Load commands */
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`[COMMAND] - ${file} loaded.`);
}

/* Track interactions */
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
    }
});

client.login(BOT_TOKEN);
