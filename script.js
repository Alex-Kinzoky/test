function print_table(table){
    let table_html = document.querySelector(".body-table")
    table_html.innerHTML = ""
    for (i=0; i< table.length; i++){
        table_html.innerHTML += `<tr id=${i}>
            <td>${table[i]["name"]["firstName"]}</td>
            <td>${table[i]["name"]["lastName"]}</td>
            <td>${table[i]["phone"]}</td>
            <td class="about-value">${table[i]["about"]}</td>
            <td>${table[i]["eyeColor"]}</td>
        </tr>`
    }
    let rows = table_html.querySelectorAll("tr")
    for (i=0;i<rows.length;i++){
        rows[i].addEventListener('click', print_row_info)
    }
}
//функция сортировки таблице по значениям колонки
function sort_column(table, column_name, column_table){
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
    print_table(table)
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
    document.querySelector("#Eye-Color").value = cells[4].innerHTML
    row_id = event.target.parentNode.getAttribute("id")
}

function save_change(table, index_row){
    table[index_row]["name"]["firstName"] = document.querySelector("#First-Name").value
    table[index_row]["name"]["lastName"] = document.querySelector("#Last-Name").value
    table[index_row]["phone"] = document.querySelector("#Phone").value
    table[index_row]["about"] = document.querySelector("#About").value
    table[index_row]["eyeColor"] = document.querySelector("#Eye-Color").value
    print_table(table)
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
}

window.addEventListener('load', function () {
    let row_id = NaN
    get_table_data().then((table_data) => {
        print_table(table_data)
        set_btn_func(table_data)
    })
    
    
    
})