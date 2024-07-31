let info = {};
window.onload = async () => {
  const inf = await getInfo();
  const apl = await aplyFuncs();
};
async function getInfo() {
  const res = await fetch(
    `../../routers/settings/operations/get_operations_info.php`
  );
  const data = await res.json();
  if (!res.ok) {
    Swal.fire({
      icon: "error",
      title: "حدث خطأ",
    });
  }
  info = {
    autoshow_type: data[0].autoshow_type,
    autoshow_company_benefit: data[0].autoshow_company_benefit,
    autoshow_shop_benefit: data[0].autoshow_shop_benefit,
    add_sound: data[0].add_sound,
    list: data[0].list,
    cards: data[0].cards,
    photo_on_card: data[0].photo_on_card,
    simnum_show: data[0].simnum_show,
    simtype_show: data[0].simtype_show,
    clientnum_show: data[0].clientnum_show,
    date_show: data[0].date_show,
    time_show: data[0].time_show,
    operationtype_show: data[0].operationtype_show,
    money_show: data[0].money_show,
    shop_show: data[0].shop_show,
    companeyt_show: data[0].companeyt_show,
    total_show: data[0].total_show,
  };
}
async function aplyFuncs () {
  manageSwitches()
}
async function manageSwitches () {
    const switches = document.querySelectorAll("input");
    //'manage togling
    switches.forEach((ele) => {
      if (info[`${ele.dataset.option}`] == 1) {
        ele.checked = true
      }
    })
    //'send values
    switches.forEach((ele,index) => {
        ele.addEventListener("click" , (e) => {
          let st
          let data = {}
          e.target.checked ? st = 1 : st =0
          data[`${e.target.dataset.option}`] = st
          fetch("../../routers/settings/operations/put_operations_info.php?id=1",{
            headers: {
              "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(data),
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
        } ) 
    })
}