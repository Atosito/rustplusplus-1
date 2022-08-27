const Discord = require('discord.js');

const CommandHandler = require('../handlers/inGameCommandHandler.js');
const DiscordEmbeds = require('../discordTools/discordEmbeds.js');
const DiscordMessages = require('../discordTools/discordMessages.js');
const DiscordTools = require('../discordTools/discordTools.js');
const SmartSwitchGroupHandler = require('../handlers/smartSwitchGroupHandler.js');
const TeamChatHandler = require("../handlers/teamChatHandler.js");
const TeamHandler = require('../handlers/teamHandler.js');

module.exports = {
    name: 'message',
    async execute(rustplus, client, message) {
        /* rustplus.log('MESSAGE', 'MESSAGE RECEIVED'); */
        let instance = client.readInstanceFile(rustplus.guildId);
        if (!rustplus.ready) return;

        if (message.hasOwnProperty('response')) {

        }
        else if (message.hasOwnProperty('broadcast')) {
            if (message.broadcast.hasOwnProperty('teamChanged')) {
                TeamHandler.handler(rustplus, client, message.broadcast.teamChanged.teamInfo);
                rustplus.team.updateTeam(message.broadcast.teamChanged.teamInfo);
            }
            else if (message.broadcast.hasOwnProperty('teamMessage')) {
                /* Let command handler handle the potential command */
                message.broadcast.teamMessage.message.message =
                    message.broadcast.teamMessage.message.message.replace(
                        /^<color.+?<\/color>/g, '');

                let handled = await CommandHandler.inGameCommandHandler(rustplus, client, message);

                if (!handled) {
                    TeamChatHandler(rustplus, client, message.broadcast.teamMessage.message);
                }
            }
            else if (message.broadcast.hasOwnProperty('entityChanged')) {
                let entityId = message.broadcast.entityChanged.entityId;

                if (instance.switches.hasOwnProperty(entityId)) {
                    if (rustplus.currentSwitchTimeouts.hasOwnProperty(entityId)) {
                        clearTimeout(rustplus.currentSwitchTimeouts[entityId]);
                        delete rustplus.currentSwitchTimeouts[entityId];
                    }

                    if (rustplus.interactionSwitches.includes(`${entityId}`)) {
                        rustplus.interactionSwitches = rustplus.interactionSwitches.filter(e => e !== `${entityId}`);
                    }
                    else {
                        let active = message.broadcast.entityChanged.payload.value;
                        instance.switches[entityId].active = active;
                        client.writeInstanceFile(rustplus.guildId, instance);

                        DiscordMessages.sendSmartSwitchMessage(rustplus.guildId, entityId);
                        SmartSwitchGroupHandler.updateSwitchGroupIfContainSwitch(
                            client, rustplus.guildId, rustplus.serverId, entityId);
                    }
                }
                else if (instance.alarms.hasOwnProperty(entityId)) {
                    let active = message.broadcast.entityChanged.payload.value;
                    instance.alarms[entityId].active = active;
                    instance.alarms[entityId].reachable = true;
                    client.writeInstanceFile(rustplus.guildId, instance);

                    if (active) {
                        let title = instance.alarms[entityId].name;
                        let message = instance.alarms[entityId].message;

                        let content = {};
                        content.embeds = [DiscordEmbeds.getEmbed({
                            color: '#ce412b',
                            thumbnail: `attachment://${instance.alarms[entityId].image}`,
                            title: title,
                            footer: { text: instance.alarms[entityId].server },
                            timestamp: true,
                            fields: [
                                { name: 'ID', value: `\`${entityId}\``, inline: true },
                                { name: 'Message', value: `\`${message}\``, inline: true }]
                        })];

                        content.files = [
                            new Discord.AttachmentBuilder(
                                `src/resources/images/electrics/${instance.alarms[entityId].image}`)];

                        if (instance.alarms[entityId].everyone) {
                            content.content = '@everyone';
                        }

                        let channel = DiscordTools.getTextChannelById(rustplus.guildId, instance.channelId.activity);
                        if (channel) {
                            await client.messageSend(channel, content);
                        }

                        if (instance.generalSettings.smartAlarmNotifyInGame) {
                            rustplus.sendTeamMessageAsync(`${title}: ${message}`);
                        }
                    }

                    DiscordMessages.sendSmartAlarmMessage(rustplus.guildId, entityId);
                }
                else if (instance.storageMonitors.hasOwnProperty(entityId)) {
                    if (message.broadcast.entityChanged.payload.value === true) return;

                    if (!instance.storageMonitors[entityId].reachable &&
                        instance.storageMonitors[entityId].type === 'st') return;

                    if (instance.storageMonitors[entityId].type === 'toolcupboard' ||
                        message.broadcast.entityChanged.payload.capacity === 28) {
                        setTimeout(async () => {
                            let info = await rustplus.getEntityInfoAsync(entityId);
                            if (!(await rustplus.isResponseValid(info))) {
                                instance.storageMonitors[entityId].reachable = false;
                                client.writeInstanceFile(rustplus.guildId, instance);
                            }
                            else {
                                instance.storageMonitors[entityId].reachable = true;
                                client.writeInstanceFile(rustplus.guildId, instance);
                            }

                            if (instance.storageMonitors[entityId].reachable) {
                                rustplus.storageMonitors[entityId] = {
                                    items: info.entityInfo.payload.items,
                                    expiry: info.entityInfo.payload.protectionExpiry,
                                    capacity: info.entityInfo.payload.capacity,
                                    hasProtection: info.entityInfo.payload.hasProtection
                                }

                                let instance = client.readInstanceFile(rustplus.guildId);
                                instance.storageMonitors[entityId].type = 'toolcupboard';

                                if (info.entityInfo.payload.protectionExpiry === 0 &&
                                    instance.storageMonitors[entityId].decaying === false) {
                                    instance.storageMonitors[entityId].decaying = true;

                                    await DiscordMessages.sendDecayingNotification(rustplus.guildId, entityId);

                                    if (instance.storageMonitors[entityId].inGame) {
                                        rustplus.sendTeamMessageAsync(
                                            `${instance.storageMonitors[entityId].name} is decaying!`);
                                    }
                                }
                                else if (info.entityInfo.payload.protectionExpiry !== 0) {
                                    instance.storageMonitors[entityId].decaying = false;
                                }
                                client.writeInstanceFile(rustplus.guildId, instance);
                            }

                            await DiscordMessages.sendStorageMonitorMessage(rustplus.guildId, entityId);
                        }, 2000);
                    }
                    else {
                        rustplus.storageMonitors[entityId] = {
                            items: message.broadcast.entityChanged.payload.items,
                            expiry: message.broadcast.entityChanged.payload.protectionExpiry,
                            capacity: message.broadcast.entityChanged.payload.capacity,
                            hasProtection: message.broadcast.entityChanged.payload.hasProtection
                        }

                        let info = await rustplus.getEntityInfoAsync(entityId);
                        if (!(await rustplus.isResponseValid(info))) {
                            instance.storageMonitors[entityId].reachable = false;
                            client.writeInstanceFile(rustplus.guildId, instance);
                        }
                        else {
                            instance.storageMonitors[entityId].reachable = true;
                            client.writeInstanceFile(rustplus.guildId, instance);
                        }

                        await DiscordMessages.sendStorageMonitorMessage(rustplus.guildId, entityId);
                    }
                }
            }
        }
    },
};