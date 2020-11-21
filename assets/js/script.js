//Main Variables
var main = $(".card-body");
var cityhistory = [];
 
//Var for Wheater Items for City 
var item = function () {
   var citystored = JSON.parse(localStorage.getItem("cityhistory"));
   if (citystored !== null) {
     cityhistory = citystored;
     for(var i=0;i<cityhistory.length;i++) {
         if(i==8){
             break;
         }
       //  creates links/buttons https://getbootstrap.com/docs/4.0/components/list-group/
       citylist = $("<a>").attr({
         class: "list-group-item list-group-item-action",
         href: "#",
         "data-btn-num": i
       });
         // appends history as a button below the search field
         citylist.text(cityhistory[i]);
         $(".list-group").append(citylist);      
     }
   }
};

// Save City Name to LocalStorage 
var savecity = function(city){
    var inArray = cityhistory.includes(city);
    if(!inArray && city !==""){
        cityhistory.push(city);
        localStorage.setItem("cityhistory", JSON.stringify(cityhistory));
        var citylist = $("<a>").attr(
            {
                class:"list-group-item list-group-item-action",
                href: "#",
                "data-btn-num": cityhistory.length
            }
        );
        citylist.text(city);
        $(".list-group").append(citylist);

    }
};



 
item();
 