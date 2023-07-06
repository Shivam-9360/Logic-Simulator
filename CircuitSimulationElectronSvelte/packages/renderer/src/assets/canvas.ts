import { simcir, simcirDiv } from "./stores";

let simcirValue: any;
let simcirDivValue: any;
simcir.subscribe((currentValue) => {
    simcirValue = currentValue;
});
simcirDiv.subscribe((currentValue) => {
    simcirDivValue = currentValue;
});

export function getCircuitData () {
    return simcirValue.controller(
        [simcirDivValue.querySelector(".simcir-workspace")]).data();
};
export function setCircuitData (data) {
    simcirValue.setupSimcir([simcirDivValue], data);
};
export function windowResize () {
    var circuitData = getCircuitData();
    circuitData.width = window.innerWidth;
    circuitData.height = window.innerHeight - document.querySelector(".navbar").clientHeight
    setCircuitData(circuitData);
};