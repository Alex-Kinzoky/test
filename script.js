function print_table(table,start,end){
    let table_html = document.querySelector(".body-table")
    table_html.innerHTML = ""
    for (i=start; i< end; i++){
        table_html.innerHTML += `<tr id=${i}>
            <td class="num0">${table[i]["name"]["firstName"]}</td>
            <td class="num1">${table[i]["name"]["lastName"]}</td>
            <td class="num2">${table[i]["phone"]}</td>
            <td class="about-value num3">${table[i]["about"]}</td>
            <td class="num4"><div style="background-color:${table[i]["eyeColor"]}; width:20px; height:20px"></div></td>
        </tr>`
    }
    let rows = table_html.querySelectorAll("tr")
    for (i=0;i<rows.length;i++){
        rows[i].addEventListener('click', print_row_info)
    }
}
//функция сортировки таблице по значениям колонки
function sort_column(table, column_name, column_table){
    let theads = document.querySelectorAll("thead")
    for (let i=0;i<theads.length;i+=1){
        theads[i].setAttribute("status", "no-sort")
    }
    let status = column_table.getAttribute("status")
    if (status == "no-sort" || status == "reverse"){
        if (column_name == "firstName" || column_name == "lastName"){
            table.sort((x, y) => x["name"][column_name].localeCompare(y["name"][column_name]))
        } else{
            table.sort((x, y) => x[column_name].localeCompare(y[column_name]))
        }
        column_table.setAttribute("status","sort")
        
    } else {
        if (column_name == "firstName" || column_name == "lastName"){
            table.sort((x, y) => y["name"][column_name].localeCompare(x["name"][column_name]))
        } else{
            table.sort((x, y) => y[column_name].localeCompare(x[column_name]))
        }
        column_table.setAttribute("status","reverse")
    }
    print_table(table,number_page*10,number_page*10+10)
}
//функция отображения данных ряда в форме редактирования
function print_row_info(event){
    let form = document.querySelector('.form')
    form.style.display = "block"
    let cells = event.target.parentNode.querySelectorAll("td")
    document.querySelector("#First-Name").value = cells[0].innerHTML
    document.querySelector("#Last-Name").value = cells[1].innerHTML
    document.querySelector("#Phone").value = cells[2].innerHTML
    document.querySelector("#About").value = cells[3].innerHTML
    document.querySelector("#Eye-Color").value = cells[4].querySelector("div").style.backgroundColor
    row_id = event.target.parentNode.getAttribute("id")
}

function save_change(table, index_row){
    table[index_row]["name"]["firstName"] = document.querySelector("#First-Name").value
    table[index_row]["name"]["lastName"] = document.querySelector("#Last-Name").value
    table[index_row]["phone"] = document.querySelector("#Phone").value
    table[index_row]["about"] = document.querySelector("#About").value
    table[index_row]["eyeColor"] = document.querySelector("#Eye-Color").value
    print_table(table,number_page*10,number_page*10+10)
}
function get_table_data(){
    return fetch('./data_table.json')
    .then(response => response.json())
    .then(json => {
        let table_data = []
        for (let i in json){
            table_data.push(
                {
                    "id":json[i]["id"],
                    "name":{
                        "firstName":json[i]["name"]["firstName"],
                        "lastName":json[i]["name"]["lastName"]
                    },
                    "phone":json[i]["phone"],
                    "about":json[i]["about"],
                    "eyeColor":json[i]["eyeColor"]
                }
            )
        }
        return table_data
    })
}
function change_page(table,new_page_btn){
    console.log(new_page_btn)
    number_page = +new_page_btn.innerHTML -1
    let last_page = document.querySelector(".active")
    last_page.classList.remove("active")
    new_page_btn.classList.add("active")
    print_table(table,number_page*10,number_page*10+10)
}
function create_btn_pages(table){
    let number_of_pages = Math.ceil(table.length/10)
    let div_btn_pg = document.querySelector(".btn-pages")
    for (let i = 1; i<=number_of_pages;i+=1){
        if (i==1){
            div_btn_pg.innerHTML += `<div class="btn-pg active">${i}</div>`
        } else{
            div_btn_pg.innerHTML += `<div class="btn-pg">${i}</div>`
        }
    }
    let buttons = document.querySelectorAll(".btn-pg")
    for (let i=0;i<buttons.length;i+=1){
        buttons[i].addEventListener('click',function(){change_page(table,buttons[i])})
    }
}
function col_visible(btn, col_num){
    let active = btn.classList
    let column = document.querySelectorAll(`.num${col_num}`)
    if (active.includes("active-hide")){
        btn.classList.remove("active-hide")
        for (let i=0;i<column.length;i+=1){
            column[i].style.display = "block"
        }
    } else{
        btn.classList.add("active-hide")
        for (let i=0;i<column.length;i+=1){
            column[i].style.display = "none"
        }
    }
}
function set_btn_func(table_data){
    //находим заголовки колонок и вешаем на них функцию сортировки при клике
    
    let firstname = document.querySelector(".firstname")
    firstname.addEventListener('click', function(){sort_column(table_data, "firstName", firstname)})
    let lastname = document.querySelector(".lastname")
    lastname.addEventListener('click', function(){sort_column(table_data, "lastName", lastname)})
    let phone = document.querySelector(".phone")
    phone.addEventListener('click', function(){sort_column(table_data, "phone", about)})
    let about = document.querySelector(".about")
    about.addEventListener('click', function(){sort_column(table_data, "about", about)})
    let eyecolor = document.querySelector(".eyecolor")
    eyecolor.addEventListener('click', function(){sort_column(table_data, "eyeColor", eyecolor)})

    let button_save = document.querySelector(".btn-save")
    button_save.addEventListener('click', function (){save_change(table_data, row_id)})
    let button_cancel = document.querySelector('.btn-cancel')
    button_cancel.addEventListener('click', print_row_info)

    let hide_col_btns = document.querySelectorAll(".hide_btn")
    for (let i=0; i<hide_col_btns.length;i+=1){
        hide_col_btns[i].addEventListener('click', function(){col_visible(hide_col_btns[i],i)})
    }
}

window.addEventListener('load', function () {
    let row_id = NaN
    let number_page = 0
    get_table_data().then((table_data) => {
        print_table(table_data,0,10)
        set_btn_func(table_data)
        create_btn_pages(table_data)
    })
    
    
    
})