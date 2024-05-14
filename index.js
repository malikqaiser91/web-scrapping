const express = require('express')
const cron = require('node-cron')
require('dotenv').config()

const app = express()

const {
  sendSMS,
  sendWhatsAppText,
  voiceCall,
  getContent,
  checkForText,
} = require('./util')

// */2 * * * * - 2 minutes
// * * * * * * - 1 second

app.use('/', async (req, res, next) => {
  return res.send('Hello World')
})

app.use('/testing', async (req, res, next) => {
  return res.status(200).json({
    message: 'Service running successfully',
  })
})

cron.schedule('* * * * * *', async () => {
  try {
    const result = await getContent()
    // const isAvailable = checkForText(result, process.env.APPOINTMENT_TEXT)
    // console.log('Is Available', isAvailable)
    if (result) {
      await sendSMS()
      await sendWhatsAppText()
      await voiceCall()
    }
  } catch (error) {
    console.error(`Error: ${error}`)
  }
})

module.exports = app
