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
    theme(data[0].site_style)

  }
}
async function theme(s) {
  let root = document.querySelector(":root");
  console.log(root
  );
  
  let dark = {                                           
    "--background-color": "#080c14",
  "--main-color": "#111827",
  "--titles-color": "white",
  "--second-color": "#7d0633",
  "--thered-color": "rgb(31, 34, 38)",
  "--fourth-color": "#2465f0",
  "--five-color": "#ba9544",
  "--six-color": "#4e3434",
  "--seven-color": "#5c5470",
  "--eight-color": "#1e76c4"              
    
  }
  let light= {
      "--background-color": "#eceff4",
      "--main-color": "#f3f4f6",
      "--titles-color": "rgb(1, 1, 1)",
      "--second-color": "#ff2949",
      "--thered-color": "rgb(156, 163, 175)",
      "--fourth-color": "#6abff7",
      "--five-color": "#791aa5",
      "--six-color": "#ff9100",
      "--seven-color": "#a600ff",
      "--eight-color": "#1e76c4"
    };
    
  if (s == 0) {

    for (const [key,value] of Object.entries(light)) {
      root.style.setProperty(`${key}`,`${value}`)
      
      console.log(key,value);
      
    }
  }else{
    for (const [key,value] of Object.entries(dark)) {
      root.style.setProperty(`${key}`,`${value}`)
      console.log(key,value);
      
    }
  }
  }
  

change_global_settings();
