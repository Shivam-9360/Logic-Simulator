var $s = $('.simcir');

// getter-setter functions for json-canvas
var getCircuitData = function () {
    return JSON.parse(
        simcir.controller(
            $s.find('.simcir-workspace')).text());
};
var setCircuitData = function (data) {
    simcir.setupSimcir($s, data);
};

// event handlers
$(window).resize(function () {
    var circuitData = getCircuitData();
    circuitData.width = window.innerWidth;
    circuitData.height = window.innerHeight - $(".navbar").outerHeight(true);
    setCircuitData(circuitData);
});
$('#zoomIn').click(function () {
    unit = unit + 2;
    fontSize = fontSize + 2;
    setCircuitData(getCircuitData());
});
$('#zoomOut').click(function () {
    unit = unit - 2;
    fontSize = fontSize - 2;
    setCircuitData(getCircuitData());
});
$('#registerDeviceForm').submit(function () {
    var cirucuitName = $('#deviceName').val();
    var circuitHeight = $('#deviceHeight').val();
    var circuitWidth = $('#deviceWidth').val();

    // Validating form
    if (cirucuitName == '' ||
        circuitWidth == '' ||
        circuitHeight == '' ||
        +circuitWidth == 0 ||
        +circuitHeight == 0) {
        $('.alert').show();
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
    var findDevice = function (name) {
        var index = -1;
        $.each($(".simcir-device").children(".simcir-device-label"), function (key, value) {
            if (value.innerHTML == name) {
                index = key;
                return false;
            }
        });
        return $(".simcir-device").get(index);
    }
    var normalize = function (val, max, min) {
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

        device.x = (device.x == 0) ? device.x + unit : device.x;
        device.x = (device.x + deviceWidth + fontSize >= circuitWidth) ? circuitWidth - deviceWidth - unit - fontSize : device.x;
        device.y = (device.y == 0) ? device.y + unit : device.y;
        device.y = (device.y + deviceHeight + fontSize >= circuitHeight) ? circuitHeight - deviceHeight - unit - fontSize : device.y;
    }

    simcir.registerDevice(cirucuitName, circuitData);

    // check for local storage support
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("allRegisteredDevices") === null) {
            var allRegisteredDevices = [];
            allRegisteredDevices.push({
                "cirucuitName": cirucuitName,
                "circuitData": circuitData
            });
            localStorage.setItem("allRegisteredDevices", JSON.stringify(allRegisteredDevices));
        }
        else {
            var allRegisteredDevices = JSON.parse(localStorage.getItem("allRegisteredDevices"));
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

    $('#deviceName').val('');
    $('#deviceWidth').val('');
    $('#deviceHeight').val('');
    $('.alert').hide();
    $('#registerDeviceDialogueBox').modal('hide');

    simcir.controller($(".simcir-scrollbar")).scrollBottom();
});
$('#newDeviceForm').submit(function () {
    var deviceType = $('#selectNewDevice').val();
    var deviceLabel = $('#deviceLabel').val();
    var numberOfInputs = $('#numberOfInputs').val();

    // Validating form
    if (deviceLabel == '' ||
        numberOfInputs == '' ||
        +numberOfInputs == 0) {
        $('.alert').show();
        return;
    }

    var circuitData = getCircuitData();
    numberOfInputs = +numberOfInputs;
    circuitData.toolbox = [{ "type": cirucuitName, "numInputs": numberOfInputs }, ...circuitData.toolbox];
    circuitData.devices.push({
        'type': deviceType,
        'numInputs': numberOfInputs,
        'id': `dev${circuitData.devices.length}`,
        'x': unit,
        'y': unit,
        'label': deviceLabel
    });

    setCircuitData(circuitData);

    $('#deviceLabel').val('');
    $('#numberOfInputs').val('');
    $('.alert').hide();
    $('#newDeviceDialogueBox').modal('hide');
});
$('#unregisterDeviceDialogueBox').on('show.bs.modal', function (event) {
    var allRegisteredDevices = [];
    var selectRegisteredDeviceDropdown = $('#selectRegisteredDevice');

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
});
$('#unregisterDeviceForm').submit(function () {
    var registeredDevice = $('#selectRegisteredDevice').val();
    var circuitData = getCircuitData();

    ids = [];
    circuitData.toolbox = circuitData.toolbox.filter(device => device.type !== registeredDevice);
    circuitData.devices = circuitData.devices.filter((device) => {
        if (device.type === registeredDevice)
            ids.push(device.id);
        return device.type !== registeredDevice;
    });
    circuitData.connectors = circuitData.connectors.filter((connector) => {
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

    $('.alert').hide();
    $('#unregisterDeviceDialogueBox').modal('hide');
});

// load default (just specifies circuit size)
$(document).ready(function () {
    setCircuitData(JSON.parse(
        `{ "width":${window.innerWidth}, "height":${window.innerHeight - $(".navbar").outerHeight(true)} }`));
});