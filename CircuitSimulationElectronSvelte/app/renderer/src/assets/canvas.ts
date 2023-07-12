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