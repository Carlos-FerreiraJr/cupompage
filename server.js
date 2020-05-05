// constantes
const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ObjectID } = require('mongodb')
const uri=''

// conexão com o banco 
// o app só roda após a conexão ser aberta
MongoClient.connect(uri,(err,client)=>{
    db = client.db('nodetest')    

    app.listen(8080,function(){
        console.log("server running on port 8080")
    });    

})

// ############################## engines
    app.use(bodyParser.urlencoded({extended: true}))
    app.set('view engine','ejs')


// ##############################  rota principal - add, e ver cupons
    app.get('/',(req,res)=>{
        db.collection('data').find().toArray((err, results) => {
            if (err) return console.log(err)
            res.render('index.ejs', { data: results })
            console.log(results)
        })
    });


//##############################  rota de salvamento 
    app.post('/show',(req,res)=>{
        db.collection('data').insertOne(req.body,(err,result)=>{
            console.log("salvo")
            res.redirect('/')    
        })
    });


//############################## rota de edição editar cupons e voltar
app.route('/edit/:id')
    .get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectID(id)).toArray((err,result)=>{
            res.render('edit.ejs',{data:result})
        })
    })

.post((req,res)=>{
    var id    = req.params.id 
    var name  = req.body.name 
    var cupom = req.body.cupom  

    db.collection('data').updateOne({_id: ObjectID(id)},{
        $set:{
            name: name, 
            cupom:cupom
        }   
    },(err,result)=>{
            if (err) return res.send(err)
            res.redirect('/')
            console.log('Atualizado no Banco de Dados')
        })
    })

//############################## deletar cupoms

app.route('/deletecupom/:id')
.get((req,res)=>{
    var id_to_delete = req.params.id 
    db.collection('data').deleteOne({_id:ObjectID(id_to_delete)},(err,result)=>{
        res.redirect('/')
    })
})





























