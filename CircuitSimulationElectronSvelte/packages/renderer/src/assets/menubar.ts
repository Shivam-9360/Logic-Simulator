import jQuery from "jquery";
import { 
    isRegisterDeviceDialogueBoxOpen,
    isUnregisterDeviceDialogueBoxOpen,
    isNewDeviceDialogueBoxOpen
} from "./stores";
import { 
    getCircuitData, 
    setCircuitData 
} from "./canvas";
import { simcir } from '../external/js/simcir.js'


export function zoomInClick () {
    simcir.unit = simcir.unit + 2;
    simcir.fontSize = simcir.fontSize + 2;
    setCircuitData(getCircuitData());
}
export function zoomOutClick () {
    simcir.unit = simcir.unit - 2;
    simcir.fontSize = simcir.fontSize - 2;
    setCircuitData(getCircuitData());
}
export function registerDeviceFormSubmit () {
    let registerDeviceForm = this;
    let cirucuitName = registerDeviceForm.elements['deviceName'].value;
    let circuitHeight = registerDeviceForm.elements['deviceHeight'].value;
    let circuitWidth = registerDeviceForm.elements['deviceWidth'].value;

    // Validating form
    if (cirucuitName == '' ||
        circuitWidth == '' ||
        circuitHeight == '' ||
        +circuitWidth == 0 ||
        +circuitHeight == 0) {
        jQuery(".alert-danger").show();
        return;
    }

    var circuitData = getCircuitData();
    circuitData.showToolbox = false;
    circuitData.toolbox = {};
    circuitWidth = +circuitWidth;
    circuitHeight = +circuitHeight;
    circuitData.width = circuitWidth;
    circuitData.height = circuitHeight;

    // helper functions
    var findDevice = function (name: string) {
        var index = -1;
        jQuery.each(jQuery(".simcir-device").children(".simcir-device-label"), function (key, value) {
            if (value.innerHTML == name) {
                index = key;
                return false;
            }
        });
        return jQuery(".simcir-device").get(index);
    }
    var normalize = function (val: number, max: number, min: number) {
        if (max == min) {
            return 0.5;
        }
        else {
            return (val - min) / (max - min);
        }
    }

    var maxX = Number.MIN_SAFE_INTEGER;
    var maxY = Number.MIN_SAFE_INTEGER;
    var minX = Number.MAX_SAFE_INTEGER;
    var minY = Number.MAX_SAFE_INTEGER;
    for (var device of circuitData.devices) {
        maxX = (device.x > maxX) ? device.x : maxX;
        maxY = (device.y > maxY) ? device.y : maxY;

        minX = (device.x < minX) ? device.x : minX;
        minY = (device.y < minY) ? device.y : minY;
    }
    for (var device of circuitData.devices) {
        device.x = normalize(device.x, maxX, minX) * circuitWidth;
        device.y = normalize(device.y, maxY, minY) * circuitHeight;

        var deviceElement = findDevice(device.type);
        var deviceWidth = deviceElement.children[0].width.baseVal.value;
        var deviceHeight = deviceElement.children[0].height.baseVal.value;

        device.x = (device.x == 0) ? device.x + simcir.unit : device.x;
        device.x = (device.x + deviceWidth + simcir.fontSize >= circuitWidth) ? circuitWidth - deviceWidth - simcir.unit - simcir.fontSize : device.x;
        device.y = (device.y == 0) ? device.y + simcir.unit : device.y;
        device.y = (device.y + deviceHeight + simcir.fontSize >= circuitHeight) ? circuitHeight - deviceHeight - simcir.unit - simcir.fontSize : device.y;
    }
    
    simcir.registerDevice(cirucuitName, circuitData);

    // check for local storage support
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("allRegisteredDevices") === null) {
            let allRegisteredDevices = [];
            allRegisteredDevices.push({
                "cirucuitName": cirucuitName,
                "circuitData": circuitData
            });
            localStorage.setItem("allRegisteredDevices", JSON.stringify(allRegisteredDevices));
        }
        else {
            let allRegisteredDevices = JSON.parse(localStorage.getItem("allRegisteredDevices"));
            allRegisteredDevices.push({
                "cirucuitName": cirucuitName,
                "circuitData": circuitData
            });
            localStorage.setItem("allRegisteredDevices", JSON.stringify(allRegisteredDevices));
        }
    }

    circuitData = getCircuitData();
    circuitData.toolbox = [{ "type": cirucuitName }, ...circuitData.toolbox];
    setCircuitData(circuitData);

    registerDeviceForm.reset();
    jQuery('.alert-danger').hide();
    isRegisterDeviceDialogueBoxOpen.update((value) => (!value));
}
export function newDeviceFormSubmit () {
    let newDeviceForm = this;
    let deviceType = newDeviceForm.elements['selectNewDevice'].value;
    let deviceLabel = newDeviceForm.elements['#deviceLabel'].value;
    let numberOfInputs = newDeviceForm.elements['#numberOfInputs'].value;

    // Validating form
    if (deviceLabel == '' ||
        numberOfInputs == '' ||
        +numberOfInputs == 0) {
        jQuery('.alert').show();
        return;
    }

    var circuitData = getCircuitData();
    numberOfInputs = +numberOfInputs;
    circuitData.toolbox = [{ "type": deviceType, "numInputs": numberOfInputs }, ...circuitData.toolbox];
    circuitData.devices.push({
        'type': deviceType,
        'numInputs': numberOfInputs,
        'id': `dev${circuitData.devices.length}`,
        'x': simcir.unit,
        'y': simcir.unit,
        'label': deviceLabel
    });

    setCircuitData(circuitData);

    newDeviceForm.reset();
    jQuery('.alert').hide();
    isNewDeviceDialogueBoxOpen.update((value) => (!value));
}
export function onUnregisterDeviceDialogueBoxOpen () {
    let allRegisteredDevices = [];
    let selectRegisteredDeviceDropdown = jQuery('#selectRegisteredDevice');

    // check for local storage support
    if (typeof (Storage) !== "undefined") {
        // check if there are stored items
        if (localStorage.getItem("allRegisteredDevices") !== null) {
            allRegisteredDevices = JSON.parse(localStorage.getItem("allRegisteredDevices"));
        }
    }
    selectRegisteredDeviceDropdown.children().remove().end();

    if (allRegisteredDevices.length === 0) {
        selectRegisteredDeviceDropdown.append('<option>No Device Registered</option>');
        return;
    }
    for (var registeredDevice of allRegisteredDevices) {
        selectRegisteredDeviceDropdown.append(`<option>${registeredDevice.cirucuitName}</option>`);
    }
}
export function unregisterDeviceFormSubmit() {
    let registeredDevice = jQuery('#selectRegisteredDevice').val();
    let circuitData = getCircuitData();

    let ids = [];
    circuitData.toolbox = circuitData.toolbox.filter((device: { type: string; id: string}) => device.type !== registeredDevice);
    circuitData.devices = circuitData.devices.filter((device: { type: string; id: string}) => {
        if (device.type === registeredDevice)
            ids.push(device.id);
        return device.type !== registeredDevice;
    });
    circuitData.connectors = circuitData.connectors.filter((connector: { from: string; to: string; }) => {
        return !ids.includes(connector.from.split(".", 1)[0]) &&
            !ids.includes(connector.to.split(".", 1)[0]);
    });

    // check for local storage support
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("allRegisteredDevices") !== null) {
            var allRegisteredDevices = JSON.parse(localStorage.getItem("allRegisteredDevices"));
            allRegisteredDevices = allRegisteredDevices.filter(device => device.cirucuitName !== registeredDevice);
            localStorage.setItem("allRegisteredDevices", JSON.stringify(allRegisteredDevices));
        }
    }

    setCircuitData(circuitData);

    jQuery('.alert').hide();
    isUnregisterDeviceDialogueBoxOpen.update((value) => (!value));
}