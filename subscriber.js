const express = require("express")
const { Kafka } = require('kafkajs')

const app = express()

const kafka = new Kafka({
    clientId: 'messager',
    // three different Kafka nodes running simultaneously 
    brokers: ['localhost:9093', 'localhost:9094', 'localhost:9095'],
    connectionTimeout: 3000
})

app.listen(3500, async () => {
    const referee = kafka.admin()
    await referee.connect()
    await referee.createTopics({
        waitForLeaders: true,
        topics: [{topic: "message"}]
    })
    const texter = kafka.consumer({groupId: "texters"})
    await texter.connect()
    // possible to subscribe to many more topics and choose which topics to listen to
    await texter.subscribe({topic: "message", fromBeginning: true})
    await texter.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log(message.value.toString());
        }
    })
})