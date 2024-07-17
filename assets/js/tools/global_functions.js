import {
  getCurrentDate,
  getDateAfterOneDay,
  getCurrentTime,
  getCurrentArabicDay,
  getDateAfterOneMonth,
  getDateAfterOneWeek,
} from "./createDateAndTimeAndDay.js";
//close over window
let closing = new Audio("../assets/audio/close.mp3")
export const close = async (cl,bo,stat) =>{
    cl.addEventListener("click", () => {
        closing.volume = 0.1;
        closing.play();
        stat == true
          ? (bo.firstElementChild.lastElementChild.innerHTML = "")
          : ""
        bo.classList.replace("d-flex", "d-none");
      });
}
//show simCards in form
export const showShopSimCards = async (clicker, box, func, t)  => {
    let items;
    if (!clicker.hasEventListener) {
      clicker.addEventListener("click", () => {
        box.classList.replace("d-none", "d-flex");
        box.style.zIndex = "10000";
        fetch(" ../routers/simCards/get_simCards.php")
          .then((res) => res.json())
          .then((data) => {
            box.firstElementChild.lastElementChild.innerHTML = "";
            data.forEach((ele) => {
              let item = `<div class="itm p-2 col-12 text-center mt-2">${ele.number}</div>`;
              box.firstElementChild.lastElementChild.innerHTML += item;
            });
            if (data.length == 0) {
              noRes(
                box.firstElementChild.lastElementChild,
                "لم يتم اضافة خطوط",
                "11"
              );
            }
            items = document.querySelectorAll(".itm");
            items.forEach((ele) => {
              ele.addEventListener("click", (e) => {
                clicker.value = e.target.innerHTML;
                box.firstElementChild.lastElementChild.innerHTML = "";
                box.classList.replace("d-flex", "d-none");
                func;
              });
            });
            close(document.querySelector(`.simCards-closer-${t} i`), box, false);
          })
          .catch((error) => {
            console.error("Error fetching SIM cards:", error);
          });
      });
      clicker.hasEventListener = true;
    }
  }
//show operation types in form
export const   showOpeType = async (clicker, box) =>  {
    let itms = document.querySelectorAll(".opeShower .item");
    clicker.addEventListener("click", (e) => {
      box.classList.replace("d-none", "d-flex");
      box.style.zIndex = "10000";
      itms.forEach((ele) => {
        ele.addEventListener("click", (e) => {
          clicker.value = e.target.innerHTML.trim();
          clicker.setAttribute("data-ope", e.target.dataset.id);
          box.classList.replace("d-flex", "d-none");
        });
      });
    });
  }
  //safe managment
export const  sendMoneyToAllSafs = (i) =>  {
  fetch(` ../routers/safes/get_safe.php?id=${i}`)
    .then((res) => res.json())
    .then((data) => {
      let startDate = data.startDate;
      let endDate = data.endDate;
      var endnumericValue = endDate.split("/");
      var After = getCurrentDate().split("/");
      if (endnumericValue[0].length == 1) {
        endnumericValue[0] = "0" + endnumericValue[0];
      }
      if (After[0].length == 1) {
        After[0] = "0" + After[0];
      }
      const endVal = parseInt(endnumericValue.reverse().join(""));
      const AfterVal = parseInt(After.reverse().join(""));
      console.log(AfterVal, endVal);
      const day = () => {
        if (AfterVal == endVal || AfterVal > endVal) {
          startDate = getCurrentDate();
          endDate = getDateAfterOneDay();
        }
      };
      const week = () => {
        if (AfterVal == endVal || AfterVal > endVal) {
          startDate = getCurrentDate();
          endDate = getDateAfterOneWeek();
        }
      };
      const month = () => {
        if (AfterVal == endVal || AfterVal > endVal) {
          startDate = getCurrentDate();
          endDate = getDateAfterOneMonth();
        }
      };
      if (i == "1") {
        day();
      }
      if (i == "2") {
        week();
      }
      if (i == "3") {
        month();
      }

      let end = {
        startDate: startDate,
        endDate: endDate,
      };
      fetch(` ../routers/safes/put_safe.php?id=${i}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(end),
      })
        .then((res) => {
          if (res.ok) {
            res.json();
          }
        })
        .then((d) => {});
    });
}
//check safe
export const  checkSafe = async () =>  {
  const res = await fetch("../routers/safes/get_safe.php");
  const data = await res.json();
  let stat = false
  let x = await data.map((ele, index) => {
    if (ele.startDate == "" || ele.endDate == "") {
      stat = true
      let dateF = ""
      if (index == 0) {
        dateF = getDateAfterOneDay()
      }if (index == 1) {
        dateF = getDateAfterOneWeek()
      }if (index == 2) {
        dateF = getDateAfterOneMonth()
      }
      fetch(`../routers/safes/put_safe.php?id=${index+1}`, {
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          startDate:getCurrentDate(),
          endDate:dateF
        })
      });
    }
  });
  if (stat == true) {
    Swal.fire({
      icon:"success",
      title:"تم تحديث التاريخ بنجاح"
    })
  }
}