import { MessageEmbed } from "discord.js";

import { ServerModelInt } from "../../../database/models/ServerModel";
import { BeccaInt } from "../../../interfaces/BeccaInt";
import { ArraySettingsType } from "../../../interfaces/settings/ArraySettingsType";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

import { renderSetting } from "./renderSetting";

/**
 * Parses a settings array into a paginated embed, with array values
 * stored in the description separated by new lines.
 *
 * @param {BeccaInt} Becca Becca's Discord instance.
 * @param {ServerModelInt} config The server's settings from the database.
 * @param {ArraySettingsType} setting The setting to be parsed.
 * @param {number} page The page number for the current embed.
 * @returns {MessageEmbed | null} The parsed embed, or null on error.
 */
export const viewSettingsArray = (
  Becca: BeccaInt,
  config: ServerModelInt,
  setting: ArraySettingsType,
  page: number
): MessageEmbed | null => {
  try {
    const data = config[setting];

    const settingEmbed = new MessageEmbed();
    settingEmbed.setTitle(`Config Data for ${setting}`);
    settingEmbed.setTimestamp();
    settingEmbed.setColor(Becca.colours.default);

    if (!data || !data.length) {
      settingEmbed.setDescription("No data found.");
      settingEmbed.setFooter("Page 1 of 1");
      return settingEmbed;
    }

    const pages = Math.ceil(data.length / 10);
    const paginatedData = data
      .slice(page * 10 - 10, page * 10)
      .map((el) => renderSetting(Becca, setting, el));

    settingEmbed.setDescription(paginatedData.join("\n"));
    settingEmbed.setFooter(`Page ${page} of ${pages}`);
    return settingEmbed;
  } catch (err) {
    beccaErrorHandler(Becca, "view settings array module", err);
    return null;
  }
};
