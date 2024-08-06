async function change_global_settings() {
  let arr = window.location.pathname.split("/");
  let url = "routers/settings/site_info/get_siteinfo.php";
  if (arr.includes("pages")) {
    console.log("pages");
    url = `../routers/settings/site_info/get_siteinfo.php`;
    if (arr.includes("settings")) {
      url = `../../routers/settings/site_info/get_siteinfo.php`;
    }
  }
  const site_name = document.querySelector("header .logoAndName .name");
  const site_logo = document.querySelector("header .profile .img");
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    Swal.fire({
      icon: "error",
      text: "error",
    });
  } else {
    let path = `uploads/${data[0].shop_img}`;
    if (arr.includes("pages")) {
      console.log("pages");
      path = `../uploads/${data[0].shop_img}`;
      if (arr.includes("settings")) {
        path = `../../uploads/${data[0].shop_img}`;
      }
    }
    site_name.textContent = data[0].site_name;
    site_logo.firstElementChild.src = `${path}`;

  }
}

  

change_global_settings();
