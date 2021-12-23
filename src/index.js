require("dotenv").config()
const { Client, Collection } = require('discord.js')
const client = new Client({intents: []})
client.commands = new Collection()
const fs = require('fs');

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`)
    client.commands.set(command.data.name, command)
})

client.once("ready", () =>{
    console.log(`Logged in as ${client.user.username}. Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);

    client.user.setActivity({name: "mit dem Code", type: "PLAYING"})
})

client.on("interactioncreate", async (interaction) =>{
    if(!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    
    if(command) {
        try{
            await command.execute(interaction)
        } catch(error) {
            console.error(error)

            if(interaction.deferred || interaction.replied) {
                interaction.editReply("Tut uns Leid! Es ist ein Fehler beim ausführen des Commands aufgetreten")
            }else {
                interaction.reply("Tut uns Leid! Es ist ein Fehler beim ausführen des Commands aufgetreten")
            }
        }
    }

})

client.login(process.env.token)