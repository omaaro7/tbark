//import modules
import {
  setSimsInBox,
  setColorsInTable,
} from "./settings/client/simcards/simcards.js";
import { close } from "./tools/global_functions.js";
//helping vars
let tableBody = document.querySelector(".table tbody");

async function apply() {
  setSimsInBox();
  sel();
}
window.onload = async () => {
  let x = await apply();
  autoSelectType();
  showSimCardType();
  let d = await setColorsInTable();
  let r = await sel();
};
async function sel() {
  let deleteItems = document.querySelectorAll("table tbody tr td.del");
  console.log(deleteItems);
  let editItems = document.querySelectorAll("table tbody tr td.edi");
  console.log(editItems)
  let adder = document.querySelector("form button");
  let delAll = document.querySelector("button.delAll");
  let exc = document.querySelector("button.downExcel");
  let csv = document.querySelector("button.csv");
  let pdf = document.querySelector("button.pdf");
  let accept = false;
  adder.addEventListener("click", () => {
    addSimCard();
  });
  editItems.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      editSimCard(e.target.dataset.id);
    });
  });
  deleteItems.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      deleteSimCard(e.target.dataset.id);
    });
  });
  exc.addEventListener("click", () => {
    exportExcelAndCsv("xls");
  });
  csv.addEventListener("click", () => {
    exportExcelAndCsv("csv");
  });
  pdf.addEventListener("click", () => {
    exportAsPdf();
  });
  delAll.addEventListener("click", () => {
    deleteAll(data);
  });
}
async function showSimCardType() {
  const clicker = document.querySelector(".sim-type");
  const itms = document.querySelectorAll(".type-item");
  const box = document.querySelector(".types-box-main");
  clicker.addEventListener("click", (e) => {
    box.classList.replace("d-none", "d-flex");
  });
  itms.forEach((item) => {
    item.addEventListener("click", (e) => {
      box.classList.replace("d-flex", "d-none");
      clicker.value = e.target.innerHTML;
      clicker.dataset.type = e.target.dataset.type;
      accept = true;
    });
  });
  close(document.querySelector(".types-closer i"), box, false);
}
async function autoSelectType() {
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
      if (e.target.value.startsWith("010")) {
        type.value = "Vodafone";
        type.dataset.type = "0";
      }
      if (e.target.value.startsWith("012")) {
        type.value = "Orange";
        type.dataset.type = "1";
      }
      if (e.target.value.startsWith("011")) {
        type.value = "Etisalat";
        type.dataset.type = "2";
      }
      if (e.target.value.startsWith("015")) {
        type.value = "We";
        type.dataset.type = "3";
      }
    }
  });
}
function addSimCard() {
  let inputs = document.querySelectorAll("form input");
  if (
    inputs[0].value.trim() === "" ||
    inputs[1].value.trim() === "" ||
    inputs[2].value.trim() === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "يرجى ملء جميع البيانات",
    });
  } else {
    if (inputs[0].value.length > 11 || inputs[0].value.length < 11) {
      Swal.fire({
        icon: "error",
        title: "يجب الا يزيد او يقل الرقم عن 11 رقم",
      });
    } else {
      let data = {
        id: null,
        number: inputs[0].value.trim(),
        name: inputs[1].value.trim(),
        type: inputs[2].dataset.type,
      };
      fetch(` ../routers/simCards/post_simCard.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        res.json();
        if (res.status === 200 || res.status === 201) {
          Swal.fire({
            icon: "success",
            title: "تمت الاضافه بنجاح",
          }).then(() => setTimeout(() => window.location.reload(), 1000));
        } else {
          Swal.fire({
            icon: "erorr",
            title: "حدث خطأ",
          });
        }
      });
    }
  }
}
async function editSimCard(f) {
  const res = await fetch(`../routers/simCards/get_simCards.php?id=${f}`)
  const data = await res.json()
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
    number: data.number,
    name: data.name,
    money: data.money,
  };
  labels[0].innerHTML += dataE.number;
  labels[1].innerHTML += dataE.name;
  labels[2].innerHTML += dataE.money;
  updater.addEventListener("click", () => {
    inputs[0].value.trim() != ""
      ? (dataE.number = inputs[0].value)
      : (dataE.number = data.number);
    inputs[1].value.trim() != ""
      ? (dataE.name = inputs[1].value)
      : (dataE.name = data.name);
    inputs[2].value.trim() != ""
      ? (dataE.money = inputs[2].value)
      : (dataE.money = data.money);
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
        fetch(` ../routers/simCards/put_simCards.php?id=${f}`, {
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
  });
}
function deleteSimCard(id) {
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
      fetch(` ../routers/simCards/delete_simCards.php?id=${id}`, {
        method: "delete",
      }).then((res) => {
        res.json();
        if (res.status !== 200) {
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
function deleteAll(d) {
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
      d.forEach((ele) => {
        fetch(` ../routers/simCards/delete_simCards.php?id=${ele.id}`, {
          method: "delete",
        }).then((res) => {
          res.json();
          if (res.status !== 200) {
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
      });
    }
  });
}
function exportExcelAndCsv(type) {
  const fileName = "exported." + type;
  const table = document.querySelector(".table");
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, fileName);
}
function exportAsPdf() {
  window.location = "../reports/sim_cards.php";
}
