require('dotenv').config()
require('module-alias/register')

require('@ShiaHelpers/extenders/Message')
require('@ShiaHelpers/extenders/Guild')
require('@ShiaHelpers/extenders/GuildChannel')

const { checkForUpdates } = require('@ShiaHelpers/BotUtils')
const { initializeMongoose } = require('@ShiaSRC/database/mongoose')
const { BotClient } = require('@ShiaSRC/structures')
const { validateConfiguration } = require('@ShiaHelpers/Validator')

validateConfiguration()

let client

async function initializeBot() {
  try {
    client = new BotClient()

    await checkForUpdates()

    await initializeMongoose()

    await client.loadCommands('./src/commands')
    client.loadContexts('./src/contexts')
    client.loadEvents('./src/events')

    await client.login(process.env.BOT_TOKEN)
    return client
  } catch (error) {
    if (client) {
      client.logger.error('Failed to initialize bot:', error)
    } else {
      console.error('Failed to initialize bot:', error)
    }
    process.exit(1)
  }
}

process.on('unhandledRejection', err => {
  if (client) {
    client.logger.error('Unhandled Rejection:', err)
  } else {
    console.error('Unhandled Rejection:', err)
  }
})

process.on('uncaughtException', err => {
  if (client) {
    client.logger.error('Uncaught Exception:', err)
  } else {
    console.error('Uncaught Exception:', err)
  }
})

initializeBot().catch(error => {
  console.error('Failed to start bot:', error)
  process.exit(1)
})

// this is the entry point for my Discord bot 
// the main source code is private
// but im posting this here for easy access in case i need it later
// i tend to rewrite this part often, so it might be a little buggy during the process