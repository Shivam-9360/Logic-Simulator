import { simcir } from '../external/js/simcir.js'
import '../external/js/simcir-basicset.js'

let simcirDiv: HTMLElement;

export function setSimcirDiv(){
    simcirDiv = document.querySelector(".simcir");
}
export function getCircuitData () {
    return simcir.controller(
        [simcirDiv.querySelector(".simcir-workspace")]).data();
};
export function setCircuitData (data) {
    simcir.setupSimcir([simcirDiv], data);
};
export function windowResize () {
    var circuitData = getCircuitData();
    circuitData.width = window.innerWidth;
    circuitData.height = window.innerHeight - document.querySelector(".navbar").clientHeight
    setCircuitData(circuitData);
};
export function setPhysicalDevices () {
    // helper function
    var setSignalValue = (signal: number) => signal == 1 ? 1 : null;

    // physical devices
    fetch('/Home/GetSignal')
    .then(response => response.json())
    .then((data) => {
        var signal = setSignalValue(data.signal);

        simcir.registerDevice('Hardware (IN)', function(device: any) {
            device.addOutput();
            var super_createUI = device.createUI;
            device.createUI = function() {
                super_createUI();
                device.$ui.addClass('simcir-basicset-dc');
            };
            device.$ui.on('deviceAdd', function() {
                fetch('/Home/GetSignal')
                    .then(response => response.json())
                    .then((data) => {
                        signal = setSignalValue(data.signal);
                        device.getOutputs()[0].setValue(signal);
                    })
                    .catch(device.getOutputs()[0].setValue(signal))
            });
            device.$ui.on('deviceRemove', function() {
                device.getOutputs()[0].setValue(null);
            });
        });
    })
    .catch(error => console.error('Unable to get data =>', error));
}
export function setDevice () {
    setSimcirDiv();
    setPhysicalDevices();
    setCircuitData({
        "width": window.innerWidth,
        "height": window.innerHeight - document.querySelector(".navbar").clientHeight
    });
}