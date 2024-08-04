async function manage_pages () {
    const pages_con = document.querySelectorAll(".item-container")
    const res = await fetch("routers/settings/site_info/get_siteinfo.php")
    const data = await res.json()
    let pages = {
        sims : data[0].simmanagment_page,
        operations:data[0].operations_page,
        reports:data[0].reports_page,
        bests:data[0].bestclients_page,
        safes:data[0].safes_page
    }
   pages_con.forEach((ele) => {
    if(pages[`${ele.dataset.item}`] == 0 ){
        ele.firstElementChild.href = "#"
        ele.style.opacity = "0.2"
        ele.classList.add("dis")
    }
   })
    
}
manage_pages()