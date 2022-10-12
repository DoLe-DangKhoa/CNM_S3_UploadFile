
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json({extended: false}));
app.use(express.static('./views'));
app.set('view engine','ejs');
app.set('views','./views');

const AWS = require('aws-sdk');
const config = new AWS.Config({
    accessKeyId:'AKIARIEH2YYZUZL6GNQ7',
    secretAccessKey:'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',
    region:'ap-southeast-1'
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'BaoCaoSP';

const multer = require('multer');

const upload = multer();


app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params,(err,data) => {
        if(err)
            console.log(err);
        else{
            
            return res.render('index', {data: data.Items});
        }

    });
});

app.post('/',upload.fields([]) ,(req, res) => {
    const {stt,ten_baocao,ten_tacgia,chi_so, so_trang,nam_xb} = req.body;
    const params = {
        TableName: tableName,
        Item:{
            stt,ten_baocao,ten_tacgia,chi_so, so_trang,nam_xb
        }
    };
    
    
    docClient.put(params,(err,data) =>{
         
        if(err ) {
            console.log(err);  
        }      
        else{
            // console.log(JSON.stringify(data));
            return res.redirect('/');
        }
    })
});

app.post('/delete',upload.fields([]) , (req, res) => {
    const listItems = Object.keys(req.body);
    if(listItems == 0)
        return res.redirect('/');
    function onDeleteItem(index){
        const params = {
            TableName: tableName,
            Key:{
                'ten_baocao':listItems[index]
            }
        }
        docClient.delete(params,(err,data) =>{
            if(err)
            console.log(err);
        else{
            if(index >0 )
                onDeleteItem(index-1);
            else
                return res.redirect('/');
        }

        });
    }
    onDeleteItem(listItems.length -1);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})