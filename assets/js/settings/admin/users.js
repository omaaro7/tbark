import { user } from "../../tools/card.js";

let info = [];
let all = 0;
let admins = 0;
let workers = 0;
window.onload = async () => {
  const inf = await getInfo();
  const apl = await aplyFuncs();
};
async function getInfo() {
  const res = await fetch(`../../routers/settings/users/get_users.php`);
  const data = await res.json();
  const maping = await data.map((ele) => {
    all++;
    if (ele.type == 0) admins++;
    if (ele.type == 1) workers++;

    let sInfo = {
      id: ele.id,
      user_name: ele.user_name,
      password: ele.password,
      phone_number: ele.phone_number,
      stat: ele.stat,
      type: ele.type,
    };
    info.push(sInfo);
  });
}
async function aplyFuncs() {
  setUsersNumbers();
  const t = await putUsersInTable();
  deleteUser();
  editUser()
}
async function setUsersNumbers() {
  const boxes = document.querySelectorAll("div.number");
  boxes[0].textContent = all;
  boxes[1].textContent = admins;
  boxes[2].textContent = workers;
}
async function putUsersInTable() {
  const tb = document.querySelector("tbody");
  info.forEach((ele) => {
    let tp = "";
    let st = "";
    let kd = "";
    ele.type == 0 ? (tp = "مشرف") : (tp = "عامل");
    ele.type == 0 ? (kd = "admin") : (kd = "user");
    ele.stat == 0 ? (st = "معطل") : (st = "مفعل");
    tb.innerHTML += user(ele.id, ele.user_name, ele.phone_number, tp, st, kd);
  });
}
async function deleteUser() {
  const deleters = document.querySelectorAll(".delete_user i");
  deleters.forEach((ele) => {
    ele.addEventListener("click", (e) => {
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
          fetch(
            ` ../../routers/settings/users/delete_user.php?id=${e.target.parentElement.dataset.id}`,
            {
              method: "delete",
            }
          ).then((res) => {
            res.json();
            if (!res.ok) {
              Swal.fire({
                title: "حدث خطأ",
                icon: "error",
              });
            } else {
              Swal.fire({
                title: "تم الحذف بنجاح ",
                icon: "success",
              }).then(() => {
                window.location.reload();
              });
            }
          });
        }
      });
    });
  });
}
async function editUser () {}