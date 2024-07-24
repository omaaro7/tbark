async function change_global_settings() {
  const site_name = document.querySelector("header .logoAndName .name");
  const site_logo = document.querySelector("header .logoAndName .logo");
  const res = await fetch("routers/settings/site_info/get_siteinfo.php");
  const data = await res.json();
  if (!res.ok) {
    Swal.fire({
      icon: "error",
      text: "error",
    });
  } else {
    site_name.textContent = data[0].site_name
    console.log(data);
  }
}
change_global_settings();
