import { simc, simCard } from "../../../tools/card.js";
import { close } from "../../../tools/global_functions.js";
close
let accept = false;
let info
export const setSimsInBox = async () => {
  const box = document.querySelector(".types-box-items");
  const res = await fetch("../routers/settings/sim_info/get_siminfo.php");
  const data = await res.json();
  console.log(data);

  data.forEach((ele, index) => {
    if (ele.simstate == 1) {
      box.innerHTML += simc(ele.simname, index);
    }
  });
  info = data
};
export const setColorsInTable = async () => {
  const colors = [];
  const statues = [];
  const res = await fetch("../routers/settings/sim_info/get_siminfo.php");
  const data = await res.json();
  data.forEach((ele, index) => {
    colors.push(ele.sim_color);
    statues.push(ele.simstate);
  });
  let tableBody = document.querySelector(".table tbody");
  const re = await fetch(" ../routers/simCards/get_simCards.php");
  const d = await re.json();
  const x = await d.map((ele) => {
    let type = "";
    let color = "";
    let stat = "";
    let op = "1";
    if (ele.type == 0) {
      type = "Vodafone";
      color = colors[0];
      stat = statues[0];
    }
    if (ele.type == 1) {
      color = colors[1];
      type = "Orange";
      stat = statues[1];
    }
    if (ele.type == 2) {
      color = colors[2];
      type = "Etisalat";
      stat = statues[2];
    }
    if (ele.type == 3) {
      color = colors[3];
      type = "We";
      stat = statues[3];
    }
    if (stat == 0) {
      op = "0.4";
    }
    tableBody.innerHTML += simCard(
      ele.number,
      ele.name,
      ele.id,
      type,
      color,
      op
    );
  });
};
export const showSimCardType = async () =>  {
  const clicker = document.querySelector(".sim-type");
  const itms = document.querySelectorAll(".type-item");
  const box = document.querySelector(".types-box-main");
  clicker.addEventListener("click", (e) => {
    box.classList.replace("d-none", "d-flex");
    console.log(true);
    console.log(itms);
    
    itms.forEach((item) => {
      item.addEventListener("click", (e) => {
        box.classList.replace("d-flex", "d-none");
        clicker.value = e.target.innerHTML;
        clicker.dataset.type = e.target.dataset.type;
        accept = true;
      });
    });
  });
  close(document.querySelector(".types-closer i"), box, false);

}
export const autoSelectType = async () => {
  const item = document.querySelector(".num");
  const type = document.querySelector(".sim-type");
  item.addEventListener("input", (e) => {
    if (!accept) {
      if (
        !e.target.value.startsWith("010") ||
        !e.target.value.startsWith("012") ||
        !e.target.value.startsWith("011") ||
        !e.target.value.startsWith("015")
      ) {
        type.value = "";
        type.dataset.type = "";
      }
      if (e.target.value.startsWith("010") && info[0].simstate == 1) {
        type.value = "Vodafone";
        type.dataset.type = "0";
      }
      if (e.target.value.startsWith("012") && info[1].simstate == 1) {
        type.value = "Orange";
        type.dataset.type = "1";
      }
      if (e.target.value.startsWith("011") && info[2].simstate == 1) {
        type.value = "Etisalat";
        type.dataset.type = "2";
      }
      if (e.target.value.startsWith("015") && info[3].simstate == 1) {
        type.value = "We";
        type.dataset.type = "3";
      }
    }
  });
};
