const axios = require('axios')
const cheerio = require('cheerio')
require('dotenv').config()

const sendSMS = async () => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `App ${process.env.INFO_BIP_KEY}`)
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    const raw = JSON.stringify({
      messages: [
        {
          destinations: [{ to: '923215488108' }],
          from: 'Germany Embassy Islamabad Appointment',
          text: 'Appointment are open on the germany embassy Islamabad Portal. Please book your appointment asap',
        },
      ],
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    const response = await fetch(process.env.INFO_BIP_SMS_URL, requestOptions)
    const text = await response.text()

    console.log(text)
  } catch (err) {
    console.log(`Info Bip Error: ${err?.message}`)
  }
}

const sendWhatsAppText = async () => {
  try {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `App ${process.env.INFO_BIP_KEY}`)
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Accept', 'application/json')

    const raw = JSON.stringify({
      messages: [
        {
          from: '447860099299',
          to: '923215488108',
          messageId: '290ea68e-ab63-48cf-889f-cf19a25ec193',
          content: {
            templateName: 'message_test',
            templateData: {
              body: {
                placeholders: ['Qaiser'],
              },
            },
            language: 'en',
          },
        },
      ],
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(process.env.INFO_BIP_WHATSAPP_URL, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error))
  } catch (err) {
    console.log(`Info Bip Error: ${err.message}`)
  }
}

const voiceCall = async () => {
  try {
    const response = await axios.post(
      process.env.INFO_BIP_VOICE_URL,
      {
        text: 'Test Voice message.',
        language: 'en',
        voice: {
          name: 'Joanna',
          gender: 'female',
        },
        from: '442032864231',
        to: '+923215488108',
      },
      {
        headers: {
          Authorization: `App ${process.env.INFO_BIP_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

const getContent = async () => {
  try {
    const response = await axios.get(process.env.GERMAN_EMBASSY_URL)
    console.log('Response', response)
    const $ = cheerio.load(response.data)
    const selectList = $('#appointment_newAppointmentForm_fields_3__content')

    const optionValues = []

    selectList.find('option').each((index, element) => {
      optionValues.push($(element).attr('value'))
    })

    return optionValues.some((option) =>
      option.includes(
        process.env.APPOINTMENT_TEXT_1 ||
          process.env.APPOINTMENT_TEXT_2 ||
          process.env.APPOINTMENT_TEXT_3 ||
          process.env.APPOINTMENT_TEXT_4
      )
    )
  } catch (err) {
    console.log(`Error: ${err}`)
  }
}

const checkForText = (sentences, searchText) => {
  console.log('Checking text', sentences, searchText)
  return sentences.some((sentence) => sentence.includes(searchText))
}

module.exports = {
  sendSMS,
  sendWhatsAppText,
  voiceCall,
  getContent,
  checkForText,
}
