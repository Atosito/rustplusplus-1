/*
    Copyright (C) 2024 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

import { Message } from 'discord.js';

import { log } from '../../index';
import * as discordTools from '../discordTools/discord-tools';
const { DiscordBot } = require('../structures/DiscordBot.js');
const DiscordCommandHandler = require('../handlers/discordCommandHandler.js');

export const name = 'messageCreate';

export async function execute(client: typeof DiscordBot, message: Message) {
    if (!message.guild) return;

    const guildId = message.guild.id;
    const instance = client.getInstance(guildId);
    const rustplus = client.rustplusInstances[guildId];

    if (message.author.bot || !rustplus || (rustplus && !rustplus.isOperational)) return;

    if (instance.blacklist['discordIds'].includes(message.author.id) &&
        Object.values(instance.channelIds).includes(message.channelId)) {
        const guild = await discordTools.getGuild(client, guildId);
        if (!guild) return;
        const channel = await discordTools.getTextChannel(client, guild.id, message.channelId);
        if (!channel) return;
        log.info(client.intlGet(null, `userPartOfBlacklistDiscord`, {
            guild: `${guild.name} (${guild.id})`,
            channel: `${channel.name} (${channel.id})`,
            user: `${message.author.username} (${message.author.id})`,
            message: message.cleanContent
        }));
        return;
    }

    if (message.channelId === instance.channelIds.commands) {
        await DiscordCommandHandler.discordCommandHandler(rustplus, client, message);
    }
    else if (message.channelId === instance.channelIds.teamchat) {
        const guild = await discordTools.getGuild(client, guildId);
        if (!guild) return;
        const channel = await discordTools.getTextChannel(client, guild.id, message.channelId);
        if (!channel) return;
        log.info(client.intlGet(null, `logDiscordMessage`, {
            guild: `${guild.name} (${guild.id})`,
            channel: `${channel.name} (${channel.id})`,
            user: `${message.author.username} (${message.author.id})`,
            message: message.cleanContent
        }));
        await rustplus.sendInGameMessage(`${message.author.username}: ${message.cleanContent}`);
    }
}