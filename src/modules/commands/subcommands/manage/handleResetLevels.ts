import { GuildMember } from "discord.js";
import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const handleResetLevels: CommandHandler = async (Becca, interaction) => {
  try {
    const { guild, member } = interaction;

    if (!guild || !member) {
      await interaction.editReply({ content: Becca.responses.missing_guild });
      return;
    }

    if (
      !(member as GuildMember).permissions.has("MANAGE_GUILD") &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({ content: Becca.responses.no_permission });
      return;
    }

    const currentLevels = await LevelModel.findOne({ serverID: guild.id });

    if (!currentLevels) {
      await interaction.editReply({
        content: "I cannot find any level data for this server.",
      });
      return;
    }

    await currentLevels.delete();
    await interaction.editReply({
      content: "I have burned all records of your guild's activities.",
    });
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset level command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "reset level", errorId)],
        ephemeral: true,
      })
      .catch(async () =>
        interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "reset level", errorId)],
        })
      );
  }
};