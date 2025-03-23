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

import { RateLimitData } from '@discordjs/rest';

import { log } from '../../index';
import { DiscordManager } from '../managers/discordManager';

export const name = 'rateLimited';
export const once = false;

export async function execute(dm: DiscordManager, rateLimitInfo: RateLimitData) {
    const funcName = `[discordEvent: ${name}]`;
    log.warn(
        `${funcName} ` +
        `global: ${rateLimitInfo.global} ` +
        `hash: ${rateLimitInfo.hash} ` +
        `limit: ${rateLimitInfo.limit} ` +
        `majorParameter: ${rateLimitInfo.majorParameter} ` +
        `method: ${rateLimitInfo.method} ` +
        `retryAfter: ${rateLimitInfo.retryAfter} ` +
        `route: ${rateLimitInfo.route} ` +
        `scope: ${rateLimitInfo.scope} ` +
        `sublimitTimeout: ${rateLimitInfo.sublimitTimeout} ` +
        `timeToReset: ${rateLimitInfo.timeToReset} ` +
        `url: ${rateLimitInfo.url}`
    );
}