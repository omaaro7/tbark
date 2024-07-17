window.onload = () => {
  setSafeAllMoney("1", "day");
  setSafeAllMoney("2", "week");
  setSafeAllMoney("3", "month");
  // putOperations("1","day")
  // putOperations("2","week")
  // putOperations("3","month")
};
async function setSafeAllMoney(id, pl) {
  let plc = document.querySelector(`.all-money-a.${pl}`);
  let res = await fetch(` ../routers/safes/get_safe.php?id=${id}`);
  let data = await res.json();
  let resT = await fetch(
    ` ../routers/safes/get_operations.php?endDate=${data.endDate}&startDate=${data.startDate}`
  );
  let dataT = await resT.json();
  let totel = 0;
  let m = await dataT.map((ele) => {
    let totelMoney = parseFloat(ele.totel_money);
    console.log(totelMoney);
    console.log(ele);
    ele.operationType == "0"
      ? (totel = totel + totelMoney)
      : (totel = totel - totelMoney);
    console.log(totel);
  });
  plc.textContent = totel + "جنيه";
  console.log(totel);

  putOperations(pl, dataT);
}
function safeItem(type, money, stat) {
  const item = `
        <div class="pe ${stat} col-12 d-flex justify-content-between py-3 px-2 mt-1">
            <div class="pe-type ">${type}</div>
            <div class="pe-money ">${money} جنيه </div>
            </div>
                    `;
  return item;
}
async function putOperations(box, arr) {
  let plc = document.querySelector(`.safe-ope-list.${box}`);
  let statues;
  let type;
  let money;
  console.log("oar")
  console.log(arr)
  arr.map((ele) => {
    console.log("A")
    console.log(ele);
    ele.operationType == "0"
      ? (money = +ele.money - ele.baky)
      : (money = +ele.money - ele.baky);
    ele.operationType == "0" ? (statues = "one") : (statues = "two");
    ele.operationType == "0" ? (type = " تمت اضافة") : (type = " تم خصم");
    plc.innerHTML += safeItem(type, money, statues);
    console.log(plc);
  });
}
