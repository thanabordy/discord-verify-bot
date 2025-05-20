const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const TOKEN = '[YOU TOKEN on Discord dev]'; // ใช้ Token ที่คุณให้
const CLIENT_ID = '[YOU CLIENT ID on Discord dev]'; // ใช้ Client ID ของคุณ
const GUILD_ID = '[YOU Discord ID]'; // ใช้ Guild ID ของคุณ

const commands = [
  new SlashCommandBuilder().setName('verify').setDescription('เริ่มการยืนยันตัวตน'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
  .then(() => console.log('✅ เพิ่มคำสั่ง /verify แล้ว'))
  .catch(console.error);
