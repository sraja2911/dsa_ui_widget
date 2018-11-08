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

var rajsFirstDataView = {
    template: "<br>#name# <img src='" + config.BASE_URL + "/item/#_id#/tiles/thumbnail' >",
    view: "dataview",
    id: "slideDataview",
    url: config.BASE_URL + "/item?folderId=5bd2222ee62914004e463a54&limit=50&sort=lowerName&sortdir=1&height=" + thumbHeight,
    type: {
        width: 261,
        height: 300
    },

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
        $$("templateWin").define("template", slideText)
        $$("templateWin").refresh()  
        make_plotly();
}

function multi_select(ar_selected){

}

webix.ready(function() {
    webix.ui({
        container: "main_layout",
        rows: [
            {
                "cols": [
                        rajsFirstDataView,
                        {

                            // "data": scatterData,
                            // "type": "scatter",
                            // "xValue": "#a#",
                            // "value": "#d#",
                            // "view": "chart"
                        }
                        ]                
            }
        ]
    })
});

function make_plotly() {
    var data = [
        { x: [5, 6, 7, 8], y: [12, 9, 15, 12],  mode:'lines+markers'},
        { x: [5, 6, 7, 8], y: [10, 15, 13, 17], mode:'markers'},
        { x: [5, 6, 7, 8], y: [16, 5, 11, 10],  mode:'lines'}
    ];

 var layout = {
              title:'Plotly - Digital Slide Archive',
              height: 750,
              width: 750
            };

    Plotly.newPlot('plotly_div', data, layout);           
}

  	
/*webix.ready(function() {
    webix.ui({
        "rows": [{
                "template": "Raj PutsHisHeaderHere",
                "height": 50,
                "view": "template"
            },
            {
                "cols": [{
                    "type": "line",
                    "cols": [{
                        "type": "line",
                        "cols": [{
                            "type": "line",
                            "cols": [
                                rajsFirstDataView,
                                {
                                   // "data": scatterData,
                                    // "type": "scatter",
                                    // "xValue": "#a#",
                                    // "value": "#d#",
                                    // "view": "chart"
                                }
                            ]
                        }]
                    }]
                }]
            },
            {
                "template": "Footer ",
                "height": 50,
                "view": "template"
            }
        ]
    })
});*/

