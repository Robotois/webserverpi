const mqtt = require('mqtt');
const client = mqtt.connect({ host: 'localhost' })

// simple shadow, no support for multiple Tois so far
let devicesShadow = {}

client.on('connect', () => {
  client.subscribe('tois/+/update')
  client.subscribe('tois/+/get')
})

const getToiId = (topic) => topic.match(/(?<=tois\/).+(?=\/)/i)

client.on('message', (topic, payload) => {
  console.log({topic, payload: payload.toString()})
  if (topic.includes('/update')) {
    const toi = getToiId(topic)
    const shadow = devicesShadow[toi] || {}
    const newShadow = update(topic, payload.toString(), shadow)
    devicesShadow[toi] = newShadow
  }
  if (topic.includes('/get')) {
    const toi = getToiId(topic)
    const shadow = devicesShadow[toi] || {}
    get(topic, shadow)
  }
})

function get(topic, shadow) {
  let delta
  if (shadow.reported && shadow.desired) {
    delta = Object.keys(shadow.reported).reduce(
      (res, key) => shadow.desired && shadow.reported[key] === shadow.desired[key] ? res : { ...res, [key]: shadow.desired[key] },
      {}
    )
    delta =  Object.keys(delta).length !== 0 ? delta : undefined
  }
  const state = { state: { ...shadow, delta } }
  client.publish(`${topic}/accepted`,
    JSON.stringify(state))
}

function update(topic, message, shadow) {
  const { state: { desired, reported } } = JSON.parse(message)
  const resultShadow = { ...shadow }
  if (reported) {
    resultShadow.reported = {
        ...resultShadow.reported,
        ...reported
    }
    const state = { state: { reported: resultShadow.reported } }
    client.publish(`${topic}/accepted`, JSON.stringify(state))
    return resultShadow
  }

  if (desired) {
    const delta = Object.keys(desired).reduce(
        (res, key) => 
            resultShadow.reported && resultShadow.reported[key] === desired[key] ? res : { ...res, [key]: desired[key] },
        {}
    );
    resultShadow.desired = {
        ...resultShadow.desired,
        ...delta
    }
    client.publish(`${topic}/accepted`, JSON.stringify({ state: { desired: delta } }))
    client.publish(`${topic}/delta`, JSON.stringify({ state: delta }))
    return resultShadow
  }
}

// setTimeout(() => {
//   client.publish('tois/superToi/update', JSON.stringify({ state: { reported: { power: 'on', color: 'green' } } }))
//   client.publish('tois/superToi/get')
// }, 2000);
// setTimeout(() => {
//   client.publish('tois/superToi/update', JSON.stringify({ state: { desired: { power: 'off', color: 'green' } } }))
//   client.publish('tois/superToi/update', JSON.stringify({ state: { reported: { power: 'off', color: 'red' } } }))
// }, 3500);

// setTimeout(() => {
//   client.publish('tois/superToi/update', JSON.stringify({ state: { reported: { power: 'on', color: 'purple' } } }))
//   client.publish('tois/superToi/get')
// }, 5500)
