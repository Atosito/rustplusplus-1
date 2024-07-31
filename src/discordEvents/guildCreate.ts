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

import { Guild } from 'discord.js';

import { client } from '../../index';
import * as guildInstance from '../util/guild-instance';

export const name = 'guildCreate';

export async function execute(guild: Guild) {
    guildInstance.createGuildInstanceFile(guild.id);
    const gi = guildInstance.readGuildInstanceFile(guild.id);
    client.setInstance(guild.id, gi); // TODO! TEMP

    client.fcmListenersLite[guild.id] = new Object();

    client.loadGuildIntl(guild.id);

    await client.setupGuild(guild);
}