//'main vars
import { colorsIt } from "../../tools/card.js";
import { close } from "../../tools/global_functions.js";
let info = [];
const input = document.querySelector(".per");
const checks = document.querySelectorAll(".activater");
const companey_checks = document.querySelectorAll(".companey-activater");
const shop_checks = document.querySelectorAll(".shop-activater");
const company_edit = document.querySelectorAll(".company-edit");
const shop_edit = document.querySelectorAll(".shop-edit");
const colors = document.querySelectorAll(".sim");
window.onload = async () => {
  const inf = await getInfo();
  const apl = await applyFuncs();
};
//'main funcs
async function getInfo() {
  const res = await fetch("../../routers/settings/sim_info/get_siminfo.php");
  const data = await res.json();
  console.log(data);
  const maping = await data.map((ele) => {
    let Sinfo = {
      id: ele.id,
      simname: ele.simname,
      simstate: ele.simstate,
      sim_companey: ele.sim_company,
      sim_shop: ele.sim_shop,
      sim_color: ele.sim_color,
      company_state: ele.company_state,
      shop_state: ele.shop_state,
      company_penefit_type: ele.company_penefit_type,
      shop_penefit_type: ele.shop_penefit_type,
    };
    info.push(Sinfo);
  });
  console.log(info);
}
async function applyFuncs() {
  check_activation();
  setSimColor();
  setActivation();
  companyAndShop_activation();
  manageAndEditPenefits();
}
//'controling funcs
async function check_activation() {
  console.log(company_edit);
  info.map((ele, index) => {
    if (ele.simstate == 1) {
      checks[index].checked = true;
    } else {
      companey_checks[index].disabled = true;
      companey_checks[
        index
      ].parentElement.parentElement.parentElement.style.opacity = "0.5";
      shop_checks[index].disabled = true;
      shop_checks[
        index
      ].parentElement.parentElement.parentElement.style.opacity = "0.5";
      company_edit[index].parentElement.classList.replace("mt-2", "mt-3");
      company_edit[index].parentElement.style.opacity = "0.5";
      company_edit[index].classList.add("d-none");
      shop_edit[index].parentElement.classList.replace("mt-2", "mt-3");

      shop_edit[index].parentElement.style.opacity = "0.5";
      shop_edit[index].classList.add("d-none");
      colors[index].parentElement.parentElement.classList.replace(
        "mt-2",
        "mt-3"
      );
      colors[index].parentElement.parentElement.style.opacity = "0.5";
      colors[index].classList.add("d-none");
    }
  });
}
async function setSimColor() {
  let box = document.querySelector(".colors-box");
  close(document.querySelector(".colors-closer i"), box, false);
  let colors = [
    "rgb(255, 0, 0)",
    "rgb(48, 161, 48)",
    "rgb(7, 7, 219)",
    "rgb(255, 255, 0)",
    "rgb(255, 0, 255)",
    "rgb(69, 179, 179)",
    "rgb(128, 0, 128)",
    "rgb(0, 128, 128)",
    "rgb(255, 165, 0)",
    "rgb(128, 0, 0)",
    "rgb(128, 128, 0)",
    "rgb(0, 0, 128)",
    "rgb(128, 128, 128)",
    "rgb(192, 192, 192)",
    "rgb(255, 99, 71)",
    "rgb(70, 130, 180)",
  ];

  let colorsBox = document.querySelectorAll("span.change label");
  let choose = document.querySelector(".choose-color");
  let colorsItemsBox = document.querySelector(".colors-items-box");
  colors.forEach((ele, index) => {
    colorsItemsBox.innerHTML += colorsIt(ele);
  });
  let itms = document.querySelectorAll(".color-item");

  info.map((ele, index) => {
    colorsBox[index].style.backgroundColor = `${ele.sim_color}`;
    colorsBox[
      index
    ].parentElement.previousElementSibling.firstElementChild.textContent =
      ele.sim_color;
  });
  colorsBox.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      box.classList.replace("d-none", "d-flex");
      choose.textContent = info[index].simname;
      itms.forEach((ele) => {
        ele.addEventListener("click", (e) => {
          fetch(
            `../../routers/settings/sim_info/put_siminfo.php?id=${index + 1}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: JSON.stringify({ sim_color: e.target.dataset.color }),
            }
          ).then((res) => {
            if (res.ok) {
              Swal.fire({
                icon: "success",
                title: "تم التعديل بنجاح",
              }).then(() => window.location.reload());
            } else {
              Swal.fire({
                icon: "error",
                title: "حدث خطأ",
              });
            }
          });
        });
      });
    });
  });
}
//'activation funcs
async function setActivation() {
  checks.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      let stat = 0;
      e.target.checked == true ? (stat = 1) : (stat = 0);
      fetch(`../../routers/settings/sim_info/put_siminfo.php?id=${index + 1}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({ simstate: stat }),
      }).then((res) => {
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "تم التعديل بنجاح",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({
            icon: "error",
            title: "حدث خطأ",
          });
        }
      });
    });
  });
}
async function companyAndShop_activation() {
  //'check
  info.forEach((ele, index) => {
    if (info[index].company_state == 1) {
      companey_checks[index].checked = true;
    }
    if (info[index].shop_state == 1) {
      shop_checks[index].checked = true;
    }
  });
  //'set
  let state = {
    company: 0,
    shop: 0,
  };
  companey_checks.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      e.target.checked == true ? (state.company = 1) : (state.company = 0);
      controle(e.target, index, { company_state: state.company });
    });
  });

  shop_checks.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      e.target.checked == true ? (state.shop = 1) : (state.shop = 0);
      controle(e.target, index, { shop_state: state.shop });
    });
  });

  function controle(item, index, handle) {
    if (!item.disabled) {
      let state = fetch(
        `../../routers/settings/sim_info/put_siminfo.php?id=${index + 1}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(handle),
        }
      ).then((res) => {
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "تم التعديل بنجاح",
          }).then(() => window.location.reload());
        } else {
          Swal.fire({
            icon: "error",
            title: "حدث خطأ",
          });
        }
      });
    }
  }
}
//'manage and edit penefits
async function manageAndEditPenefits() {
  //'helper funcs
  close(
    document.querySelector(".edit-closer"),
    document.querySelector(".edit-box"),
    false
  );
  switchChoises();
  show_penefits();
  //'code
  const clickers = document.querySelectorAll(".per-edit ");
  clickers.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      if (e.target.dataset.edit == "company") {
        showEditBox(
          "الشركه",
          e.target.parentElement.parentElement.parentElement
            .previousElementSibling.textContent,
          e.target.dataset.edit
        );
        applyNewPenefit(
          e.target.parentElement.parentElement.parentElement
            .previousElementSibling.parentElement.parentElement.dataset.id,
          "companey"
        );
      } else if (e.target.dataset.edit == "shop") {
        showEditBox("المحل", "__", e.target.dataset.edit);
        applyNewPenefit(
          e.target.parentElement.parentElement.parentElement
            .previousElementSibling.parentElement.parentElement.dataset.id,
          "shop"
        );
      }
    });
  });
}
async function show_penefits() {
  const company = document.querySelectorAll(".com-p");
  const shop = document.querySelectorAll(".shop-p");
  company.forEach((ele,index) => {
    let st = "%";
    if (info[index].company_penefit_type == 1) {
      st = "جنيه";
    }
    console.log(info);
      ele.firstElementChild.firstElementChild.textContent = info[index].sim_companey  + " " + st
  });
  shop.forEach((ele,index) => {
    let st = "%";
    if (info[index].shop_penefit_type == 1) {
      st = "جنيه";
    }
    console.log(info);
      ele.firstElementChild.firstElementChild.textContent = info[index].sim_shop  + " " + st
  });
}
async function showEditBox(loc, nm, target) {
  const choises = document.querySelectorAll(".choose");
  const box = document.querySelector(".edit-box");
  const loaction = document.querySelector("span.location");
  const Name = document.querySelector("span.name");
  box.classList.replace("d-none", "d-flex");
  choises[0].classList.add("active");
  choises[1].classList.remove("active");
  input.placeholder = " اكتب النسبه الجديده";
  input.dataset.mstate = "0";
  loaction.textContent = loc;
  Name.textContent = nm;
  input.dataset.target = target;
}
async function switchChoises() {
  const choises = document.querySelectorAll(".choose");
  choises.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      choises.forEach((el) => el.classList.remove("active"));
      e.target.classList.add("active");
      input.value = "";
      e.target.dataset.type == "mblh"
        ? (input.placeholder = "اكتب المبلع الجديد")
        : (input.placeholder = "اكتب النسبه الجديده"),
        e.target.dataset.type == "mblh"
          ? (input.dataset.mstate = 1)
          : (input.dataset.mstate = 0);
    });
  });
}
async function applyNewPenefit(index, st) {
  let obj;
  const btn = document.querySelector(".per-group button");
  btn.addEventListener("click", () => {
    if (st == "shop") {
      obj = {
        sim_shop: input.value.trim(),
        shop_penefit_type: input.dataset.mstate,
      };
    } else {
      obj = {
        sim_company: input.value.trim(),
        company_penefit_type: input.dataset.mstate,
      };
    }
    fetch(`../../routers/settings/sim_info/put_siminfo.php?id=${+index + 1}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(obj),
    }).then((res) => {
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التعديل بنجاح",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ",
        });
      }
    });
  });
}