const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

const TOKEN = 'MTM2NDQ5ODcyNDQ2MTQ3NzkzMA.GCDO7T.nvBeLHPzSFM6kem0sAN3zAVBbafSXuUsHEa1Jw';
const CLIENT_ID = '1364498724461477930';
const GUILD_ID = '480026073988595732';

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot พร้อมแล้ว!`);

  const guild = await client.guilds.fetch(GUILD_ID);
  await guild.channels.fetch();
  await guild.roles.fetch();

  // 🔧 สร้าง role Member ถ้ายังไม่มี
  let memberRole = guild.roles.cache.find(r => r.name === 'Member');
  if (!memberRole) {
    memberRole = await guild.roles.create({
      name: 'Member',
      color: 'Blue',
      reason: 'สำหรับสมาชิกทั่วไป',
      permissions: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
      ],
    });
    console.log('✅ สร้าง role Member แล้ว');
  }

  // 🔧 สร้างช่อง verify-complete ถ้ายังไม่มี
  let completeChannel = guild.channels.cache.find(ch => ch.name === 'verify-complete');
  if (!completeChannel) {
    completeChannel = await guild.channels.create({
      name: 'verify-complete',
      type: ChannelType.GuildText,
      reason: 'ห้องแสดงการยืนยันสำเร็จ',
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['ViewChannel'],
        },
        {
          id: client.user.id,
          allow: ['SendMessages', 'ViewChannel'],
        },
      ],
    });
    console.log('✅ สร้างห้อง verify-complete แล้ว');
  }

  // 🔧 สร้างช่อง verify ถ้ายังไม่มี
  let verifyChannel = guild.channels.cache.find(ch => ch.name === 'verify');
  if (!verifyChannel) {
    verifyChannel = await guild.channels.create({
      name: 'verify',
      type: ChannelType.GuildText,
      reason: 'ห้องสำหรับยืนยันตัวตน',
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['ViewChannel'],
          deny: ['SendMessages'],
        },
        {
          id: client.user.id,
          allow: ['SendMessages', 'ViewChannel'],
        },
      ],
    });

    const button = new ButtonBuilder()
      .setCustomId('verify_button')
      .setLabel('ยืนยันตัวตน')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await verifyChannel.send({
      content: `👋 กรุณากดปุ่มด้านล่างเพื่อเริ่มยืนยันตัวตน`,
      components: [row],
    });

    console.log('✅ สร้างห้อง verify แล้ว');
  } else {
    console.log('✅ พบห้อง verify อยู่แล้ว');
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
    if (interaction.customId === 'verify_button') {
      const modal = new ModalBuilder()
        .setCustomId('verify_modal')
        .setTitle('กรุณากรอกชื่อของคุณ');

      const nameInput = new TextInputBuilder()
        .setCustomId('display_name')
        .setLabel('ชื่อที่จะใช้แสดงในเซิร์ฟเวอร์')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(nameInput);
      modal.addComponents(row);
      await interaction.showModal(modal);
    }
  }

  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === 'verify_modal') {
      const name = interaction.fields.getTextInputValue('display_name');

      // ตั้งชื่อเล่น
      await interaction.member.setNickname(name).catch(console.error);

      // เพิ่ม role Member
      const role = interaction.guild.roles.cache.find(r => r.name === 'Member');
      if (role) {
        await interaction.member.roles.add(role).catch(console.error);
      }

      // ส่ง embed ไปห้อง verify-complete
      const completeChannel = interaction.guild.channels.cache.find(ch => ch.name === 'verify-complete');
      if (completeChannel && completeChannel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setColor(0x00FF99)
          .setTitle(`🎉 ยินดีต้อนรับนักผจญภัย ${name}!`)
          .setThumbnail(interaction.user.displayAvatarURL({ size: 128 }))
          .addFields(
            { name: 'Discord ID', value: interaction.user.id, inline: true },
          )
          .setFooter({ text: `ขอให้สนุกกับการผจญภัยในเซิร์ฟเวอร์!` });

        await completeChannel.send({ embeds: [embed] });
      }

      await interaction.reply({
        content: `✅ ยืนยันเรียบร้อย! ไปที่ห้อง <#${completeChannel.id}> เพื่อดูประกาศของคุณ`,
        ephemeral: true,
      });
    }
  }
});

client.login(TOKEN);
