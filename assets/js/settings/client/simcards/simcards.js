import { simc, simCard } from "../../../tools/card.js";
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
