import { close } from "../../tools/global_functions.js";
let info;
window.onload = async () => {
  const inf = await get_info();
  const apl = await aply_funcs();
};
async function get_info() {
  const res = await fetch(`../../routers/settings/about/get_shopinfo.php`);
  const data = await res.json();
  if (!res.ok) {
    Swal.fire({
      icon: "error",
      title: "حدث خطأ",
    });
  }
  info = {
    shop_name: data[0].shop_name,
    shop_number: data[0].shop_number,
    shop_img: data[0].shop_img,
    shop_adress: data[0].shop_adress,
    manager_name: data[0].manager_name,
    manager_number:data[0].manager_number
  };
}
async function aply_funcs() {
  upload_photo();
  manage_changing(
    document.querySelector(".shop_name"),
    document.querySelector(".shop_name_in"),
    "shop_name"
  );
  manage_changing(
    document.querySelector(".shop_adress"),
    document.querySelector(".shop_adress_in"),
    "shop_adress"
  );
  manage_changing(
    document.querySelector(".man_num"),
    document.querySelector(".man_num_in"),
    "manager_number"
  );
  manage_changing(
    document.querySelector(".man_name"),
    document.querySelector(".man_name_in"),
    "manager_name"
  );
  show_info()
}
async function manage_changing(btn, inp, nm) {
  btn.addEventListener("click", () => {
    let dt = {};
    dt[`${nm}`] = inp.value.trim();
    fetch(`../../routers/settings/about/put_shopinfo.php?id=1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dt),
    }).then((res) => {
      if (res.ok) {
        Swal.fire({
          icon:"success",
          title: "تم التعديل بنجاح",

        }).then(() => {
          window.location.reload()
        })
      }else{
        Swal.fire({
          icon:"error",
          title: "حدث خطأ",
        })
      }
    })
  });
}
async function show_info () {
  let infoImg = document.querySelector(".info .info-img img")
  let allInfo = document.querySelectorAll(".info .info-box .info-main")
  infoImg.src = `../../uploads/${info.shop_img}`
  allInfo[0].textContent = info.shop_name
  allInfo[1].textContent = info.shop_adress
  allInfo[2].textContent = info.manager_name
  allInfo[3].textContent = info.manager_number
}
async function upload_photo() {
  const formEle = document.querySelector("#imgs");
  const fileinp = document.querySelector("#img");
  const label = document.querySelector("label.im");
  fileinp.addEventListener("input", (e) => {
    console.log(e.target.files[0]);
    label.firstElementChild.classList.add("d-none");
    label.lastElementChild.classList.remove("d-none");
    label.lastElementChild.src = URL.createObjectURL(e.target.files[0]);
  });
  formEle.addEventListener("submit", (e) => {
    let formDate = new FormData(formEle);
    let file = fileinp.files[0];
    console.log(file);
    e.preventDefault();
    formDate.append("image", file);
    fetch("../../routers/settings/about/upload_img.php", {
      method: "POST",
      body: formDate,
    }).then((res) => {
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "تم التعديل بنجاح",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "حدث خطأ",
        });
      }
    });
  });
}
