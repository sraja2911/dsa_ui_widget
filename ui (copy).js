config = {}
config.BASE_URL = "http://candygram.neurology.emory.edu:8080/api/v1"

thumbHeight = 200;

function closeWindow() {
    $$("my_win").hide();
}

var window = webix.ui({
    view:"window",
    id:"my_win",
    modal: true,
    head:"DSA - Slide Properties",
    position: "center",
    height: 350,
    width: 350, 
    body:{
        rows: [
            {view:"button",value:"",click:closeWindow},
            {view:"template",id:"templateWin", template:"My box"}
        ]
    }   
})


  webix.type(webix.ui.dataview,{
            name:"smallThumb",
            template: "<br>#slideAbbrev# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail?width=128' >",
            width: 140,
            height: 140
        });

        webix.type(webix.ui.dataview,{
            name:"bigThumb",
            template: "<br>#name# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail?width=256' >",
            width: 260,
            height: 360
        });



var rajsFirstDataView = {
//    template: "<br>#name# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail' >",
    
    view: "dataview",
    id: "slideDataview",
    url: config.BASE_URL + "/item?folderId=5bd2222ee62914004e463a54&limit=50&sort=lowerName&sortdir=1&height=" + thumbHeight,
    type: "smallThumb",

    "select": true,
    "multiselect": true,
    "on": { 'onAfterSelect': function(id) { 
           var ar_selected = $$("slideDataview").getSelectedItem(true);

           if (ar_selected.length == 1)  {
                // single_select(id, this);
                single_select(ar_selected[0])
            }
            else {

                multi_select(ar_selected);
            }
        }
    },
    scheme:
        {
            $init: function(obj)
                {
                    //create a shorter abbreviation for each item
                    obj['slideAbbrev'] = obj['name'].split(".")[0];
                }


        }
}

function single_select(item){
        id = item._id;                
        if ("meta" in item) {
            var Stain_Types = item.meta.Stain_Types;
            var Blood_Red_Percentage = item.meta.Blood_Red_Percentage;
            var White_Blood_Cell_Count = item.meta.White_Blood_Cell_Count;
            var Cancer_Grading = item.meta.Cancer_Grading;
            var Associated_Genes = item.meta.Associated_Genes;                    
        }
        var  item_name = item.name;
        slideText= ("SlideID: " + id + 
                   "\\n" + "Stain_Types: " + Stain_Types +  
                   "\\n "+ "Blood_Red_Percentage: " + Blood_Red_Percentage + 
                   "\\n" + "White_Blood_Cell_Count: " + White_Blood_Cell_Count +  
                   "\\n" + "Cancer_Grading: "+ Cancer_Grading+  
                   "\\n" + "Associated_Genes: " + "Associated_Genes" +  
                   "\\n" + "Slide Name: " + item_name );
        $$("my_win").show();
        $$("templateWin").define("template", slideText);
        $$("templateWin").refresh();  
}

var layout = {
    title: 'Digital Slides Plot, Digital Slide Archive Platform, Emory University',
    xaxis: {
        title: 'Slide Name',
        titlefont: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
        }
    },
    height:600,
    width:600,
    showlegend : true,
    yaxis: {
    title: 'Slide Values',
        titlefont: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'
        }
  }
};

function multi_select(ar_selected){

        var slideRecords = webix.toArray(ar_selected);

        data = []
        var update = {}        
        var name = []
        var perc = []
        var wb_count = []
        slideRecords.each(function(obj){
           console.log(this.length);
           console.log(obj.name);
           console.log(obj._id);           
           name.push(obj.name);
           perc.push(obj.meta.Blood_Red_Percentage);
           wb_count.push(obj.meta.White_Blood_Cell_Count);                                
        });
        var data = [
            {x:name, y:perc, mode:'lines+markers', name:"BRC Percentage"},
            {x:name, y:wb_count, mode:'lines+markers', name:"WBC Count"}
            ]

        Plotly.newPlot("plotly_div", data, layout);
}


var dataViewControls = {

    cols:[{view:"button", id:"btnSmallThumb", label:"smallThumbs", click:  function(id) {
                webix.message("small Raj")
                $$('slideDataview').define('type','smallThumb');
                $$('slideDataview').render();

     }



    },


         {view:"button",id:"btnLargeThumb",label:"largeThumbs", click: function(id)
            {

                webix.message("large Raj")
                $$('slideDataview').define('type','bigThumb');
                $$('slideDataview').render();



            }



     }]    


}

webix.ready(function() {
    webix.ui({
        container: "main_layout",
        rows: [
            {
                "cols": [
                        { rows: [ 

                            {view:"template",template:"DV Controls", type:"header"},
                            dataViewControls,
                            rajsFirstDataView,
                            { view: "template", template: "Footer", gravity:0.2}


                            ]},                        
                          { view:"template", content:"plotly_div"}
                        ]                
            }, 
            // {
            //     view: "template",
            //     template: "Footer",
            //     id : "Footer",
            //     height : 250,
            //     width : 261
            // }           
        ]
    })
});