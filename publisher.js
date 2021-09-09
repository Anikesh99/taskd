const express = require("express")
const { Kafka } = require('kafkajs')

const app = express()
const kafkaPub = new Kafka({
    clientId: 'messager',
    // 3 simultaneous Kafka nodes listening 
    brokers: ['localhost:9093', 'localhost:9094', 'localhost:9095'],
    connectionTimeout: 3000
})

app.listen(3000, async () => {
    var sender = kafkaPub.producer()
    await sender.connect()
    await sender.send({
        topic: 'message',
        // can change the topic or add more topics and messages
        messages: [{ value: "Hello there"}, {value: "General kenobi!"}]
    })

    await sender.disconnect()

    console.log("Publisher is running")
})