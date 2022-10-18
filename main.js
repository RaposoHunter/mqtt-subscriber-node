require('dotenv').config();

const express = require('express');
const mqtt = require('mqtt');
const app = express();

const client = mqtt.connect({
    host: process.env.MQTT_HOST,
    port: process.env.MQTT_PORT,
    protocol: process.env.MQTT_PROTOCOL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});

let last_reading = null;

client.on('connect', () => {
    console.log('Cliente MQTT conectado!');
});

client.on('error', err => {
    console.log('Algo deu errado ao conectar o cliente MQTT!');
    console.error(err);
});

client.on('message', (topic, message) => {
    console.log(`Mensagem recebida: ${message.toString()}`);

    last_reading = message.toString();
});

client.subscribe('mqtt/leituras', {
    qos: 1
});

app.get('/ws/mqtt', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(last_reading);
});

app.listen(3000, () => {
    console.log('Servidor Iniciado');
});