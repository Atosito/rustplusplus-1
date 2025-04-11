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

import { log, discordManager as dm } from '../../index';
import { RustPlusInstance, ConnectionStatus } from "../managers/rustPlusManager";
import { sendServerMessage } from '../discordUtils/discordMessages';

export const name = 'connected';

export async function execute(rustPlusInstance: RustPlusInstance) {
    const funcName = `[rustPlusEvent: ${name}]`;
    const logParam = {
        guildId: rustPlusInstance.guildId,
        serverId: rustPlusInstance.serverId,
        serverName: rustPlusInstance.serverName
    };

    log.info(`${funcName}`, logParam);

    clearTimeout(rustPlusInstance.reconnectTimeoutId);
    rustPlusInstance.reconnectTimeoutId = undefined;

    rustPlusInstance.connectionStatus = ConnectionStatus.Connected;
    await sendServerMessage(dm, rustPlusInstance.guildId, rustPlusInstance.serverId, ConnectionStatus.Connected);
}