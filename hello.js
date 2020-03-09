
var express = require('express'),
    path = require('path'),
    app = express();
    fs = require("fs")
    $ = require('jquery');

app.use(express.static('static_files'))

var realdata=0;
function getthis(name,dataset) {
    let totalset={'nodes':[],'links':[]}
    for (const i of dataset['nodes']) {
        if (i.id==name) {
            let nodeindex=dataset['nodes'].indexOf(i)
            totalset['nodes'].push(i)
            for (const r of dataset['links']) {
                if (r.source==nodeindex|r.target==nodeindex) {
                 totalset['links'].push({"source": dataset['nodes'][r.source]['id'],"target":dataset['nodes'][r.target]['id'],"value": r.value})   
                 totalset['nodes'].push(dataset['nodes'][r.source])
                 totalset['nodes'].push(dataset['nodes'][r.target])
                }
                }
            }
        }
    if (totalset) {
        return totalset
    }else{
        return {}
    }

}

Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});
function getall(names,dataset) {
    let settotal={"nodes":[],"links":[]};
    let thisset={};
    let nodesitem="";
    let linkitem="";
    for (const i of names) {
        thisset= getthis(i,dataset)
        console.log(thisset);
        
        nodesitem=thisset['nodes'].flat()
        linkitem=thisset['links'].flat()
        settotal['nodes'].push(...nodesitem)
        settotal['links'].push(...linkitem)
    }
    settotal['links'] = [...new Set(settotal['links'])]
    settotal['nodes'] = [...new Set(settotal['nodes'])]
    return settotal
}

fs.readFile("mynode.json", "utf8", function(error, data) {
    realdata=JSON.parse(data)
})


app.get('/users', function(req, res) {
    const data=realdata['nodes'];
    console.log(data.length);
    console.log(data.indexOf({'id':'Gouws Christian'}));
    // res.redirect('network.html');
    
    res.send(data)
});

app.get('/users/:userid',(req,res)=>{
    const nodenames=req.params.userid.split(",");
    console.log(nodenames);
    let totalset=getall(nodenames,realdata)
    if (totalset) {
        fs.writeFile("mynn.json", JSON.stringify(totalset), function(err) {
            console.log("file written");
            })
        res.send(totalset);
    }else{
        res.send({})
    }
})

app.get('/users/num/:userid',(req,res)=>{
    const numnode=req.params.userid;   
    let numberset=[]
    let indexset=[]
    let element=0
    for (let i = 0; i < numnode; i++) {
        element=Math.floor(Math.random()*257459)-0
        if (!indexset.includes(element)) {
            indexset.push(element);
            numberset.push(realdata['nodes'][element]['id'])
        }else{
            i-=1
        }      
    }
    let totalset=getall(numberset,realdata)
    console.log(totalset);
    if (totalset) {
        fs.writeFile("mynn.json", JSON.stringify(totalset), function(err) {
            console.log("file written");
            })
        res.send(totalset);
    }else{
        res.send({})
    }
    
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/static_files/network.html'));
  });

var port=process.env.PORT||4000

app.listen(port,function () {
    console.log('App running');
});
// app.listen(8080, () => {
//     console.log('Server started at http://localhost:4000/');
//   });