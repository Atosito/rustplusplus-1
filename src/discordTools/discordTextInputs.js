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

const Discord = require('discord.js');

module.exports = {
    getTextInput: function (options = {}) {
        const textInput = new Discord.TextInputBuilder();

        if (options.customId) textInput.setCustomId(options.customId);
        if (options.label) textInput.setLabel(options.label);
        if (options.value) textInput.setValue(options.value);
        if (options.style) textInput.setStyle(options.style);
        if (options.placeholder) textInput.setPlaceholder(options.placeholder);
        if (options.required) textInput.setRequired(options.required);

        return textInput;
    },
}