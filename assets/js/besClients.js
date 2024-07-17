import { client, infoBox, historyItem, nores } from "./tools/card.js";
import {
  getCurrentDate,
  getDateAfterOneDay,
  getCurrentTime,
  getCurrentArabicDay,
  getDateAfterOneMonth,
  getDateAfterOneWeek,
} from "./tools/createDateAndTimeAndDay.js";
import {
  close,
  showShopSimCards,
  showOpeType,
  sendMoneyToAllSafs
} from "./tools/global_functions.js";
let addInputs = document.querySelectorAll("form input");
let addButton = document.querySelector("form button");
let deleters = "";
let editers = "";
let historyShower = "";
let operationController = "";
window.onload = () => {
  main();
  addButton.addEventListener("click", () => addClient());
};
function logr() {
  console.log("p");
}
function noRes(box, text, size) {
  box.innerHTML = nores(text, size);
}
function addClient() {
  if (
    addInputs[0].value.trim() === "" ||
    addInputs[1].value.trim() === "" ||
    addInputs[2].value.trim() === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "يرجى ملء جميع البيانات",
    });
  } else {
    let data = {
      client_name: addInputs[0].value,
      client_number: addInputs[1].value,
      client_credit: addInputs[2].value,
    };
    Swal.fire({
      title: "هل انت متأكد ؟",
      icon: "warning",
      html: `
      اسم العميل : ${addInputs[0].value} <br>
      رقم العميل : ${addInputs[1].value} <br>
      الرصيد المعتاد : ${addInputs[2].value}
  `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(` ../routers/best_clients/post_bestClient.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(data).toString(),
        }).then((res) => {
          res.json();
          if (!res.ok) {
            Swal.fire({
              title: "حدث خطأ",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "تمت الاضافه بنجاح",
              icon: "success",
            }).then(() => {
              setTimeout(() => window.location.reload(), 1000);
            });
          }
        });
      }
    });
  }
}
async function main() {
  //create clients cards
  let box = document.querySelector(".users-container");
  const res = await fetch(` ../routers/best_clients/get_bestClients.php`);
  const data = await res.json();
  if (!res.ok) {
    Swal.fire({
      icon: "error",
      title: "حدث خطأ أثناء جلب البياتات",
    });
  } else {
    box.innerHTML = "";
    const maping = await data.map((ele) => {
      box.innerHTML += client(
        ele.client_name,
        ele.client_number,
        ele.client_credit,
        ele.id
      );
    });
    //update values
    deleters = document.querySelectorAll(".option.delete");
    editers = document.querySelectorAll(".option.edit");
    historyShower = document.querySelectorAll(".option.history");
    operationController = document.querySelectorAll(".option.ope");
    //delete client
    deleters.forEach((ele) =>
      ele.addEventListener("click", (e) => deleteClient(e.target.dataset.id))
    );
    //udpdate client
    editers.forEach((ele, index) =>
      ele.addEventListener("click", (e) =>
        editClient(data, index, e.target.dataset.id)
      )
    );
    //show client history
    historyShower.forEach((ele) => {
      ele.addEventListener("click", (e) => showHistory(e.target.dataset.id));
    });
    operationController.forEach((ele) => {
      ele.addEventListener("click", (e) => addOperation(e.target.dataset.id));
    });

  }
}
function deleteClient(id) {
  Swal.fire({
    title: "هل انت متأكد ؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "نعم",
    cancelButtonText: "الغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(` ../routers/best_clients/delete_bestClient.php?id=${id}`, {
        method: "delete",
      }).then((res) => {
        res.json();
        if (!res.ok) {
          Swal.fire({
            title: "حدث خطأ",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "تم الحذف بنجاح",
            icon: "success",
          }).then(() => {
            setTimeout(() => window.location.reload(), 1000);
          });
        }
      });
    }
  });
}
function editClient(d, i, f) {
  let box = document.querySelector(".edit-main");
  let labels = document.querySelectorAll(".edit-main-box .editing-form label");
  let inputs = document.querySelectorAll(".edit-main-box .editing-form input");
  let updater = document.querySelector(
    ".edit-main-box .editing-form button.upd"
  );
  let closer = document.querySelector(
    ".edit-main-box .editing-form button.cls"
  );
  box.classList.replace("d-none", "d-flex");
  let dataE = {
    client_name: d[i].client_name,
    client_number: d[i].client_number,
    client_credit: d[i].client_credit,
  };
  labels[0].innerHTML += dataE.client_name;
  labels[1].innerHTML += dataE.client_number;
  labels[2].innerHTML += dataE.client_credit;
  updater.addEventListener("click", () => {
    inputs[0].value.trim() != ""
      ? (dataE.client_name = inputs[0].value)
      : (dataE.client_name = d[i].client_name);
    inputs[1].value.trim() != ""
      ? (dataE.client_number = inputs[1].value)
      : (dataE.client_number = d[i].client_number);
    inputs[2].value.trim() != ""
      ? (dataE.client_credit = inputs[2].value)
      : (dataE.client_credit = d[i].client_credit);
    Swal.fire({
      title: "هل انت متأكد ؟",
      html: `
        الاسم :  ${dataE.client_name} <br>
        الرقم :  ${dataE.client_number} <br>
        الرصيد  :  ${dataE.client_credit} <br>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(` ../routers/best_clients/put_bestClient.php?id=${f}`, {
          method: "PUT",
          body: JSON.stringify(dataE),
        }).then((res) => {
          res.json();
          if (res.status !== 200) {
            Swal.fire({
              title: "حدث خطأ",
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "تم التعديل بنجاح",
              icon: "success",
            }).then(() => {
              setTimeout(() => window.location.reload(), 1000);
            });
          }
        });
      }
    });
  });
  closer.addEventListener("click", () => {
    box.classList.replace("d-flex", "d-none");
    labels[0].innerHTML = "";
  labels[1].innerHTML ="";
  labels[2].innerHTML = "";
  });
}
async function showHistory(id) {
  console.log("hist");
  const box = document.querySelector(".history-main");
  let clickers = document.querySelectorAll(".clickers button")
  let clientNum = "";
  box.classList.replace("d-none", "d-flex");
  async function getUserInfo() {
    const res = await fetch(
      `../routers/best_clients/get_bestClients.php?id=${id}`
    );
    const data = await res.json();
    clientNum = data.client_number;
    box.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.innerHTML =
      "";
    box.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.innerHTML +=
      infoBox(data.client_name, data.client_number, data.client_credit);
  }
  async function getUserHistory() {
    const bx = document.querySelector(".items-hist");
    const res = await fetch(
      `../routers/operations/filtring/by_clientNum.php?client_number=${clientNum}&limit=100000000`
    );
    const data = await res.json();
    bx.innerHTML = "";
    if (data.length == 0) {
      noRes(bx, "لا توجد نتائج", "12");
    } else {
      const maping = await data.data.map((ele) => {
        bx.innerHTML += historyItem(
          ele.simCardNumber,
          ele.money,
          ele.operationType,
          ele.baky,
          ele.dateDay,
          ele.time
        );
      });
    }
    console.log("ss");
  }
  const t = await getUserInfo();
  const y = await getUserHistory();
   downAsPdf(clickers[1],clientNum)
  close(document.querySelector(".history-closer i"), box, false);
}
function addOperation(id) {
  let clientNum = "";
  const box = document.querySelector(".add-main");
  box.classList.replace("d-none", "d-flex");
  fetch(`../routers/best_clients/get_bestClients.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      clientNum = data.client_number;
      box.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.innerHTML =
        "";
      box.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.innerHTML +=
        infoBox(data.client_name, data.client_number, data.client_credit);
      let inputs = document.querySelectorAll(".add-form input");
      let btn = document.querySelector(".add-form button");
      showShopSimCards(
        inputs[0],
        document.querySelector(".simCardsShowerMain"),
        logr(),
        "best"
      );
      showOpeType(inputs[3], document.querySelector(".opeShowerMain"));
      btn.addEventListener("click", (e) => {
        if (
          inputs[0].value.trim() != "" ||
          inputs[1].value.trim() != "" ||
          inputs[2].value.trim() != "" ||
          inputs[3].value.trim() != ""
        ) {
          Swal.fire({
            title: "هل انت متأكد ؟",
            icon: "warning",
            html: `
              رقم المحل : ${inputs[0].value} <br>
              رقم العميل : ${clientNum}<br>
              المبلغ : ${inputs[1].value}<br>
              نوع العمليه : ${inputs[3].value}<br>
             الآجل / الدين : ${inputs[2].value}<br>
          `,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم",
            cancelButtonText: "الغاء",
          }).then((result) => {
            if (result.isConfirmed) {
              fetch(`../routers/operations/post_operations.php`, {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                body: new URLSearchParams({
                  client_number: clientNum,
                  simCardNumber: inputs[0].value.trim(),
                  dateDay: getCurrentDate(),
                  time: getCurrentTime(),
                  operationType: inputs[3].dataset.ope,
                  money: inputs[1].value.trim(),
                  baky: inputs[2].value.trim(),
                  totel_money:
                    +inputs[1].value.trim() - +inputs[2].value.trim(),
                }).toString(),
              }).then((res) => {
                res.json();
                if (!res.ok) {
                  Swal.fire({
                    title: "حدث خطأ",
                    icon: "error",
                  });
                } else {
                  let pp;
                  inputs[3].dataset.ope == 0 ? (pp = "-") : (pp = "+");
                  sendMoneyToAllSafs("1");
                  sendMoneyToAllSafs("2");
                  sendMoneyToAllSafs("3");
                  Swal.fire({
                    title: "تمت الاضافه بنجاح",
                    icon: "success",
                  }).then(() => {
                    inputs[0].value = "";
                    inputs[1].value = "";
                    inputs[2].value = "";
                    inputs[3].value = "";
                    box.classList.replace("d-flex", "d-none");
                    main();
                  });
                }
              });
            }
          });
        }
      });
      document
        .querySelector(".operations-closer i")
        .addEventListener("click", () => {
          inputs[0].value = "";
          inputs[1].value = "";
          inputs[2].value = "";
          inputs[3].value = "";
        });
      close(document.querySelector(".operations-closer i"), box, false);
    });
}
function downAsPdf (clicker,num) {
  clicker.addEventListener("click" , () => {
    window.open(`../reports/pdfs/best_clients.php?client_number=${num}`,"_blank")
  })
}
/* 
todo download history
*/
