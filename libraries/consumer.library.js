'use strict';
require('dotenv').config();
const chalk = require('chalk');

const { baseError } = require('../system/core/error/baseError');
const { kafka } = require('../app/helpers/kafka');
const { consumerCallTopicsService } = require('../kafka');
const log = console.log;
const groupId = process.env.KAFKA_GROUP_ID;
const topicsString = process.env.KAFKA_SUBSCRIBE_TOPICS;
const topics = topicsString.split(',');

exports.consumerKafkaMessage = async () => {
  try{
    const consumer = kafka.consumer({ groupId: groupId });
    await consumer.connect().then((value) => console.log("Consumer connected"))
    .catch((err) => {
      throw new baseError(err);
    });

    console.log('consumer', consumer);
    if(topics.length > 0) {
      topics.forEach(topic => {
        if(topic.length > 0) consumer.subscribe({ topic: topic });
      });
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await consumerCallTopicsService(topic, partition, message);
      },
    });

  } catch (ex) {
    throw new baseError(ex);
  }
};
