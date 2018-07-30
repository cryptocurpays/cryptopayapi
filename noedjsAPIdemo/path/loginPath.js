/**
 * Created by shijiangang on 2018/5/3.
 */


function loginGet(req, res){
    res.render('login.ejs', { message: req.flash('loginMessage') });

}


module.exports={
    loginGet : loginGet
}




