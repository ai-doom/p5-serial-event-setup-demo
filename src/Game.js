import {InputDevice} from './Device.js'
import {popup_and_play} from './index.js'
/**
 * 
 * 
 * @param {[InputDevice, string]} deviceEvent 
 * @param {[[InputDevice, string] | [wait, number]]} inDeviceEvents 
 * @param {number} timeout 
 * @returns {boolean} if the correct device is activated
 */
const wait_until_some_device = async (deviceEvent, deviceEvents, timeout) => {
    let [correct_device, _] = deviceEvent
    let events_count = deviceEvents.length
    let inDeviceEvents = deviceEvents.slice(0)
    if(timeout){
        inDeviceEvents.push([wait, timeout])
    }
    let [waited_device, waited_event] = await wait_race(inDeviceEvents)
    return waited_device;
}

// var color_to_button = {
//     'white': button3,
//     'red': button2,
//     'blue': button1,
// }
// var possible_buttons = ['white', 'red', 'blue']

export
class GameMatch{
    /**
     * Creates an instance of GameMatch.
     * @param {any} instrction 
     * @param {[InputDevice, string]} deviceEvent 
     * @param {[[InputDevice, string]]} [deviceEvents=[]] 
     * @memberof GameMatch
     */
    constructor(instrction, deviceEvent, deviceEvents = []){
        this.instrction = instrction
        this.deviceEvent = deviceEvent
        this.inDeviceEvents = deviceEvents.slice(0)
        this.inDeviceEvents.push(deviceEvent)
    }
    async play(timeout){
        let start = new Date()
        await popup_and_play(this.instrction)
        let end = new Date()
        console.log('instruction elaspe', end - start)

        return await wait_until_some_device(this.deviceEvent, this.inDeviceEvents, timeout)
    }
    get correct_device(){
        return this.deviceEvent;
    }
}