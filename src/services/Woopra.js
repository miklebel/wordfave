import { getUniqueId, getDeviceId, getDeviceName } from 'react-native-device-info'

export const sendWoopraEvent = async ({ eventName, eventData }) => {
  try {
    const deviceId = getUniqueId()
    const deviceModel = getDeviceId()
    const deviceName = await getDeviceName()
    const trackUrl = `https://www.woopra.com/track/ce/?project=wordfave.com&instance=woopra&app=js-client&cookie=${deviceId}&event=${eventName}&ce_eventData=${eventData}&ce_deviceName=${deviceName}&ce_deviceId=${deviceId}&ce_deviceModel=${deviceModel}`

    fetch(trackUrl)
  } catch (error) {}
}
