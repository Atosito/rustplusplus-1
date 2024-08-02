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

import { log, client, localeManager as lm } from '../../index';
import * as guildInstance from '../util/guild-instance';
import * as discordTools from '../discordTools/discord-tools';
import { discordCommandHandler } from '../handlers/discord-command-handler';
const Config = require('../../config');

export const name = 'messageCreate';

export async function execute(message: Message) {
    if (!message.guild) return;

    const guildId = message.guild.id;
    const instance = guildInstance.readGuildInstanceFile(guildId);
    const rustplus = client.rustplusInstances[guildId];

    if (message.author.bot || !rustplus || (rustplus && !rustplus.isOperational)) return;

    if (instance.blacklist['discordIds'].includes(message.author.id) &&
        Object.values(instance.channelIds).includes(message.channelId)) {
        const guild = await discordTools.getGuild(guildId);
        if (!guild) return;
        const channel = await discordTools.getTextChannel(guild.id, message.channelId);
        if (!channel) return;
        log.info(lm.getIntl(Config.general.language, `userPartOfBlacklistDiscord`, {
            guild: `${guild.name} (${guild.id})`,
            channel: `${channel.name} (${channel.id})`,
            user: `${message.author.username} (${message.author.id})`,
            message: message.cleanContent
        }));
        return;
    }

    if (message.channelId === instance.channelIds.commands) {
        await discordCommandHandler(rustplus, message);
    }
    else if (message.channelId === instance.channelIds.teamchat) {
        const guild = await discordTools.getGuild(guildId);
        if (!guild) return;
        const channel = await discordTools.getTextChannel(guild.id, message.channelId);
        if (!channel) return;
        log.info(lm.getIntl(Config.general.language, `logDiscordMessage`, {
            guild: `${guild.name} (${guild.id})`,
            channel: `${channel.name} (${channel.id})`,
            user: `${message.author.username} (${message.author.id})`,
            message: message.cleanContent
        }));
        await rustplus.sendInGameMessage(`${message.author.username}: ${message.cleanContent}`);
    }
}