/*
    Copyright (C) 2025 Alexander Emanuelsson (alexemanuelol)

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

import * as discordjs from 'discord.js';

import { guildInstanceManager as gim, log } from '../../index';
import { DiscordManager } from '../managers/discordManager';
import { GuildInstance } from '../managers/guildInstanceManager';

export const name = 'messageCreate';
export const once = false;

export async function execute(dm: DiscordManager, message: discordjs.Message) {
    const funcName = `[discordEvent: ${name}]`;

    /* Ignore messages from bots. */
    if (message.author.bot) return;

    if (message.guild) {
        /* Message in a guild. */
        await handleGuildMessage(dm, message);
    }
    else {
        /* Direct message. */
        await handleDirectMessage(dm, message);
    }
}

async function handleGuildMessage(dm: DiscordManager, message: discordjs.Message) {
    // TODO!
    // Check what guild the message is created in
    // Check if the author of the message is part of blacklist
    // Is the channel commands? Then call the command
    // I sthe channel teamchat? Then forward it to teamchat ingame
}

async function handleDirectMessage(dm: DiscordManager, message: discordjs.Message) {
    /* TBD */
}