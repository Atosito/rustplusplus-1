/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

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

    https://github.com/alexemanuelol/rustPlusPlus

*/

const Fs = require('fs');
const Path = require('path');

const InstanceUtils = require('../util/instanceUtils.js');

module.exports = (client, guild) => {
    let instance = null;
    if (!Fs.existsSync(Path.join(__dirname, '..', '..', 'instances', `${guild.id}.json`))) {
        instance = {
            firstTime: true,
            role: null,
            generalSettings: client.readGeneralSettingsTemplate(),
            notificationSettings: client.readNotificationSettingsTemplate(),
            channelId: {
                category: null,
                information: null,
                servers: null,
                settings: null,
                commands: null,
                events: null,
                teamchat: null,
                switches: null,
                alarms: null,
                storageMonitors: null,
                activity: null,
                trackers: null
            },
            informationMessageId: {
                map: null,
                server: null,
                event: null,
                team: null
            },
            serverList: {},
            serverListLite: {},
            trackers: {},
            marketSubscribeItemIds: []
        };
    }
    else {
        instance = InstanceUtils.readInstanceFile(guild.id);

        if (!instance.hasOwnProperty('firstTime')) {
            instance.firstTime = true;
        }

        if (!instance.hasOwnProperty('role')) {
            instance.role = null;
        }

        if (!instance.hasOwnProperty('generalSettings')) {
            instance.generalSettings = client.readGeneralSettingsTemplate();
        }
        else {
            const generalSettings = client.readGeneralSettingsTemplate();

            for (const [key, value] of Object.entries(generalSettings)) {
                if (!instance.generalSettings.hasOwnProperty(key)) {
                    instance.generalSettings[key] = value;
                }
            }
        }

        if (!instance.hasOwnProperty('notificationSettings')) {
            instance.notificationSettings = client.readNotificationSettingsTemplate();
        }
        else {
            const notificationSettings = client.readNotificationSettingsTemplate();

            for (const [key, value] of Object.entries(notificationSettings)) {
                if (!instance.notificationSettings.hasOwnProperty(key)) {
                    instance.notificationSettings[key] = value;
                }
            }
        }

        if (!instance.hasOwnProperty('channelId')) {
            instance.channelId = {
                category: null,
                information: null,
                servers: null,
                settings: null,
                commands: null,
                events: null,
                teamchat: null,
                switches: null,
                alarms: null,
                storageMonitors: null,
                activity: null,
                trackers: null
            }
        }
        else {
            if (!instance.channelId.hasOwnProperty('category')) instance.channelId.category = null;
            if (!instance.channelId.hasOwnProperty('information')) instance.channelId.information = null;
            if (!instance.channelId.hasOwnProperty('servers')) instance.channelId.servers = null;
            if (!instance.channelId.hasOwnProperty('settings')) instance.channelId.settings = null;
            if (!instance.channelId.hasOwnProperty('commands')) instance.channelId.commands = null;
            if (!instance.channelId.hasOwnProperty('events')) instance.channelId.events = null;
            if (!instance.channelId.hasOwnProperty('teamchat')) instance.channelId.teamchat = null;
            if (!instance.channelId.hasOwnProperty('switches')) instance.channelId.switches = null;
            if (!instance.channelId.hasOwnProperty('alarms')) instance.channelId.alarms = null;
            if (!instance.channelId.hasOwnProperty('storageMonitors')) instance.channelId.storageMonitors = null;
            if (!instance.channelId.hasOwnProperty('activity')) instance.channelId.activity = null;
            if (!instance.channelId.hasOwnProperty('trackers')) instance.channelId.trackers = null;
        }

        if (!instance.hasOwnProperty('informationMessageId')) {
            instance.informationMessageId = {
                map: null,
                server: null,
                event: null,
                team: null
            }
        }
        else {
            if (!instance.informationMessageId.hasOwnProperty('map')) instance.informationMessageId.map = null;
            if (!instance.informationMessageId.hasOwnProperty('server')) instance.informationMessageId.server = null;
            if (!instance.informationMessageId.hasOwnProperty('event')) instance.informationMessageId.event = null;
            if (!instance.informationMessageId.hasOwnProperty('team')) instance.informationMessageId.team = null;
        }

        if (!instance.hasOwnProperty('serverList')) instance.serverList = {};
        if (!instance.hasOwnProperty('serverListLite')) instance.serverListLite = {};
        if (!instance.hasOwnProperty('trackers')) instance.trackers = {};
        if (!instance.hasOwnProperty('marketSubscribeItemIds')) instance.marketSubscribeItemIds = [];

        for (const serverId of Object.keys(instance.serverList)) {
            if (!Object.keys(instance.serverListLite).includes(serverId)) {
                instance.serverListLite[serverId] = new Object();
            }

            instance.serverListLite[serverId][instance.serverList[serverId].steamId] = {
                serverIp: instance.serverList[serverId].serverIp,
                appPort: instance.serverList[serverId].appPort,
                steamId: instance.serverList[serverId].steamId,
                playerToken: instance.serverList[serverId].playerToken
            };
        }
    }

    client.setInstance(guild.id, instance);
};
