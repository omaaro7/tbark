//---------------------------sim cards page----------------------------
export const simCard = (number, name, id,type) => {
  const item = `
  <tr class="${type}">
                    <td data-label="الرقم">${number}</td>
                    <td data-label="اسم الخط">${name}</td>
                    <td data-label="اسم الخط">${type}</td>
                    <td data-label="تعديل" class="edi">
                  <div class="edit" data-id="${id}"><i class="fa-regular fa-pen-to-square"></i></div>
                </td>
                <td data-label="حذف" class="del">
                    <div class="delete" data-id="${id}"><i class="fa-regular fa-trash"></i></div>
                </td>
                </tr>`;
  return item;
};
//--------------------------best clients page----------------------------
//create client card
export const client = (name, number, cridet, id) => {
  const item = `
        <div class="user-box mt-3 col-12 col-md-6 col-lg-4 col-xl-3 px-2 d-flex justify-content-center">
        <div class="user col-11 px-3 py-3" data-id="${id}">
          <div class="imgContainer col-12 d-flex justify-content-center">
            <img src="../assets/imgs/user.png" alt="">
          </div>
          <div class="infoContainer  col-12 mt-2">
            <div class="name-box col-12">
              الاسم :  <span class="col-12"> ${name}</span>
            </div>
            <div class="number-box col-12 mt-2">
              الرقم :  <span>${number}</span>
            </div>
            <div class="cridet-box col-12 mt-2">
              الرصيد المعتاد :  <span>${cridet}</span>
            </div>
          </div>
          <div class="options-container col-12 d-flex justify-content-between flex-wrap mt-3">
            <button class="option col-5 mt-2 ope" data-id="${id}"> عمليه</button>
            <button class="option col-5 mt-2 history" data-id="${id}">السجل</button>
            <button class="option col-5 mt-2 edit" data-id="${id}">تعديل</button>
            <button class="option col-5 mt-2  delete" data-id="${id}">حذف</button>
          </div>
        </div>
      </div>
        `;
  return item;
};
//info box
export const infoBox = (name,number,cridet) => {
  const item = `
  <div class="client-info-con col-12 d-flex justify-content-between mt-1 pb-1">
              <div class="client-name col-4 d-flex justify-content-start">اسم العميل : <span>${name} </span></div>
              <div class="client-num col-4 d-flex justify-content-center">رقم العميل : <span>${number}</span></div>
              <div class="client-cridet col-4 d-flex justify-content-end">الرصيد المعتاد : <span>${cridet}</span></div>
            </div>`;
  return item;
};
//history item box 
export const historyItem = (sim,money,ope,baky,date,time) => {
  let op = ""
  ope == "0" ? op ="تحويل": op = "استلام"
  const item = `
  <div class="hist-item  col-12 d-flex p-2 mt-1">
                <div class="sim_card col-2 d-flex justify-content-center">${sim}</div>
                <div class="money col-2 d-flex justify-content-center">${money}</div>
                <div class="type col-2 d-flex justify-content-center">${op}</div>
                <div class="baky col-2 d-flex justify-content-center">${baky}</div>
                <div class="date col-2 d-flex justify-content-center">${date}</div>
                <div class="time col-2 d-flex justify-content-center">${time}</div>
                </div>`
    return item
}
//--------------------operations page-------------------
//operation card
export const card = (
  id,
  simCardNumber,
  client_number,
  money,
  opeS,
  dateDay,
  time,
  baky
) => {
  let opeStatues;
  let agl;
  let debt;
  let agld;
  let debtd;
  if (opeS == 0) {
    opeStatues = "تحويل";
    agl = baky;
    debt = "0";
    agld = "block";
    debtd = "none";
  } else {
    opeStatues = "استلام";
    agl = "0";
    debt = baky;
    agld = "none";
    debtd = "debt";
  }
  const item = `
    <div
                        class="ope-container mt-3 col-10 col-md-6 col-lg-4 col-xl-3 px-2 d-flex justify-content-center" data-id="${id}" data-opeT="${opeS}" data-aos="zoom-in" data-aos-duration="600"
                      >
                        <div class="ope col-11 px-3 py-3" >
                          <div class="imgContainer col-12 d-flex justify-content-center">
                            <img src="../assets/imgs/d.png" alt="" />
                          </div>
                          <div class="infoContainer col-12 mt-3">
                            <div class="shop-number-box col-12">
                              رقم خط المحل : <span class="col-12 ">${simCardNumber}</span>
                            </div>
                            <div class="client-number-box col-12 mt-2">
                              رقم العميل : <span>${client_number}</span>
                            </div>
                            <div class="cridet-box col-12 mt-2">
                              المبلغ : <span>${money}</span>
                            </div>
                            <div class="ope-box col-12 mt-2">
                              نوع العمليه : <span>${opeStatues}</span>
                            </div>
                            <div class="date-box col-12 mt-2">
                               التاريخ : <span>${dateDay}</span>
                            </div>
                            <div class="time-box col-12 mt-2">
                               الوقت : <span>${time}</span>
                            </div>
                            <div class="agl-box col-12 mt-2 d-${agld}">الآجل : <span>${agl}</span></div>
                            <div class="debt-box col-12 mt-2 d-${debtd}">الدين : <span>${debt}</span></div>
                          </div>
                          <div
                            class="options-container col-12 d-flex justify-content-between flex-wrap mt-3"
                          >
                            <button class="option bt col-12 col-md-5 mt-2 edit" data-id="${id}">
                              تعديل
                            </button>
                            <button class="o bt col-12 col-md-5 mt-2 delete" data-id="${id}">
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                      `;

  return item;
};
//money back item
export const moneyBack = (number, money, id, mg) => {
  const item = `<div class="agl-g col-12 d-flex justify-content-between p-2 mt-1">
              <div class="agl-number col-3 d-flex align-items-center">
                ${number}
              </div>
              <div
                class="agl-money col-3 d-flex justify-content-center align-items-center"
              >
                ${money}
              </div>
              <div class="agl-clickers col-4 d-flex justify-content-end">
                <button class="given-part px-3 py-2" data-id="${id}"> ${mg} جزء</button>
                <button class="given-all me-2 px-3 py-2" data-id="${id}">${mg} الكل</button>
              </div>
            </div>`;
  return item;
};
//money back part send or recive
export const part = (type, num, id, baky) => {
  const item = `
        <div class="part-box col-11 col-md-9 col-lg-7 col-xl-5 px-2 py-3">
          <div class="closer  position-absolute top-3">
            <i class="fa-sharp fa-solid fa-circle-xmark"></i>
          </div>
          <div
            class="part-box-title col-12 text-center fs-5 pb-2 mt-2"
            style="color: var(--titles-color)"
          >
            <span>${type}</span> : <span>${num}</span>
          </div>
          <div class="part-box-form col-12 d-flex justify-content-around">
            
            <input
              type="number"
              placeholder="اكتب المبلغ..."
              class="recivedSend col-5 py-1 px-2 rounded-2"
              style="border: 2px solid var(--second-color)"
            />
            <div class="col-1 text-center d-flex align-items-center justify-content-center">من</div>
            <div
              class="main-part col-3 py-1 px-2 rounded-3 text-center"
              style="border: 2px dashed var(--fourth-color)"
            >${baky} جنيه</div>
            <button
              class="col-2 py-1 px-2 rounded-3"
              style="
                border: 2px solid var(--second-color);
                background-color: var(--second-color);
                color: var(--main-color);
                transition: all 0.5s;
              "
              data-id="${id}"
            >
              تأكيد
            </button>
          </div>
        </div>
`;
  return item;
};
//money back search (filter)
export const moneyBackSearch = (moneyType, searchType, searchTitle) => {
  const item = `
    <div class="show-number col-11 col-md-9 col-lg-6 py-3 px-2">
          <div class="closer position-absolute top-3">
            <i class="fa-sharp fa-solid fa-circle-xmark"></i>
          </div>
          <div class="show-number-title col-12 text-center mt-2 fs-5">بحث عن ${moneyType} ${searchType}</div>
          <div class="show-number-form col-12 mt-2 d-flex justify-content-between">
            <input type="number" class="show-number-input col-9 py-1" placeholder="${searchTitle}... "/>
            <button type="button" class="col-2 show-number button py-1">
              اظهار
            </button>
          </div>
        </div>
  `;
  return item;
};
//if no res
export const nores = (text, size) => {
  const item = `
    <div class="nores col-${size} text-center rounded-3 py-3 fs-5" style="background: var(--fourth-color);margin: auto;color: var(--main-color);">${text}</div>
  `;
  return item;
};

//---------------------------settings---------------------------
//sim cards
export const colorsIt =  (bac) => {
  const item = `
  <div class="color-item-box col-12 col-lg-4 col-xl-3 mt-2 ">
            <div class="color-item col-11" style="background:${bac}" data-color="${bac}"></div>
          </div>`
          return item;
}
//users
export const user = (id,userName,phoneNumber,type,statues,st) => {
  const item = `
  <tr class="${st}">
                  <td data-label="اسم المستخدم">${userName}</td>
                  <td data-label="  الهاتف">${phoneNumber}</td>
                  <td data-label=" نوع المستخدم">${type}</td>
                  <td data-label=" الحاله">${statues}</td>
                  <td data-label="تعديل" class="edi">
                    <div class="edit_user" data-id="${id}">
                      <i class="fa-regular fa-pen-to-square"></i>
                    </div>
                  </td>
                  <td data-label="حذف" class="del">
                    <div class="delete_user" data-id="${id}">
                      <i class="fa-solid fa-trash"></i>
                    </div>
                  </td>
                </tr>
  `
  return item
}