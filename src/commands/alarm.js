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

	https://github.com/alexemanuelol/rustplusplus

*/

const Builder = require('@discordjs/builders');

import { log } from '../../index';
import * as discordEmbeds from '../discordTools/discord-embeds';
import * as discordTools from '../discordTools/discord-tools';
import * as discordMessages from '../discordTools/discord-messages';

module.exports = {
	name: 'alarm',

	getData(client, guildId) {
		return new Builder.SlashCommandBuilder()
			.setName('alarm')
			.setDescription(client.intlGet(guildId, 'commandsAlarmDesc'))
			.addSubcommand(subcommand => subcommand
				.setName('edit')
				.setDescription(client.intlGet(guildId, 'commandsAlarmEditDesc'))
				.addStringOption(option => option
					.setName('id')
					.setDescription(client.intlGet(guildId, 'commandsAlarmEditIdDesc'))
					.setRequired(true))
				.addStringOption(option => option
					.setName('image')
					.setDescription(client.intlGet(guildId, 'commandsAlarmEditImageDesc'))
					.setRequired(true)
					.addChoices(
						{ name: client.intlGet(guildId, 'autoturret'), value: 'autoturret' },
						{ name: client.intlGet(guildId, 'boomBox'), value: 'boombox' },
						{ name: client.intlGet(guildId, 'broadcaster'), value: 'broadcaster' },
						{ name: client.intlGet(guildId, 'ceilingLight'), value: 'ceiling_light' },
						{ name: client.intlGet(guildId, 'discoFloor'), value: 'discofloor' },
						{ name: client.intlGet(guildId, 'doorController'), value: 'door_controller' },
						{ name: client.intlGet(guildId, 'elevator'), value: 'elevator' },
						{ name: client.intlGet(guildId, 'hbhfSensor'), value: 'hbhf_sensor' },
						{ name: client.intlGet(guildId, 'heater'), value: 'heater' },
						{ name: client.intlGet(guildId, 'samsite'), value: 'samsite' },
						{ name: client.intlGet(guildId, 'sirenLight'), value: 'siren_light' },
						{ name: client.intlGet(guildId, 'smartAlarm'), value: 'smart_alarm' },
						{ name: client.intlGet(guildId, 'smartSwitch'), value: 'smart_switch' },
						{ name: client.intlGet(guildId, 'sprinkler'), value: 'sprinkler' },
						{ name: client.intlGet(guildId, 'storageMonitor'), value: 'storage_monitor' },
						{ name: client.intlGet(guildId, 'christmasLights'), value: 'xmas_light' })));
	},

	async execute(client, interaction) {
		const guildId = interaction.guildId;
		const instance = client.getInstance(guildId);

		const verifyId = Math.floor(100000 + Math.random() * 900000);
		await client.logInteraction(interaction, verifyId, 'slashCommand');

		if (!await client.validatePermissions(interaction)) return;
		await interaction.deferReply({ ephemeral: true });

		switch (interaction.options.getSubcommand()) {
			case 'edit': {
				const entityId = interaction.options.getString('id');
				const image = interaction.options.getString('image');

				const device = client.getSmartDevice(guildId, entityId);
				if (device === null) {
					const str = client.intlGet(guildId, 'invalidId', { id: entityId });
					await discordTools.interactionEditReply(interaction, discordEmbeds.getActionInfoEmbed(1, str));
					log.warn(str);
					return;
				}

				const entity = instance.serverList[device.serverId].alarms[entityId];

				if (image !== null) instance.serverList[device.serverId].alarms[entityId].image = `${image}.png`;
				client.setInstance(guildId, instance);

				log.info(client.intlGet(null, 'slashCommandValueChange', {
					id: `${verifyId}`,
					value: `edit, ${entityId}, ${image}.png`
				}));

				await discordMessages.sendSmartAlarmMessage(guildId, device.serverId, entityId);

				const str = client.intlGet(guildId, 'smartAlarmEditSuccess', { name: entity.name });
				await discordTools.interactionEditReply(interaction, discordEmbeds.getActionInfoEmbed(0, str,
					instance.serverList[device.serverId].title));
				log.info(str);
			} break;

			default: {
			} break;
		}
	},
};
