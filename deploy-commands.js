const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const TOKEN = 'MTM2NDQ5ODcyNDQ2MTQ3NzkzMA.GCDO7T.nvBeLHPzSFM6kem0sAN3zAVBbafSXuUsHEa1Jw';  // ใช้ Token ที่คุณให้
const CLIENT_ID = '1364498724461477930';  // ใช้ Client ID ของคุณ
const GUILD_ID = '480026073988595732';  // ใช้ Guild ID ของคุณ

const commands = [
  new SlashCommandBuilder().setName('verify').setDescription('เริ่มการยืนยันตัวตน'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('✅ เพิ่มคำสั่ง /verify แล้ว'))
  .catch(console.error);
