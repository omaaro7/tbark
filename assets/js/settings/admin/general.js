//'afterload
let info = "";
window.onload = async () => {
  async function getInfo() {
    const res = await fetch(
      "../../routers/settings/site_info/get_siteinfo.php"
    );
    const data = await res.json();
    console.log(data);
    info = {
      site_name: data[0].site_name,
      site_style: data[0].site_style,
      site_font: data[0].site_font,
      time_show: data[0].time_show,
      date_show: data[0].date_show,
      day_show: data[0].day_show,
      simmanagment_page: data[0].simmanagment_page,
      operations_page: data[0].operations_page,
      reports_page: data[0].reports_page,
      bestclients_page: data[0].bestclients_page,
      safes_page: data[0].safes_page,
      suporticon: data[0].suporticon,
      notes: data[0].notes,
    };
    if (localStorage.getItem("general_settings") == null) {
      localStorage.setItem("generalsettings",JSON.stringify(info))
    }
  }
  async function applyFuncs() {
    changeSiteName();
    changeTheme();
    fontChanger();
    dateTimeDay_show()
  }
  const inf = await getInfo();
  const apl = await applyFuncs();
};

async function changeSiteName() {
  const box = document.querySelector(".site-name-changer");
  box.firstElementChild.lastElementChild.firstElementChild.lastElementChild.addEventListener(
    "click",
    (e) => {
      let data = {
        site_name:
          box.firstElementChild.lastElementChild.firstElementChild.firstElementChild.value.trim(),
      };
      console.log(data);
      fetch("../../routers/settings/site_info/put_siteinfo.php?id=1", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "تم التعديل بنجاح",
          });
        }
      });
    }
  );
}
async function changeTheme() {
  //!apply switch
  const togglers = document.querySelectorAll(
    ".theme .box-container .box-content div .toggel label input"
  );
  
  togglers.forEach((ele, index) => {
    if (ele.dataset.style == info.site_style) {
      ele.checked = true
    }
    ele.addEventListener("click", (e) => {
      togglers.forEach((ele) => {
        ele.checked = false;
      });
      if (e.target.checked) {
        e.target.checked = false;
        index == 0 ? (togglers[1].checked = true) : (togglers[0].checked = tue);
      } else {
        e.target.checked = true;
        fetch("../../routers/settings/site_info/put_siteinfo.php?id=1",{
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify({
            site_style: e.target.dataset.style,
          }),
        }).then((res) => {
          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "تم التعديل بنجاح",
            }).then(() =>
              setTimeout(() => {
                window.location.reload();
              }, 1000)
            );
          } else {
            Swal.fire({
              icon: "error",
              title: "حدث خطأ",
            });
      }})
      }
    });
  });
}
async function fontChanger() {
  const menuClicker = document.querySelector(".drop-menu-box");
  const menu = document.querySelector(".menu");
  const fonts = document.querySelectorAll(".menu .font");
  //show or hide menu
  menuClicker.addEventListener("click", (e) => {
    menu.classList.toggle("d-none");
    menuClicker.lastElementChild.firstElementChild.classList.toggle("fa-angle-up")
  });
  //change font
  fonts.forEach((ele, index) => {
    ele.addEventListener("click", (e) => {
      fetch("../../routers/settings/site_info/put_siteinfo.php?id=1", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          site_font: e.target.dataset.font,
        }),
      }).then((res) => {
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "تم التعديل بنجاح",
          }).then(() =>
            setTimeout(() => {
              window.location.reload();
            }, 1000)
          );
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
async function dateTimeDay_show () {
  const togglers = document.querySelectorAll(
    ".times .box-container .box-content div .toggel label input"
  );
  togglers.forEach((ele,index) => {
    let val = ele.dataset.inf
    if (info[`${val}_show`]== 1) {
      ele.checked = true
    }
  })
}