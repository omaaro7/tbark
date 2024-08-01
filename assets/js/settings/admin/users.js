import { user } from "../../tools/card.js";
import { close } from "../../tools/global_functions.js";
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
  editUser();
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

async function editUser() {
  async function getUserInfo(id) {
    const res = await fetch(
      `../../routers/settings/users/get_users.php?id=${id}`
    );
    const data = await res.json();
    return data;
  }

  const editers = document.querySelectorAll(".edit_user i");
  const box = document.querySelector(".edit-box.user");
  const closer = document.querySelector(".closer.edit-user-closer i");
  const labels = document.querySelectorAll(".edit-box.user .options .line");
  const save = document.querySelector(".save button");
  let dt = {};
  close(closer, box, false);
  closer.addEventListener("click", (e) => {
    labels.forEach((ele) => {
      ele.lastElementChild.value = "";
    });
    dt = {};
  });
  editers.forEach((ele) => {
    ele.addEventListener("click", async (e) => {
      box.classList.replace("d-none", "d-flex");
      console.log(labels);
      const id = e.target.parentElement.dataset.id;
      const inf = await getUserInfo(id);
      let s;
      let t;
      inf.type == 0 ? (t = "مشرف") : (t = "admin");
      inf.stat == 0 ? (s = "مفعل") : (s = "معطل");
      labels[0].parentElement.previousElementSibling.firstElementChild.textContent =
        inf.user_name;
      labels[0].firstElementChild.firstElementChild.textContent = inf.user_name;
      labels[1].firstElementChild.firstElementChild.textContent =
        inf.phone_number;
      labels[2].firstElementChild.firstElementChild.textContent = t;
      labels[3].firstElementChild.firstElementChild.textContent = s;
      save.addEventListener("click", async (event) => {
        dt = {};
        labels.forEach((ele) => {
          if (ele.lastElementChild.value.trim() !== "") {
            dt[ele.lastElementChild.dataset.op] =
              ele.lastElementChild.value.trim();
          }
        });
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
            fetch(` ../../routers/settings/users/put_user.php?id=${id}`, {
              method: "PUT",
              body: JSON.stringify(dt),
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
    });
  });
}
async function deleteUser () {
  const deleters = document.querySelectorAll(".delete_user i");
  deleters.forEach((deleter) => {
    deleter.addEventListener("click", async () => {
      const id = deleter.parentElement.dataset.id;
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
          fetch(` ../../routers/settings/users/delete_user.php?id=${id}`, {
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
    })
  })

}